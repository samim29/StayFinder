const BookingModel = require("../models/booking.model.js");
const PgModel = require("../models/pg.model.js");

const BOOKING_HOLD_HOURS = 48;

const populateBooking = (query) =>
  query
    .populate("pg", "title address rent images availableBeds roomTypes")
    .populate("student", "name email phone")
    .populate("owner", "name email phone");

const createBookingController = async (req, res) => {
  const { pgId, moveInDate, roomType, durationMonths } = req.body;
  const student = req.user._id;

  try {
    const pg = await PgModel.findOneAndUpdate(
      { _id: pgId, availableBeds: { $gt: 0 }, roomTypes: roomType },
      { $inc: { availableBeds: -1 } },
      { returnDocument: "after" },
    );

    if (!pg)
      return res
        .status(409)
        .json({ message: "This PG has no available beds or room type" });

    const existing = await BookingModel.findOne({
      student,
      pg: pgId,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existing) {
      await PgModel.updateOne({ _id: pgId }, { $inc: { availableBeds: 1 } });
      return res
        .status(409)
        .json({ message: "You already have an active booking for this PG" });
    }

    try {
      const booking = await BookingModel.create({
        student,
        owner: pg.owner,
        pg: pg._id,
        moveInDate: new Date(moveInDate),
        roomType,
        durationMonths: Number(durationMonths),
        expiresAt: new Date(Date.now() + BOOKING_HOLD_HOURS * 60 * 60 * 1000),
      });

      return res.status(201).json({ message: "Booking request sent", booking });
    } catch (createError) {
      await PgModel.updateOne({ _id: pgId }, { $inc: { availableBeds: 1 } });
      if (createError.code === 11000)
        return res
          .status(409)
          .json({ message: "You already have an active booking for this PG" });
      throw createError;
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return res
      .status(500)
      .json({ message: "Could not create booking request" });
  }
};

const getMyBookingsController = async (req, res) => {
  try {
    const bookings = await populateBooking(
      BookingModel.find({ student: req.user._id }).sort("-createdAt"),
    );
    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching student bookings:", error);
    res.status(500).json({ message: "Could not fetch bookings" });
  }
};

const getOwnerBookingsController = async (req, res) => {
  try {
    const bookings = await populateBooking(
      BookingModel.find({ owner: req.user._id }).sort("-createdAt"),
    );
    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    res.status(500).json({ message: "Could not fetch booking requests" });
  }
};

const acceptBookingController = async (req, res) => {
  try {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: req.params.bookingId, owner: req.user._id, status: "pending" },
      { $set: { status: "confirmed", expiresAt: null, decidedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!booking)
      return res
        .status(404)
        .json({ message: "Pending booking request not found" });
    res.json({ message: "Booking accepted", booking });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({ message: "Could not accept booking" });
  }
};

const rejectBookingController = async (req, res) => {
  try {
    const booking = await BookingModel.findOneAndUpdate(
      { _id: req.params.bookingId, owner: req.user._id, status: "pending" },
      { $set: { status: "rejected", expiresAt: null, decidedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!booking)
      return res
        .status(404)
        .json({ message: "Pending booking request not found" });
    await PgModel.updateOne(
      { _id: booking.pg },
      { $inc: { availableBeds: 1 } },
    );
    res.json({ message: "Booking rejected", booking });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res.status(500).json({ message: "Could not reject booking" });
  }
};

const cancelBookingController = async (req, res) => {
  try {
    const booking = await BookingModel.findOneAndUpdate(
      {
        _id: req.params.bookingId,
        student: req.user._id,
        status: { $in: ["pending", "confirmed"] },
      },
      { $set: { status: "cancelled", expiresAt: null, decidedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!booking)
      return res.status(404).json({ message: "Active booking not found" });
    await PgModel.updateOne(
      { _id: booking.pg },
      { $inc: { availableBeds: 1 } },
    );
    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Could not cancel booking" });
  }
};

const expirePendingBookingsController = async () => {
  const expired = await BookingModel.find({
    status: "pending",
    expiresAt: { $lte: new Date() },
  }).select("_id pg");
  for (const booking of expired) {
    const updated = await BookingModel.findOneAndUpdate(
      { _id: booking._id, status: "pending" },
      { $set: { status: "expired", decidedAt: new Date() } },
    );
    if (updated)
      await PgModel.updateOne(
        { _id: booking.pg },
        { $inc: { availableBeds: 1 } },
      );
  }
};

const startBookingExpiryJob = () => {
  const timer = setInterval(
    () =>
      expirePendingBookingsController().catch((error) =>
        console.error("Booking expiry job failed:", error),
      ),
    60 * 1000,
  );
  timer.unref?.();
};

module.exports = {
  createBookingController,
  getMyBookingsController,
  getOwnerBookingsController,
  acceptBookingController,
  rejectBookingController,
  cancelBookingController,
  startBookingExpiryJob,
};

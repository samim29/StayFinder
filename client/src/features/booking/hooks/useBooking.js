import { useContext } from "react";
import { BookingContext } from "../booking.context.jsx";
import {
  acceptBooking,
  cancelBooking,
  createBooking,
  getMyBookings,
  getOwnerBookings,
  rejectBooking,
} from "../services/booking.api.js";

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used inside BookingProvider");

  const { bookings, setBookings, loading, setLoading } = context;

  const handleGetMyBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data.bookings);
      return data.bookings;
    } finally {
      setLoading(false);
    }
  };

  const handleGetOwnerBookings = async () => {
    setLoading(true);
    try {
      const data = await getOwnerBookings();
      setBookings(data.bookings);
      return data.bookings;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (data) => {
    setLoading(true);
    try {
      return await createBooking(data);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, action) => {
    setLoading(true);
    try {
      const response = await action(bookingId);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? { ...booking, ...response.booking }
            : booking,
        ),
      );
      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    handleGetMyBookings,
    handleGetOwnerBookings,
    handleCreateBooking,
    handleAcceptBooking: (id) => updateBookingStatus(id, acceptBooking),
    handleRejectBooking: (id) => updateBookingStatus(id, rejectBooking),
    handleCancelBooking: (id) => updateBookingStatus(id, cancelBooking),
  };
};

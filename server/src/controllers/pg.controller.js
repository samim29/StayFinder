const PgModel = require("../models/pg.model.js");
const checkPgOwnedByOwner = require("../utils/checkPgOwnedByOwner.utils.js");



/**
 * @description Controller to create a new PG listing.
 * @route POST /api/pg
 * @access private (only authenticated users with 'owner' role)
 */
const createPgController = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      lat,
      lng,
      rent,
      totalBeds,
      availableBeds,
      roomTypes,
      amenities,
      rules,
      genderPreference,
      contactPhone,
      contactEmail,
      images,
    } = req.body;

    const owner = req.user._id; // Assuming the authenticated user's ID is available in req.user

    if (
      !title ||
      !description ||
      !address ||
      !lat ||
      !lng ||
      !rent ||
      !totalBeds ||
      availableBeds === undefined ||
      !contactPhone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPg = await PgModel.create({
      owner,
      title,
      description,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON format: [longitude, latitude]
      },
      rent,
      totalBeds,
      availableBeds: availableBeds ?? totalBeds, // Default to totalBeds if availableBeds is not provided
      roomTypes,
      amenities,
      rules,
      genderPreference,
      contact: {
        phone: contactPhone,
        email: contactEmail,
      },
      images: images || [], // Default to an empty array if no images are provided
    });

    res.status(201).json({ message: "PG created successfully", pg: newPg });
  } catch (error) {
    console.error("Error creating PG:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * @description Controller to update an existing PG listing.
 * @route PUT /api/pg/:pgId
 * @access private (only authenticated users with 'owner' role)
 */
const updatePgController = async (req, res) => {
  const { pgId } = req.params;
  const userId = req.user._id;

  try {
    const pg = await checkPgOwnedByOwner(pgId, userId);

    const updatableFields = [
      "title",
      "description",
      "address",
      "rent",
      "totalBeds",
      "availableBeds",
      "roomTypes",
      "amenities",
      "rules",
      "genderPreference",
      "images",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pg[field] = req.body[field];
      }
    });

    // Update location only when both coordinates are provided
    if (req.body.lat !== undefined && req.body.lng !== undefined) {
      pg.location = {
        type: "Point",
        coordinates: [
          Number(req.body.lng),
          Number(req.body.lat),
        ],
      };
    }

    // Update contact information
    if (
      req.body.contactPhone !== undefined ||
      req.body.contactEmail !== undefined
    ) {
      pg.contact = {
        phone: req.body.contactPhone ?? pg.contact.phone,
        email: req.body.contactEmail ?? pg.contact.email,
      };
    }

    const updatedPg = await pg.save();

    res.status(200).json({
      message: "PG updated successfully",
      pg: updatedPg,
    });
  } catch (error) {
    console.error("Error updating PG:", error);

    res.status(403).json({
      message: error.message,
    });
  }
};

/**
 * @description Controller to delete an existing PG listing.
 * @route DELETE /api/pg/:pgId
 * @access private (only authenticated users with 'owner' role)
 */
const deletePgController = async (req, res) => {
  const { pgId } = req.params;
  const userId = req.user._id;

  try {
    const pg = await checkPgOwnedByOwner(pgId, userId);

    await pg.deleteOne();

    res.status(200).json({
      message: "PG deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PG:", error);

    res.status(403).json({
      message: error.message,
    });
  }
};
module.exports = {
  createPgController,
  updatePgController,
  deletePgController,
};

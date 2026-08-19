const PgModel = require("../models/pg.model");

/**
 * @description Middleware to check if the authenticated user is the owner of the PG listing.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

const checkPgOwnedByOwner = async (pgId, userId) => {
  try {
    const pg = await PgModel.findById(pgId);
    if (!pg) {
      throw new Error("PG listing not found");
    }
    if (pg.owner.toString() !== userId.toString()) {
      throw new Error("User is not the owner of this PG listing");
    }
    return pg; // Return the PG document if the user is the owner
  } catch (error) {
    console.error("Error checking PG ownership:", error);
    throw error;
  }
};

module.exports = checkPgOwnedByOwner;

const PgModel = require("../models/pg.model.js");
const checkPgOwnedByOwner = require("../utils/checkPgOwnedByOwner.utils.js");

/**
 * @description Get all PG listings with optional filters and pagination
 * @route GET /api/pg/
 * @access Public
 */
const getAllPgsController = async (req, res) => {
    try {
        const {
            lat,
            lng,
            radius = 5000,
            minRent,
            maxRent,
            amenities,
            roomTypes,
            genderPreference,
            availableBeds,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        // -------------------------
        // Rent filter
        // -------------------------
        if (minRent !== undefined || maxRent !== undefined) {
            filter.rent = {};

            if (minRent !== undefined) {
                filter.rent.$gte = Number(minRent);
            }

            if (maxRent !== undefined) {
                filter.rent.$lte = Number(maxRent);
            }
        }

        // -------------------------
        // Amenities filter
        // -------------------------
        if (amenities) {
            const amenitiesArray = Array.isArray(amenities)
                ? amenities
                : amenities.split(",");

            filter.amenities = {
                $all: amenitiesArray,
            };
        }

        // -------------------------
        // Room types filter
        // -------------------------
        if (roomTypes) {
            const roomTypesArray = Array.isArray(roomTypes)
                ? roomTypes
                : [roomTypes];

            filter.roomTypes = {
                $in: roomTypesArray,
            };
        }

        // -------------------------
        // Gender preference filter
        // -------------------------
        if (genderPreference) {
            filter.genderPreference = genderPreference;
        }

        // -------------------------
        // Available beds filter
        // -------------------------
        if (availableBeds !== undefined) {
            filter.availableBeds = {
                $gte: Number(availableBeds),
            };
        }

        // -------------------------
        // Pagination
        // -------------------------
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

        const skip = (pageNumber - 1) * limitNumber;

        let pgs;
        let total;

        // -------------------------
        // Geo search
        // -------------------------
        if (lat !== undefined && lng !== undefined) {
            const latitude = Number(lat);
            const longitude = Number(lng);
            const radiusNumber = Number(radius);

            // Validate coordinates
            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                latitude < -90 ||
                latitude > 90 ||
                longitude < -180 ||
                longitude > 180
            ) {
                return res.status(400).json({
                    message: "Invalid latitude or longitude",
                });
            }

            if (!Number.isFinite(radiusNumber) || radiusNumber <= 0) {
                return res.status(400).json({
                    message: "Invalid radius",
                });
            }

            const result = await PGModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        distanceField: "distanceInMeters",
                        maxDistance: radiusNumber,
                        query: filter,
                        spherical: true,
                    },
                },

                {
                    $facet: {
                        pgs: [
                            {
                                $sort: {
                                    distanceInMeters: 1,
                                },
                            },
                            {
                                $skip: skip,
                            },
                            {
                                $limit: limitNumber,
                            },
                        ],

                        total: [
                            {
                                $count: "count",
                            },
                        ],
                    },
                },
            ]);

            pgs = result[0].pgs;
            total = result[0].total[0]?.count || 0;
        }

        // -------------------------
        // Normal search
        // -------------------------
        else {
            [pgs, total] = await Promise.all([
                PGModel.find(filter)
                    .sort("-createdAt")
                    .skip(skip)
                    .limit(limitNumber),

                PGModel.countDocuments(filter),
            ]);
        }

        // -------------------------
        // Response
        // -------------------------
        res.json({
            pgs,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            total,
        });
    } catch (error) {
        console.error("Error fetching PGs:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

/**
 * @description Get all PG listings owned by the authenticated user
 * @route GET /api/pg/mine
 * @access Private - PG owner only
 */
const getMyPgsController = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const pgs = await PgModel.find({ owner: ownerId }).sort("-createdAt");

        res.json({
            pgs,
        });
    } catch (error) {
        console.error("Error fetching user's PGs:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

/**
 * @description Get a PG listing by its ID
 * @route GET /api/pg/:id
 * @access Private - Authenticated users only
 */
const getPGByIdController = async (req, res) => {
   try {
    const pg = await PGModel.findById(req.params.id).populate('owner', 'name phone email');
    if (!pg) return res.status(404).json({ message: 'PG listing not found' });
    res.json(pg);
   } catch (error) {
        console.error("Error fetching PG by ID:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

/**
 * @description Create a new PG listing
 * @route POST /api/pg
 * @access Private
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

        const owner = req.user._id;

        // -------------------------
        // Required field validation
        // -------------------------
        if (
            !title ||
            !description ||
            !address ||
            lat === undefined ||
            lng === undefined ||
            rent === undefined ||
            totalBeds === undefined ||
            !contactPhone
        ) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // -------------------------
        // Convert numeric values
        // -------------------------
        const latitude = Number(lat);
        const longitude = Number(lng);
        const rentAmount = Number(rent);
        const totalBedsNumber = Number(totalBeds);

        const availableBedsNumber =
            availableBeds !== undefined
                ? Number(availableBeds)
                : totalBedsNumber;

        // -------------------------
        // Validate coordinates
        // -------------------------
        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90 ||
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                message: "Invalid latitude or longitude",
            });
        }

        // -------------------------
        // Validate rent and beds
        // -------------------------
        if (!Number.isFinite(rentAmount) || rentAmount < 0) {
            return res.status(400).json({
                message: "Invalid rent",
            });
        }

        if (!Number.isInteger(totalBedsNumber) || totalBedsNumber < 1) {
            return res.status(400).json({
                message: "Total beds must be at least 1",
            });
        }

        if (
            !Number.isInteger(availableBedsNumber) ||
            availableBedsNumber < 0 ||
            availableBedsNumber > totalBedsNumber
        ) {
            return res.status(400).json({
                message:
                    "Available beds cannot exceed total beds or be less than 0",
            });
        }

        // -------------------------
        // Create PG
        // -------------------------
        const newPg = await PgModel.create({
            owner,
            title,
            description,
            address,

            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },

            rent: rentAmount,
            totalBeds: totalBedsNumber,
            availableBeds: availableBedsNumber,

            roomTypes,
            amenities,
            rules,
            genderPreference,

            contact: {
                phone: contactPhone,
                email: contactEmail,
            },

            images: images || [],
        });

        res.status(201).json({
            message: "PG created successfully",
            pg: newPg,
        });
    } catch (error) {
        console.error("Error creating PG:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};


/**
 * @description Update an existing PG listing
 * @route PUT /api/pg/:pgId
 * @access Private - PG owner only
 */
const updatePgController = async (req, res) => {
    const { pgId } = req.params;
    const userId = req.user._id;

    try {
        const pg = await checkPgOwnedByOwner(pgId, userId);

        // -------------------------
        // Update simple fields
        // -------------------------
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

        // -------------------------
        // Update location
        // -------------------------
        if (
            req.body.lat !== undefined ||
            req.body.lng !== undefined
        ) {
            const latitude =
                req.body.lat !== undefined
                    ? Number(req.body.lat)
                    : pg.location.coordinates[1];

            const longitude =
                req.body.lng !== undefined
                    ? Number(req.body.lng)
                    : pg.location.coordinates[0];

            if (
                !Number.isFinite(latitude) ||
                latitude < -90 ||
                latitude > 90 ||
                !Number.isFinite(longitude) ||
                longitude < -180 ||
                longitude > 180
            ) {
                return res.status(400).json({
                    message: "Invalid latitude or longitude",
                });
            }

            pg.location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
        }

        // -------------------------
        // Update contact information
        // -------------------------
        if (
            req.body.contactPhone !== undefined ||
            req.body.contactEmail !== undefined
        ) {
            pg.contact = {
                phone:
                    req.body.contactPhone !== undefined
                        ? req.body.contactPhone
                        : pg.contact.phone,

                email:
                    req.body.contactEmail !== undefined
                        ? req.body.contactEmail
                        : pg.contact.email,
            };
        }

        // -------------------------
        // Validate beds after updates
        // -------------------------
        if (
            pg.availableBeds < 0 ||
            pg.availableBeds > pg.totalBeds
        ) {
            return res.status(400).json({
                message:
                    "Available beds cannot exceed total beds or be less than 0",
            });
        }

        // -------------------------
        // Save changes
        // -------------------------
        const updatedPg = await pg.save();

        res.status(200).json({
            message: "PG updated successfully",
            pg: updatedPg,
        });
    } catch (error) {
        console.error("Error updating PG:", error);

        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};


/**
 * @description Delete an existing PG listing
 * @route DELETE /api/pg/:pgId
 * @access Private - PG owner only
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

        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};


module.exports = {
    getAllPgsController,
    createPgController,
    updatePgController,
    deletePgController,
};
const PgModel = require("../models/pg.model.js");
const checkPgOwnedByOwner = require("../utils/checkPgOwnedByOwner.utils.js");
const cloudinary = require("../config/cloudinary.config.js");

const isOwnerCloudinaryImage = (image, ownerId) =>
    image &&
    typeof image.url === "string" &&
    typeof image.publicId === "string" &&
    image.url.startsWith("https://res.cloudinary.com/") &&
    image.publicId.startsWith(`stayfinder/pgs/${ownerId}/`);

const deleteCloudinaryImages = async (images) => {
    await Promise.all(
        images.map(({ publicId }) =>
            cloudinary.uploader.destroy(publicId, { resource_type: "image" }),
        ),
    );
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
            q,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        if (q && String(q).trim()) {
            const search = new RegExp(escapeRegex(String(q).trim()), "i");
            filter.$or = [
                { title: search },
                { description: search },
                { address: search },
            ];
        }

        // -------------------------
        // Rent filter
        // -------------------------
        if (minRent !== undefined || maxRent !== undefined) {
            filter.rent = {};

            if (minRent !== undefined) {
                const minimumRent = Number(minRent);
                if (!Number.isFinite(minimumRent) || minimumRent < 0) {
                    return res.status(400).json({ message: "Invalid minimum rent" });
                }
                filter.rent.$gte = minimumRent;
            }

            if (maxRent !== undefined) {
                const maximumRent = Number(maxRent);
                if (!Number.isFinite(maximumRent) || maximumRent < 0) {
                    return res.status(400).json({ message: "Invalid maximum rent" });
                }
                filter.rent.$lte = maximumRent;
            }

            if (filter.rent.$gte !== undefined && filter.rent.$lte !== undefined && filter.rent.$gte > filter.rent.$lte) {
                return res.status(400).json({ message: "Minimum rent cannot exceed maximum rent" });
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
            const minimumBeds = Number(availableBeds);
            if (!Number.isInteger(minimumBeds) || minimumBeds < 0) {
                return res.status(400).json({ message: "Invalid available beds value" });
            }
            filter.availableBeds = {
                $gte: minimumBeds,
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

            const result = await PgModel.aggregate([
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
                PgModel.find(filter)
                    .sort("-createdAt")
                    .skip(skip)
                    .limit(limitNumber),

                PgModel.countDocuments(filter),
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
 * @description Get a PG listing for its owner to manage.
 * @route GET /api/pg/:pgId/manage
 * @access Private - PG owner only
 */
const getPgForOwnerController = async (req, res) => {
    try {
        const pg = await checkPgOwnedByOwner(req.params.pgId, req.user._id);
        res.status(200).json(pg);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};
/**
 * @description Get a PG listing by its ID
 * @route GET /api/pg/:id
 * @access Public
 */
const getPGByIdController = async (req, res) => {
   try {
    const pg = await PgModel.findById(req.params.id).populate('owner', 'name phone email');
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

        if (!Array.isArray(images) || !images.every((image) => isOwnerCloudinaryImage(image, owner))) {
            return res.status(400).json({ message: "Images must be uploaded through StayFinder" });
        }

        const latitude = Number(lat);
        const longitude = Number(lng);
        const rentAmount = Number(rent);
        const totalBedsNumber = Number(totalBeds);

        const availableBedsNumber =
            availableBeds !== undefined
                ? Number(availableBeds)
                : totalBedsNumber;

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

            images,
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
        // Check whether the PG exists and belongs to the logged-in owner
        const pg = await checkPgOwnedByOwner(pgId, userId);
        const previousImages = pg.images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
        }));

        if (req.body.images !== undefined) {
            if (!Array.isArray(req.body.images) || !req.body.images.every((image) => isOwnerCloudinaryImage(image, userId))) {
                return res.status(400).json({ message: "Images must be uploaded through StayFinder" });
            }
        }

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
        // Validate beds relationship
        // -------------------------
        if (pg.availableBeds > pg.totalBeds) {
            return res.status(400).json({
                message: "Available beds cannot exceed total beds",
            });
        }

        // -------------------------
        // Save changes
        // -------------------------
        const updatedPg = await pg.save();

        if (req.body.images !== undefined) {
            const retainedPublicIds = new Set(updatedPg.images.map((image) => image.publicId));
            const removedImages = previousImages.filter(
                (image) => !retainedPublicIds.has(image.publicId),
            );

            try {
                await deleteCloudinaryImages(removedImages);
            } catch (cloudinaryError) {
                console.error("Failed to remove old Cloudinary images:", cloudinaryError);
            }
        }

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

        try {
            await deleteCloudinaryImages(pg.images);
        } catch (cloudinaryError) {
            console.error("Failed to remove Cloudinary images:", cloudinaryError);
        }

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
    getMyPgsController,
    getPgForOwnerController,
    getPGByIdController,
    createPgController,
    updatePgController,
    deletePgController,
};

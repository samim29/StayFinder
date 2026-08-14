const validationMiddleware = require("../middlewares/validation.middleware");

// ==========================================
// Required string validator
// ==========================================

const requiredString = (fieldName, label, options = {}) => {
    const {
        minLength,
        maxLength,
        pattern,
        allowedValues,
    } = options;

    return (payload) => {
        const value = payload[fieldName];

        if (typeof value !== "string" || value.trim().length === 0) {
            return `${label} is required`;
        }

        const trimmedValue = value.trim();

        if (
            typeof minLength === "number" &&
            trimmedValue.length < minLength
        ) {
            return `${label} must be at least ${minLength} characters`;
        }

        if (
            typeof maxLength === "number" &&
            trimmedValue.length > maxLength
        ) {
            return `${label} cannot exceed ${maxLength} characters`;
        }

        if (pattern && !pattern.test(trimmedValue)) {
            return `${label} is invalid`;
        }

        if (
            Array.isArray(allowedValues) &&
            !allowedValues.includes(trimmedValue)
        ) {
            return `${label} must be one of ${allowedValues.join(", ")}`;
        }

        return null;
    };
};


// ==========================================
// Optional string validator
// ==========================================

const optionalString = (fieldName, label, options = {}) => {
    const {
        minLength,
        maxLength,
        pattern,
        allowedValues,
    } = options;

    return (payload) => {
        const value = payload[fieldName];

        if (value === undefined) {
            return null;
        }

        if (typeof value !== "string" || value.trim().length === 0) {
            return `${label} cannot be empty`;
        }

        const trimmedValue = value.trim();

        if (
            typeof minLength === "number" &&
            trimmedValue.length < minLength
        ) {
            return `${label} must be at least ${minLength} characters`;
        }

        if (
            typeof maxLength === "number" &&
            trimmedValue.length > maxLength
        ) {
            return `${label} cannot exceed ${maxLength} characters`;
        }

        if (pattern && !pattern.test(trimmedValue)) {
            return `${label} is invalid`;
        }

        if (
            Array.isArray(allowedValues) &&
            !allowedValues.includes(trimmedValue)
        ) {
            return `${label} must be one of ${allowedValues.join(", ")}`;
        }

        return null;
    };
};


// ==========================================
// Required number validator
// ==========================================

const requiredNumber = (
    fieldName,
    label,
    { min, max, integer = false } = {}
) => {
    return (payload) => {
        const value = payload[fieldName];

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return `${label} is required`;
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return `${label} must be a valid number`;
        }

        if (integer && !Number.isInteger(number)) {
            return `${label} must be an integer`;
        }

        if (typeof min === "number" && number < min) {
            return `${label} must be at least ${min}`;
        }

        if (typeof max === "number" && number > max) {
            return `${label} cannot exceed ${max}`;
        }

        return null;
    };
};


// ==========================================
// Optional number validator
// ==========================================

const optionalNumber = (
    fieldName,
    label,
    { min, max, integer = false } = {}
) => {
    return (payload) => {
        const value = payload[fieldName];

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return null;
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return `${label} must be a valid number`;
        }

        if (integer && !Number.isInteger(number)) {
            return `${label} must be an integer`;
        }

        if (typeof min === "number" && number < min) {
            return `${label} must be at least ${min}`;
        }

        if (typeof max === "number" && number > max) {
            return `${label} cannot exceed ${max}`;
        }

        return null;
    };
};


// ==========================================
// Array validator
// ==========================================

const optionalArray = (
    fieldName,
    label,
    { allowedValues } = {}
) => {
    return (payload) => {
        const value = payload[fieldName];

        if (value === undefined) {
            return null;
        }

        if (!Array.isArray(value)) {
            return `${label} must be an array`;
        }

        if (Array.isArray(allowedValues)) {
            const invalidValue = value.find(
                (item) => !allowedValues.includes(item)
            );

            if (invalidValue !== undefined) {
                return `${label} contains an invalid value`;
            }
        }

        return null;
    };
};


// ==========================================
// Beds relationship validator
// ==========================================

const validateBedsRelationship = (payload) => {
    const totalBeds = Number(payload.totalBeds);
    const availableBeds = Number(payload.availableBeds);

    if (
        Number.isFinite(totalBeds) &&
        Number.isFinite(availableBeds) &&
        availableBeds > totalBeds
    ) {
        return "Available beds cannot exceed total beds";
    }

    return null;
};


// ==========================================
// CREATE PG
// ==========================================

const validateCreatePG = validationMiddleware([
    requiredString("title", "Title", {
        minLength: 3,
        maxLength: 100,
    }),

    requiredString("description", "Description", {
        minLength: 10,
        maxLength: 2000,
    }),

    requiredString("address", "Address", {
        minLength: 5,
        maxLength: 300,
    }),

    requiredNumber("lat", "Latitude", {
        min: -90,
        max: 90,
    }),

    requiredNumber("lng", "Longitude", {
        min: -180,
        max: 180,
    }),

    requiredNumber("rent", "Rent", {
        min: 0,
    }),

    requiredNumber("totalBeds", "Total beds", {
        min: 1,
        integer: true,
    }),

    requiredNumber("availableBeds", "Available beds", {
        min: 0,
        integer: true,
    }),

    validateBedsRelationship,

    requiredString("contactPhone", "Contact phone", {
        pattern: /^[0-9]{10}$/,
    }),
    optionalString("contactEmail", "Contact email", {
        pattern: /^\S+@\S+\.\S+$/,
    }),
    requiredString("genderPreference", "Gender preference", {
        allowedValues: ["boys", "girls", "co-ed"],
    }),

    optionalArray("roomTypes", "Room types", {
        allowedValues: ["single", "double", "triple"],
    }),

    optionalArray("amenities", "Amenities"),
]);


// ==========================================
// UPDATE PG
// ==========================================

const validateUpdatePG = validationMiddleware([
    optionalString("title", "Title", {
        minLength: 3,
        maxLength: 100,
    }),

    optionalString("description", "Description", {
        minLength: 10,
        maxLength: 2000,
    }),

    optionalString("address", "Address", {
        minLength: 5,
        maxLength: 300,
    }),

    optionalNumber("lat", "Latitude", {
        min: -90,
        max: 90,
    }),

    optionalNumber("lng", "Longitude", {
        min: -180,
        max: 180,
    }),

    optionalNumber("rent", "Rent", {
        min: 0,
    }),

    optionalNumber("totalBeds", "Total beds", {
        min: 1,
        integer: true,
    }),

    optionalNumber("availableBeds", "Available beds", {
        min: 0,
        integer: true,
    }),

    optionalString("contactPhone", "Contact phone", {
        pattern: /^[0-9]{10}$/,
    }),

    optionalString("contactEmail", "Contact email", {
        pattern: /^\S+@\S+\.\S+$/,
    }),

    optionalString("genderPreference", "Gender preference", {
        allowedValues: ["boys", "girls", "co-ed"],
    }),

    optionalArray("roomTypes", "Room types", {
        allowedValues: ["single", "double", "triple"],
    }),

    optionalArray("amenities", "Amenities"),
]);


module.exports = {
    validateCreatePG,
    validateUpdatePG,
};
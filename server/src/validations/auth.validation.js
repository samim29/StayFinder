const validationMiddleware = require('../middlewares/validation.middleware');

const requiredString = (fieldName, label, options = {}) => {
    const {
        minLength,
        maxLength,
        pattern,
        allowedValues,
    } = options;

    return (payload) => {
        const value = payload[fieldName];

        if (typeof value !== 'string' || value.trim().length === 0) {
            return `${label} is required`;
        }

        const trimmedValue = value.trim();

        if (typeof minLength === 'number' && trimmedValue.length < minLength) {
            return `${label} must be at least ${minLength} characters`;
        }

        if (typeof maxLength === 'number' && trimmedValue.length > maxLength) {
            return `${label} cannot exceed ${maxLength} characters`;
        }

        if (pattern && !pattern.test(trimmedValue)) {
            return `${label} is invalid`;
        }

        if (Array.isArray(allowedValues) && !allowedValues.includes(trimmedValue)) {
            return `${label} must be one of ${allowedValues.join(', ')}`;
        }

        return null;
    };
};

const validateRegisterUser = validationMiddleware([
    requiredString('name', 'Name', { minLength: 2, maxLength: 60 }),
    requiredString('email', 'Email', {
        pattern: /^\S+@\S+\.\S+$/,
    }),
    requiredString('password', 'Password', { minLength: 8 }),
    requiredString('phone', 'Phone number', {
        pattern: /^[0-9]{10}$/,
    }),
    requiredString('role', 'Role', {
        allowedValues: ['student', 'owner'],
    }),
]);

const validateLoginUser = validationMiddleware([
    requiredString('identifier', 'Email or phone number'),
    requiredString('password', 'Password'),
    requiredString('role', 'Role', {
        allowedValues: ['student', 'owner'],
    }),
]);

module.exports = {
    validateRegisterUser,
    validateLoginUser,
};
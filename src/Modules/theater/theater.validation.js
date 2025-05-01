import Joi from "joi";
const facilities = ['parking', 'food_court', 'wheelchair_access', 'dolby_sound', 'imax', '3d', 'vip_lounge'];


export const createTheaterSchema = Joi.object({
    name: Joi.string().required().trim().messages({
        'string.empty': 'Theater name is required',
        'any.required': 'Theater name is required'
    }),
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required().trim().messages({
        'string.empty': 'manager name is required',
        'any.required': 'manager name is required'
    }),
    location: Joi.string().required().trim().messages({
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
    }),
    address: Joi.object({
        city: Joi.string().trim(),
        street: Joi.string().trim(),
        zipCode: Joi.string().trim()
    }),
    totalSeats: Joi.number().integer().min(1).required().messages({
        'number.base': 'Total seats must be a number',
        'number.min': 'Total seats must be at least 1',
        'any.required': 'Total seats is required'
    }),
    seatingLayout: Joi.object({
        rows: Joi.number().integer().min(0).default(0),
        columns: Joi.number().integer().min(0).default(0),
        configuration: Joi.object().default({})
    }),
    facilities: Joi.array().items(Joi.string().valid(...facilities)),
});

export const getTheaterByIdSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid theater ID format',
        'any.required': 'Theater ID is required'
    })
});

export const updateTheaterSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid theater ID format',
        'any.required': 'Theater ID is required'
    }),
    name: Joi.string().optional().trim().messages({
        'string.empty': 'Theater name is required',
        'any.required': 'Theater name is required'
    }),

    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).optional().trim().messages({
        'string.empty': 'manager name is required',
        'any.required': 'manager name is required'
    }),
    location: Joi.string().optional().trim().messages({
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
    }),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
    address: Joi.object({
        city: Joi.string().trim(),
        street: Joi.string().trim(),
        zipCode: Joi.string().trim()
    }),
    totalSeats: Joi.number().integer().min(1).optional().messages({
        'number.base': 'Total seats must be a number',
        'number.min': 'Total seats must be at least 1',
        'any.required': 'Total seats is required'
    }),
    seatingLayout: Joi.object({
        rows: Joi.number().integer().min(0).default(0),
        columns: Joi.number().integer().min(0).default(0),
        configuration: Joi.object().default({})
    }),
    facilities: Joi.array().items(Joi.string().valid(...facilities)).optional(),
});

export const deleteTheaterSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid theater ID format',
        'any.required': 'Theater ID is required'
    })
});

export const toggleTheaterStatusSchema = Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid theater ID format',
        'any.required': 'Theater ID is required'
    })
});

export const getAllTheaterSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base": "Page must be a number",
            "number.min": "Page must be at least 1"
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .messages({
            "number.base": "Limit must be a number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        }),


    name: Joi.string().optional().trim(),
    facilities: Joi.string().optional().trim(),
    city: Joi.string().optional().trim(),
});
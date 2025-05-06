import Joi from "joi";


export const createShowtimeSchema = Joi.object({
    movieId: Joi.string().hex().length(24).required().messages({
        'any.required': 'Movie ID is required'
    }),
    theaterId: Joi.string().hex().length(24).required().messages({
        'any.required': 'Theater ID is required'
    }),
    startTime: Joi.date().iso().greater('now').required().messages({
        'date.base': 'Start time must be a valid date',
        'date.greater': 'Start time must be in the future',
        'any.required': 'Start time is required'
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price cannot be negative',
        'any.required': 'Price is required'
    })
});


export const getAllShowtimeQuerySchema = Joi.object({
    movie: Joi.string().min(1).max(100).optional(),
    theater: Joi.string().min(1).max(100).optional(),
    startAfter: Joi.date().iso().optional()
        .messages({
            'date.format': `"startAfter" must be a valid ISO 8601 date string`
        }),

    startBefore: Joi.date().iso().optional()
        .messages({
            'date.format': `"startBefore" must be a valid ISO 8601 date string`
        }),

    page: Joi.number().integer().min(1).optional(),

    limit: Joi.number().integer().min(1).max(100).optional()
});

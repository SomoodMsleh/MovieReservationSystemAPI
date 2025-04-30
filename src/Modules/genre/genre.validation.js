import Joi from "joi";

export const createGenreSchema = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        'string.min': 'Genre name must be at least 2 characters',
        'string.max': 'Genre name cannot exceed 30 characters',
        'any.required': 'Genre name is required'
    }),
    description: Joi.string().max(300).allow('').optional().messages({
        'string.max': 'Description cannot exceed 300 characters'
    })
});

export const getGenreByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    })
});

export const updateGenreSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
    name: Joi.string().min(2).max(30).messages({
        'string.min': 'Genre name must be at least 2 characters',
        'string.max': 'Genre name cannot exceed 30 characters'
    }),
    description: Joi.string().max(300).allow('').messages({
        'string.max': 'Description cannot exceed 300 characters'
    })
});

export const deleteGenreSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    })
});
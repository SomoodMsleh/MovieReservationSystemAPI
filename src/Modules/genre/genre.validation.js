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
import Joi from "joi";

export const getUserByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
}); 

export const toggleUserStatusSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
}); 

export const deleteUserSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
        'string.min': 'Current password must be at least 6 characters',
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .messages({
            'string.min': 'New password must be at least 6 characters',
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'New password is required'
        })
});
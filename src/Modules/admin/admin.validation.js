import Joi from "joi";

export const updateUserRoleSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
    role: Joi.string().valid('user', 'admin').required().messages({
        'string.valid': "Role must be either 'user' or 'admin'",
        'any.required': 'Role is required'
    })
}); 

export const getAdminByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
}); 


export const toggleAdminStatusSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    })
}); 


export const deleteAdminSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
}); 

export const forceResetPasswordSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid ID format',
        'string.length': 'ID must be 24 characters',
        'any.required': 'ID is required'
    }),
    newPassword: Joi.string().min(6).required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'New password is required'
        })
});
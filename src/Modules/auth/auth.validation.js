import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'password is required'
    }),
    firstName: Joi.string().min(3).pattern(/^[a-zA-Z\s'-]+$/).required(),
    lastName: Joi.string().min(3).pattern(/^[a-zA-Z\s'-]+$/).required(),
    phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
    gender: Joi.string().valid("male", "female").optional(),
});

export const verifyEmailSchema = Joi.object({
    verificationCode: Joi.string().alphanum().length(8).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),//tlds: Top-Level Domains like :- .com, .net, .org.
    password: Joi.string().min(6).required()
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required()
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
    .messages({
        'string.min': 'Password must be at least 6 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'New password is required'
    })
});

export const updateProfileSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{8,15}$/).optional(),
    gender: Joi.string().valid("male", "female", "other").optional()
});

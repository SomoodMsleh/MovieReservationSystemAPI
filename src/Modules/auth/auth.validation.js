import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(6).required(),
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
    password: Joi.string().min(6).required()
});
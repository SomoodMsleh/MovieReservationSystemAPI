import Joi from "joi";

export const updateUserRoleSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    role: Joi.string().required()
}); 

export const getAdminByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}); 


export const toggleAdminStatusSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}); 


export const deleteAdminSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}); 
import Joi from "joi";

export const updateUserRoleSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    role: Joi.string().required()
}); 


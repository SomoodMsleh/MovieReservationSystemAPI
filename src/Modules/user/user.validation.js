import Joi from "joi";

export const getUserByIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
}); 
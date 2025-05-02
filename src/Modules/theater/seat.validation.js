import Joi from "joi";

export const configureTheaterSeatsSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Theater ID must be a valid hexadecimal ID',
        'string.length': 'Theater ID must be 24 characters long',
        'any.required': 'Theater ID is required'
    }),
    seats: Joi.array().items(
        Joi.object({
            row: Joi.string().required().trim().messages({
                'any.required': 'Row is required',
                'string.empty': 'Row cannot be empty'
            }),
            number: Joi.number().integer().min(1).required().messages({
                'any.required': 'Seat number is required',
                'number.base': 'Seat number must be a number',
                'number.min': 'Seat number must be at least 1',
                'number.integer': 'Seat number must be an integer'
            }),
            type: Joi.string().valid('standard', 'premium', 'handicap').default('standard').messages({
                'string.valid': 'Type must be one of: standard, premium, handicap'
            }),
            price: Joi.number().min(0).required().messages({
                'any.required': 'Price is required',
                'number.base': 'Price must be a number',
                'number.min': 'Price cannot be negative'
            })
        })
    ).min(1).required().messages({
        'any.required': 'Seats array is required',
        'array.min': 'At least one seat must be provided',
        'array.base': 'Seats must be an array'
    })
});

export const getTheaterSeatsSchema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Theater ID must be a valid hexadecimal ID',
        'string.length': 'Theater ID must be 24 characters long',
        'any.required': 'Theater ID is required'
    })
});
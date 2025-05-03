import Joi from "joi";

export const createMovieSchema = Joi.object({
    title: Joi.string()
        .required()
        .trim()
        .min(1)
        .max(100)
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 1 character",
            "string.max": "Title cannot exceed 100 characters",
            "any.required": "Title is required"
        }),

    description: Joi.string()
        .required()
        .trim()
        .min(10)
        .max(2000)
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description cannot exceed 2000 characters",
            "any.required": "Description is required"
        }),

    duration: Joi.number()
        .required()
        .integer()
        .min(1)
        .messages({
            "number.base": "Duration must be a number",
            "number.min": "Duration must be at least 1 minute",
            "number.integer": "Duration must be a whole number",
            "any.required": "Duration is required"
        }),

    releaseDate: Joi.date()
        .required()
        .messages({
            "date.base": "Release date must be a valid date",
            "any.required": "Release date is required"
        }),

    genres: Joi.array()
        .items(Joi.string())
        .min(1).optional()
        .messages({
            "array.min": "At least one genre must be selected"
        }),

    contentRating: Joi.string()
        .valid('G', 'PG', 'PG-13', 'R', 'NC-17')
        .required()
        .messages({
            "string.empty": "Content rating is required",
            "any.only": "Content rating must be one of: G, PG, PG-13, R, NC-17",
            "any.required": "Content rating is required"
        }),
    trailerUrl: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
        .messages({
            "string.uri": "Trailer URL must be a valid HTTP or HTTPS URL",
            "string.empty": "Trailer URL is required",
            "any.required": "Trailer URL is required"
        }),
    cast: Joi.array()
        .items(Joi.string().max(100))
        .optional()
        .messages({
            "string.max": "Cast member names cannot exceed 100 characters"
        }),

    language: Joi.string()
        .trim()
        .optional()
        .default('english')
        .messages({
            "string.empty": "Language cannot be empty"
        })
});

export const getMovieByIdSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        .required().messages({
            "string.pattern.base": "Invalid movie ID format",
            "any.required": "Movie ID is required"
        })
});

export const updateMovieSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        .required().messages({
            "string.pattern.base": "Invalid movie ID format",
            "any.required": "Movie ID is required"
        }),

    title: Joi.string()
        .trim()
        .min(1)
        .max(100)
        .optional()
        .messages({
            "string.empty": "Title cannot be empty",
            "string.min": "Title must be at least 1 character",
            "string.max": "Title cannot exceed 100 characters"
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .optional()
        .messages({
            "string.empty": "Description cannot be empty",
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description cannot exceed 2000 characters"
        }),
    duration: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base": "Duration must be a number",
            "number.min": "Duration must be at least 1 minute",
            "number.integer": "Duration must be a whole number"
        }),

    releaseDate: Joi.date()
        .optional()
        .messages({
            "date.base": "Release date must be a valid date"
        }),

    genres: Joi.array()
        .items(Joi.string())
        .min(1).optional()
        .messages({
            "array.min": "At least one genre must be selected"
        }),

    contentRating: Joi.string()
        .valid('G', 'PG', 'PG-13', 'R', 'NC-17')
        .optional()
        .messages({
            "string.empty": "Content rating cannot be empty",
            "any.only": "Content rating must be one of: G, PG, PG-13, R, NC-17"
        }),

    trailerUrl: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .optional()
        .messages({
            "string.uri": "Trailer URL must be a valid HTTP or HTTPS URL",
            "string.empty": "Trailer URL cannot be empty"
        }),

    cast: Joi.array()
        .items(Joi.string().max(100))
        .optional()
        .messages({
            "string.max": "Cast member names cannot exceed 100 characters"
        }),

    language: Joi.string()
        .trim()
        .optional()
        .messages({
            "string.empty": "Language cannot be empty"
        }),

});

export const deleteMovieSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        .required().messages({
            "string.pattern.base": "Invalid movie ID format",
            "any.required": "Movie ID is required"
        })
});


export const toggleMovieStatusSchema = Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        .required().messages({
            "string.pattern.base": "Invalid movie ID format",
            "any.required": "Movie ID is required"
        })
});

export const getAllMoviesSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            "number.base": "Page must be a number",
            "number.min": "Page must be at least 1"
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .messages({
            "number.base": "Limit must be a number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        }),

    sort: Joi.string()
        .optional()
        .pattern(/^(\w+:(asc|desc),)*(\w+:(asc|desc))$/)
        .messages({
            "string.pattern.base": "Sort must be in format: field:asc|desc"
        }),

    title: Joi.string()
        .optional()
        .trim(),


    genre: Joi.string().optional().trim(),


    releaseYear: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear() + 10)
        .optional()
        .messages({
            "number.base": "Release year must be a number",
            "number.min": "Release year must be at least 1900",
            "number.max": `Release year cannot exceed ${new Date().getFullYear() + 10}`
        })
});
import rateLimit from "express-rate-limit";

export const forgotPasswordLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // 5 requests per hour per IP
	message: {
		success: false,
		message: "Too many password reset requests. Try again later.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

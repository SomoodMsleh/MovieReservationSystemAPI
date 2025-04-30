export const preProcessArrayFields = (fields = [])=>{
    return async (req, res, next) => {
        try {
            const fieldsToProcess = fields.length;
            if(fieldsToProcess > 0){
                for (const field of fields){
                    if (req.body[field] && typeof req.body[field] === 'string') {
                        try {
                            req.body[field] = JSON.parse(req.body[field]);
                            
                            // Ensure the parsed value is actually an array
                            if (!Array.isArray(req.body[field])) {
                                throw new Error(`${field} must be a JSON array`);
                            }
                        } catch (parseError) {
                            throw new Error(`Invalid JSON format in ${field} field: ${parseError.message}`);
                        }
                    }
                }
            }
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Error processing array fields",
                error: error.stack
            });
        }
    }
};
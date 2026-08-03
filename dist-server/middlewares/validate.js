export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.errors || error.message
            });
        }
    };
};

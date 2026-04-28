export function validateRequest(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.details.map((d) => d.message),
            });
        }
        req.query = value;
        next();
    };
}
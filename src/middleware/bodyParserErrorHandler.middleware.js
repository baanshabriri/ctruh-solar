function isBodyParserError(error) {
    const bodyParserCommonErrorsTypes = [
        "encoding.unsupported",
        "entity.too.large",
        "entity.parse.failed",
        "entity.verify.failed",
        "request.aborted",
        "request.size.invalid",
        "parameters.too.many",
        "charset.unsupported",
    ];

    return bodyParserCommonErrorsTypes.includes(error?.type);
}

export function bodyParserErrorHandler({
    onError = () => { },
    errorMessage = (err) =>
        `Body Parser failed to parse request --> ${err.message}`,
} = {}) {
    return (err, req, res, next) => {
        if (err && isBodyParserError(err)) {
            onError(err, req, res);

            return res.status(err.status || 400).json({
                error: "Invalid request body",
                message: errorMessage(err),
            });
        }

        return next(err);
    };
}
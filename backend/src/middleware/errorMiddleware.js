const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error("-------------------- ERROR --------------------");
    console.error(`Timestamp: ${new Date().toISOString()}`);
    console.error(`Route: ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        // Avoid logging sensitive info like passwords in production
        const safeBody = { ...req.body };
        if (safeBody.password) safeBody.password = "[REDACTED]";
        console.error(`Body: ${JSON.stringify(safeBody)}`);
    }
    console.error(`Error Message: ${err.message}`);
    console.error(`Error Stack: ${err.stack}`);
    console.error("---------------------------------------------");

    // Determine the status code
    // Use the status code from the error if it exists, otherwise default to 500
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

    // Send the error response
    res.status(statusCode).json({
        message: err.message || "Ocorreu um erro interno no servidor.",
        // Optionally include stack trace in development environment
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = { errorHandler };


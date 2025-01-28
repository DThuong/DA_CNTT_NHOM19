const notFound = (req, res, next) => {
    const err = new Error(`Route {${req.originalUrl}} not found`);
    err.status = 404;
    next(err);
}

const errHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        msg: err?.message
    })
}

module.exports = {
    notFound,
    errHandler
}
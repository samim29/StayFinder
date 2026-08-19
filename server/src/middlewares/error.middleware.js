const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Keeps legacy controllers and newer controllers on one error response shape.
const responseShapeMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 400 && body && body.success === undefined) {
      return originalJson({ success: false, ...body });
    }
    return originalJson(body);
  };
  next();
};

const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const statusCode =
    error.statusCode || (error.name === "ValidationError" ? 400 : 500);
  const message = statusCode === 500 ? "Internal server error" : error.message;

  console.error(`[${statusCode}] ${req.method} ${req.originalUrl}`, error);
  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || undefined,
  });
};

module.exports = {
  responseShapeMiddleware,
  notFoundMiddleware,
  errorMiddleware,
};

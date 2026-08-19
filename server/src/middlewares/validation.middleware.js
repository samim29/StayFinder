const validationMiddleware = (validators = []) => {
  return async (req, res, next) => {
    const errors = [];

    for (const validator of validators) {
      const error = await validator(req.body);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

module.exports = validationMiddleware;

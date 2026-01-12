const { validationResult } = require('express-validator');

/**
 * Express middleware to handle validation results from express-validator
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => ({ param: e.param, msg: e.msg })),
    });
  }
  next();
}

module.exports = { handleValidation };

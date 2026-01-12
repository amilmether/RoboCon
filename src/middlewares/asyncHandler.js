/**
 * Small helper to wrap async route handlers and forward errors to next()
 * Usage: router.get('/', asyncHandler(async (req, res) => { ... }))
 */
module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Wraps async route handlers to catch errors and forward to the error handler.
 * Eliminates try-catch boilerplate in every controller.
 *
 * Usage: router.get('/path', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

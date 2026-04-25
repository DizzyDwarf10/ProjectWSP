function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function notFoundHandler(_req, res) {
  return res.status(404).json({ error: 'Route not found' });
}

function errorHandler(error, _req, res, _next) {
  if (error && error.code === 'SQLITE_CONSTRAINT') {
    return res.status(409).json({ error: 'Database constraint violation' });
  }

  const status = error.status || 500;
  const message = error.message || 'Unexpected server error';
  return res.status(status).json({ error: message });
}

module.exports = {
  asyncHandler,
  notFoundHandler,
  errorHandler
};

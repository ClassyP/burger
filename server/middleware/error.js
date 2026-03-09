const { createHttpError } = require("../lib/httpError");

function notFound(req, _res, next) {
  next(createHttpError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.path}`));
}

function errorHandler(error, _req, res) {
  const status = error.status || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const message = error.message || "Unexpected server error.";

  const responseError = {
    code,
    message
  };

  if (error.details) {
    responseError.details = error.details;
  }

  res.status(status).json({
    error: responseError
  });
}

module.exports = {
  notFound,
  errorHandler
};

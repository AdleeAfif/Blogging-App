const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case 400:
      res.json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 401:
      res.json({
        title: "Unauthorized Operation",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 403:
      res.json({
        title: "Forbidden Access",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 404:
      res.json({
        title: "Resource Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case 409:
      res.json({
        title: "Conflict Source",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      res.status(statusCode).json({
        title: "Internal Server Error",
        message: "Something went wrong",
        stackTrace: err.stack,
      });
      break;
  }
};

module.exports = errorHandler;

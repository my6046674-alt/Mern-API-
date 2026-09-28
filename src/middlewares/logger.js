const logger = (req, res, next) => {
  const url = req.originalUrl;
  const method = req.method;

  console.log(`${method}: ${url}`);

  next();
};

export default logger;
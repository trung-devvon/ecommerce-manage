const rateLimit = {};
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS = 20;

const requestLimiter = (req, res, next) => {
  const route = req.originalUrl;
  const currentTime = Date.now();

  if (!rateLimit[route]) {
    rateLimit[route] = [];
  }

  // Remove outdated requests
  rateLimit[route] = rateLimit[route].filter(
    (timestamp) => currentTime - timestamp < RATE_LIMIT_WINDOW
  );

  if (rateLimit[route].length >= MAX_REQUESTS) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.',
    });
  }

  // Add the current timestamp
  rateLimit[route].push(currentTime);
  next();
};

module.exports = requestLimiter;

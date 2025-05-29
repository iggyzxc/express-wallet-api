import ratelimit from '../config/upstash.js';

const rateLimiter = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : req.ip; // Use user ID if available, otherwise use IP address
    if (!userId) {
      console.warn(
        'Rate limiter: Could not determine user ID. Falling back to IP address.',
      );
    }

    // Pass the userId (or IP as fallback) as the key to the limit method
    const { success } = await ratelimit.limit(userId);

    if (!success) {
      return res
        .status(429)
        .json({ error: 'Too many requests, please try again later.' });
    }
    next(); // Proceed to the next function if the rate limit is not exceeded
  } catch (error) {
    console.log('Rate limit error', error);
    next(error);
  }
};

export default rateLimiter;

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

import 'dotenv/config';

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, '60 s'), // 100 requests per minute
});

export default rateLimit;

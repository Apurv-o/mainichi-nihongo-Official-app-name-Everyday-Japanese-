/**
 * Lightweight in-memory rate limiter for Vercel Serverless Functions
 */
const ipRequests = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(clientIp) {
  if (!clientIp) return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW };
  
  const now = Date.now();
  const userRecord = ipRequests.get(clientIp) || { count: 0, resetTime: now + WINDOW_MS };

  // If window expired, reset
  if (now > userRecord.resetTime) {
    userRecord.count = 0;
    userRecord.resetTime = now + WINDOW_MS;
  }

  userRecord.count += 1;
  ipRequests.set(clientIp, userRecord);

  // Periodic cleanup of stale records if Map gets large
  if (ipRequests.size > 10000) {
    for (const [ip, rec] of ipRequests.entries()) {
      if (now > rec.resetTime) {
        ipRequests.delete(ip);
      }
    }
  }

  const limited = userRecord.count > MAX_REQUESTS_PER_WINDOW;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - userRecord.count);

  return { limited, remaining, resetTime: userRecord.resetTime };
}

module.exports = {
  isRateLimited,
  MAX_REQUESTS_PER_WINDOW,
  WINDOW_MS
};

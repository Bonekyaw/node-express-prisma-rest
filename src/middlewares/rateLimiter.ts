import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 15,    // Limit each IP to 15 requests per `window` (here, per 1 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // skipSuccessfulRequests: true,      // This is useful for auth check. If request is successful, it never limit.
});


export const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] [${new Date().toISOString()}]`, err.message);
  res.status(err.status || 500).json({
    msg: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
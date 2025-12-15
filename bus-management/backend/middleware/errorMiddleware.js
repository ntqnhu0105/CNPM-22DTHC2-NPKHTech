const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống server';
  res.status(statusCode).json({ 
    success: false, 
    message: message 
  });
};
module.exports = errorMiddleware;
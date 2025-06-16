const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Không có token, truy cập bị từ chối' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Không có quyền truy cập' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token không hợp lệ' });
    }
  };
};

module.exports = authMiddleware;
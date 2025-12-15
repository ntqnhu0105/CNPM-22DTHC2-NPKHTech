const { register, login, changePassword, forgotPassword, resetPassword } = require('../services/authService');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res, next) => {
  try {
    const { captchaValue, captchaToken } = req.body;

    if (!captchaValue || !captchaToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập mã Captcha.' 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(captchaToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'Captcha đã hết hạn hoặc không hợp lệ. Vui lòng tải lại ảnh mới.' 
      });
    }

    if (captchaValue.toLowerCase() !== decoded.answer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mã Captcha không chính xác.' 
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, user } = await register(req.body);

    res.status(201).json({ 
      success: true,
      message: 'Đăng ký thành công',
      token, 
      user 
    });

  } catch (err) {
    next(err);
  }
};
const loginAttempts = new Map();
const loginUser = async (req, res, next) => {
  try {
    const { username, password, captchaValue, captchaToken } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress; 

    const attemptData = loginAttempts.get(clientIp) || { count: 0 };
    
    if (attemptData.count >= 3) {
      
      if (!captchaValue || !captchaToken) {
        return res.status(403).json({ 
          success: false, 
          requireCaptcha: true, 
          message: 'Hệ thống phát hiện bất thường. Vui lòng nhập mã Captcha.' 
        });
      }

      try {
        const decoded = jwt.verify(captchaToken, process.env.JWT_SECRET);
        if (captchaValue.toLowerCase() !== decoded.answer) {
          return res.status(400).json({ success: false, message: 'Mã Captcha không đúng.' });
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Captcha hết hạn.' });
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await login({ username, password });
      
      loginAttempts.delete(clientIp);
      
      res.json(result);

    } catch (error) {
      
      const newCount = attemptData.count + 1;
      loginAttempts.set(clientIp, { count: newCount });

      res.status(401).json({ 
        success: false, 
        message: error.message,
        requireCaptcha: newCount >= 3 
      });
    }

  } catch (err) {
    next(err);
  }
};

const changePasswordController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user.userId; // Lấy từ Token (authMiddleware)
    const { oldPassword, newPassword } = req.body;

    const result = await changePassword(userId, oldPassword, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Vui lòng nhập email' });

    const result = await forgotPassword(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, otp, newPassword } = req.body;
    const result = await resetPassword(email, otp, newPassword);
    res.json(result);
  } catch (err) {
    next(err);
  }
};


module.exports = { registerUser, loginUser, changePasswordController, forgotPasswordController, resetPasswordController };
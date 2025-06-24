const crypto = require('crypto');

const getCaptcha = async (req, res, next) => {
  try {
    // Sinh chuỗi captcha random (5 ký tự)
    const captchaText = crypto.randomBytes(3).toString('hex').slice(0, 5).toUpperCase();
    req.session.captcha = captchaText;
    res.json({ captcha: captchaText });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCaptcha }; 
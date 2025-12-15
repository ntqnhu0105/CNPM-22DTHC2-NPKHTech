const svgCaptcha = require('svg-captcha');
const jwt = require('jsonwebtoken');

const getCaptcha = async (req, res, next) => {
  try {
    const captcha = svgCaptcha.create({
      size: 5,
        ignoreChars: '0o1i', 
        noise: 1, 
        color: false, 
        width: 150,   
        height: 50,   
        fontSize: 50 
    });

    const captchaToken = jwt.sign(
      { answer: captcha.text.toLowerCase() },
      process.env.JWT_SECRET, 
      { expiresIn: '10m' }    
    );

    res.status(200).json({
      image: captcha.data,
      token: captchaToken
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { getCaptcha };
const { register, login } = require('../services/authService');
const { validationResult } = require('express-validator');

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { token, user } = await register(req.body);
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    console.log('Login request body:', req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array()); // Debug log
      return res.status(400).json({ errors: errors.array() });
    }
    const { token, user } = await login(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
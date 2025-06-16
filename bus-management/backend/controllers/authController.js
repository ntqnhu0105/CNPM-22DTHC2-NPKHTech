const { register, login } = require('../services/authService');
const { validationResult } = require('express-validator');

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { token, user } = await login(req.body);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
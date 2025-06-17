const { getAllUser, createUser, updateUser, deleteUser: deleteUserService } = require('../services/userService');
const { validationResult } = require('express-validator');

const getUser = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await getAllUser({ page: parseInt(page), limit: parseInt(limit) });
    res.json({
      data: result.users,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

const postUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await createUser(req.body);
    res.status(201).json({ data: user, message: 'Tạo người dùng thành công' });
  } catch (err) {
    next(err);
  }
};

const putUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await updateUser(req.params.id, req.body);
    res.json({ data: user, message: 'Cập nhật người dùng thành công' });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const result = await deleteUserService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUser,
  postUser,
  putUser,
  deleteUser,
};
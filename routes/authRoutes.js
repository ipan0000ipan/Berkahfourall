const express = require('express');
const { login } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', [
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password is required').notEmpty()
], login);

module.exports = router;
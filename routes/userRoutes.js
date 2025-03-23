const express = require('express');
const { createUser, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// @route   POST /api/users
// @desc    Create new user
// @access  Private/Admin
router.post('/', [
  protect,
  authorize('admin'),
  check('username', 'Username is required').notEmpty(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role', 'Role must be admin, karyawan, konsumen, or investor')
    .isIn(['admin', 'karyawan', 'konsumen', 'investor'])
], createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', [protect, authorize('admin')], getAllUsers);

module.exports = router;
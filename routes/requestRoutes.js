const express = require('express');
const { createRequest, getAllRequests, updateRequestStatus, getUserRequests } = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// @route   POST /api/requests
// @desc    Create new pickup request
// @access  Private/Konsumen
router.post('/', [
  protect,
  authorize('konsumen'),
  check('barang', 'Jenis barang is required').notEmpty(),
  check('berat', 'Berat barang is required').isNumeric().toFloat(),
  check('alamat', 'Alamat is required').notEmpty(),
  check('mapsLink', 'Google Maps link is required').notEmpty().isURL(),
  check('metodePembayaran', 'Metode pembayaran must be cash or transfer').isIn(['cash', 'transfer']),
  check('tanggalJemput', 'Tanggal jemput is required').isISO8601().toDate(),
  check('jamJemput', 'Jam jemput is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
], createRequest);

// @route   GET /api/requests
// @desc    Get all requests
// @access  Private/Admin,Karyawan
router.get('/', [protect, authorize('admin', 'karyawan')], getAllRequests);

// @route   PATCH /api/requests/:id
// @desc    Update request status
// @access  Private/Admin,Karyawan
router.patch('/:id', [
  protect,
  authorize('admin', 'karyawan'),
  check('status', 'Status must be disetujui, dijemput, selesai, or ditolak')
    .isIn(['disetujui', 'dijemput', 'selesai', 'ditolak'])
], updateRequestStatus);

// @route   GET /api/requests/user
// @desc    Get user's requests
// @access  Private/Konsumen
router.get('/user', [protect, authorize('konsumen')], getUserRequests);

module.exports = router;
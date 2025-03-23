const Request = require('../models/Request');
const { validationResult } = require('express-validator');

// @desc    Create new pickup request
// @route   POST /api/requests
// @access  Private/Konsumen
const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { barang, berat, alamat, mapsLink, metodePembayaran, tanggalJemput, jamJemput } = req.body;

    const request = await Request.create({
      userId: req.user._id,
      barang,
      berat,
      alamat,
      mapsLink,
      metodePembayaran,
      tanggalJemput,
      jamJemput
    });

    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all requests with optional filters
// @route   GET /api/requests
// @access  Private/Admin,Karyawan
const getAllRequests = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.tanggalJemput = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const requests = await Request.find(filter)
      .populate('userId', 'username')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id
// @access  Private/Admin,Karyawan
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (!['disetujui', 'dijemput', 'selesai', 'ditolak'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    await request.save();

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's requests
// @route   GET /api/requests/user
// @access  Private/Konsumen
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  getUserRequests
};
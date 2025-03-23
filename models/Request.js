const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  barang: {
    type: String,
    required: [true, 'Jenis barang is required'],
    trim: true
  },
  berat: {
    type: Number,
    required: [true, 'Berat barang is required'],
    min: [0, 'Berat tidak boleh negatif']
  },
  alamat: {
    type: String,
    required: [true, 'Alamat is required'],
    trim: true
  },
  mapsLink: {
    type: String,
    required: [true, 'Google Maps link is required'],
    trim: true
  },
  metodePembayaran: {
    type: String,
    enum: ['cash', 'transfer'],
    required: [true, 'Metode pembayaran is required']
  },
  tanggalJemput: {
    type: Date,
    required: [true, 'Tanggal jemput is required']
  },
  jamJemput: {
    type: String,
    required: [true, 'Jam jemput is required']
  },
  status: {
    type: String,
    enum: ['menunggu', 'disetujui', 'dijemput', 'selesai', 'ditolak'],
    default: 'menunggu'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
requestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
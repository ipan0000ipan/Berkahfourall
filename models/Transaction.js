const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: [true, 'Request ID is required']
  },
  jumlah: {
    type: Number,
    required: [true, 'Jumlah is required'],
    min: [0, 'Jumlah tidak boleh negatif']
  },
  metodePembayaran: {
    type: String,
    enum: ['cash', 'transfer'],
    required: [true, 'Metode pembayaran is required']
  },
  tanggal: {
    type: Date,
    default: Date.now
  },
  strukPath: {
    type: String,
    required: [true, 'Path struk PDF is required']
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
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
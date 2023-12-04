
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true },
  purchaseDatetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;

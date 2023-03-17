const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: Object, required: false },
  order: { type: Object, required: true },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },

},
  { timestamps: true });

const Order = mongoose.model("orders", orderSchema);

module.exports = { orderSchema, Order };

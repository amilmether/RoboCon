const mongoose = require('mongoose');

/**
 * Item schema - schema-level validation is enforced here
 * Fields:
 * - name: required string
 * - description: optional string
 * - price: required number >= 0
 * - quantity: number (default 0)
 */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [1, 'Name must not be empty'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;

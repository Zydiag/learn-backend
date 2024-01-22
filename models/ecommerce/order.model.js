import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderPrice: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'cancelled', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

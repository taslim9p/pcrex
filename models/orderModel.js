import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.ObjectId, ref: "Products" },
  name: String,
  description: String,
  price: Number,
  quant: Number,

  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    products: [productSchema],
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

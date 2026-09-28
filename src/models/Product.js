import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    minLength: 3,
    maxLength: 50,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Category is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [1, "Price must be greater than 1."],
    max: [1000000, "Price must be less than 10,00,000."],
  },
  stock: {
    type: Number,
    min: 0,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Created by user id is required."],
  },
  imageUrls: {
    type: [String],
  },
  description: {
    type: String,
  },
});

export default mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  variantName: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, require: true },
  attributes: {
    color: { type: String },
    size: { type: String },
    material: { type: String },
    more: { type: String },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = { productVariantSchema, ProductVariant };

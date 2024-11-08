const mongoose = require("mongoose");
const { productVariantSchema } = require("./ProductVariant");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    keyword: [{ type: String }],
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    variants: [productVariantSchema],
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Middleware auto update totalStock
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

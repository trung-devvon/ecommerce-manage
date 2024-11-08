const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { ProductVariant } = require("../models/ProductVariant");

const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  const images = req.files
  
});

module.exports = { createProduct };

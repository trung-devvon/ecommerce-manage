const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");

const createParentCategory = asyncHandler(async (req, res) => {
  const { name, code, parentCategory, shopId } = req.body;
  const image = req.file ? req.file.path : "";
  const existingCategory = await Category.findOne({ code: code });

  if (existingCategory) {
    if (req.file) {
      cloudinary.uploader.destroy(req.file.filename, function (error, result) {
        if (error) {
          console.log("Error deleting file from Cloudinary: ", error);
        } else {
          console.log("File deleted successfully from Cloudinary: ", result);
        }
      });
    }
    return res.status(400).json({
      message: "Tên danh mục đã tồn tại",
    });
  }

  const category = await Category.create({
    name,
    code,
    image,
    belongToShop: shopId || null,
    parentCategory: parentCategory || null,
  });
  return res.status(201).json({
    message: "Successfully",
    category,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const data = await Category.find({
    parentCategory: null,
    belongToShop: null,
  });
  return res.json({
    categories: data || [],
  });
});
const allCategoriesByShop = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const data = await Category.find({ belongToShop: shopId });
  return res.json({
    categories: data || [],
  });
});

module.exports = {
  createParentCategory,
  getAllCategories,
  allCategoriesByShop,
};

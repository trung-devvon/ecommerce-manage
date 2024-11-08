const User = require("../models/User");
const Shop = require("../models/Shop");
const asyncHandler = require("express-async-handler");

const getCurrentUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).select(
    "id email username role active isVerified"
  );
  let shop = null
  if (currentUser.role === "seller") {
    shop = await Shop.findOne({ userId: req.user.id });
  }
  if (currentUser && currentUser.isVerified && currentUser.active) {
    const userData = {
      id: currentUser.id,
      shopId: shop ? shop._id : '',
      email: currentUser.email,
      username: currentUser.username,
      role: currentUser.role,
      active: currentUser.active,
      isVerified: currentUser.isVerified,
    };
    const data = JSON.stringify(userData);
    return res.json({ user: data, success: true });
  }
  return res.json({ success: false, test: false });
});
const updateRole = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id).select(
    "id email username role active isVerified"
  );
  if (currentUser && currentUser.isVerified && currentUser.active) {
    const userData = {
      id: currentUser.id,
      email: currentUser.email,
      username: currentUser.username,
      role: currentUser.role,
      active: currentUser.active,
      isVerified: currentUser.isVerified,
    };
    const data = JSON.stringify(userData);
    return res.json({ user: data, success: true });
  }
  return res.json({ success: false, test: false });
});

module.exports = { getCurrentUser };

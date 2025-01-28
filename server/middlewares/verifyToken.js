const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user")

// hàm này verify access token mà người dùng gửi lên
const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Check if the authorization header starts with "Bearer "
  if (req?.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, msg: "Invalid access token" });
      }
      // Lấy thông tin người dùng từ database
      const user = await User.findById(decoded.id);
      // Kiểm tra nếu tài khoản bị block
      if (user?.isBlocked) {
        return res
          .status(403)
          .json({ success: false, msg: "Account is blocked, Please contact admin !!!" });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ success: false, msg: "Require authenticated token" });
  }
});

// middleware phân quyền admin
const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (+role !== 2002) {
    return res.status(401).json({
      success: false,
      msg: "Require admin role",
    });
  }
  next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
};

const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

const jwt = require("jsonwebtoken");

const { sendEmail } = require("../utils/sendMail");

const crypto = require("crypto");
const makeToken = require("uniqid");
const users = require("../utils/contants");

// Đăng ký
// const register = asyncHandler(async (req, res) => {
//   const { firstname, lastname, email, password } = req.body;
//   if (!firstname || !lastname || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       msg: "Please enter all fields",
//     });
//   }
//   const user = await User.findOne({ email });
//   if (user) throw new Error("User already exists");
//   else {
//     const createUser = await User.create(req.body);
//     return res.status(200).json({
//       success: createUser ? true : false,
//       msg: createUser
//         ? "Create user successfully, PLease go Login~"
//         : "Create user failed",
//     });
//   }
// });

const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, mobile } = req.body;
  if (!firstname || !lastname || !email || !password || !mobile) {
    return res.status(400).json({
      success: false,
      msg: "Please enter all fields",
    });
  }
  const userEmail = await User.findOne({ email });
  const userMobile = await User.findOne({ mobile });
  if (userEmail) throw new Error("User with email already exists");
  else if (userMobile) throw new Error("User with mobile already exists");
  else {
    const token = makeToken();
    res.cookie(
      "dataregister",
      { ...req.body, token },
      { httpOnly: true, maxAge: 15 * 60 * 1000 }
    );
    const html = `Vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký, Link này sẽ hết hạn sau 15 phút: 
    <a href="${process.env.SERVER_URL}/api/user/finalregister/${token}">Click here</a>`;
    await sendEmail({
      email,
      html,
      subject: "Hoàn tất đăng ký tài khoản e-commerce",
    });
    return res.json({
      success: true,
      msg: "Please check email to active your account",
    });
  }
});

const finalregister = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { token } = req.params;

  if (!cookie?.dataregister || cookie.dataregister.token !== token) {
    res.clearCookie("dataregister");
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }
  const { email, password, firstname, lastname, mobile } = cookie?.dataregister;

  const createUser = await User.create({
    email,
    password,
    firstname,
    lastname,
    mobile,
  });
  res.clearCookie("dataregister");
  if (createUser)
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  else return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
});

// refresh token: cấp mới access token
// access token: xác thực người dùng, phân quyền người dùng
// đăng nhập
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: "missing fields",
    });
  }
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    // Check if the account is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        msg: "Your account has been blocked. Please contact support.",
      });
    }
    // tách password và role ra khỏi response
    const { role, password, refreshToken, ...userData } = user.toObject();
    // tạo access Token
    const accessToken = generateAccessToken(user._id, role);
    // tạo refresh token
    const newRefreshToken = generateRefreshToken(user._id);
    // lưu refresh token vào database
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    // lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      msg: "Login successfully",
      accessToken,
      userData,
    });
  } else {
    return res.status(404).json({
      success: false,
      msg: "User not found",
    });
  }
});

// Lấy 1 user cụ thể thông qua id
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById({ _id }).select("-refreshToken -password");
  return res.status(200).json({
    success: user ? true : false,
    msg: user ? user : "user not found!!!",
  });
});

// API cấp mới một accesstoken khi nó hết hạn
const refreshAccessToken = asyncHandler(async (req, res) => {
  // lấy token từ cookie
  const { refreshToken } = req.cookies;
  // check xem có token hay không
  if (!refreshToken) throw new Error("Don't have refresh token in cookie");
  // check token có hợp lệ không
  const rs = await jwt.verify(refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "refresh token not matched",
  });
});

// Đăng xuất
const logOut = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.status(200).json({
    success: true,
    msg: "Logout successfully",
  });
});

// coding api reset password:
// client gửi lên email mà họ đăng ký
// server check xem email có hợp lệ không => gửi mail => kèm theo link (password change token)
// client check mail => click vào link
// client gửi api kèm token
// check token có giống với token mà server gửi mail hay không
// change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email is required");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = await user.generatePasswordResetToken(); // lưu token vào db
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn, Link này sẽ hết hạn sau 15 phút: <a href="${resetURL}">Click here</a>`;

  const data = {
    email,
    html,
    subject: "Forgot password",
  };

  const result = await sendEmail(data);
  return res.status(200).json({
    success: result.response?.includes("OK") ? true : false,
    msg: result.response?.includes("OK")
      ? "Hãy check mail của bạn"
      : "Đã có lỗi, hãy thử lại sau !!!",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password) throw new Error("Password is required");
  if (!token) throw new Error("Reset token is required");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("User not found");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    msg: user ? "Reset password successfully" : "Failed to reset password",
  });
});

// lấy tất cả user (quyền admin)
const getUsers = asyncHandler(async (req, res) => {
  // 2 object giống nhau là queries và req.query (copy req.query)
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((item) => delete queries[item]); // xóa các trường ra khỏi queries

  // Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatQueryString = JSON.parse(queryString);

  //Filtering
  if (queries?.name)
    formatQueryString.name = { $regex: queries.name, $options: "i" };

  let queryCommand = User.find(formatQueryString);

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join("");
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fieldsLimit = req.query.fields.split(",").join("");
    queryCommand = queryCommand.select(fieldsLimit);
  }

  // Pagination
  // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || process.env.LIMIT_PRODUCTS || 10;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute
  queryCommand
    .exec()
    .then(async (response) => {
      const counts = await User.find(formatQueryString).countDocuments();
      return res.status(200).json({
        success: response ? true : false,
        counts,
        users: response ? response : "Can't find user",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// Xóa 1 user dựa trên id
const deleteUserById = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid) throw new Error("Can't find id");
  const response = await User.findByIdAndDelete(uid);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email: ${response.email} has been deleted`
      : "no user deleted",
  });
});

// Cập nhật 1 user dựa trên id
const updateUserById = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {firstname, lastname, email, mobile} = req.body
  const data = {firstname, lastname, email, mobile}
  if(req.file) data.avatar = req.file.path
  else throw new Error('File not found')
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Can't find id");
  const update = await User.findByIdAndUpdate(_id, data, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: update ? true : false,
    msg: update ? update : "Failed to update",
  });
});

// Cập nhật 1 user quyền ADMIN
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error("Can't find id");
  const update = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -refreshToken");
  return res.status(200).json({
    success: update ? true : false,
    UPdatedUser: update ? update : "Failed to update",
  });
});

// update address user, 1 user có thể có nhiều address
const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing address input");
  const newAddress = req.body.address; // address mà người dùng gửi lên
  const user = await User.findById(_id);
  if (user.address.includes(newAddress)) {
    return res
      .status(400)
      .json({ msg: "Duplicate address, please enter another address" });
  }
  const updateAddress = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: updateAddress ? true : false,
    UPdatedUser: updateAddress
      ? updateAddress
      : "Failed to update user's address",
  });
});

// update User's cart
const updateCartUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity = 1, color } = req.body;
  if (!pid || !color) throw new Error("missing inputs");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity, "cart.$.color": color } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        msg: response ? response : "something went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        msg: response ? response : "cannot update user's cart",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      msg: response ? response : "cannot update user's cart",
    });
  }
});

// remove product in cart
const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid} = req.body;
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (!alreadyProduct) {
    return res.status(200).json({
      success: true,
      msg : "updated your cart",
    });
  }
  const response = await User.findByIdAndUpdate(
    _id,
    { $pull: { cart: { product: pid } } },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    msg: response ? response : "cannot update user's cart",
  });
});


// create user
const createUsers = asyncHandler(async (req, res) => {
  // Thêm avatar mặc định vào từng user trong mảng `users`
  const usersWithDefaultAvatar = users.map(user => ({
    ...user,
    avatar: "https://res.cloudinary.com/dj5buyo04/image/upload/v1733829770/e-commerce-storage/jnr4tkuun8cfzsm5try0.jpg",
  }));

  const response = await User.create(usersWithDefaultAvatar);
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const blockUserById = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  let { isBlocked } = req.body;

  // Chuyển đổi isBlocked thành boolean
  if (typeof isBlocked === "string") {
    isBlocked = isBlocked === "true";
  }

  if (typeof isBlocked !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid isBlocked value" });
  }

  const user = await User.findByIdAndUpdate(uid, { isBlocked }, { new: true });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: `User ${isBlocked ? "blocked" : "unblocked"} successfully.`,
    updatedUser: user,
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logOut,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUserById,
  updateUserById,
  updateUserByAdmin,
  updateUserAddress,
  updateCartUser,
  finalregister,
  createUsers,
  blockUserById,
  removeProductInCart
};

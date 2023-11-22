const User = require("../models/User");
const Note = require("../models/Note");

// dependencies
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(404).json({
      message: "No users found",
    });
  }

  return res.json(users);
});

// @desc create a new user
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // confirm the data recieved
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // check for duplicates
  const duplicate = await User.findOne({
    username,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Username already exist",
    });
  }

  // hash password with 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPassword, roles };

  // create and store a user

  const user = User.create(userObject);

  if (user) {
    // user was created
    res.status(201).json({
      message: `New user created : ${username}`,
    });
  } else {
    res.status(400).json({
      message: "Invalid user data recieved",
    });
  }
});

// @desc update a user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // confirm recieved data
  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  //check for duplicates
  const duplicate = await User.findOne(user).lean().exec();

  //   allow updates to original user only
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({
      message: "Duplicate username",
    });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    user.password = await bcrypt.hash(password, 10); //10 rounds of salt
  }

  const updatedUser = await user.save();
  res.status(201).json({
    message: `user updated : ${updateUser.username}`,
  });
});

// @desc delete a user
// @route DELETE /user
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // check if id is recieved
  if (!id) {
    return res.status(400).json({
      message: "User ID required",
    });
  }

  // check if user has assigned notes
  const notes = await Note.findOne({
    user: id,
  })
    .lean()
    .exec();

  if (notes?.length) {
    return res.status(400).json({
      message: "user has assigned notes",
    });
  }

  //   check if the user exist
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};

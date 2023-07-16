const db = require("../services/db");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const mysql = require("mysql2");

const createUser = catchAsync(async (req, res, next) => {
  const { username, password, phone, email } = req.body;

  // Check if the username already exists in the database
  const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
  const existingUser = await db.query(checkUsernameQuery, [username]);

  // if (existingUser.length > 0) {
  //   //   return res.status(409).json({ message: "Username already exists" });
  //   return next(new AppError("useralready usamfocseifjwesio exist ", 400));
  // }

  // Create the new user in the database
  const createUserQuery =
    "INSERT INTO users (username, password, role, phone , email) VALUES (?, ?, ?, ?,?)";
  await db.query(createUserQuery, [
    username,
    password,
    "manager",
    phone,
    email,
  ]);
  // Fetch the newly created user from the database
  const getUserQuery = "SELECT * FROM users WHERE username = ?";
  const newUser = await db.query(getUserQuery, [username]);
  res.status(201).json(newUser[0]);
});
const getAllUsers = catchAsync(async (req, res) => {
  // Fetch all users from the database
  const getUsersQuery = "SELECT * FROM users";
  const users = await db.query(getUsersQuery);

  res.status(200).json(users);
});
module.exports = {
  createUser,
  getAllUsers,
};

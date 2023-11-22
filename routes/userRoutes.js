const express = require("express");

const usersController = require("../controllers/usersController");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser);

module.exports = userRouter;

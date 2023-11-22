const express = require("express");

const userRouter = express.Router();

userRouter
  .route("/")
  //
  .get()
  //
  .path()
  //
  .delete()
  //
  .patch();

module.exports = userRouter;

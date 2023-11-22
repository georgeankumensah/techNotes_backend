const express = require("express");

const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnect");

const app = express();

const PORT = process.env.PORT || 3500;

// middlewares
console.log(process.env.NODE_ENV);
dotenv.config();
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    // handle wrong page routes
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    // handle wrong api routes
    res.json({ message: "404 Not found" });
  } else {
    // default response type
    res.type("txt").send("404 Not found");
  }
});


// introduce error handler
app.use(errorHandler);

// database connection listeners
mongoose.connection.once(() => {
  console.log("connected to database successfully");
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
 
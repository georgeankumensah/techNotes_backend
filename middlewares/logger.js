const { format } = require("date-fns");

const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;

const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd \t HH:mm:ss")}`;
  const logItem = `${dateTime}\t ${uuid()}\t${message}\n`;
  try {
    // creates logs folder if it doesnt already exist
    if (!fs.existsSync(__dirname, "..", "logs")) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // creates log file for the day if it doesnt already exist
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}\t${req.get(
      "User-Agent"
    )}`,
    "reqLog.log"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };

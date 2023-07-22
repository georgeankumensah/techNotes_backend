const {logEvents} = require('./logger');

const errorHandler = (err,req,res,next)=>{
    logEvents(`${err.name}\t${err.message}\t${err.method}\t${err.url}\t${err.headers.origin}`,'errorLog.log');
    console.log(err.stack);
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status);
    res.json({message:err.message});
    // process.exit(1);
}

module.exports = errorHandler;
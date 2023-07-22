const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');
const {logger} = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 3500;


// middlewares
app.use(logger)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'/public')));

app.use('/',require('./routes/root'));


app.all('*',(req,res)=>{
        res.status(404)
        if (req.accepts('html')) {
            // handle wrong page routes
            res.sendFile(path.join(__dirname,"views",'404.html'));
        }else if(req.accepts('json')){
            // handle wrong api routes
            res.json({message:"404 Not found"});
        }else{
            // default response type
            res.type('txt').send('404 Not found');
        }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    }
);
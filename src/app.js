'use strict';
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

//custom middleware
const errorHandler = require('./middleware/server-error');
const notFound = require('./middleware/notFound');
//
// //routes
const authRouter = require('./routes/auth');
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('*', notFound);
app.use(errorHandler);
app.use(authRouter);

module.exports = {
    server: app,
    start: port => {
        let PORT = port || process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    }
};






'use strict';

const mongoose = require('mongoose');
require('dotenv').config();
const Server = require('./src/app');

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);





Server.start();
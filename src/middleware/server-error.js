'use strict';

module.exports = (error, req, res, next) => {
    console.error(error);
    res.status(500);
    res.statusMessage = 'Server Error';
    res.json({error: error});
};
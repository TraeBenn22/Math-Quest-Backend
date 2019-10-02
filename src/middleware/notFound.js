'use strict';

module.exports = (error, req, res, next) => {
    console.error(error);
    res.status(404);
    res.statusMessage = 'Not Found';
    res.json({error: error});
};
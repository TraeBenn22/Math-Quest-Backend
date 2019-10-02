'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'foobar';


const user = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['admin', 'editor', 'user'] },
});

const capabilities = {
    admin: ['create', 'read', 'update', 'delete'],
    editor: ['create', 'read', 'update'],
    user: ['read'],
};

// pre-hooks, is there any considerations we need when making changes
user.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// ****  Auth? ****
// Token Validation
// Bearer Auth, checking if a token is valid from a header
user.statics.authenticateToken = function (token) {

    try {
        let parsedToken = jwt.verify(token, SECRET);
        // (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
        let query = { _id: parsedToken.id };
        return this.findOne(query);
    } catch (e) { throw new Error('Invalid Token'); }

};

// Basic Auth, grabbing values from an encypted header
user.statics.authenticateBasic = function (auth) {
    let query = { username: auth.username };
    return this.findOne(query)
        .then(user => user && user.comparePassword(auth.password))
        .catch(error => { throw error; });
};

user.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
        .then(valid => valid ? this : null);
};

// generating Tokens
user.methods.generateToken = function (type) {

    let token = {
        id: this._id,
        capabilities: capabilities[this.role],
        type: type || 'user',
    };

    // let options = {};
    // if (type !== 'key' && !!TOKEN_EXPIRE) {
    //   options = { expiresIn: TOKEN_EXPIRE };
    // }

    return jwt.sign(token, SECRET);
};


// Does a capability exist for this user role
user.methods.can = function (capability) {
    return capabilities[this.role].includes(capability);
};

module.exports = mongoose.model("User", user);
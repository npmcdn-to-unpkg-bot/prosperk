/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var userSchema = new schema({
    firstName: {
        type:String,
        required: true,
        trim:true
    },
    lastName: {
        type:String,
        required: true,
        trim:true
    },
    username: {
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:{
            unique:true
        }
    },
    password: {
        type:String,
        required:true,
        trim:true
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null , function (err, hash) {
        if(err){
            return next(err);
        } else{
            user.password = hash;
            next();
        }
    });
});

userSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};


module.exports = mongoose.model('User', userSchema);
/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var userSchema = new schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    designName: {
        type:String,
        required: true,
        trim:true
    },
    images: [{
        main:{
            type:String,
            required:true,
            trim:true
        },
        list:[{
            type:String,
            trim:true
        }]
    }],
    tags: {
        type:[],
        required:true,
        trim:true
    },
    isEnabled: {
        type:Boolean,
        default: false
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
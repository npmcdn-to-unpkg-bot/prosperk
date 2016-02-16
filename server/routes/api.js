/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var User = require('../models/user');
var config = require('../../config');
var secret = config.secret;
var jwt = require('jsonwebtoken');

// Requires multiparty
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty(),

// Requires controller
    UserController = require('./../controllers/UserController');



module.exports = function(app, express){
    var api = express.Router();

    api.post('/signup', function (req, res) {
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.email,
            password: req.body.password
        });

        user.save(function (err, user) {
            if(err){
                if(err.code == 11000){
                    return res.status(500).send({errCode:11000, success:false, message:'User already exists.'});
                }
                return res.send(err);
            } else{
                User.findOne({
                    username:user.username
                }).exec(function (err, user) {
                    
                    if(err){return res.send(err)};
                    var token = createToken(user);

                    req.token = token;
                    var userDetails = {
                        firstName:user.firstName,
                        lastName: user.lastName,
                        username: user.username
                    };

                    res.send({success:true, user: userDetails, token:token});
                });
            }
        })
    });

    api.post('/login', function (req, res) {

        var userData = {
            username: req.body.username,
            password: req.body.password
        };


        User.findOne({
            username:userData.username
        }).exec(function (err, user) {
            if(err){
                throw err;
            }

            if(!user) {
                res.send({message:'User Doesn\'t exist' });
            }else if(user){
                
                var validPassword = user.comparePassword(userData.password);

                if(!validPassword){
                    res.send({message:'Invalid Password'});
                } else{
                    
                    console.log(user);
                    var token = createToken(user);

                    var userDetails = {
                        firstName:user.firstName,
                        lastName: user.lastName,
                        username: user.username
                    };

                    res.json({
                        success: true,
                        message:'Login Successfully',
                        token: token,
                        user: userDetails
                    })
                }
            }
        })

    });


    api.use(function (req,res, next) {

        console.log('Somebody is trying to access Secure Area. \nValidating Token');
        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        if(token){
            jwt.verify(token, secret, function (err, decoded) {
                if(err){
                    res.status(403).send({
                        success:false,
                        errCode:9999,
                        message:'False or expired token'
                    })
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }else{
            res.status(403).send({
                success:false,
                errCode:9999,
                message:'No token provided'
            })
        }

    });

    api.get('/users', function (req, res) {
        User.find({}).select('-_id -password -__v').exec(function (err, users){
            if(err){
                return res.send(err);
            } else{
                res.json(users);
            }
        })
    });

    api.get('/me', function (req, res, next) {
       res.send(req.decoded);
    });

    api.post('/user/upload', multipartyMiddleware, UserController.uploadFile);




    return api;

};



function createToken(user){
    var token = jwt.sign({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }, secret, {
        expiresInMinute: 1440
    });
    
    return token;
}
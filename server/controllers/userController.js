/**
 * Created by MrSingh on 2/15/16.
 */

'use strict';

var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'personly-me',
    api_key: '942718617727482',
    api_secret: 'w0NXceMU_3ChODlb_Js_PeX_TE8'
});

var UserController = function() {};

UserController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;

    //checking if file size is greater than 5MB
    if(file.size > 5242880){
        console.log(file.size);
        res.status(403).send({success:false, message: "Image size must be less than 5MB"});
        return;
    }

    cloudinary.uploader.upload(file.path, function(result) {
        console.log(result);
    },{ public_id: "designs/"+ file.name });

};

module.exports = new UserController();
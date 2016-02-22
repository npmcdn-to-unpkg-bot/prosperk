/**
 * Created by MrSingh on 2/15/16.
 */

'use strict';

var cloudinary = require('cloudinary');
var randomstring = require("randomstring");
var Design = require('../models/design');

cloudinary.config({
    cloud_name: 'personly-me',
    api_key: '942718617727482',
    api_secret: 'w0NXceMU_3ChODlb_Js_PeX_TE8'
});

var DesignController = function() {};

DesignController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;
    var data = req.body.data;

    console.log(req);

    var imgRandomString = randomstring.generate({
        length: 24,
        charset: 'alphanumeric'
    });

    var designName = data.name;
    designName = designName.replace(/ /g, "-");

    //checking if file size is greater than 5MB
    if(file.size > 5242880){
        console.log(file.size);
        res.status(403).send({success:false, message: "Image size must be less than 5MB"});
        return;
    }


    cloudinary.uploader.upload(file.path, function(result) {
        console.log(result);

        var design = new Design({
            createdBy : req.decoded._id,
            name: data.name,
            description: data.description,
            images:{
                version: 'v'+result.version,
                fileName: result.public_id
            },
            tags: data.tags,
            isEnabled:false
        });

        design.save(function (err, design) {
            if (err) {
                return res.status(500).send({success: false,error:err, message: 'Error Saving Design.'});
            } else {
                console.log(design);

                res.status(200).send({
                    success: true,
                    design: design,
                    message:"Design Added Successfully"
                });
            }
        });
    },{ public_id: "designs/"+ designName + "-" + imgRandomString });

};

module.exports = new DesignController();
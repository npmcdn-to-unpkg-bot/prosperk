/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var designSchema = new schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {
        type:String,
        required: true,
        trim:true
    },
    description: {
        type:String,
        required: true,
        trim:true
    },
    images: [{
        version:{
            type:String,
            required: true,
            trim:true
        },
        fileName:{
            type:String,
            required: true,
            trim:true
        }
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


module.exports = mongoose.model('Design', designSchema);
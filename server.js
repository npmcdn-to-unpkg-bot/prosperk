var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    config = require('./config'),
    mongoose = require('mongoose');

mongoose.connect(config.db , function (err) {
    if(err){
        console.log(err);
    } else{
        console.log('Connected to the database');
    }
});


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));



var api = require('./server/routes/api')(app, express);

app.use('/api/v1', api);

// This route enables HTML5Mode by forwarding missing files to the index.html
app.all('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.listen(config.port, function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('Listening on port '+ config.port);
    }
});
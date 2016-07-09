"use strict";

var express    = require("express");
var bodyParser = require("body-parser");

//var Storage = require('./lib/MongoDB');

var app = express();

//var db = new Storage(null, null, 'timer');

// use the parse to get JSON objects out of the request. 
app.use(bodyParser.json());

// server static files from the public/ directory.
app.use(express.static('client'));

var visualSettings;
var gameSettings;
/**
 * Handle a request for task data.
 */
app.post("/visualSettings", function (req, res) {
    console.log("POST Request to: /visualSettings");
    visualSettings = req.body;
    res.status(200).send();
    console.log(visualSettings);
});

app.post("/gameSettings", function (req, res) {
    console.log("POST Request to: /gameSettings");
    gameSettings = req.body;
    res.status(200).send();
    console.log(gameSettings);
});



/*
app.post("/add", function (req, res) {

    console.log("POST Request to: /add");
    
    db.addTask(req.body, function(err){
        if(err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });
    
    res.status(200).send();
});

app.post("/remove", function (req, res) {
    
    console.log("POST Request to: /remove");
    console.log(req.body);

    db.removeTask(req.body.id, function(err){
        if(err){
            res.status(500).send();
        }else{
            res.status(200).send();
        }
    });
});
*/

app.listen(process.env.PORT || 80, function () {
    
    console.log("Listening on port 80");
    
    /*
    db.connect(function(){
        // some message here....
    });
    */
    
});
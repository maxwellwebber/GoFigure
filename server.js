"use strict";

var express    = require("express");
var bodyParser = require("body-parser");

var Storage = require('./DBServer');

var app = express();

var db = new Storage('GoFigure');

// use the parse to get JSON objects out of the request. 
app.use(bodyParser.json());

// server static files from the client/ directory.
app.use(express.static('client'));




/**
 * Handle a request for task data.
 */
app.post("/setVisualSettings", function (req, res) {
    console.log("POST Request to: /setVisualSettings");
    db.setVisualSetting(req.body);
    res.status(200).send();
});

app.post("/setGame", function (req, res) {
    console.log("POST Request to: /setGame");
    db.setGame(req.body);
    res.status(200).send();
});

app.post("/makeAccount", function(req, res){
   
   console.log("POST Request to: /makeAccount"); 
   db.makeAccount(req.body, function(err){
       if(err){
           res.status(401).send();
       }else{
           res.status(200).send();
       }
    
    });
});

app.post("/authenticate", function(req, res){
    console.log("POST Request to: /authenticate");
    db.authenticateUser(req.body, function(err){
        if(err){
            res.status(401).send();
        }else{
            res.status(200).send();
        }
    });
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


// Board script
function generateBoard(){

    // set an object for the board
    var state = {
        size : 0, 
        board  : [],
    }

    // variable sizes
    var max = 19;
    var min = 5;

    // temp board creator
    while(state.size % 2 !== 1){
        state.size = Math.floor(Math.random() * (max - min + 1)) + min; 
    }

    // temp storage
    var tmp = []; 
    
    // push the moves
    //  first loop for each row
    //  Second is for each column
    for(var i = 0; i < state.size; i++){
        
        // reset for each line
        tmp = [];
        for(var j = 0; j < state.size; j++){
            tmp.push(Math.floor(Math.random()*(2 - 0 + 1))); 
        }
        
        // push the state to the state object for board
        state.board.push(tmp);
    }

    // return the state
    return state; 

}

// get the board data
app.post("/getCurrentGame", function (req, res) {
    console.log("POST Request to: /getCurrentGame");
    db.getCurrentGame(req.body, function(docs){
            console.log(docs);
            res.json(docs);
        });
  
});


app.get("/getVisualSettings",function(req,res){
    var test = {boardcolor : "green", token1: "blue", token2:"red"};
    //db.getVisualSettings();
    res.json(test);
});


// Listen for changes
app.listen(process.env.PORT || 80, function () {
    
    console.log("Listening on port 80");
    
    
    db.connect(function(){
        // some message here....
        
    });
    
    
});

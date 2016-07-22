"use strict";

var express    = require("express");
var bodyParser = require("body-parser");

var aiInterface = require("./aiInterface");

var algorithms = require("./algorithms")
//var algorithmsInstance = new algorithms();

var Storage = require('./DBServer');

var app = express();

var db = new Storage('GoFigure');

// use the parse to get JSON objects out of the request. 
app.use(bodyParser.json());

// server static files from the client/ directory.
app.use(express.static('client'));

var games = {};


/**
 * Handle a request for task data.
 */
app.post("/setVisualSettings", function (req, res) {
    console.log("POST Request to: /setVisualSettings");
    db.setVisualSetting(req.body);
    res.status(200).send();
});

app.post('/endGame', function(req, res) {
    console.log("POST Request to: /endGame");
    delete games[req.body.userName];
    res.status(200).send();
});

app.post("/setGame", function (req, res) {
    console.log("POST Request to: /setGame");
    db.setGame(req.body);
    //console.log( "Gurjyot ");

    var userName = req.body.userName;
    //var size = req.body.gameSettings.boardSize
    //games[userName] = makeEmptyBoard(size);
    //console.log(games);
    
    db.getCurrentGame({'userName':userName}, function(docs){
        //console.log(docs);
        games[userName] = [];
        games[userName].push(docs.currentGame.boardState);
    });
    
    //console.log(games[userName]);
    
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

app.post("/saveReplay", function(req, res) {
   console.log("POST Request to: /saveReplay");
    var userName = req.body.userName;
    var replayName = req.body.replayName;
    var visualSettings = req.body.visualSettings;
    var boardStates = games[userName];
    
    var replay = {
        "userName" : userName,
        "replayName": replayName,
        "boardStates": boardStates,
        "visualSettings": visualSettings
    }
    
    db.saveReplay(replay, function(docs) {
        res.json(docs);
        //console.log(docs);
        if(docs == null){
            delete games[userName];
            //console.log(games);
        }
    });
});




function makeEmptyBoard(size){
    var board = new Array(size);
    for(var i = 0; i<size; i++){
        board[i] = new Array(size);
    }
    
    for(var i = 0; i<size; i++){
        for(var j = 0; j<size; j++){
            board[i][j] = 0;
        }
    }
    
    return board;
}


// get the board data
app.post("/getCurrentGame", function (req, res) {
    console.log("POST Request to: /getCurrentGame");
    db.getCurrentGame(req.body, function(docs){
            //console.log(docs);
            res.json(docs);
        });
  
});


/*
    "size" : number,
    "board" : [ [...], ...],
    "last" : {
        "x" : number,
        "y" : number,
        "c" : number,
        "pass" : boolean
    }
*/
app.post("/getAIMove", function(req, res) {
    console.log("POST Request to: /getAIMove");
    
    var object = req.body;
    var pass;
    var diff = object.diff;
    console.log("DIFF ON BACK END");
    console.log(diff);
    db.getCurrentGame({"userName": object.userName}, function(game){
        var userName = object.userName;
        console.log("Inside getCurrentGame");
        pass = game.currentGame.pass;
        
    
        //console.log(game[userName][games[userName]]);
        
        
        var previousBoard = games[userName][games[userName].length-2];
        //if (games[userName].length > 1)
        //{
        //    previousBoard = games[userName][games[userName].length-2];
        //}
    
    
        console.log("About to call getPosition with : ");
        console.log(object.board);
        console.log("and ");
        console.log(previousBoard);
        
        getALTERNATEPosition(game.currentGame.boardState, previousBoard, function(position) {
        
            console.log("inside get Position callback");
            
            var last = {
                "x" : position.row,
                "y" : position.column,
                "c" : 1,
                "pass": pass
            }
            console.log("before calling aiInterface");
            if(!diff){
                aiInterface.getAttackEnemyMove(object.board.length, game.currentGame.boardState, last, function(move){
                    console.log(move);
                    res.json(move);
                 }); 
            }else{
                aiInterface.getMaxLibsMove(object.board.length, game.currentGame.boardState, last, function(move){
                    console.log(move);
                    res.json(move);
                 }); 
            }
        });
    });
    
    //console.log("exited getAIMove");
});


function getALTERNATEPosition(object,previousBoard, cb){
    
    var position = {row: 0, column: 0};
        
    
    console.log("about to start nested for loop in getALTERNATEPosition");
    /*prevBoard = */
    //db.getCurrentGame({"userName": object.userName}, function(prevBoard){
        //object.prevBoard = prevBoard;
        for(var i=0; i < object.length; i++){
            for(var j=0; j < object.length; j++){
                if ((object[i][j] != 0) && (object[i][j] != previousBoard[i][j])){
                    position.row = i;
                    position.column = j;
                    console.log("about to exit getPosition")
                    cb(position);
                    return;
                }
            }
        }
        //console.log(position);
    //})
}


app.post("/makeMove", function(req,res){
    console.log("POST Request to: /makeMove");
   
    var object = req.body;
    
   //console.log(position);
   //console.log(position.row);
   getPosition(object, function(position) {
        var userName = req.body.userName;
        
        var previousBoard = games[userName][games[userName].length-1];
        if ( games[userName].length > 1)
        {
         previousBoard = games[userName][games[userName].length-2];
        }
        
        

       
        //console.log(isValid);
        
        console.log("In make Move with position is " + position.row + " " + position.column + " with board ");
        console.log(object.board);
        //console.log(new Date().getTime()/1000);
        var armiesKilled = algorithms.checkDeath(position, object.board);
        //console.log("checkDeath Has been called");
        //console.log(new Date().getTime()/1000);
       
        //console.log(position);
        
        //console.log(object.board);
        
        var numArmiesKilled = armiesKilled.length;
        var isValid = algorithms.validate(object.board, previousBoard, position, numArmiesKilled);
        //console.log("\n");
        //console.log(armiesKilled);
        //console.log("There have been "+ numArmiesKilled + " armies killed\n");
        
        var scoringSettings = object.gameSettings.scoringSettings;
        var playerTurn = object.turn;
        
        //console.log("is valid is " + isValid);
        
        if (isValid==1) {
            return res.json("Error, Suicidal Move");
        
        } else {
            //console.log("about to change turn");
            if(object.turn == 1){
                object.turn = 2;
            }
            else{
                object.turn = 1;
            }
            for (var i = 0; i < numArmiesKilled; i++) {
                object.board[armiesKilled[i].row][armiesKilled[i].column] = 0;
            }
            console.log("THE BOARD AFTER ARMIES ARE KILLED");
            console.log(object.board);
            if (algorithms.isKO(object.board, previousBoard)) return res.json("Error, Ko");
            ////console.log("AFTER KO INSIDE ELSE");
            ////console.log(object.board)
            var scores = {}
            if (scoringSettings == "Area Scoring") {
                scores = algorithms.areaScoring(object.board);
            } else if (scoringSettings == "Territory Scoring") {
                scores = algorithms.areaScoring(object.board);
                if(playerTurn == 1){
                    if(scores.player2-numArmiesKilled < 0){ scores.player2 = 0; }
                    else{scores.player2 = (scores.player2)-numArmiesKilled;}
                    //console.log("player 2 score is "+object.player2Score);
                }
                else{
                    if(scores.player1-numArmiesKilled < 0){ scores.player1 = 0 }
                    else{scores.player1 = (scores.player1)-numArmiesKilled;}
                    //console.log("player 1 score is "+object.player1Score);
                }
                
            } else {
                scores = algorithms.stoneScoring(object.board);
            }
            object.player1Score = scores.player1;
            object.player2Score = scores.player2;
        
            db.makeMove(object, function(docs) {
                if (numArmiesKilled > 0) docs["killCheck"] = true;
                res.json(docs);
                //console.log(armiesKilled);
                var userName = req.body.userName;
                if(games[userName] != undefined){
                    games[userName].push(object.board);
                }else{
                    games[userName] = [];
                    games[userName].push(object.board);
                }
                
                //console.log(games[userName]);
            });
            
        
        }   
   });
    
});



function getPosition(object, cb){
    
    var position = {row: 0, column: 0};
        
    
    //console.log("about to start nested for loop in getPosition function");
    /*prevBoard = */
    db.getCurrentGame({"userName": object.userName}, function(prevBoard){
        //object.prevBoard = prevBoard;
        for(var i=0; i < object.board.length; i++){
            for(var j=0; j < object.board.length; j++){
                if ((object.board[i][j] != 0) && (object.board[i][j] != prevBoard.currentGame.boardState[i][j])){
                    position.row = i;
                    position.column = j;
                    //console.log("about to exit getPosition")
                    cb(position);
                    return;
                }
            }
        }
    
    })
}



app.post("/pass", function(req,res) {
    console.log("POST Request to: /pass");
    db.passMove(req.body, function(docs) {
       res.json(docs); 
    });
});

app.post("/randomMove", function(req,res){
    //aiInterface.random()
})


// Listen for changes
app.listen(process.env.PORT || 80, function () {
    
    console.log("Listening on port 80");
    
    
    db.connect(function(){
        // some message here....
        
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

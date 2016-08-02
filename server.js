"use strict";

var express = require("express");
var bodyParser = require("body-parser");

var aiInterface = require("./aiInterface");

var algorithms = require("./algorithms")

var Storage = require('./DBServer');

var app = express();

var db = new Storage('GoFigure');

// use the parse to get JSON objects out of the request. 
app.use(bodyParser.json());

// server static files from the client/ directory.
app.use(express.static('client'));

var games = {};


/**
 * this will set the visual settings
 */
app.post("/setVisualSettings", function(req, res) {
    console.log("POST Request to: /setVisualSettings");
    db.setVisualSetting(req.body);
    res.status(200).send();
});

/** Handler function to delete the game from the
 *  games array when the game ends
 */
app.post('/endGame', function(req, res) {
    console.log("POST Request to: /endGame");
    delete games[req.body.userName];
    res.status(200).send();
});

/** 
 * creates current game in database and
 *  adds game to games array on server
 */
app.post("/setGame", function(req, res) {
    console.log("POST Request to: /setGame");
    db.setGame(req.body);

    var userName = req.body.userName;

    db.getCurrentGame({
        'userName': userName
    }, function(docs) {
        games[userName] = [];
        games[userName].push(docs.currentGame.boardState);
    });
    res.status(200).send();
});

/**  handler function that creates a new account in the database
 */
app.post("/makeAccount", function(req, res) {
    console.log("POST Request to: /makeAccount");
    db.makeAccount(req.body, function(err) {
        if (err) {
            res.status(401).send();
        } else {
            res.status(200).send();
        }

    });
});

/**  handler function that authenticates a account
 */
app.post("/authenticate", function(req, res) {
    console.log("POST Request to: /authenticate");
    db.authenticateUser(req.body, function(err) {
        if (err) {
            res.status(401).send();
        } else {
            res.status(200).send();
        }
    });
});


/** handler function that gets the board data
 */
app.post("/getCurrentGame", function(req, res) {
    console.log("POST Request to: /getCurrentGame");
    db.getCurrentGame(req.body, function(docs) {
        res.json(docs);
    });

});

/** Handler function that gets the last position on the board and makes
  * a call to getAttackEnemyMove AI or getMaxLibs AI dependent on a diff boolean
 */
app.post("/getAIMove", function(req, res) {
    console.log("POST Request to: /getAIMove");

    var object = req.body;
    var pass;
    var diff = object.diff;
    db.getCurrentGame({
        "userName": object.userName
    }, function(game) {
        var userName = object.userName;
        pass = game.currentGame.pass;

        var previousBoard = games[userName][games[userName].length - 2];

        // gets the position of the last move
        getALTERNATEPosition(game.currentGame.boardState, previousBoard, function(position) {
            // a position is found
            var last = {
                "x": position.row,
                "y": position.column,
                "c": 1,
                "pass": pass
            }
            if (!diff) {
                // calls getAttackEnemyMove AI
                aiInterface.getAttackEnemyMove(object.board.length, game.currentGame.boardState, last, function(move) {
                    res.json(move);
                });
            } else {
                // calls getMaxLibs AI
                aiInterface.getMaxLibsMove(object.board.length, game.currentGame.boardState, last, function(move) {
                    res.json(move);
                });
            }
        });
    });
});


/** gets the position of the last move by the player
 *  used in singleplayer AI play
 */
function getALTERNATEPosition(object, previousBoard, cb) {

    var position = {
        row: 0,
        column: 0
    };

    for (var i = 0; i < object.length; i++) {
        for (var j = 0; j < object.length; j++) {
            if ((object[i][j] != 0) && (object[i][j] != previousBoard[i][j])) {
                position.row = i;
                position.column = j;
                cb(position);
                return;
            }
        }
    }
}

/** validates a move, removes killed armies from the board,
 *  calculates score, and updates database if move is valid,
 *  otherwise it specifies why move was invalid
 */
app.post("/makeMove", function(req, res) {
    console.log("POST Request to: /makeMove");

    var object = req.body;

    // gets position of last move
    getPosition(object, function(position) {
        var userName = req.body.userName;

        var previousBoard = games[userName][games[userName].length - 1];
        if (games[userName].length > 1) {
            previousBoard = games[userName][games[userName].length - 2];
        }
        // checks if any armies are killed
        var armiesKilled = algorithms.checkDeath(position, object.board);

        var numArmiesKilled = armiesKilled.length;
        // checks if move is valid
        var isValid = algorithms.validate(object.board, previousBoard, position, numArmiesKilled);

        var scoringSettings = object.gameSettings.scoringSettings;
        var playerTurn = object.turn;

        if (isValid == 1) {
            // move is suicidal
            return res.json("Error, Suicidal Move");

        } else {
            // move is valid change turn
            if (object.turn == 1) {
                object.turn = 2;
            } else {
                object.turn = 1;
            }
            // removes armies from board
            for (var i = 0; i < numArmiesKilled; i++) {
                object.board[armiesKilled[i].row][armiesKilled[i].column] = 0;
            }
            // checs Ko
            if (algorithms.isKO(object.board, previousBoard)) return res.json("Error, Ko");
            // checks scoring settings and scores accordingly
            var scores = {}
            if (scoringSettings == "Area Scoring") {
                scores = algorithms.areaScoring(object.board);
            } else if (scoringSettings == "Territory Scoring") {
                scores = algorithms.areaScoring(object.board);
                if (playerTurn == 1) {
                    if (scores.player2 - numArmiesKilled < 0) {
                        scores.player2 = 0;
                    } else {
                        scores.player2 = (scores.player2) - numArmiesKilled;
                    }
                } else {
                    if (scores.player1 - numArmiesKilled < 0) {
                        scores.player1 = 0
                    } else {
                        scores.player1 = (scores.player1) - numArmiesKilled;
                    }
                }

            } else {
                scores = algorithms.stoneScoring(object.board);
            }
            object.player1Score = scores.player1;
            object.player2Score = scores.player2;

            // updates database with updated board
            db.makeMove(object, function(docs) {
                if (numArmiesKilled > 0) docs["killCheck"] = true;
                res.json(docs);
                var userName = req.body.userName;
                if (games[userName] != undefined) {
                    games[userName].push(object.board);
                } else {
                    games[userName] = [];
                    games[userName].push(object.board);
                }
            });
        }
    });
});

/** gets the position of the last move by the player
 *  used in hotseat play
 */
function getPosition(object, cb) {

    var position = {
        row: 0,
        column: 0
    };

    db.getCurrentGame({
        "userName": object.userName
    }, function(prevBoard) {
        for (var i = 0; i < object.board.length; i++) {
            for (var j = 0; j < object.board.length; j++) {
                if ((object.board[i][j] != 0) && (object.board[i][j] != prevBoard.currentGame.boardState[i][j])) {
                    position.row = i;
                    position.column = j;
                    cb(position);
                    return;
                }
            }
        }
    })
}

/** handler function thats called if a player passed
 */
app.post("/pass", function(req, res) {
    console.log("POST Request to: /pass");
    db.passMove(req.body, function(docs) {
        res.json(docs);
    });
});

// Listen for changes
app.listen(process.env.PORT || 80, function() {
    console.log("Listening on port 80");
    db.connect(function() { });
});
"use strict";


// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;


class DBServer {

    constructor( db, host, port) {

        this._dbname = db;
        this._host = host || "localhost";
        this._port = port || 27017;

        this._db = null;

    }

    /**
     * Connects to the database.
     * @param callback {function} called when the connection completes.
     *      Takes an error parameter.
     */
    connect(callback) {

        var that = this;

        MongoClient.connect(
            "mongodb://" + this._host + ":" + this._port + "/" + this._dbname,
            function(err, db) {

                if (err) {
                    console.log("ERROR: Could not connect to database.");
                    that._db = null;
                    callback(err);
                } else {
                    console.log("INFO: Connected to database.");
                    that._db = db;
                    callback(null);
                }

            }
        );

    }

    /**
     * Closes the connection to the database.
     */
    close() {
        this._db.close();
    }

    /**
     * Checks if user exists in database and creates new user if 
     * username is available
     */
    makeAccount(newUser, callback) {
        var collection = this._db.collection("users");

        collection.find({
            "userName": newUser.userName
        }).toArray(function(err, docs) {
            if (docs.length > 0) {
                // username already exists
                callback("This user already exists");
                console.log("USER " + newUser.userName + " EXISTS");
            } else {
                // username is available 
                // initialize default visual settings
                newUser["visualSettings"] = {
                    "tokenColor": "Black and White",
                    "tokenShape": "Circle",
                    "boardColor": "Brown"
                }

                console.log("Created user with username: " + newUser.userName);
                collection.insertOne(newUser, function(err, result) {
                    if (err) callback(err);
                    else callback(null);
                });
            }
        });
    }

    /** verifies username and password against
     *  database entry
     */
    authenticateUser(user, callback) {
        var collection = this._db.collection("users");

        collection.find({
            "userName": user.userName,
            "password": user.password
        }).toArray(function(err, docs) {
            if (docs.length > 0) {
                // username and password matched
                if (err) callback(err);
                else callback(null);
            } else {
                // username and/or password not found
                callback("incorrect username or password.");
            }
        });

    }


    /** Saves users selected visual settings in database
    */
    setVisualSetting(object) {
        var collection = this._db.collection("users");

        var userName = object.userName;
        var visualSettings = object.visualSettings;

        collection.update({
            "userName": userName
        }, {
            $set: {
                "visualSettings": visualSettings
            }
        });
    }

    /** Initializes new game with specified settings
    */
    setGame(object) {
        var collection = this._db.collection("users");

        var userName = object.userName;
        var gameSettings = object.gameSettings;
        var handicap = gameSettings.handicapSettings;

        var boardRow = []
        var board = [];

        // creates board of correct size
        for (var i = 0; i < object.gameSettings.boardSize; i++) {
            boardRow.push(0);
        }
        for (var i = 0; i < object.gameSettings.boardSize; i++) {
            var row = boardRow.slice()
            board.push(row);
        }

        // places appropriate number of handicap tokens
        if (handicap == "One") {
            board[Math.floor(gameSettings.boardSize / 2)][Math.floor(gameSettings.boardSize / 2)] = 1;
        }

        if (handicap == "Two") {
            board[Math.floor(gameSettings.boardSize / 2)][Math.floor(gameSettings.boardSize / 2) + Math.floor(gameSettings.boardSize / 4)] = 1;
            board[Math.floor(gameSettings.boardSize / 2)][Math.floor(gameSettings.boardSize / 2) - Math.floor(gameSettings.boardSize / 4)] = 1;
        }

        if (handicap == "Four") {
            board[Math.floor(gameSettings.boardSize / 2) + Math.floor(gameSettings.boardSize / 4)][Math.floor(gameSettings.boardSize / 2) + Math.floor(gameSettings.boardSize / 4)] = 1;
            board[Math.floor(gameSettings.boardSize / 2) + Math.floor(gameSettings.boardSize / 4)][Math.floor(gameSettings.boardSize / 2) - Math.floor(gameSettings.boardSize / 4)] = 1;
            board[Math.floor(gameSettings.boardSize / 2) - Math.floor(gameSettings.boardSize / 4)][Math.floor(gameSettings.boardSize / 2) + Math.floor(gameSettings.boardSize / 4)] = 1;
            board[Math.floor(gameSettings.boardSize / 2) - Math.floor(gameSettings.boardSize / 4)][Math.floor(gameSettings.boardSize / 2) - Math.floor(gameSettings.boardSize / 4)] = 1;

        }

        // initializes current game for database
        var game = {
            "pass": false,
            'gameSettings': gameSettings,
            'boardState': board,
            'turn': 1,
            'player1Score': 0,
            'player2Score': 0
        }

        // uploads current game to database
        collection.update({
            "userName": userName
        }, {
            $set: {
                "currentGame": game
            }
        }, {
            "upsert": true
        });
    }

    /** Updates boardState in database if
     *  a valid move is made
     */
    makeMove(object, callback) {
        var collection = this._db.collection("users");
        var currentGame = {
            "pass": object.pass,
            "gameSettings": object.gameSettings,
            "boardState": object.board,
            "turn": object.turn,
            "player1Score": object.player1Score,
            "player2Score": object.player2Score
        }
        // updates entry in database
        collection.update({
            "userName": object.userName
        }, {
            $set: {
                "currentGame": currentGame
            }
        }, {
            "upsert": true
        });

        // gets entry from database, sets killcheck to false
        // and returns object to caller
        collection.find({
            "userName": object.userName
        }).toArray(function(err, docs) {
            if (docs.length > 0) {
                var user = docs[0];
                user.currentGame["killCheck"] = false;
                callback(user.currentGame);
            } else {
                callback(err, null);
            }
        });
    }

 /** checks pass variable of current game in database
   *    if pass is true it responds with a game over
   *    otherwise it turns pass to true
   */
    passMove(object, callback) {
        var collection = this._db.collection("users");
        collection.find({
            "userName": object.userName
        }).toArray(function(err, docs) {
            if (docs.length > 0) {
                var user = docs[0];
                var currentGame = user.currentGame;
                if (currentGame.pass == true) {
                    // two passes have been detected
                    callback({
                        "gameIsOver": 1
                    });
                } else {
                    // previous turn was not a pass
                    currentGame.pass = true;
                    collection.update({
                        "userName": object.userName
                    }, {
                        $set: {
                            "currentGame": currentGame
                        }
                    }, {
                        "upsert": true
                    });
                    callback({
                        "gameIsOver": 0
                    });
                }
            }
        });

    }

    /** gets current game in data base when
     *  a game is started
     */
    getCurrentGame(userName, callback) {
        var collection = this._db.collection("users");
        collection.find(userName).toArray(function(err, docs) {
            if (docs.length > 0) {
                var user = docs[0];

                var game = {
                        "visualSettings": user.visualSettings,
                        "currentGame": user.currentGame
                    }
                callback(game);
            } else {
                callback(err, null);
            }
        });
    }

}


module.exports = DBServer;
"use strict";


// See https://github.com/mongodb/node-mongodb-native for details.
var MongoClient = require("mongodb").MongoClient;



class DBServer{

    constructor(/*u, p,*/ db, host, port) {

        /*this._user   = u;
        this._passwd = p;*/
        this._dbname = db;
        this._host   = host || "localhost";
        this._port   = port || 27017;

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
            function (err, db) {

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
    
    makeAccount(newUser, callback){
        var collection = this._db.collection("users");

    collection.find({"userName": newUser.userName}).toArray(function(err, docs) {
        console.log(docs[0]);
 	if (docs.length > 0){
 		callback("This user already exists");
        console.log("USER "  + newUser.userName + " EXISTS");
 	} else {
 	    
 	    newUser["visualSettings"] = {
 	        "tokenColor" : "Black and White",
 	        "tokenShape" : "Circle",
 	        "boardColor" : "Brown"
 	    }
 	    
 	    console.log("Created user with username: " + newUser.userName);
 		collection.insertOne(newUser, function(err, result){
            if(err) callback(err);
            else callback(null);
         });
 	}
  });
    }
    
    authenticateUser(user, callback) {
        var collection = this._db.collection("users");
        
        collection.find({"userName": user.userName,"password": user.password}).toArray(function(err, docs) {
        console.log(docs[0]);
 	if (docs.length > 0){
 		if(err) callback(err);
        else callback(null);
 	} else {
 	    callback("incorrect username or password.");
 	}
  });
        
    }
    

    
    setVisualSetting(object){
        var collection = this._db.collection("users");
        
        var userName = object.userName;
        var visualSettings = object.visualSettings;
        
        collection.update({"userName":userName},{$set:{"visualSettings":visualSettings}});
    }
    
    setGame(object){
         var collection = this._db.collection("users");
         
         var userName = object.userName;
         var gameSettings = object.gameSettings;
         var handicap = gameSettings.handicapSettings;
         
         var boardRow = []
         var board = [];

         
         for (var i = 0; i < object.gameSettings.boardSize; i++) {

             boardRow.push(0);
         }
         for (var i = 0; i < object.gameSettings.boardSize; i++) {
            var row = boardRow.slice()
             board.push(row);
         }
         
         
         
         console.log(handicap)
         
         if (handicap == "One"){
             board[Math.floor(gameSettings.boardSize/2)][Math.floor(gameSettings.boardSize/2)] = 1;
         }
         
         if (handicap == "Two") {
             board[Math.floor(gameSettings.boardSize/2)][Math.floor(gameSettings.boardSize/2)+Math.floor(gameSettings.boardSize/4)] = 1;
             board[Math.floor(gameSettings.boardSize/2)][Math.floor(gameSettings.boardSize/2)-Math.floor(gameSettings.boardSize/4)] = 1;
         }
         console.log(board);
         if (handicap == "Four") {
            board[Math.floor(gameSettings.boardSize/2)+Math.floor(gameSettings.boardSize/4)][Math.floor(gameSettings.boardSize/2)+Math.floor(gameSettings.boardSize/4)] = 1;
            board[Math.floor(gameSettings.boardSize/2)+Math.floor(gameSettings.boardSize/4)][Math.floor(gameSettings.boardSize/2)-Math.floor(gameSettings.boardSize/4)] = 1;
            board[Math.floor(gameSettings.boardSize/2)-Math.floor(gameSettings.boardSize/4)][Math.floor(gameSettings.boardSize/2)+Math.floor(gameSettings.boardSize/4)] = 1;
            board[Math.floor(gameSettings.boardSize/2)-Math.floor(gameSettings.boardSize/4)][Math.floor(gameSettings.boardSize/2)-Math.floor(gameSettings.boardSize/4)] = 1;
             
         }
         
         var game = {
             "pass" : false,
             'gameSettings': gameSettings,
             'boardState': board,
             'turn': 1
         }
         
         //console.log(game);
         collection.update({"userName":userName},{$set:{"currentGame":game}},{"upsert":true});
    }
    
    makeMove(object, callback) {
        var collection = this._db.collection("users");
        var currentGame = {
            "gameSettings":object.gameSettings,
            "boardState":object.board
        }
        collection.update({"userName":object.userName},{$set:{"currentGame":currentGame}},{"upsert":true});
        
        collection.find({"userName":object.userName}).toArray(function(err, docs) {
     	if (docs.length > 0){
     	    var user = docs[0];
     		callback(user.currentGame);
     	} else {
     	    callback(err, null);
            }
        });
    }
    
    passMove(object, callback) {
        var collection = this._db.collection("users");
        collection.find({"userName":object.userName}).toArray(function(err, docs) {
         	if (docs.length > 0){
         	    var user = docs[0];
         	    var currentGame = user.currentGame;
                if (currentGame.pass == true) {
                    //two passes have been detected
                    callback({"gameIsOver":1});
                } else {
                    currentGame.pass=true;
                    collection.update({"userName":object.userName},{$set:{"currentGame":currentGame}},{"upsert":true});
                    callback({"gameIsOver":0});
                }
         	}
        });
        
    }
    
    getCurrentGame(userName, callback){
        
        var collection = this._db.collection("users");
        //console.log()
        collection.find(userName).toArray(function(err, docs) {
     	if (docs.length > 0){
     	    var user = docs[0];
     	    
     	    var game = {
     	        "visualSettings" : user.visualSettings,
     	        "currentGame" : user.currentGame
     	    }
     	    //console.log(game);
     		callback(game);
     	} else {
     	    callback(err, null);
            }
        });
    }
    
}  
    
    
    /*getVisualSettings(object){
    //    var collection = this._db.collection("users");
        
    //    var userName = object.userName;
        
    //    collection.find({"userName": userName}).toArray(function(err, docs) {
    //        console.log(docs);
        });
    }
    
   getAllUsers(callback) {

        var collection = this._db.collection("users");
        
        collection.find({}).toArray(function(err, data){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        });
    }*/
    
    


module.exports = DBServer; 
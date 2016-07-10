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
        
        /*
        console.log(collection.find({"userName": "a"}).toArray());
        var count = 0;
        //console.log(newUser.userName);
        count = collection.find({"userName": newUser.userName}).count();

        if(count > 0){
            //callback("This user already exists");
            //console.log("USER "  + newUser.userName + " EXISTS")
            console.log(collection.find({"userName": newUser.userName}).count());
        }
            //console.log(docs);
            //if(docs.length != 0){
              //  callback("This user already exists");
                //console.log("USER "  + newUser.userName + "EXISTS");
                
            
            
            /*
            if(collection.count({"userName": newUser.userName}) != 0){
                console.log(collection.find({"userName": newUser.userName}));
                callback("This user already exists");
            }
            
            */
            //}
            /*
            //else{
                //console.log("Count is " + collection.find({"userName": newUser.userName}).count());
                console.log("Created user with username: " + newUser.userName);
                collection.insertOne(newUser, function(err, result){
                    if(err) callback(err);
                    else callback(null);
                });
            //}
            
          //console.log(newUser.userName);  
       //});
      */
    collection.find({"userName": newUser.userName}).toArray(function(err, docs) {
        //console.log(docs);
 	if (docs.length > 0){
 		callback("This user already exists");
        console.log("USER "  + newUser.userName + " EXISTS");
 	} else {
 	    console.log("Created user with username: " + newUser.userName);
 		collection.insertOne(newUser, function(err, result){
            if(err) callback(err);
            else callback(null);
         });
 	}
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
    }
}

module.exports = DBServer; 
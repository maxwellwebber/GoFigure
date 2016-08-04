/** 
 * This file contains functions for communicating with an external AI
 * provided by the instructor of SENG299 to play the boatd game Go.
 * 
 */ 


var http = require("http");

var port = 30000;


/**
 * Gets a move using the random Move function
 *
 * @param size {int} the size of the board being played on 
 * @param board {2D int array} The current board
 * @param lastMove {object} the last move played (x, y and color)
 * @param cb {function} callback function
 *
 */
function getRandomMove(size, board, lastMove, cb) {
    //input to be sent to the external AI
    var input = {
        size: size,
        board: board,
        last: lastMove
    };
    //options for the connection
    var options = {
        host: 'roberts.seng.uvic.ca',
        path: '/ai/random',
        port: port,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(input)
    };

    //the actual request
    var req = http.request(options, (res) => {
        var output = '';
        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            cb(output);
        })
    });
    //if error print it 
    req.on('error', function(e) {
        console.log("An error has occured with HTTP request " + e);
    });
    //actually write the input we are sending to the extenal request
    req.write(JSON.stringify(input));
    req.end();

}

/**
 * Gets a move using the max Liberties function
 *
 * @param size {int} the size of the board being played on 
 * @param board {2D int array} The current board
 * @param lastMove {object} the last move played (x, y and color)
 * @param cb {function} callback function
 *
 */
function getMaxLibsMove(size, board, lastMove, cb) {
    var input = {
        size: size,
        board: board,
        last: lastMove
    };

    var options = {
        host: 'roberts.seng.uvic.ca',
        path: '/ai/maxLibs',
        port: port,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(input)
    };

    var req = http.request(options, (res) => {
        var output = '';
        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            cb(output);
        })
    });
    req.on('error', function(e) {
        console.log("An error has occured with HTTP request " + e);
    });
    req.write(JSON.stringify(input));
    req.end();

}



/**
 * Gets a move using the attack enemy move
 *
 * @param size {int} the size of the board being played on 
 * @param board {2D int array} The current board
 * @param lastMove {object} the last move played (x, y and color)
 * @param cb {function} callback function
 *
 */
function getAttackEnemyMove(size, board, lastMove, cb) {
    var input = {
        size: size,
        board: board,
        last: lastMove
    };

    var options = {
        host: 'roberts.seng.uvic.ca',
        path: '/ai/attackEnemy',
        port: port,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(input)
    };

    var req = http.request(options, (res) => {
        var output = '';
        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            cb(output);
        })
    });
    req.on('error', function(e) {
        console.log("An error has occured with HTTP request " + e);
    });
    req.write(JSON.stringify(input));
    req.end();

}

/**
 * Gets a move using the form eyes move
 *
 * @param size {int} the size of the board being played on 
 * @param board {2D int array} The current board
 * @param lastMove {object} the last move played (x, y and color)
 * @param cb {function} callback function
 *
 */
function getFormEyesMove(size, board, lastMove, cb) {
    var input = {
        size: size,
        board: board,
        last: lastMove
    };

    var options = {
        host: 'roberts.seng.uvic.ca',
        path: '/ai/formEyes',
        port: port,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(input)
    };

    var req = http.request(options, (res) => {
        var output = '';
        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            cb(output);
        })
    });
    req.on('error', function(e) {
        console.log("An error has occured with HTTP request " + e);
    });
    req.write(JSON.stringify(input));
    req.end();

}

//Exports each function to be used by server.js
module.exports = {

    getRandomMove: getRandomMove,
    getMaxLibsMove: getMaxLibsMove,
    getAttackEnemyMove: getAttackEnemyMove,
    getFormEyesMove: getFormEyesMove
}
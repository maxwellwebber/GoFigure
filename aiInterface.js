/** 
 * This file contains functions for communicating with an external AI
 * provided by the instructor of SENG299 to play the boatd game Go.
 * 
 */ 


var http = require("http");

var port = 8081;


/**
 * Gets a move using the 
 *
 * @param size {int} the size of the board being played on 
 * @param board {2D int array} The current board
 * @param lastMove {object} the last move played (x, y and color)
 * @param cb {function} callback function
 *
 */
function getRandomMove(size, board, lastMove, cb) {
    var input = {
        size: size,
        board: board,
        last: lastMove
    };

    var options = {
        host: 'localhost',
        path: '/ai/random',
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
    console.log("About to send request with ----->")
    console.log(JSON.stringify(input));
    req.write(JSON.stringify(input));
    req.end();

}

/**
 * Gets a move using the 
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
        host: 'localhost',
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
    console.log("About to send request with ----->")
    console.log(JSON.stringify(input));
    req.write(JSON.stringify(input));
    req.end();

}



/**
 * Gets a move using the 
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
        host: 'localhost',
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
    console.log("About to send request with ----->")
    console.log(JSON.stringify(input));
    req.write(JSON.stringify(input));
    req.end();

}

/**
 * Gets a move using the 
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
        host: 'localhost',
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
    console.log("About to send request with ----->")
    console.log(JSON.stringify(input));
    req.write(JSON.stringify(input));
    req.end();

}


module.exports = {

    getRandomMove: getRandomMove,
    getMaxLibsMove: getMaxLibsMove,
    getAttackEnemyMove: getAttackEnemyMove,
    getFormEyesMove: getFormEyesMove
}
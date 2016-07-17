var http = require("http");

var port = 8081;

  function getMove() {}

  function random(size, board, lastMove, cb){
      var input = {
        size : size,
        board : board,
        last : lastMove
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
  
      var body = [];
      var req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
          cb(JSON.parse(chunk));
        });
  
        res.on('end', () => {
        })
      });
      req.on('error',function(e){
        console.log('Problem with getRamdomMove ${e.message}');
      });
      req.write(JSON.stringify(input));
      req.end();
  
  }
  
  function maxLibs(size, board, lastMove, cb){
      var input = {
        size : size,
        board : board,
        last : lastMove
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
  
      var body = [];
      var req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
          cb(JSON.parse(chunk));
        });
  
        res.on('end', () => {
        })
      });
      req.on('error',function(e){
        console.log('Problem with getRamdomMove ${e.message}');
      });
      req.write(JSON.stringify(input));
      req.end();
  
  }
  
  
  
  
  function attackEnemy(size, board, lastMove, cb){
      var input = {
        size : size,
        board : board,
        last : lastMove
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
  
      var body = [];
      var req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
          cb(JSON.parse(chunk));
        });
  
        res.on('end', () => {
        })
      });
      req.on('error',function(e){
        console.log('Problem with getRamdomMove ${e.message}');
      });
      req.write(JSON.stringify(input));
      req.end();
  
  }
  
  
  function formEyes(size, board, lastMove, cb){
      var input = {
        size : size,
        board : board,
        last : lastMove
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
  
      var body = [];
      var req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
          cb(JSON.parse(chunk));
        });
  
        res.on('end', () => {
        })
      });
      req.on('error',function(e){
        console.log('Problem with getRamdomMove ${e.message}');
      });
      req.write(JSON.stringify(input));
      req.end();
  
  }


module.exports = 
{
	
	randmom : random,
	maxLibs : maxLibs,
  attackEnemy : attackEnemy,
	formEyes : formEyes
}



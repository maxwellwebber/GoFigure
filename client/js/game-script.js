

/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb){
    
    sendData = {'userName' :document.cookie.split('=')[1] }
    clientServer.sendData(sendData,"getCurrentGame", function(data) {

        // handle any errors here....
        console.log(data)
        // draw the board....
        
        cb(data.currentGame,data.visualSettings);
        });

}

function getVisualSettings(state){
    $.get("/getVisualSettings", function(data, textStatus, xhr){
        console.log("Response for /getVisualSettings: "+textStatus);  
        console.log(data);
        // handle any errors here....

        // draw the board....
        drawBoard(state,data);  

    });   
}


/**
 * Draws the board to the #canvas element on the page. 
 *
 * You may find the following links helpful: 
 *  - https://api.jquery.com/
 *  - https://api.jquery.com/append/
 *  - http://www.tutorialspoint.com/jquery/
 *  - http://www.w3schools.com/jquery/ 
 *
 * @param state {object} - an object representing the state of the board.  
 */ 

        
function drawBoard(game,visualSettings){
    //var myData = visualSettings;
    
    
    
    //console.log("myData is " + myData.token1);
    
    if (visualSettings.tokenColor == "Black and White") {
        token1 = '#000000'
        token2 = '#FFFFFF'
    }
    if (visualSettings.tokenColor == "Red and Green") {
        token1 = '#FF0000'
        token2 = '#00FF00'
    }
    if (visualSettings.tokenColor == "Blue and Orange") {
        token1 = '#0000FF'
        token2 = '#FFA500'
    }
    
    if (visualSettings.boardColor = 'Brown') {boardcolor = "#AF9B60"}
    if (visualSettings.boardColor = 'Pink') {boardcolor = "#FFDFDD"}
    if (visualSettings.boardColor = 'White') {boardcolor = "#FFFFFF"}
    if (visualSettings.boardColor = 'Grey') {boardcolor = "#C0C0C0"}
    if (visualSettings.boardColor = 'Yellow') {boardcolor = "#FFFF00"}

    


    var canvas = $("#canvas"); 

    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
    var W = 600, H = 600; 
    canvas.css("height", H); 
    canvas.css("width", W); 

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API.
    var svg = $(makeSVG(W, H));

	// Variables for board size and grid
	var size = game.gameSettings.boardSize;
	var grid = (W/size);
    var state = game.boardState;
	// Draw a rectangle for the board
	svg.append(makeRectangle(0, 0, W, H, boardcolor));

	
	// Draw the lines
	
	for (var i = 1; i < size; i++) {
		svg.append(makeLine(grid,(grid*i),W-grid,(grid*i)));
		
	}
	for (var i = 1; i < size; i++) {
		svg.append(makeLine((grid*i), grid, (grid*i), H-grid));
	}



/*

    var s = Snap(600, 600);


    for (var k = 1; k<size; k++) {
        for (var l = 1; l<size; l++) {
            var token = s.circle((grid*i),(grid*j),grid/2.3);
            //token.appendTo(board);
        }
    }


*/


	// Draw the armies
	for (i = 1; i < size; i++) {
		for (j = 1; j < size; j++) {
			if (state[i][j] == 1) {
				svg.append(makeCircle((grid*i),(grid*j),grid/2.3, visualSettings.token1));
			}
			else if (state[i][j] == 2) {
				svg.append(makeCircle((grid*i),(grid*j),grid/2.3, visualSettings.token2));
			}
		}
	}	

    // append the svg object to the canvas object.
    canvas.append(svg);

}

function init(){

    // do page load things here...
    clientServer = new ClientServer("localhost", 80);
    console.log("Initalizing Page...."); 
    getData(drawBoard); 
}

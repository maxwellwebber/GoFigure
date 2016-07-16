

/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb){
    
    sendData = {'userName' :document.cookie.split('=')[1] }
    clientServer.sendAndRecieveData(sendData,"getCurrentGame", function(data) {

        // handle any errors here....
        console.log(data)
        // draw the board....
        
        cb(data.currentGame,data.visualSettings);
        });

}





function makeMove(game){
    
    var size = game.gameSettings.boardSize;
   
    var gridSizeNonScaled = 600/size;
    var gridSizeScaled = (600-2*gridSizeNonScaled)/size;
    var ratio = size/(size-1);
    var gameSettings = game.gameSettings;
    var board = game.boardState;
    var radius = gridSizeScaled/2.8;
    
    $("#canvas").click(function(e){
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top
        wentThrough = false;
        end:
        if (wentThrough == false) {
            for (var i = 0;i< board.length; i++) {
                for (var j = 0;j< board.length; j++) {
                    
                    //console.log(i + " " + j);
                    
                    
                    var x_grid_location = j*gridSizeScaled*ratio+gridSizeNonScaled;
                    var y_grid_location = i*gridSizeScaled*ratio+gridSizeNonScaled;
                    //mouseX > x-10 && mouseX < x+10 && mouseY > y-10 && mouseY < y+10
                    //var mouseX = 
                    //console.log(j*gridSizeScaled*ratio+gridSizeNonScaled + " " + i*gridSizeScaled*ratio+gridSizeNonScaled);
                    if (mouseX > x_grid_location-radius && mouseX < x_grid_location+radius && mouseY > y_grid_location-radius && mouseY < y_grid_location+radius) {
                        if (board[i][j] == 0) {
                            //comment this out to not draw and add to the array so it is drawn by the draw board function
                            //svg.append(makeCircle(j*gridSizeScaled*ratio+gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeScaled/2.8,"black")); 
                            //for this
                            if (playerTurn == 1){
                                board[i][j] = 1;
                            } else {
                                board[i][j] = 2;
                            }
                            //console.log(board[i][j]);
                            sendData = {'userName' :document.cookie.split('=')[1],'pass':false, 'board' : board, "turn":playerTurn,"gameSettings":gameSettings};
                            wentThrough = true;
                            $("#error-prompt").empty();
                            break end;
                        } else {
                            $("#error-prompt").text("A token already exists on that spot");
                        }
                    }  
                }
            }
            return;
        }
      
    clientServer.sendAndRecieveData(sendData,"/makeMove",function(data){
                    if (data.boardState != undefined){
                        if (playerTurn == 1){
                            svg.append(makeShape(x_grid_location,y_grid_location,radius,token1,tokenShape));
                            playerTurn = 2;
                        } else {
                            svg.append(makeShape(x_grid_location,y_grid_location,radius,token2,tokenShape));
                            playerTurn = 1;
                        }
                    } else {
                        // here is where we put error
                        console.log(data);
                    }
                        return;
                });
    
    });//end canvas click function  
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

        
function initializeBoard(game,visualSettings){
    //var myData = visualSettings;
    
    //------------------------------
    //-------------------------------
    
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
    
    if (visualSettings.boardColor == 'Brown') {boardcolor = "#AF9B60"}
    if (visualSettings.boardColor == 'Pink') {boardcolor = "#FFDFDD"}
    if (visualSettings.boardColor == 'White') {boardcolor = "#FFFFFF"}
    if (visualSettings.boardColor == 'Grey') {boardcolor = "#C0C0C0"}
    if (visualSettings.boardColor == 'Yellow') {boardcolor = "#FFFF00"}

    tokenShape = visualSettings.tokenShape;
    
    canvas = $("#canvas"); 
    W = 600;
    H = 600;
    svg = $(makeSVG(W, H));
     
    canvas.css("height", H); 
    canvas.css("width", W);
   // makeMove(game.boardState,gridSizeScaled,gridSizeNonScaled,ratio,game.gameSettings);
    makeMove(game);
    drawBoard(game);


}



function drawBoard(game) {
    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API.
   
    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
 
    

	// Variables for board size and grid
    //	var size = game.gameSettings.boardSize;
	var grid = (W/size);
    var board = game.boardState;
	// Draw a rectangle for the board
	$('#canvas').empty();
	svg.append(makeRectangle(0, 0, W, H, boardcolor));

	var size = game.gameSettings.boardSize;
    // var board = state.board;
    var gridSizeNonScaled = 600/size;
    var gridSizeScaled = (600-2*gridSizeNonScaled)/size;
    svg.append(makeRectangle(gridSizeNonScaled*0.60,gridSizeNonScaled*0.60,600-1.2*gridSizeNonScaled,600-1.2*gridSizeNonScaled,boardcolor));
    svg.append(makeRectangle(gridSizeNonScaled,gridSizeNonScaled,600-2*gridSizeNonScaled,600-2*gridSizeNonScaled,boardcolor));
    var ratio = size/(size-1);
    for (var i = 1; i < size-1; i++) 
        svg.append(makeLine(i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,600-gridSizeNonScaled,"#000000",1));
    for (var i = 1; i < size-1; i++) 
        svg.append(makeLine(gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,600-gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,"#000000",1));
        
        
    for (var i = 0;i< size; i++) {
        for (var j = 0;j< size; j++) {
            if (board[i][j] == 1) 
                svg.append(makeShape(j*gridSizeScaled*ratio+gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeScaled/2.8,token1,tokenShape));
            if (board[i][j] == 2) 
                svg.append(makeShape(j*gridSizeScaled*ratio+gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeScaled/2.8,token2,tokenShape));
        }
    }
    




    // append the svg object to the canvas object.
    canvas.append(svg);
}

function initializePassButton() {
   $("#pass-button").click(function() {
        
        sendData = {
            "userName": document.cookie.split('=')[1]
        }
        
        clientServer.sendAndRecieveData(sendData,"pass",function(data){
            if (data.gameIsOver > 0) {
                alert("Player "+data.gameIsOver+" Wins!!");
            } else {
               if (playerTurn == 1){
                    playerTurn = 2;
                } else {
                    playerTurn = 1;
                }
                $("#error-prompt").empty();
            }
        });
    });  
}

function init(){

    playerTurn = 1;
    // do page load things here...
    clientServer = new ClientServer("localhost", 80);
    console.log("Initalizing Page...."); 
    getData(initializeBoard);
    initializePassButton();
   
}

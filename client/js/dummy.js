/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb) {

    sendData = {
        'userName': document.cookie.split('=')[1]
    }
    clientServer.sendAndRecieveData(sendData, "getCurrentGame", function(data) {

        // handle any errors here....
        console.log(data)
            // draw the board....

        cb(data.currentGame, data.visualSettings);
    });

}

function getVisualSettings(state) {
    $.get("/getVisualSettings", function(data, textStatus, xhr) {
        console.log("Response for /getVisualSettings: " + textStatus);
        console.log(data);
        // handle any errors here....

        // draw the board....
        drawBoard(state, data);

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


function drawBoard(game, visualSettings) {
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

    if (visualSettings.boardColor == 'Brown') {
        boardcolor = "#AF9B60"
    }
    if (visualSettings.boardColor == 'Pink') {
        boardcolor = "#FFDFDD"
    }
    if (visualSettings.boardColor == 'White') {
        boardcolor = "#FFFFFF"
    }
    if (visualSettings.boardColor == 'Grey') {
        boardcolor = "#C0C0C0"
    }
    if (visualSettings.boardColor == 'Yellow') {
        boardcolor = "#FFFF00"
    }


    //--------------------- code to draw board --------------------------------

    var canvas = $("#canvas");



    // Change the height and width of the board here...
    // everything else should adapt to an adjustable
    // height and width.
    var W = 600,
        H = 600;
    canvas.css("height", H);
    canvas.css("width", W);

    // The actual SVG element to add to. 
    // we make a jQuery object out of this, so that 
    // we can manipulate it via calls to the jQuery API.
    var svg = $(makeSVG(W, H));

    // Variables for board size and grid
    //	var size = game.gameSettings.boardSize;
    var grid = (W / size);
    var board = game.boardState;
    // Draw a rectangle for the board
    svg.append(makeRectangle(0, 0, W, H, boardcolor));

    var size = game.gameSettings.boardSize;
    // var board = state.board;
    var gridSizeNonScaled = 600 / size;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / size;
    svg.append(makeRectangle(gridSizeNonScaled * 0.60, gridSizeNonScaled * 0.60, 600 - 1.2 * gridSizeNonScaled, 600 - 1.2 * gridSizeNonScaled, "burlywood"));
    svg.append(makeRectangle(gridSizeNonScaled, gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, "burlywood"));
    var ratio = size / (size - 1);
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, "#000000", 1));
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, "#000000", 1));

    //-------------------------------------------------- end code needed to draw board in dummy ----------------------------------------------

    //this adds to the board at clicked canvas position
    $("#canvas").click(function(e) {
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top
            //console.log("Mouse x is " +  e.pageX - offset.left);
            //console.log("Mouse y is " +e.pageY - offset.top);

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var x = j * gridSizeScaled * ratio + gridSizeNonScaled;
                var y = i * gridSizeScaled * ratio + gridSizeNonScaled;
                //mouseX > x-10 && mouseX < x+10 && mouseY > y-10 && mouseY < y+10
                //var mouseX = 
                //console.log(j*gridSizeScaled*ratio+gridSizeNonScaled + " " + i*gridSizeScaled*ratio+gridSizeNonScaled);
                if (mouseX > x - 10 && mouseX < x + 10 && mouseY > y - 10 && mouseY < y + 10)
                //comment this out to not draw and add to the array so it is drawn by the draw board function
                    svg.append(makeCircle(j * gridSizeScaled * ratio + gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeScaled / 2.8, "black"));
                //for this
                //board[i][j] = 1 or 2 depending on turn
            }
        }

    }); //end canvas click function


    // append the svg object to the canvas object.
    canvas.append(svg);

}

function init() {

    // do page load things here...
    clientServer = new ClientServer("localhost", 80);
    console.log("Initalizing Page....");
    getData(drawBoard);
}
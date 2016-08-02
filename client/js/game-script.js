/**
 * Requests a new board state from the server's /getCurrentGame route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb) {
    sendData = {
        'userName': cookie
    }
    clientServer.sendAndRecieveData(sendData, "getCurrentGame", function(data) {
        cb(data.currentGame, data.visualSettings);
    });

}

/** takes an xy grid location as input and
 *  sets x_grid_location and y_grid_location
 *  to the actual x and y position to draw the
 *  svg.
 */
function getXYPosition(x, y, boardsize) {
    var gridSizeNonScaled = 600 / boardsize;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / boardsize;
    var ratio = boardsize / (boardsize - 1);
    x_grid_location = x * gridSizeScaled * ratio + gridSizeNonScaled;
    y_grid_location = y * gridSizeScaled * ratio + gridSizeNonScaled;
}


/** function that defines the onclick event for a board that is
 *  used for a hotseat game
 */
function makeMove(game) {

    // declare variables used in the onclick event

    //  used for figuring out exactly where to draw svgs
    var size = game.gameSettings.boardSize;
    var gridSizeNonScaled = 600 / size;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / size;
    var ratio = size / (size - 1);
    var radius = gridSizeScaled / 2.8;

    // object containing the game settings
    var gameSettings = game.gameSettings;
    // 2d array of board state positions
    board = game.boardState;

    
    // actual declaration of onclick for board
    $("#canvas").click(function(e) {
        // needed to locate mouse position
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;
        // used to only iterate through loop one time
        wentThrough = false;
        end:
            if (wentThrough == false) {
                // looks through ever board position
                for (var i = 0; i < board.length; i++) {
                    for (var j = 0; j < board.length; j++) {
                        // defines the x and y position on the svg of the current grid spot
                        var x_grid_location = j * gridSizeScaled * ratio + gridSizeNonScaled;
                        var y_grid_location = i * gridSizeScaled * ratio + gridSizeNonScaled;

                        // this is where the mouse click is detected
                        if (mouseX > x_grid_location - radius && mouseX < x_grid_location + radius && mouseY > y_grid_location - radius && mouseY < y_grid_location + radius) {
                            // detects if spot was free
                            if (board[i][j] == 0) {
                                // adds the piece onto the board
                                if (playerTurn == 1) {
                                    board[i][j] = 1;
                                } else {
                                    board[i][j] = 2;
                                }
                                // changes the text displaying the current turn
                                $('#current-turn').text(playerTurn);
                                // move data to be sent to the server 
                                sendData = {
                                    'userName': cookie,
                                    'pass': false,
                                    'board': board,
                                    "turn": playerTurn,
                                    "gameSettings": gameSettings,
                                    'player1Score': player1Score,
                                    'player2Score': player2Score
                                };
                                // used to ensure it loop isnt exicuted again
                                wentThrough = true;
                                // clears and hides error prompt
                                $("#error-prompt").empty();
                                $('.error-prompt-div').addClass('hidden');
                                // break out of both loops
                                break end;
                            } else {
                                // spot isnt free, display error
                                $("#error-prompt").text("A token already exists on that spot");
                                $('.error-prompt-div').removeClass('hidden');
                            }
                        }
                    }
                }
                return;
            }

        clientServer.sendAndRecieveData(sendData, "/makeMove", function(data) {

            // Nothing has been killed, append the appropriate players token and switch turn
            if ((data.boardState != undefined) && (data.killCheck == false)) {
                player1Score = data.player1Score;
                player2Score = data.player2Score + 0.5;
                if (playerTurn == 1) {
                    svg.append(makeShape(x_grid_location, y_grid_location, radius, token1, tokenShape));
                    playerTurn = 2;
                } else {
                    svg.append(makeShape(x_grid_location, y_grid_location, radius, token2, tokenShape));
                    playerTurn = 1;
                }
                updateScoreView();
                $('#current-turn').text(playerTurn);
                board = data.boardState;

            // Something has been killed, append the appropriate players token and switch turn
            } else if ((data.boardState != undefined) && (data.killCheck == true)) {
                player1Score = data.player1Score;
                player2Score = data.player2Score + 0.5;
                if (playerTurn == 1) {
                    playerTurn = 2;
                } else {
                    playerTurn = 1;
                }
                $('#current-turn').text(playerTurn);
                $('#canvas').empty();
                board = data.boardState;
                drawBoard(data);
                updateScoreView();

            // There was an error
            } else {
                // here is where we put error
                clientServer.sendAndRecieveData({
                    'userName': cookie
                }, "getCurrentGame", function(errorBoard) {
                    board = errorBoard.currentGame.boardState;
                    $("#error-prompt").text(data);
                    $('.error-prompt-div').removeClass('hidden');
                });
            }
            return;
        });

    }); //end canvas click function  
}



/** function that defines the onclick event for a board that is
 *  used for an player vs AI game
 */
function makeAiMove(game) {
    // declare variables used in the onclick event

    //  used for figuring out exactly where to draw svgs
    var size = game.gameSettings.boardSize;
    radius = ((600 - 2 * (600 / size)) / size) / 2.8;
    // object containing the game settings
    var gameSettings = game.gameSettings;
    // 2d array of board state positions
    board = game.boardState;
    

    // actual declaration of onclick for board
    $("#canvas").click(function(e) {
        // needed to locate mouse position
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;

        // used to only iterate through loop one time
        wentThrough = false;

        // if it is player 2's turn then return out of the on click function
        if (playerTurn == 2)
            return;

        end2:
            if (wentThrough == false) {
                // looks through ever board position
                for (var i = 0; i < board.length; i++) {
                    for (var j = 0; j < board.length; j++) {
                        // defines the x and y position on the svg of the current grid spot
                        getXYPosition(i, j, size);
                        // this is where the mouse click is detected
                        if (mouseX > x_grid_location - radius && mouseX < x_grid_location + radius && mouseY > y_grid_location - radius && mouseY < y_grid_location + radius) {
                            // detects if spot was free
                            if (board[j][i] == 0) {
                                // adds the piece onto the board
                                board[j][i] = 1;
                                // move data to be sent to the server 
                                sendData = {
                                    'userName': cookie,
                                    'pass': false,
                                    'board': board,
                                    "turn": playerTurn,
                                    "gameSettings": gameSettings,
                                    'player1Score': player1Score,
                                    'player2Score': player2Score
                                };

                                // you have went through this loop so when you branch to end, it will leave the loop.
                                wentThrough = true;
                                // clears and hides error prompt
                                $("#error-prompt").empty();
                                $('.error-prompt-div').addClass('hidden');
                                break end2;
                            } else {
                                // spot isnt free, display error
                                $("#error-prompt").text("A token already exists on that spot");
                                $('.error-prompt-div').removeClass('hidden');
                            }
                        }
                    }
                }

                return;
            } // end if wentthrough and nested 'for' loop


        clientServer.sendAndRecieveData(sendData, "/makeMove", function(data) {
            // If nothing has been killed    
            if ((data.boardState != undefined) && (data.killCheck == false)) {
                player1Score = data.player1Score;
                player2Score = data.player2Score + 0.5;
                // for a players turn, append a token to the location and switch players
                if (playerTurn == 1) {
                    svg.append(makeShape(x_grid_location, y_grid_location, radius, token1, tokenShape));
                    playerTurn = 2;
                } else {
                    svg.append(makeShape(x_grid_location, y_grid_location, radius, token2, tokenShape));
                    playerTurn = 1;
                }
                $('#current-turn').text(playerTurn);
                // update the scorew view
                updateScoreView();
                // Get the AI move
                board = data.boardState;
                getAiMove(board, false);

            // if something was killed
            } else if ((data.boardState != undefined) && (data.killCheck == true)) {
                player1Score = data.player1Score;
                player2Score = data.player2Score + 0.5;
                if (playerTurn == 1) {
                    playerTurn = 2;
                } else {
                    playerTurn = 1;
                }
                $('#canvas').empty();
                $('#current-turn').text(playerTurn);
                board = data.boardState;

                // draw the board with the data
                console.log("this is the data from makeAiMove: " + data);
                drawBoard(data);
                // update the scorew views
                updateScoreView();
                // if the player turn is the AI, then get its move
                getAiMove(board, false);
                // A move was invalid
            } else {
                // here is where we put error
                clientServer.sendAndRecieveData({
                    'userName': cookie
                }, "getCurrentGame", function(errorBoard) {
                    // handle any errors here
                    board = errorBoard.currentGame.boardState;
                    $("#error-prompt").text(data);
                    $('.error-prompt-div').removeClass('hidden');
                });
            }
            return;
        });

    }); //end canvas click function  
}

/** request a move from the server. Send the username and the board.
* difAi is used to call a different ai if the agressive ai trys to 
* do a Ko */
function getAiMove(boardState, diffAi) {
    // data to send to the server
    sendData = {
        "userName": cookie,
        "board": boardState,
        'diff': diffAi
    }

    // makes request to server for a move from AI
    clientServer.sendAndRecieveData(sendData, "/getAIMove", function(data) {
        data = JSON.parse(data)
        // AI Didn't pass
        if (data.pass == false) {
            // add token on board
            boardState[data.x][data.y] = 2;
            getXYPosition(data.x, data.y, boardState.length);
            // data 
            newSendData = {
                'userName': cookie,
                'pass': false,
                'board': boardState,
                "turn": 2,
                "gameSettings": gs,
                'player1Score': player1Score,
                'player2Score': player2Score
            }
            // sends the AIs move to the server so the server can
            // validate it
            sendMoveAI(newSendData);
        } else {
            // AI Passed so it sends AI's pass to the server
            clientServer.sendAndRecieveData({
                "userName": cookie
            }, "/pass", function(passData) {
                // AI's pass caused game to end
                if (passData.gameIsOver > 0) {
                    $('#canvas').off('click');
                    $('#pass-button').off('click');
                    displayWinScreen(1);
                } else {
                    // display error
                    playerTurn = 1;
                    $("#error-prompt").empty();
                    $('.error-prompt-div').addClass('hidden');
                    $("#error-prompt").text("Computer Passed");
                    $('.error-prompt-div').removeClass('hidden');
                }
                $('#current-turn').text(playerTurn);
            });
        }
    });
}


/** sends the move the AI made to the server to 
  *  be validated
  */
function sendMoveAI(sendData) {
    clientServer.sendAndRecieveData(sendData, "/makeMove", function(data) {
        // If nothing has been killed    
        if ((data.boardState != undefined) && (data.killCheck == false)) {
            // update score variables
            player1Score = data.player1Score;
            player2Score = data.player2Score + 0.5;

            // for a players turn, append a token to the location and switch players
            if (playerTurn == 1) {
                svg.append(makeShape(x_grid_location, y_grid_location, radius, token1, tokenShape));
                playerTurn = 2;
            } else {
                svg.append(makeShape(y_grid_location, x_grid_location, radius, token2, tokenShape));
                playerTurn = 1;
            }
            $('#current-turn').text(playerTurn);
            // update the scorew view
            updateScoreView();

            // if something was killed
        } else if ((data.boardState != undefined) && (data.killCheck == true)) {
            player1Score = data.player1Score;
            player2Score = data.player2Score + 0.5;
            // change turn
            if (playerTurn == 1) {
                playerTurn = 2;
            } else {
                playerTurn = 1;
            }
            $('#current-turn').text(playerTurn);

            // empty canvas
            $('#canvas').empty();
            board = data.boardState;

            // draw the board with the data
            drawBoard(data);
            // update the scorew views
            updateScoreView();
            // position needs to be zero now

            // A move was invalid
        } else {
            // here is where we put error
            clientServer.sendAndRecieveData({
                'userName': cookie
            }, "getCurrentGame", function(errorBoard) {
                board = errorBoard.currentGame.boardState;
                getAiMove(board, true);
                $("#error-prompt").text(data);
                $('.error-prompt-div').removeClass('hidden');
            });
        }
        return;
    });
}

/**
 * initialize the global variables according to
 * the game settings
 */

function initializeBoard(game, visualSettings) {

    vs = visualSettings;
    gs = game.gameSettings;
    if (game.turn == undefined) {
        playerTurn = 1;
    } else {
        playerTurn = game.turn;
    }
    $('#current-turn').text(playerTurn);

    // sets the token colors
    if (visualSettings.tokenColor == "Black and White") {
        token1 = '#000000'
        token2 = '#FFFFFF'
    }
    if (visualSettings.tokenColor == "Red and Yellow") {
        token1 = '#FF0000'
        token2 = '#FFFF00'
    }
    if (visualSettings.tokenColor == "Blue and Orange") {
        token1 = '#0000FF'
        token2 = '#FFA500'
    }

    // sets the board color
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

    // sets the token shape
    tokenShape = visualSettings.tokenShape;

    // sets scores
    player1Score = game.player1Score;
    player2Score = game.player2Score + 0.5;
    updateScoreView()

    canvas = $("#canvas");
    W = 600;
    H = 600;
    svg = $(makeSVG(W, H));

    canvas.css("height", H);
    canvas.css("width", W);

    // initializes the proper canvas onclick function
    if (game.gameSettings.playerSettings == "One Player") makeAiMove(game);
    else makeMove(game);
    drawBoard(game);
}

/** This function draws the entire board
 */
function drawBoard(game) {
    // Variables for board size and grid
    var grid = (W / size);
    var board = game.boardState;
    // Draw a rectangle for the board
    svg.append(makeRectangle(0, 0, W, H, boardcolor));

    // variables used to map gridspot to actual x/y position on board
    var size = game.gameSettings.boardSize;
    var gridSizeNonScaled = 600 / size;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / size;
    // draws the background rectangles
    svg.append(makeRectangle(gridSizeNonScaled * 0.60, gridSizeNonScaled * 0.60, 600 - 1.2 * gridSizeNonScaled, 600 - 1.2 * gridSizeNonScaled, boardcolor));
    svg.append(makeRectangle(gridSizeNonScaled, gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, boardcolor));
    var ratio = size / (size - 1);
    // draws the grid lines
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, "#000000", 1));
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, "#000000", 1));
    // draws the tokens
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] == 1)
                svg.append(makeShape(j * gridSizeScaled * ratio + gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeScaled / 2.8, token1, tokenShape));
            if (board[i][j] == 2)
                svg.append(makeShape(j * gridSizeScaled * ratio + gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeScaled / 2.8, token2, tokenShape));
        }
    }

    // append the svg object to the canvas object.
    canvas.append(svg);
}


function displayWinScreen(winner) {
    $("#canvas").append('<div class="win-screen container" style="background-color:red;border-radius:15px;"><h3 style="color:yellow">Player ' + winner + ' wins!</h3>' +
        '<p style="color:yellow">Player 1 score: <span id="p1score">' + player1Score + '</span></p>' +
        '<p style="color:yellow">Player 2 score: <span id="p1score">' + player2Score + '</span></p>' +
        '<a href="main-menu.html" class="btn btn-default game-ender" role="button" id="main-menus"><b  style="color:red">Main Menu </b><span style="color:red" class="glyphicon glyphicon-share-alt"></span></a>' + '</div>');
    initializeGameEnd();
}

/** used to initialize the onclick function of the pass button
 */
function initializePassButton() {
    $("#pass-button").click(function() {
        // makes it so you cant spam the pass button by disabling it for 1.5 seconds
        // after it is pressed
        $('#pass-button').addClass('disabled');
        setTimeout(function() {
            $('#pass-button').removeClass('disabled');
        }, 1500);
        sendData = {
            "userName": cookie
        }

        clientServer.sendAndRecieveData(sendData, "pass", function(data) {
            if (data.gameIsOver > 0) {
                // pass triggered the game to end
                $('#canvas').off('click');
                $('#pass-button').off('click');
                if (player1Score > player2Score) {
                    displayWinScreen(1);
                } else {
                    displayWinScreen(2);
                }
            } else {
                // pass did not trigger game end so skip turn
                if (playerTurn == 1) {
                    playerTurn = 2;
                    if (gs.playerSettings == "One Player") {
                        getAiMove(board, false);
                    }
                } else {
                    playerTurn = 1;
                }
                $('#current-turn').text(playerTurn);
                $("#error-prompt").empty();
                $('.error-prompt-div').addClass('hidden');
            }
        });
    });
}

// used to tell the server the game has ended when the 
// button to return to main menu is pressed
function initializeGameEnd() {
    $(".game-ender").click(function() {
        var sendData = {
            userName: cookie
        }
        clientServer.sendData(sendData, 'endGame', function() {});
    });
}

function updateScoreView() {
    $('#player1Score').text(player1Score);
    $('#player2Score').text(player2Score);
}

// function that initializes the entire game on page load
function init() {
    cookie = getCookie('Gousername');
    clientServer = new ClientServer("localhost", 80);
    console.log("Initalizing Page....");
    getData(initializeBoard);
    initializePassButton();
    initializeGameEnd();

}

// helper function to get the username cookie from list of cookies
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
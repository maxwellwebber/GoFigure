/**
 * Requests a new board state from the server's /data route.
 * 
 * @param cb {function} callback to call when the request comes back from the server.
 */
function getData(cb) {



    sendData = {
        'userName': cookie
    }
    clientServer.sendAndRecieveData(sendData, "getCurrentGame", function(data) {

        // handle any errors here....
        //console.log(data.currentGame.gameSettings);
        // draw the board....

        cb(data.currentGame, data.visualSettings);
    });

}


function getXYPosition(x, y, boardsize) {
    var gridSizeNonScaled = 600 / boardsize;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / boardsize;
    var ratio = boardsize / (boardsize - 1);

    // these are global variables, be careful
    x_grid_location = x * gridSizeScaled * ratio + gridSizeNonScaled;
    y_grid_location = y * gridSizeScaled * ratio + gridSizeNonScaled;
}


function makeMove(game) {

    var size = game.gameSettings.boardSize;

    var gridSizeNonScaled = 600 / size;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / size;
    var ratio = size / (size - 1);
    var gameSettings = game.gameSettings;
    board = game.boardState;
    var radius = gridSizeScaled / 2.8;

    $("#canvas").click(function(e) {
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;
        wentThrough = false;
        end:
            if (wentThrough == false) {
                for (var i = 0; i < board.length; i++) {
                    for (var j = 0; j < board.length; j++) {

                        //console.log(i + " " + j);


                        var x_grid_location = j * gridSizeScaled * ratio + gridSizeNonScaled;
                        var y_grid_location = i * gridSizeScaled * ratio + gridSizeNonScaled;
                        //mouseX > x-10 && mouseX < x+10 && mouseY > y-10 && mouseY < y+10
                        //var mouseX = 
                        //console.log(j*gridSizeScaled*ratio+gridSizeNonScaled + " " + i*gridSizeScaled*ratio+gridSizeNonScaled);
                        if (mouseX > x_grid_location - radius && mouseX < x_grid_location + radius && mouseY > y_grid_location - radius && mouseY < y_grid_location + radius) {
                            if (board[i][j] == 0) {
                                //comment this out to not draw and add to the array so it is drawn by the draw board function
                                //svg.append(makeCircle(j*gridSizeScaled*ratio+gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeScaled/2.8,"black")); 
                                //for this
                                if (playerTurn == 1) {
                                    board[i][j] = 1;
                                } else {
                                    board[i][j] = 2;
                                }
                                $('#current-turn').text(playerTurn);
                                //console.log(board[i][j]);
                                sendData = {
                                    'userName': cookie,
                                    'pass': false,
                                    'board': board,
                                    "turn": playerTurn,
                                    "gameSettings": gameSettings,
                                    'player1Score': player1Score,
                                    'player2Score': player2Score
                                };
                                wentThrough = true;
                                $("#error-prompt").empty();
                                $('.error-prompt-div').addClass('hidden');
                                break end;
                            } else {
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
                //console.log(data);
                board = data.boardState;
                drawBoard(data);
                updateScoreView();

                // There was an error
            } else {
                // here is where we put error
                clientServer.sendAndRecieveData({
                    'userName': cookie
                }, "getCurrentGame", function(errorBoard) {
                    // handle any errors here....
                    board = errorBoard.currentGame.boardState;
                    $("#error-prompt").text(data);
                    $('.error-prompt-div').removeClass('hidden');
                });
            }
            return;
        });

    }); //end canvas click function  
}



function makeAiMove(game) {
    var size = game.gameSettings.boardSize;
    var gameSettings = game.gameSettings;
    board = game.boardState;
    radius = ((600 - 2 * (600 / size)) / size) / 2.8;

    $("#canvas").click(function(e) {
        var offset = $(this).offset();
        var mouseX = e.pageX - offset.left;
        var mouseY = e.pageY - offset.top;

        // set initial wentThrough to false
        wentThrough = false;

        // if it is player 2's turn then return out of the on click function
        if (playerTurn == 2)
            return;

        end2:

            if (wentThrough == false) {
                for (var i = 0; i < board.length; i++) {
                    for (var j = 0; j < board.length; j++) {

                        //console.log(i + " " + j);


                        getXYPosition(i, j, size);
                        //console.log(board);
                        //mouseX > x-10 && mouseX < x+10 && mouseY > y-10 && mouseY < y+10
                        //var mouseX = 
                        //console.log(j*gridSizeScaled*ratio+gridSizeNonScaled + " " + i*gridSizeScaled*ratio+gridSizeNonScaled);
                        if (mouseX > x_grid_location - radius && mouseX < x_grid_location + radius && mouseY > y_grid_location - radius && mouseY < y_grid_location + radius) {
                            if (board[j][i] == 0) {
                                //comment this out to not draw and add to the array so it is drawn by the draw board function
                                //svg.append(makeCircle(j*gridSizeScaled*ratio+gridSizeNonScaled,i*gridSizeScaled*ratio+gridSizeNonScaled,gridSizeScaled/2.8,"black")); 
                                //for this
                                //if (playerTurn == 1) {
                                board[j][i] = 1;
                                //}
                                //setTimeout(function() {}, 1000);


                                // Timeout: setTimeout(function(){ svg.append(makeShape(x_grid_location,y_grid_location,radius,token2,tokenShape)); }, 1000);
                                //console.log(board[i][j]);
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
                                $("#error-prompt").empty();
                                $('.error-prompt-div').addClass('hidden');
                                break end2;
                            } else {
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
                    // Timeout: setTimeout(function(){ svg.append(makeShape(x_grid_location,y_grid_location,radius,token2,tokenShape)); }, 1000);
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
                    // handle any errors here....
                    board = errorBoard.currentGame.boardState;
                    $("#error-prompt").text(data);
                    $('.error-prompt-div').removeClass('hidden');
                });
            }
            return;
        });

    }); //end canvas click function  
}

// request a move from the server. Send the username and the board.
function getAiMove(boardState, diffAi) {
    sendData = {
        "userName": cookie,
        "board": boardState,
        'diff': diffAi
    }
    console.log(diffAi);

    clientServer.sendAndRecieveData(sendData, "/getAIMove", function(data) {
        data = JSON.parse(data)
        if (data.pass == false) {
            boardState[data.x][data.y] = 2;
            getXYPosition(data.x, data.y, boardState.length);
            newSendData = {
                'userName': cookie,
                'pass': false,
                'board': boardState,
                "turn": 2,
                "gameSettings": gs,
                'player1Score': player1Score,
                'player2Score': player2Score
            }
            sendMoveAI(newSendData);
        } else {
            //AI PASSED
            clientServer.sendAndRecieveData({
                "userName": cookie
            }, "/pass", function(passData) {
                if (passData.gameIsOver > 0) {
                    $('#canvas').off('click');
                    $('#pass-button').off('click');
                    displayWinScreen(1);
                } else {
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

// send a move to the board?
function sendMoveAI(sendData) {

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

                // Timeout: setTimeout(function(){ svg.append(makeShape(x_grid_location,y_grid_location,radius,token2,tokenShape)); }, 1000);

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
            if (playerTurn == 1) {
                playerTurn = 2;
            } else {
                playerTurn = 1;
            }
            $('#current-turn').text(playerTurn);


            $('#canvas').empty();
            board = data.boardState;

            // draw the board with the data
            //console.log("this is the data from sendAiMove: ");
            //console.log(data.boardState);
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
                // handle any errors here....
                board = errorBoard.currentGame.boardState;
                getAiMove(board, true);
                $("#error-prompt").text(data);
                $('.error-prompt-div').removeClass('hidden');
            });
        }

        // return
        return;
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


function initializeBoard(game, visualSettings) {
    //var myData = visualSettings;

    //------------------------------
    //-------------------------------

    vs = visualSettings;
    gs = game.gameSettings;
    if (game.turn == undefined) {
        playerTurn = 1;
    } else {
        playerTurn = game.turn;
    }
    $('#current-turn').text(playerTurn);
    //console.log("myData is " + myData.token1);

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

    tokenShape = visualSettings.tokenShape;

    player1Score = game.player1Score;
    player2Score = game.player2Score + 0.5;
    updateScoreView()

    canvas = $("#canvas");
    W = 600;
    H = 600;
    svg = $(makeSVG(W, H));

    canvas.css("height", H);
    canvas.css("width", W);
    // makeMove(game.boardState,gridSizeScaled,gridSizeNonScaled,ratio,game.gameSettings);

    if (game.gameSettings.playerSettings == "One Player") makeAiMove(game);
    else makeMove(game);
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
    var grid = (W / size);
    var board = game.boardState;
    // Draw a rectangle for the board
    //$('#canvas').empty();
    svg.append(makeRectangle(0, 0, W, H, boardcolor));

    var size = game.gameSettings.boardSize;
    // var board = state.board;
    var gridSizeNonScaled = 600 / size;
    var gridSizeScaled = (600 - 2 * gridSizeNonScaled) / size;
    svg.append(makeRectangle(gridSizeNonScaled * 0.60, gridSizeNonScaled * 0.60, 600 - 1.2 * gridSizeNonScaled, 600 - 1.2 * gridSizeNonScaled, boardcolor));
    svg.append(makeRectangle(gridSizeNonScaled, gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, 600 - 2 * gridSizeNonScaled, boardcolor));
    var ratio = size / (size - 1);
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(i * gridSizeScaled * ratio + gridSizeNonScaled, gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, "#000000", 1));
    for (var i = 1; i < size - 1; i++)
        svg.append(makeLine(gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, 600 - gridSizeNonScaled, i * gridSizeScaled * ratio + gridSizeNonScaled, "#000000", 1));


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
    // call algorithm to find winner
    $("#canvas").append('<div class="win-screen container" style="background-color:red;border-radius:15px;"><h3 style="color:yellow">Player ' + winner + ' wins!</h3>' +
        '<p style="color:yellow">Player 1 score: <span id="p1score">' + player1Score + '</span></p>' +
        '<p style="color:yellow">Player 2 score: <span id="p1score">' + player2Score + '</span></p>' +
        /*'<a class="btn btn-default" role="button" id="save-replay-button-revealer">Save Replay</a>'+*/
        '<a href="main-menu.html" class="btn btn-default game-ender" role="button" id="main-menus"><b  style="color:red">Main Menu </b><span style="color:red" class="glyphicon glyphicon-share-alt"></span></a>' + '</div>');
    initializeGameEnd();
    //initializeSaveReplayRevealerButton(winner);
    // return winner
}

function initializeSaveReplayRevealerButton(winner) {
    $('#save-replay-button-revealer').one('click', function() {
        $(".win-screen").append('<form class="form-inline">' +
            '<div class="form-group">' +
            '<input class="form-inline replayname" id="pwd" placeholder="Enter replay name">' +
            '<a class="btn btn-default" role="button" id="save-replay-button">Save</a></div>');

        $('#save-replay-button').one('click', function() {
            var sendData = {
                "userName": cookie,
                "replayName": $('.replayname').val(),
                "visualSettings": vs,
                'winner': winner
            }

            clientServer.sendAndRecieveData(sendData, 'saveReplay', function(err) {
                if (!err) {
                    $(".win-screen").append('<p>Save Successful</p>');
                } else {
                    $(".win-screen").append('<p>' + err + '</p>');
                }
            });
        });
    });
}

function initializePassButton() {
    $("#pass-button").click(function() {
        $('#pass-button').addClass('disabled');
        setTimeout(function() {
            $('#pass-button').removeClass('disabled');
        }, 1500);
        sendData = {
            "userName": cookie
        }

        clientServer.sendAndRecieveData(sendData, "pass", function(data) {
            if (data.gameIsOver > 0) {
                $('#canvas').off('click');
                $('#pass-button').off('click');
                if (player1Score > player2Score) {
                    displayWinScreen(1);
                } else {
                    displayWinScreen(2);
                }
            } else {
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

function init() {

    cookie = getCookie('Gousername');
    // do page load things here...
    clientServer = new ClientServer("localhost", 80);
    console.log("Initalizing Page....");
    getData(initializeBoard);
    initializePassButton();
    initializeGameEnd();

}

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
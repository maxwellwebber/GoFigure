function Board(x, y, token) {
    this.neighbour = [],
        this.liberties = 0,
        this.x = x,
        this.y = y,
        this.token = token,
        this.degree = 0,
        this.visited = false
}


function addNeighbour(Board, neighbour) {
    Board.neighbour.push(neighbour);
    Board.degree++;
}

function removeNeighbour(Board, neighbour) {
    Board.neighbour.remove(neighbour);
    Board.degree--;
}


function getNeighbours(board) {
    var A = [];
    //////console.log(A[0][0]);
    //console.log(A);
    //nested for loop to fill every single cell of the array with a Board object
    for (var i = 0; i < board.length; i++) {
        //console.log(A[i][j]);
        var arr = new Array();
        for (var j = 0; j < board.length; j++) {
            //console.log("i is " + i + " j is " + j);
            arr.push(new Board(i, j, board[i][j]));
            //console.log(A[i][j]);
        }
        A.push(arr);
    }
    //console.log(A[2][0]);
    //console.log(A[0][0]);
    //console.log(A[2][0].token);
    //create second for loop to check every vertex with same token
    //for neighbours
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (j + 1 < board.length) {
                if (A[i][j].token == (A[i][j + 1].token)) {
                    addNeighbour(A[i][j], A[i][j + 1]);
                }
                if (A[i][j + 1].token == 0) {
                    A[i][j].liberties++;
                }
            }
            if (i + 1 < board.length) {
                if (A[i][j].token == (A[i + 1][j].token)) {
                    addNeighbour(A[i][j], A[i + 1][j]);
                }
                if (A[i + 1][j].token == 0) {
                    A[i][j].liberties++;
                }
            }
            if (j - 1 >= 0) {
                if (A[i][j].token == (A[i][j - 1].token)) {
                    addNeighbour(A[i][j], A[i][j - 1]);
                }
                if (A[i][j - 1].token == 0) {
                    A[i][j].liberties++;
                }
            }
            if (i - 1 >= 0) {
                if (A[i][j].token == (A[i - 1][j].token)) {
                    addNeighbour(A[i][j], A[i - 1][j]);
                }
                if (A[i - 1][j].token == 0) {
                    A[i][j].liberties++;
                }
            }


        }
    }

    return A;
}



function FloodFillBFS(Board) {
    //console.log(Board);
    var queue = [];
    queue.push(Board);
    Board.visited = true;
    //////console.log(Board);
    ////console.log("visited " + Board.x + " , " + Board.y);
    while (queue.length != 0) {
        var r = queue.pop();
        //////console.log(r);
        //////console.log(queue.length);
        for (var i = 0; i < r.neighbour.length; i++) {
            //////console.log(i);
            if (r.neighbour[i].visited == false) {
                r.neighbour[i].visited = true;
                ////console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y);
                queue.push(r.neighbour[i]);
            }
        }
    }
}

function FloodFillBFSForDeath(Board, positions) {

    ////console.log("FloodFillBFSForDeath");
    function positionKilled(row, column) {
        this.row = row,
            this.column = column
    }

    var position_floodFill = []
        ////console.log(Board);
    var kill;
    var queue = [];
    //console.log("board liberties are: " + Board.liberties);
    if (Board.liberties > 0) {

        kill = 0;
        console.log("inside this if so WILL NOT KILL ARMY");
        return;
    } else {
        queue.push(Board);
    }
    Board.visited = true;
    console.log("visited  " + Board.x + " , " + Board.y);
    position_floodFill.push(new positionKilled(Board.x, Board.y));
    while (queue.length != 0) {
        var r = queue.pop();
        ////console.log(r);
        ////console.log(queue.length);
        for (var i = 0; i < r.neighbour.length; i++) {
            ////console.log(i);
            if (r.neighbour[i].visited == false) {
                r.neighbour[i].visited = true;
                console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y);
                if (r.neighbour[i].liberties > 0) {
                    console.log("WILL NOT KILL ARMY");
                    kill = 0;
                    return;
                }
                position_floodFill.push(new positionKilled(r.neighbour[i].x, r.neighbour[i].y));
                queue.push(r.neighbour[i]);
            }
        } //end for
    } //end while
    ////console.log(positions[0]);
    if (kill == 0) {
        //console.log("Positions in FloddFill is  ");
        //console.log(positions);
    } else {
        for (var i = 0; i < position_floodFill.length; i++) {
            positions.push(position_floodFill[i]);
        }
        console.log("ARMY IS DEAD");
    }

}

function checkAdjacentTokens(A, tokens, position) {
    //////console.log(position.row + " AND " + position.column);
    //////console.log("TOKEN X and TOKEN Y " + tokens.one + "  " +  tokens.two);
    //////console.log(" A IS " + A);
    //tokens.one++;
    //////console.log(A.length);
    //////console.log("position row is  " + position.row + " and column " + position.column);
    if (position.column + 1 < A.length) {
        if (A[position.row][position.column + 1].visited == false) {
            //////console.log("in here");
            //////console.log(A)

            //////console.log(A[position.row][position.column+1].token);
            if (A[position.row][position.column + 1].token == 1) {
                //		////console.log("in here");
                A[position.row][position.column + 1].visited = true;
                tokens.one++;
            } else if (A[position.row][position.column + 1].token == 2) {
                A[position.row][position.column + 1].visited = true;
                tokens.two++;
            }
        }
    }
    if (position.row + 1 < A.length) {
        if (A[position.row + 1][position.column].visited == false) {
            //////console.log("in here");
            //////console.log(A[position.row+1][position.column].token);
            if (A[position.row + 1][position.column].token == 1) {
                //		////console.log("in here");
                A[position.row + 1][position.column].visited = true;
                tokens.one++;
            } else if (A[position.row + 1][position.column].token == 2) {
                A[position.row + 1][position.column].visited = true;
                tokens.two++;
            }
        }
    }
    if (position.column - 1 >= 0) {
        if (A[position.row][position.column - 1].visited == false) {
            //////console.log("in here");
            //////console.log(A[position.row][position.column-1].token);
            if (A[position.row][position.column - 1].token == 1) {

                //		////console.log("in here");
                A[position.row][position.column - 1].visited = true;
                tokens.one++;
            } else if (A[position.row][position.column - 1].token == 2) {
                A[position.row][position.column - 1].visited = true;
                tokens.two++;
            }
        }
    }
    if (position.row - 1 >= 0) {
        if (A[position.row - 1][position.column].visited == false) {
            //////console.log("in here");
            //////console.log(A[position.row-1][position.column].token);
            if (A[position.row - 1][position.column].token == 1) {
                //////console.log("in here");
                A[position.row - 1][position.column].visited = true;
                tokens.one++;
            } else if (A[position.row - 1][position.column].token == 2) {
                A[position.row - 1][position.column].visited = true;
                tokens.two++;
            }
        }
    }
    //////console.log(tokens.one);
}

function FloodFillBFSArea(x, y, board, B, score) {
    //////console.log(Board);
    var A = getNeighbours(board);
    var Board = A[x][y];
    var tokens = {
        one: 0,
        two: 0
    }
    var position = {
        row: 0,
        column: 0
    }
    var visits = 0;
    //////console.log(Board);
    var queue = [];
    queue.push(Board);
    Board.visited = true;
    B[x][y].visited = true;
    //////console.log(Board);
    ////console.log("visited " + Board.x + " , " + Board.y);
    visits++;
    position.row = Board.x;
    position.column = Board.y;
    checkAdjacentTokens(A, tokens, position);
    //////console.log(tokens.one + "   " + tokens.two);
    while (queue.length != 0) {
        var r = queue.pop();
        //////console.log(r);
        //////console.log(queue.length);
        for (var i = 0; i < r.neighbour.length; i++) {
            //////console.log(i);
            if (r.neighbour[i].visited == false) {
                r.neighbour[i].visited = true;
                //B.neighbour[i].visited = true;
                B[r.neighbour[i].x][r.neighbour[i].y].visited = true;
                ////console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y);
                visits++;
                position.row = r.neighbour[i].x;
                position.column = r.neighbour[i].y;
                checkAdjacentTokens(A, tokens, position);
                //////console.log(tokens.one + "   " + tokens.two);
                queue.push(r.neighbour[i]);
            }
        }

    }
    if (tokens.one == 0) {
        ////console.log("Area is controlled by player two with a score of " + visits);
        score.player2 += visits;
    } else if (tokens.two == 0) {
        ////console.log("Area is controlled by player one with a score of " + visits);
        score.player1 += visits;
    } else {
        ////console.log("Are is disputed");	
    }
    ////console.log("Area is surrounded by tokens one: " + tokens.one + " and two: " + tokens.two);
}


function isSuicide(A, position, numArmiesKilled) {
    console.log("num armies killed are " + numArmiesKilled);
    if (A[position.row][position.column].liberties == 0 && numArmiesKilled == 0) {
        //trying to commit suicide
        if (A[position.row][position.column].neighbour.length > 0) {
            if (position.column + 1 < A.length) {
                if (A[position.row][position.column + 1].token == A[position.row][position.column].token) {
                    if (A[position.row][position.column + 1].liberties > 0) {
                        return false;
                    }

                }
            }
            if (position.row + 1 < A.length) {
                if (A[position.row + 1][position.column].token == A[position.row][position.column].token) {
                    if (A[position.row + 1][position.column].liberties > 0) {
                        return false;
                    }
                }
            }
            if (position.column - 1 >= 0) {
                if (A[position.row][position.column - 1].token == A[position.row][position.column].token) {
                    if (A[position.row][position.column - 1].liberties > 0) {
                        return false;
                    }
                }
            }
            if (position.row - 1 >= 0) {
                if (A[position.row - 1][position.column].token == A[position.row][position.column].token) {
                    if (A[position.row - 1][position.column].liberties > 0) {
                        return false;
                    }
                }
            }
        }
        console.log("suicidal move");
        return true;
    } else {
        return false;
    }
}

function isKO(board, prevBoard) {
    ////console.log("prevBoard is :");
    ////console.log(prevBoard);
    ////console.log("ABOUT TO CHECK KO");
    if (arraysIdentical(board, prevBoard)) {
        console.log(("KO KO KO KO KO!!!!"));
        return true;
    } else {
        return false;
    }
}


function checkDeath(position, board) {

    function positionKilled(row, column) {
        this.row = row,
            this.column = column
    }


    ////console.log("check death received position:  row:" + position.row +" and column: " + position.column );

    var A = getNeighbours(board);
    var positions = [];
    console.log("checking if token " + A[position.row][position.column].token + " placed at row: " + position.row + " column: " + position.column + " killed something in board");
    ////console.log(board);
    ////console.log("token placed is  " + A[position.row][position.column].token);
    ////console.log("IN CHECK DEATH");
    ////console.log(A[position.row][position.column].token != A[position.row][position.column-1].token);
    ////console.log("checking if token " + A[position.row][position.column].token + " placed at row: " + position.row + " column: " + position.column + " killed something");

    if (position.column + 1 < board.length) {
        if (A[position.row][position.column].token != A[position.row][position.column + 1].token && A[position.row][position.column + 1].token != 0) {
            ////console.log(A[position.row][position.column+1].token);
            //addNeighbour(A[i][j],A[i][j+1]);
            if (A[position.row][position.column + 1].neighbour.length != 0) {
                FloodFillBFSForDeath(A[position.row][position.column + 1], positions);
            } else if (A[position.row][position.column + 1].liberties == 0) {
                console.log("in special if with row and column " + position.row + " " + position.column + 1);
                positions.push(new positionKilled(position.row, position.column + 1));
            }
        }
    }
    if (position.row + 1 < board.length) {
        if (A[position.row][position.column].token != A[position.row + 1][position.column].token && A[position.row + 1][position.column].token != 0) {
            //console.log(A[position.row+1][position.column].token);
            //addNeighbour(A[i][j],A[i+1][j]);
            if (A[position.row + 1][position.column].neighbour.length != 0) {
                FloodFillBFSForDeath(A[position.row + 1][position.column], positions);
            } else if (A[position.row + 1][position.column].liberties == 0) {
                console.log("in special if with row and column " + position.row + 1 + " " + position.column);
                positions.push(new positionKilled(position.row + 1, position.column));
            }
        }
    }
    if (position.column - 1 >= 0) {
        if (A[position.row][position.column].token != A[position.row][position.column - 1].token && A[position.row][position.column - 1].token != 0) {
            //console.log(A[position.row][position.column-1].token);
            //addNeighbour(A[i][j],A[i][j-1]);
            if (A[position.row][position.column - 1].neighbour.length != 0) {
                FloodFillBFSForDeath(A[position.row][position.column - 1], positions);
            } else if (A[position.row][position.column - 1].liberties == 0) {
                console.log("in special if with row and column " + position.row + " " + position.column - 1);
                positions.push(new positionKilled(position.row, position.column - 1));
            }
        }
    }
    if (position.row - 1 >= 0) {
        if (A[position.row][position.column].token != A[position.row - 1][position.column].token && A[position.row - 1][position.column].token != 0) {
            ////console.log(A[position.row-1][position.column-1]);
            //addNeighbour(A[i][j],A[i-1][j]);
            if (A[position.row - 1][position.column].neighbour.length != 0) {
                FloodFillBFSForDeath(A[position.row - 1][position.column], positions);
            } else if (A[position.row - 1][position.column].liberties == 0) {
                console.log("in special if with row and column " + position.row - 1 + " " + position.column);
                positions.push(new positionKilled(position.row - 1, position.column));
            }
        }
    }
    ////console.log("Killed armies");
    ////console.log("Right before checkDeath returns");
    ////console.log(new Date().getTime()/1000);
    ////console.log("Positions in check death is : ")
    ////console.log(positions);
    return positions;

}

function validate(board, previousBoard, position, numArmiesKilled) { //add previous board here to check against ko for previous state

    //////console.log(board[position.row][position.column]);
    var A = getNeighbours(board);
    ////console.log("ALGORITHMS LINE 373");
    if (isSuicide(A, position, numArmiesKilled)) {
        ////console.log("ALGORITHMS LINE 375");
        return 1;
    } else if (isKO(board, previousBoard)) {
        return 2;
    } else {
        return 0; //move is valid
    }

}

function getScore(board) {
    //if stoneScoring
    stoneScoring(board);

    //if armyscoring
    areaScoring(board); //undisputed liberties no substraction

    //if territory scoring
    territoryScoring(); //undisputed liberties - death armies 

}

function stoneScoring(board) {

    var score = {
        player1: 0,
        player2: 0
    };


    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j] == 1) {
                score.player1++;
            }
            if (board[i][j] == 2) {
                score.player2++;
            }
        }
    }
    //console.log(score);
    return score;

}


function areaScoring(board) {
    var B = getNeighbours(board);
    var score = {
        player1: 0,
        player2: 0
    };
    //////console.log(A);

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (B[i][j].token == 0 && B[i][j].visited == false) {
                FloodFillBFSArea(i, j, board, B, score);
            }
        }
    }
    ////console.log("Player 1 score is " + score.player1 + " Player 2 score is " + score.player2);
    return score;
}

function territoryScoring(board) {
    var score = areaScoring(board);
    //score.player1 -= player1.killedTokes;
    //score.player2 -= player2.killedTokens;
    ////console.log(score);
    return score;

}

function arraysIdentical(a, b) {

    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a.length; j++) {
            if (a[i][j] != b[i][j]) {
                return false;
            }
        }
    }

    return true;
}


module.exports = {
    arraysIdentical: arraysIdentical,
    isKO: isKO,
    getNeighbours: getNeighbours,
    FloodFillBFSForDeath: FloodFillBFSForDeath,
    FloodFillBFSArea: FloodFillBFSArea,
    stoneScoring: stoneScoring,
    areaScoring: areaScoring,
    territoryScoring: territoryScoring,
    checkDeath: checkDeath,
    validate: validate
}
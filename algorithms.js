/** 
 * This file contains functions for validatiing a move, calculating scores
 * of the game KO. Specifically, it allows for checking KO, Suicide, kileld armies,
 * area scoring calculation and stone scoring calculation. 
 * 
 */ 


/**
 *The object used as a board which is contained in a 2D array of Board objects
 *Each object contains an array of its inmediate neighbours (N, S, W, E)
 *and also the amount of liberties (adjacent 0's) its positions, degree and token
 *The visited paramater is used by the Flood Fill Algorithm
 */
	function Board (x,y,token)  {
	    this.neighbour = [],
	    this.liberties = 0,
	    this.x = x ,
	    this.y = y,
	    this.token = token,
	    this.degree = 0,
	    this.visited = false
	}
	
	
/**
 * Add a Neighbour to a Board object
 *
 * @param Board {Board object} The Board to add neighbour 
 * @param neighbour {Board object} The neighbour to add to the board
 *
 */
	function addNeighbour(Board,neighbour){
	    Board.neighbour.push(neighbour);
	    Board.degree++;
	}

	
/**
 * Creates all the Board object for each position of the 2D array
 *
 * @param board {2D int array} The board to base the creation 
 * 
 * @returns {2D object array} 
 */
	function getNeighbours(board){
	    var A = [];
	 		//nested for loop to fill every single cell of the array with a Board object
			for (var i = 0; i < board.length; i++){
			    var arr = new Array();
				for (var j = 0; j < board.length; j++){
				    arr.push(new Board(i,j,board[i][j]));
				}
				A.push(arr);
			}
			//create second for loop to check every vertex with same token
			for (var i = 0; i < board.length ;i++){
				for (var j=0; j < board.length ;j++){
					if (j+1 < board.length){
						if (A[i][j].token == (A[i][j+1].token)){
							addNeighbour(A[i][j],A[i][j+1]);
						}
						if (A[i][j+1].token == 0){
						    A[i][j].liberties++;
						}
					}
					if (i+1 < board.length){
						if (A[i][j].token == (A[i+1][j].token)){
							addNeighbour(A[i][j],A[i+1][j]);
						}
						if (A[i+1][j].token == 0){
						    A[i][j].liberties++;
						}
					}	
					if (j-1 >= 0){	
						if (A[i][j].token ==(A[i][j-1].token)){
							addNeighbour(A[i][j],A[i][j-1]);
						}
						if (A[i][j-1].token == 0){
						    A[i][j].liberties++;
						}
					}	
					if (i-1 >= 0){	
						if (A[i][j].token ==(A[i-1][j].token)){
							addNeighbour(A[i][j],A[i-1][j]);
						}
						if (A[i-1][j].token == 0){
						    A[i][j].liberties++;
						}
					}	
					
							
				}
			}
			
			return A;
	 }
	
/**
 * Flood Fills on the armies adjacent to the placed token
 * to check if the placed token completely surrounded another
 * army and killed it.
 *
 * @param Board {Board object} The Board to Flood Fill on
 * @param positions {int Array} Array to store the killed position
 *
 * @returns {int} 0 if no armies killed; 1 if at least 1 was killed
 */	
function FloodFillBFSForDeath(Board,positions){
	
	//Object to store the positions killed
	function positionKilled (row,column){
		this.row = row,
		this.column = column
	}
	
	var position_floodFill = []
    
	var kill;
    var queue = [];
    if (Board.liberties > 0){
    	//If it gets in here then no army was killed
    	kill = 0;
    	return 0;
    } else {
    	queue.push(Board);
    }
    Board.visited = true;
    //console.log("visited  " + Board.x + " , " + Board.y); //debugging purposes
    position_floodFill.push(new positionKilled(Board.x, Board.y));
    while (queue.length != 0){
        var r = queue.pop();
        for (var i = 0; i < r.neighbour.length; i++){
            if(r.neighbour[i].visited == false){
                r.neighbour[i].visited = true;
                //console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y); //debugging purposes
                if (r.neighbour[i].liberties > 0){
                	//If it gets in here then no army was killed
                    kill = 0;
                    return 0;
                }
                position_floodFill.push(new positionKilled(r.neighbour[i].x, r.neighbour[i].y));
                queue.push(r.neighbour[i]);
            }
        }//end for
    }//end while

    //
    if (kill == 0){
    	//Nothing was killed
    } else {
    	//Push into the positions array passed by the caller
    	for (var i = 0; i < position_floodFill.length; i++){
    		positions.push(position_floodFill[i]);
    	}
    	//Army was killed so report the death to caller
    	return 1;
    }
    
}
	
/**
 * check Adjacent Tokens of a given position
 *
 * @param A {Board object} The Board object to check adjacent Tokens of 
 * @param tokens {tokens object} object to count number of different tokens 
 * @param position {int position} Position to check
 *
 */	
	function checkAdjacentTokens(A, tokens,position){
	    if (position.column+1 < A.length){
		    if (A[position.row][position.column+1].visited == false){
				if (A[position.row][position.column+1].token == 1){
					A[position.row][position.column+1].visited = true;
				    tokens.one++;
				} else if (A[position.row][position.column+1].token == 2){
					A[position.row][position.column+1].visited = true;
					tokens.two++;
				}
			}
	    }
		if (position.row+1 < A.length){
			if (A[position.row+1][position.column].visited == false){
				if (A[position.row+1][position.column].token == 1){
					A[position.row+1][position.column].visited = true;
				   tokens.one++;
				} else if (A[position.row+1][position.column].token == 2){
					A[position.row+1][position.column].visited = true;
					tokens.two++;
				}
			}
		}	
		if (position.column-1 >= 0){	
			if (A[position.row][position.column-1].visited == false){
				if (A[position.row][position.column-1].token == 1){
					A[position.row][position.column-1].visited = true;
				    tokens.one++;
				} else if (A[position.row][position.column-1].token == 2){
					A[position.row][position.column-1].visited = true;
					tokens.two++;
				}
			}
		}	
		if (position.row-1 >= 0){	
			if (A[position.row-1][position.column].visited == false){
				if (A[position.row-1][position.column].token == 1){
					A[position.row-1][position.column].visited = true;
				    tokens.one++;
				} else if (A[position.row-1][position.column].token == 2){
					A[position.row-1][position.column].visited = true;
					tokens.two++;
				}
			}
		}
	}
	

/**
 * Flood fill with an extra token checker to add score if area is undisputed
 *
 * @param Board {Board object} The Board to add neighbour 
 * @param neighbour {Board object} The neighbour to add to the board
 *
 */	
	function FloodFillBFSArea(x,y,board, B,score){
		var A = getNeighbours(board);
		var Board = A[x][y];
		var tokens = {one: 0, two: 0}
		var position = {row: 0, column: 0}
		var visits = 0;
	    var queue = [];
	    queue.push(Board);
	    Board.visited = true;
	    B[x][y].visited = true;
	    visits++;
	    position.row = Board.x;
	    position.column = Board.y;
	    checkAdjacentTokens(A,tokens,position);
	    while (queue.length != 0){
	        var r = queue.pop();
	        for (var i = 0; i < r.neighbour.length; i++){
	            if(r.neighbour[i].visited == false){
	                r.neighbour[i].visited = true;
	                B[r.neighbour[i].x][r.neighbour[i].y].visited = true;
	                //console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y); //debuggin purposes
	                visits++;
	                position.row = r.neighbour[i].x;
	                position.column = r.neighbour[i].y;
	                //Call helper functions to check which tokens are adjacent in order to determine dispute between areas
	                checkAdjacentTokens(A,tokens,position);
	                queue.push(r.neighbour[i]);
	            }
	        }
	      
	    }
	    if (tokens.one == 0){
	    	//Area is controlled by player two
	    	score.player2 += visits;
	    } else if (tokens.two == 0){
	    	//Area is controlled by player one
	    	score.player1 += visits;
	    } else {
	    	//Area is disputed	
	    }
	}
	
/**
 * Check if a token placed at a positions is a suicidal move
 *
 * @param board {2D int array} The current board 
 * @param position {object} position of token being placed
 * @param numArmiesKilled {int} number of armies killed, if any
 *
 * @returns {boolean} true if its a suicide, false if its not
 */	
	function isSuicide(board, position,numArmiesKilled){
		console.log("num armies killed are " + numArmiesKilled);
		var A = getNeighbours(board);
		var B = getNeighbours(board);
		var C = getNeighbours(board);
		var D = getNeighbours(board);
		var positions = [];
		//If the position has any liberties then it is not a suicide
		if (A[position.row][position.column].liberties > 0){
			return false;
		}
		
		//If the positions has no liberties, it has not killed anything and it has no neighbours (tokens of same color) its a suicide
		if (A[position.row][position.column].liberties == 0  && numArmiesKilled == 0 && A[position.row][position.column].neighbour.length == 0){
			return true;	
		} else  if (A[position.row][position.column].neighbour.length > 0){
		    //May be trying to commit suicide but has neighbours, so the army can have liberties
		    //The 4 ifs will check every adjacent token of the samel color, do a FloodFill and try to find liberties on one of them
		    //if it does then the move is not suicidal, else it is
				if (position.column+1 < A.length){
				    if (A[position.row][position.column+1].token == A[position.row][position.column].token){
				    	if(A[position.row][position.column+1].liberties > 0){
				    		return false;
				    	} else  if(FloodFillBFSForDeath(A[position.row][position.column+1],positions)==0){
				    		return false;
				    	}
					
					}
	    		}
				if (position.row+1 < A.length){
					if (B[position.row+1][position.column].token == B[position.row][position.column].token){
						if(B[position.row+1][position.column].liberties > 0){
							return false;
						} else if (FloodFillBFSForDeath(B[position.row+1][position.column],positions)== 0){
							return false;
						}
					}
				}	
				if (position.column-1 >= 0){	
					if (C[position.row][position.column-1].token == C[position.row][position.column].token){
						if(C[position.row][position.column-1].liberties > 0){
							return false;
						} else if (FloodFillBFSForDeath(C[position.row][position.column-1],positions == 0)){
							return false;
						}
					}
				}	
				if (position.row-1 >= 0){	
					if (D[position.row-1][position.column].token == D[position.row][position.column].token){
						if(D[position.row-1][position.column].liberties > 0){
							return false;
						} else if (FloodFillBFSForDeath(D[position.row-1][position.column],positions) == 0){
							return false;
						}
					}
				}

		} else {
			//a Suicidal move, return true
		 	return true;
		}
	}
	
	function isKO(board, prevBoard){
		if (arraysIdentical(board,prevBoard)){
			//KO 
			return  true;
		} else {
			//not KO
			return false;
		}
	}
	
/**
 * Checks if a token placed in a position will kill any armies
 *
 * @param positon {object} Position of token being placed 
 * @param board {2D int array} The current board
 *
 * @returns {object array} Array containing row and column positions of killed tokens
 */	
function checkDeath(position, board){
	
	//Function to create a positionKilled object
	function positionKilled (row,column){
		this.row = row,
		this.column = column
	}

	var positions = [];
	//console.log("checking if token " + board[position.row][position.column].token + " placed at row: " + position.row + " column: " + position.column + " killed something in board"); //debugging purposes
	
	//The following if statements will do a Flood fill on every adjacent token to check if it exhausted all of its liberties, if it did the positions of dead are added to the array
    if (position.column+1 < board.length){
    	var A = getNeighbours(board);
	    if (A[position.row][position.column].token != A[position.row][position.column+1].token && A[position.row][position.column+1].token != 0){
			if (A[position.row][position.column+1].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row][position.column+1],positions);
			} else if (A[position.row][position.column+1].liberties == 0){
				positions.push(new positionKilled(position.row, position.column+1));
			}
		}
    }
	if (position.row+1 < board.length){
		var A = getNeighbours(board);
		if (A[position.row][position.column].token != A[position.row+1][position.column].token && A[position.row+1][position.column].token != 0){
			if (A[position.row+1][position.column].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row+1][position.column],positions);
			} else if (A[position.row+1][position.column].liberties == 0){
				positions.push(new positionKilled(position.row+1, position.column));
			}
		}
	}	
	if (position.column-1 >= 0){
		var A = getNeighbours(board);
		if (A[position.row][position.column].token != A[position.row][position.column-1].token && A[position.row][position.column-1].token != 0){
		    if (A[position.row][position.column-1].neighbour.length != 0){
		        FloodFillBFSForDeath(A[position.row][position.column-1],positions);
		    } else if(A[position.row][position.column-1].liberties == 0){
		    	positions.push(new positionKilled(position.row, position.column-1));
		    }
		}
	}	
	if (position.row-1 >= 0){
		var A = getNeighbours(board);
		if (A[position.row][position.column].token != A[position.row-1][position.column].token && A[position.row-1][position.column].token != 0){
			if (A[position.row-1][position.column].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row-1][position.column],positions);
			} else if(A[position.row-1][position.column].liberties == 0){
				positions.push(new positionKilled(position.row-1, position.column));
			}
		}
	}

	return positions;
    
}

/**
 * Validadtes a Move (Check death should be called before this)
 *
 * @param board {2D int array} The current board 
 * @param previousBoard {2D int array} The previous board
 * @param position {object} Position of token trying to be placed
 * @param numArmiesKilled {int} Number of armies killed 
 *
 * @returns {int} 2 for suicide, 1 for KO 0 for valid
 */	
	function validate(board, previousBoard, position,numArmiesKilled){ //add previous board here to check against ko for previous state
	    
	    if (isSuicide(board, position,numArmiesKilled)){
	    	return 1; //move is a suicide
	    } else if(isKO(board, previousBoard)) {
	    	return 2; //move will produce KO 
	    } else {
	    	return 0; //move is valid
	    }
	    
	}
	
/**
 * Gets the scoring of a board, based on stone scoring variant
 *
 * @param board {2D int array} The board to be scored
 * 
 * @returns {object} Object containing player 1 and player 2 score
 *
 */
	function stoneScoring(board){
		
		//Object to store player 1 and player 2 score
		var score = {player1: 0, player2: 0};
	
		for(var i=0;i<board.length;i++){
			for(var j=0;j<board.length;j++){
				if(board[i][j]==1){
					score.player1++;
				}
				if(board[i][j]==2){
					score.player2++;
				}
			}
		}
		
		return score; 
	
	}
	
/**
 * Gets the scoring of a board, based on area scoring variant
 *
 * @param board {2D int array} The board to be scored 
 *
 * @returns {object} object containing player 1 and player 2 score
 *
 */	
	function areaScoring(board){
		var B = getNeighbours(board);
		var score = {player1: 0, player2: 0};
		
		//Check the whole board on each position not visited
		for (var i =0; i <board.length; i++){
			for(var j=0; j < board.length; j++){
				if (B[i][j].token == 0 && B[i][j].visited == false){
					FloodFillBFSArea(i,j,board,B, score);
				}
			}
		}
		return score;
	}
	

/**
 * Checks if two 2D arrays a and b are identical
 *
 * @param a {2D int array} The first 2d array to be checked 
 * @param b {2D int array} The second 2d array to be checked
 *
 */	
	function arraysIdentical(a, b){
	    
	    for(var i = 0; i < a.length; i++){
	        for(var j = 0; j < a.length; j++){
	            if(a[i][j] != b[i][j]){
	                return false;
	            }
	        }
	    }
	    
	    return true;
	}


//Eports every function to be used by server.js 
module.exports = 
{
	arraysIdentical : arraysIdentical,
	isKO:isKO,
	getNeighbours : getNeighbours,
	FloodFillBFSForDeath: FloodFillBFSForDeath,
	FloodFillBFSArea:FloodFillBFSArea,
	stoneScoring : stoneScoring,
	areaScoring : areaScoring,
	checkDeath : checkDeath,
	validate : validate
}
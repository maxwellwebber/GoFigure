/*
var testBoard = [
                [0,0,1,0,0,0,0,0,0],
                [0,0,1,0,0,0,0,0,0],
                [1,1,1,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,2,2,2],
                [0,0,0,0,0,0,2,0,0],
                [0,0,0,0,0,0,2,0,0]
];
*/
  
//console.log(testBoard);

function Board (x,y,token)  {
    this.neighbour = [],
    this.liberties = 0,
    this.x = x ,
    this.y = y,
    this.token = token,
    this.degree = 0,
    this.visited = false
}



function addNeighbour(Board,neighbour){
    Board.neighbour.push(neighbour);
    Board.degree++;
}

function removeNeighbour(Board, neighbour){
    Board.neighbour.remove(neighbour);
    Board.degree--;
}


                

function getNeighbours(board,position){
    var A = [];
    //console.log(A[0][0]);
    //console.log(A);
 		//nested for loop to fill every single cell of the array with a Board object
		for (var i = 0; i < board.length; i++){
		    //console.log(A[i][j]);
		    var arr = new Array();
			for (var j = 0; j < board.length; j++){
			    //console.log("i is " + i + " j is " + j);
			    arr.push(new Board(i,j,board[i][j]));
				//console.log(A[i][j]);
			}
			A.push(arr);
		}
		//console.log(A[2][0]);
		//console.log(A[0][0]);
	    //console.log(A[2][0].token);
		//create second for loop to check every vertex with same token
		//for neighbours
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
		
		

		
		
		//if we get here there should be no KO, or Suicide or trying to place in same position
		
		//check if killed something by placing the token
		
		//console.log(A[position.row][position.column]);
		//console.log(A[5][4]);
		//checkDeath(A,position,board);
		
		return A;
		
		
		//getScore
		//console.log(A[position.x][position.y]);
        //FloodFillBFS(A[position.x][position.y]);
        //var i = 0;
        //console.log(A[i][0].neighbour[i].visited);
 }



function FloodFillBFS(Board){
    console.log(Board);
    var queue = [];
    queue.push(Board);
    Board.visited = true;
    //console.log(Board);
    console.log("visited " + Board.x + " , " + Board.y);
    while (queue.length != 0){
        var r = queue.pop();
        //console.log(r);
        //console.log(queue.length);
        for (var i = 0; i < r.neighbour.length; i++){
            //console.log(i);
            if(r.neighbour[i].visited == false){
                r.neighbour[i].visited = true;
                console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y);
                queue.push(r.neighbour[i]);
            }
        }    
    }
}

function FloodFillBFSForDeath(Board){
    //console.log(Board);
    var queue = [];
    queue.push(Board);
    Board.visited = true;
    //console.log(Board);
    console.log("visited " + Board.x + " , " + Board.y);
    while (queue.length != 0){
        var r = queue.pop();
        //console.log(r);
        //console.log(queue.length);
        for (var i = 0; i < r.neighbour.length; i++){
            //console.log(i);
            if(r.neighbour[i].visited == false){
                r.neighbour[i].visited = true;
                console.log("visited " + r.neighbour[i].x + " , " + r.neighbour[i].y);
                if (r.neighbour[i].liberties >= 1){
                    console.log("WILL NOT KILL ARMY");
                    return;
                }
                queue.push(r.neighbour[i]);
            }
        }//end for
    }//end while
    
    console.log("ARMY IS DEAD");
}


function checkSuicide(A,position){
	if (A[position.row][position.column].liberties == 0 && A[position.row][position.column].neighbour.length == 0){
	    //trying to commit suicide
	    console.log("suicide (Return some error)");
	    return;
	}
}

function checkKO(board, prevBoard){
	if (board == prevBoard){
		return ("KO KO KO KO KO!!!!");
	}
}


function checkDeath(A, position, board){
	//console.log(A[position.row][position.column].token != A[position.row][position.column-1].token);
    if (position.column+1 < board.length){
	    if (A[position.row][position.column].token != A[position.row][position.column+1].token && A[position.row][position.column+1].token != 0){
	        //console.log(A[position.row][position.column+1].token);
			//addNeighbour(A[i][j],A[i][j+1]);
			if (A[position.row][position.column+1].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row][position.column+1]);
			}
		}
    }
	if (position.row+1 < board.length){
		if (A[position.row][position.column].token != A[position.row+1][position.column].token && A[position.row+1][position.column].token != 0){
		    console.log(A[position.row+1][position.column].token);
			//addNeighbour(A[i][j],A[i+1][j]);
			if (A[position.row+1][position.column].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row+1][position.column]);
			}
		}
	}	
	if (position.column-1 >= 0){	
		if (A[position.row][position.column].token != A[position.row][position.column-1].token && A[position.row][position.column-1].token != 0){
		    console.log(A[position.row][position.column-1].token);
			//addNeighbour(A[i][j],A[i][j-1]);
		    if (A[position.row][position.column-1].neighbour.length != 0){
		        FloodFillBFSForDeath(A[position.row][position.column-1]);
		    }
		}
	}	
	if (position.row-1 >= 0){	
		if (A[position.row][position.column].token != A[position.row-1][position.column].token && A[position.row-1][position.column].token != 0){
		    //console.log(A[position.row-1][position.column-1]);
			//addNeighbour(A[i][j],A[i-1][j]);
			if (A[position.row-1][position.column].neighbour.length != 0){
			    FloodFillBFSForDeath(A[position.row-1][position.column]);
			}
		}
	}	
    
}

function validateMove(board,position){ //add previous board here to check against ko for previous state
    
    //console.log(board[position.row][position.column]);
    var A = getNeighbours(board,position);
    console.log(A[position.row][position.column]);
    checkSuicide(A);
	//checkKO
    checkDeath(A,position,board);
}

function getScore(board){
	//if stoneScoring
	stoneScoring(board);
	
	//if armyscoring
	areaScoring(board);//undisputed liberties no substraction
	
	//if territory scoring
	territoryScoring();//undisputed liberties - death armies 
    
}

function stoneScoring(board){
	
	var playerOne = 0;
	var playerTwo = 0;
	
	for(i=0;i<board.length;i++){
		for(j=0;j<board.length;j++){
			if(board[i][j]==1){
				playerOne++;
			}
			if(board[i][j]==2){
				playerTwo++;
			}
		}
	}
	
	if(playerOne>playerTwo){
		return 1;
	}
	else{
		return 2;
	}

}



function areaScoring(board){
	
}

function territoryScoring(board){
	
}
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
  
console.log(testBoard);

function Board (x,y,token)  {
    this.neighbour = [],
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


                

function getNeighbours(board){
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
				}
				if (i+1 < board.length){
					if (A[i][j].token == (A[i+1][j].token)){
						addNeighbour(A[i][j],A[i+1][j]);
					}
				}	
				if (j-1 >= 0){	
					if (A[i][j].token ==(A[i][j-1].token)){

						addNeighbour(A[i][j],A[i][j-1]);
					}
				}	
				if (i-1 >= 0){	
					if (A[i][j].token ==(A[i-1][j].token)){
						addNeighbour(A[i][j],A[i-1][j]);
					}
				}	
				
						
			}
		}
		console.log(A[0][0]);
        FloodFillBFS(A[0][0]);
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
        var test = queue.pop();
        //console.log(test);
        //console.log(queue.length);
        for (var i = 0; i < test.neighbour.length; i++){
            //console.log(i);
            if(test.neighbour[i].visited == false){
                test.neighbour[i].visited = true;
                console.log("visited " + test.neighbour[i].x + " , " + test.neighbour[i].y);
                queue.push(test.neighbour[i]);
            }
        }    
    }
    /*
    while (queue.size != 0){
        console.log(queue[0]);
        var test = queue.pop();
        console.log(test);
        var i = 0;
        /*
        for(; i < r.neighbour.length; i++){
            //console.log(i);
            //console.log(Board.neighbour[i].visited);
            
            if(Board.neighbour[i].visited){
                r.neighbour[i].visited = true;
                queue.push(r.neighbour[i]);
            }
            
        }
        */
    //}
}



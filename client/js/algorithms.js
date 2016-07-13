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
                

var Board = {
    neighbour : [],
    x : 0 ,
    y : 0,
    token : 0,
    degree : 0,
    visited : false
};

function addNeighbour(object,neighbour){
    object.push(neighbour);
    object.degree++;
}

function removeNeighbour(object, neighbour){
    object.remove(neighbour);
    object.degree--;
}


                
console.log(testBoard);

function getNeighbours(board){
    var A = new Board [9][9];
        A.x = board.length;
        A.y = board.length;
 		//nested for loop to fill every single cell of the array with a vertex
		for (var i= 0; i < board.length i++){
			for (var j=0; j < board.length; j++){
				//System.out.println("imagePixels color is "+ imagePixels[i][j]);
				A[i][j] = board[i][j];
			}
		}
		//create second for loop to check every vertex with same color
		//for neighbours
		for (var i = 0; i < board.length i++){
			for (var j=0; j < board.length j++){
				//System.out.println("color is " + A[i][j].color);
				if (j+1 < board.length{
					if (A[i][j] == (A[i][j+1])){
						//System.out.println("in if");
						A[i][j].addNeighbour(A[i][j+1]);
					}
				}
				if (i+1 < getWidth()){
					if (A[i][j] == (A[i+1][j])){
						//System.out.println("in if");
						A[i][j].addNeighbour(A[i+1][j]);
					}
				}	
				if (j-1 >= 0){	
					if (A[i][j]==(A[i][j-1])){
						///System.out.println("in if");
						A[i][j].addNeighbour(A[i][j-1]);
					}
				}	
				if (i-1 >= 0){	
					if (A[i][j]==(A[i-1][j])){
						//System.out.println("in if");
						A[i][j].addNeighbour(A[i-1][j]);
					}
				}	
				
						
			}
		}
    
    
 }



function FloodFillBFS(boardIn, position){
    var board = boardIn;
    var queue = [];
    queue.push(position);
    boardIn[position.x][position.y] = 3; //visited
    while (queue.size){
        var r = queue.pop();
        for(var i =0; i < r.getNeighbours())
    }
}
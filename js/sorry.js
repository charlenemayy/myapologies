// Index Key:
// 0 - 59: Outer Squares
// 60 - 63: Start (G, R, B, Y)
// 64 - 69: Safety Zone + Home (G)
// 70 - 75: Safety Zone + Home (R)
// 76 - 81: Safety Zone + Home (Y)
// 81 - 86: Safety Zone + Home (B)
var StartBoardPieces = 
[
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

 [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], 

 0, 0, 0, 0, 0, [0, 0, 0, 0], 
 0, 0, 0, 0, 0, [0, 0, 0, 0], 
 0, 0, 0, 0, 0, [0, 0, 0, 0], 
 0, 0, 0, 0, 0, [0, 0, 0, 0], 
];

var index = 0;
var curMove;

	function playMove()
	{	
		// Parses iteratively through shuffled list
		if(index > 45)
		{
			console.log('End of stack... Re-stacking cards')

			shuffleCards();
			index = 0;
		}

		//curMove = cardValues[index];
		curMove = 1;

		switch(curMove)
		{	
			// Implement skip move
			case 1:
				console.log('Move a pawn from Start, or move a pawn one space forward')
				break;
			case 2:
				console.log('Move a pawn from Start, or move a pawn two spaces forward. DRAW AGAIN')
				break;
			case 3:
				console.log('Move a pawn three spaces forward')
				break;
			case 4:
				console.log('Move a pawn four spaces backward')
				break;
			case 5:
				console.log('Move a pawn five spaces forward')
			case 7:
				console.log('Move one pawn seven spaces forward, or split the seven spaces between two pawns')
				console.log('Ex. Move four spaces for one pawn, and three for another')
				console.log('Cannot be used to move a pawn out of Start. The entire seven spaces must be used')
				break;
			case 8:
				console.log('Move a pawn eight spaces forward')
			case 10:
				console.log('Move a pawn ten spaces forward or one space backward. If none of your pawns can move forward 10 spaces, you must move backward')
				break;
			case 11:
				console.log('Move eleven spaces forward, or switch places with an opponents pawn.')
				break;					
			case 12:
				console.log('Move a pawn 12 spaces forward')
				break;
			case 13:
				console.log('Sorry!')
				console.log('Take any one pawn from Start and move it to a square occupied by any opponents pawn and push it back to Start')
				break;
		}

		index++;
	}
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

	var movelist = [];
	function getLegalMoves( piece )
	{

		// Get location from piece value
		console.log('piece: ' + piece)
		var spot = piecePosition[piece];

		movelist = [];

		// Legal moves depend on the current card drawn
		switch(curMove)
		{
			case 1:
				switch(spot)
				{	
					// Piece is below its safety zone
					case 2:
						// Green 
						if(piece >= 4 && piece < 8)
							movelist.push(64);
						else
							movelist.push(spot + 1);
						break;
					case 17:
						// Red
						if(piece >= 0 && piece < 4)
							movelist.push(71);
						else
							movelist.push(spot + 1);
						break;
					case 32:
						// Blue
						if(piece >= 8 && piece < 12)
							movelist.push(76);
						else
							movelist.push(spot + 1);
						break;
					case 47:
						// Yellow
						if(piece >= 12 && piece < 16)
							movelist.push(81);
						else
							movelist.push(spot + 1);
						break;

					// Piece is in start
					case 60:
						movelist.push(4);
						break;
					case 61:
						movelist.push(19);
						console.log('its red')
						break;
					case 62:	
						movelist.push(34);
						console.log('its blue')
						break;
					case 63:
						movelist.push(49);
						console.log('its yellow')
						break;

					// Every other spot
					default:
						movelist.push(spot + 1);
						break;
				}

			break;
		}
	}
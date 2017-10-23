// Index Key:
// 0 - 59: Outer Squares
// 60 - 63: Start (G, R, B, Y)
// 64 - 69: Safety Zone + Home (G)
// 70 - 75: Safety Zone + Home (R)
// 76 - 81: Safety Zone + Home (Y)
// 81 - 86: Safety Zone + Home (B)

// 45 cards total
var cardValues = [1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,
		 5,5,5,5,7,7,7,7,8,8,8,8,10,10,10,10,
		 11,11,11,11,12,12,12,12,13,13,13,13];

var index = 0;
var curMove;

	function playMove()
	{	
		cardDrawn = true;
		console.log('card drawn');

		// Parses iteratively through shuffled list
		if(index > 44)
		{
			console.log('End of stack... Re-stacking cards')

			shuffleCards();
			index = 0;
		}

		//curMove = cardValues[index];
		curMove = 12;

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
				break;
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
		//console.log('piece: ' + piece)
		var spot = piecePosition[piece];

		movelist = [];

		// Legal moves depend on the current card drawn

		// Pieces are in start
		if(spot >= 60 && spot < 64)
		{
			if(curMove != 1 && curMove != 2)
			{
				movelist.push(-1);
				return;
			}
			else
			{
				switch(spot)
				{
					case 60:
						movelist.push(4);
						break;
					case 61:
						movelist.push(19);
						break;
					case 62:	
						movelist.push(34);
						break;
					case 63:
						movelist.push(49);
						break;
				}
			}

			return;
		}

		switch(curMove)
		{
			case 1:
				switch(spot)
				{	
					// Piece is below/in its safety zone
					case 2:
						// Green 
						if(piece >= 4 && piece < 8)
							movelist.push(64);
						else
							movelist.push(spot + 1) % 60;
						break;
					case 17:
						// Red
						if(piece >= 0 && piece < 4)
							movelist.push(70);
						else
							movelist.push(spot + 1) % 60;
						break;
					case 32:
						// Blue
						if(piece >= 8 && piece < 12)
							movelist.push(76);
						else
							movelist.push(spot + 1) % 60;
						break;
					case 47:
						// Yellow
						if(piece >= 12 && piece < 16)
							movelist.push(81);
						else
							movelist.push(spot + 1) % 60;
						break;

					// Every other spot
					default:
						movelist.push(spot + 1) % 60;
						break;
				}
			break; // Case 1

			case 2:
				// Piece below safety zone
				// Green Piece
				if(piece >= 4 && piece < 8)
				{
					if(spot < 3 && spot > 0)
						movelist.push(2 - (2 - spot) + 63);
					else if(spot > 67)
						movelist.push(-1);
					else
						movelist.push((spot + 2) % 60);
				}
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot < 18 && spot > 15)
						movelist.push(2 - (17 - spot) + 69);
					else if(spot > 73)
						movelist.push(-1);
					else
						movelist.push((spot + 2) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot < 33 && spot > 30)
						movelist.push(2 - (32 - spot) + 75);
					else if(spot > 79)
						movelist.push(-1);
					else
						movelist.push((spot + 2) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot < 48 && spot > 45)
						movelist.push(2 - (47 - spot) + 80);
					else if(spot > 84)
						movelist.push(-1);
					else
						movelist.push((spot + 2) % 60);
				}

			break; // case 2

			case 3:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{
					if(spot >= 0 && spot < 3)
						movelist.push(3 - (2 - spot) + 63);
					else if(spot > 66)
						movelist.push(-1);
					else
						movelist.push((spot + 3) % 60);
				}				
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 15 && spot < 18)
						movelist.push(3 - (17 - spot) + 69);
					else if(spot > 72)
						movelist.push(-1);
					else
						movelist.push((spot + 3) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 30 && spot < 33)
						movelist.push(3 - (32 - spot) + 75);
					else if(spot > 78)
						movelist.push(-1);
					else
						movelist.push((spot + 3) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 45 && spot < 48)
						movelist.push(3 - (47 - spot) + 80);
					else if(spot > 83)
						movelist.push(-1);
					else
						movelist.push((spot + 3) % 60);
				}

			break;

			case 4:
				// Safety Zones
				// Green Piece
				if(piece >= 4 && piece < 8)
				{
					if(spot >= 64 && spot < 68)
					{
						movelist.push(-1);
						return;
					}
				}				
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 70 && spot < 74)
					{
						movelist.push(-1);
						return;
					}
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 76 && spot < 80)
					{
						movelist.push(-1);
						return;
					}
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 81 && spot < 85)
					{
						movelist.push(-1);
						return;
					}
				}

				if(spot - 4 < 0)
				{
					movelist.push(60 + (spot - 4));
					return;
				}

				movelist.push(spot - 4);
			break;

			case 5:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{
					if(spot == 59 || spot == 58 || (spot >= 0 && spot < 3))
						movelist.push(5 - (2 - spot) + 63);
					else if(spot > 64)
						movelist.push(-1);
					else
						movelist.push((spot + 5) % 60);
				}				
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 13 && spot < 18)
						movelist.push(5 - (17 - spot) + 69);
					else if(spot > 70)
						movelist.push(-1);
					else
						movelist.push((spot + 5) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 28 && spot < 33)
						movelist.push(5 - (32 - spot) + 75);
					else if(spot > 76)
						movelist.push(-1);
					else
						movelist.push((spot + 5) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 43 && spot < 48)
						movelist.push(5 - (47 - spot) + 80);
					else if(spot > 81)
						movelist.push(-1);
					else
						movelist.push((spot + 5) % 60);
				}
					
			break;

			case 8:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{	
					// Can enter safety zone
					if(spot >= 55 && spot < 60)
					{
						movelist.push(8 - ((2 + 60) - spot) + 63)
					}
					else if(spot == 0)
					{
						movelist.push(69);
					}
					// Too close to enter safety zone
					else if(spot == 1 || spot == 2 || (spot >= 64 && spot < 69))
						movelist.push(-1);
					else
						movelist.push((spot + 8) % 60);

				}
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 10 && spot <= 15)
						movelist.push(8 - (17 - spot) + 69);
					else if((spot > 15 && spot <= 17) || spot > 69)
						movelist.push(-1);
					else
						movelist.push((spot + 8) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 25 && spot <= 30)
						movelist.push(8 - (32 - spot) + 75);
					else if((spot > 30 && spot <= 32) || spot > 70)
						movelist.push(-1);
					else
						movelist.push((spot + 8) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 40  && spot <= 45)
						movelist.push(8 - (47 - spot) + 80);
					else if((spot > 45 && spot <= 47) || spot > 76)
						movelist.push(-1);
					else
						movelist.push((spot + 8) % 60);
				}
			break;

			case 10:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{	
					// Can enter safety zone
					if(spot >= 53 && spot < 58)
					{
						movelist.push(10 - ((2 + 60) - spot) + 63)
					}
					// Too close to enter safety zone
					else if((spot >= 0 && spot < 3) || (spot >= 58 && spot < 69))
						movelist.push(-1);
					else
						movelist.push((spot + 10) % 60);

				}
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 8 && spot <= 13)
						movelist.push(10 - (17 - spot) + 69);
					else if((spot > 13 && spot <= 17) || spot > 69)
						movelist.push(-1);
					else
						movelist.push((spot + 10) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 23 && spot <= 28)
						movelist.push(10 - (32 - spot) + 75);
					else if((spot > 28 && spot <= 32) || spot > 70)
						movelist.push(-1);
					else
						movelist.push((spot + 10) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 38  && spot <= 43)
						movelist.push(10 - (47 - spot) + 80);
					else if((spot > 43 && spot <= 47) || spot > 76)
						movelist.push(-1);
					else
						movelist.push((spot + 10) % 60);
				}
			break;

			case 11:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{	
					// Can enter safety zone
					if(spot >= 52 && spot < 57)
					{
						movelist.push(11 - ((2 + 60) - spot) + 63)
					}
					// Too close to enter safety zone
					else if((spot >= 0 && spot < 3) || (spot >= 57 && spot < 69))
						movelist.push(-1);
					else
						movelist.push((spot + 11) % 60);

				}
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 7 && spot <= 12)
						movelist.push(11 - (17 - spot) + 69);
					else if((spot > 12 && spot <= 17) || spot > 69)
						movelist.push(-1);
					else
						movelist.push((spot + 11) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 22 && spot <= 27)
						movelist.push(11 - (32 - spot) + 75);
					else if((spot > 27 && spot <= 32) || spot > 70)
						movelist.push(-1);
					else
						movelist.push((spot + 11) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 37  && spot <= 42)
						movelist.push(11 - (47 - spot) + 80);
					else if((spot > 42 && spot <= 47) || spot > 76)
						movelist.push(-1);
					else
						movelist.push((spot + 11) % 60);
				}
			break;

			case 12:
				// Green Piece
				if(piece >= 4 && piece < 8)
				{	
					// Can enter safety zone
					if(spot >= 51 && spot < 56)
					{
						movelist.push(12 - ((2 + 60) - spot) + 63);
					}
					// Too close to enter safety zone
					else if((spot >= 0 && spot < 3) || (spot >= 56 && spot < 69))
						movelist.push(-1);
					else
						movelist.push((spot + 12) % 60);
				}
				// Red Piece
				else if(piece >= 0 && piece < 4)
				{
					if(spot >= 6 && spot <= 11)
						movelist.push(12 - (17 - spot) + 69);
					else if((spot > 11 && spot <= 17) || spot > 69)
						movelist.push(-1);
					else
						movelist.push((spot + 12) % 60);
				}
				// Blue Piece
				else if(piece >= 8 && piece < 12)
				{
					if(spot >= 21 && spot <= 26)
						movelist.push(12 - (32 - spot) + 75);
					else if((spot > 26 && spot <= 32) || spot > 70)
						movelist.push(-1);
					else
						movelist.push((spot + 12) % 60);
				}
				// Yellow Piece
				else if(piece >= 12 && piece < 16)
				{
					if(spot >= 36  && spot <= 41)
						movelist.push(12 - (47 - spot) + 80);
					else if((spot > 41 && spot <= 47) || spot > 76)
						movelist.push(-1);
					else
						movelist.push((spot + 12) % 60);
				}
			break;

		}
	}

	function snapSelectedPieceToSpot( square3 )
	{
		if(selectedobject == null) return;

		var x = spotList[square3].position.x;
		var z = spotList[square3].position.z;

		selectedobject.position.x = x;
		selectedobject.position.z = z;

		console.log(square3)
	}


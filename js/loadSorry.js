	var renderer;
	var scene;
	var camera;
	var plane;

	const RAD = Math.PI / 180; // Degree to radian conversion

	var mouse = new THREE.Vector2();
	var selectedobject = null;
	
	var raycaster = new THREE.Raycaster();
	var projector = new THREE.Projector();
	
	// List of sorry pieces
	var pieceList = [null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null];

	// List of piece locations
	var piecePosition = [61,61,61,61,55,5,60,60,62,62,62,62,45,55,63,63]

	// Check if card is taken
	var cardTaken = [false,false,false,false,false,false,false,false,false,
			 false,false,false,false,false,false,false,false,false,
			 false,false,false,false,false,false,false,false,false,];

	// Array of spots
	var spotList = [];

	// Check if new card has been drawn
	var cardDrawn = false;
	
	function init()
	{
		scene = new THREE.Scene();
		
		setupCamera();
		setupRenderer();
		addSpotLight();
		addPlane();
		loadSounds();
		createText();

		// Output to the stream
		document.body.appendChild( renderer.domElement );
		document.addEventListener( 'keydown', onKeyDown, false );
		
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		
		loadSpots();
		loadPieces();
		createCards();
		shuffleCards();
		
		// Call render
		render();
	}

	function onKeyDown(event)
	{
	  if(event.keyCode == 72){
	    manageHelpPopUp();
	  }

	  if(event.keyCode == 65)
	  {
	    closeInfoPopUp();
	  }
	}

	
	function render()
	{
		// Request animation frame
		requestAnimationFrame( render );
		
		// Call render()
		renderer.render( scene, camera );
	}
	
	function addSpotLight()
	{	
		// y = up & down
		// z = forward & backward
        spotLight = new THREE.SpotLight( 0xffffff, .5 );
        spotLight.position.set( 0, 300, 200 );
        spotLight.shadowCameraNear = 1;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;
        scene.add(spotLight);

        spotLight2 = new THREE.SpotLight( 0xffffff, .5 );
        spotLight2.position.set( 0, 300, -200 );
        spotLight2.shadowCameraNear = 1;
        spotLight2.shadowCameraFar = 50;
        spotLight2.castShadow = true;
        scene.add(spotLight2);

        ambientlight = new THREE.AmbientLight(0xbababa);
        scene.add(ambientlight);
	}

	function createText()
	{
		var text = "Press H for Help";
		var mat = new THREE.MeshLambertMaterial({color:'white'});
		var geo = new THREE.TextGeometry( text, {
	    	font: 'calibri',
	        size: 20,
	        height: .20,
	        curveSegments: 20,
	        bevelEnabled: false,
	        bevelThickness: 5,
	        bevelSize: 0
	   	} );

	   	var text = new THREE.Mesh( geo, mat );
	   	scene.add(text);
	   	 text.rotation.y= 180 * RAD;
	   	 text.position.set(85, 15, 240);

	}
	
	window.onload = init;

	var board;
	function loadSpots()
	{
		var geo = new THREE.CylinderGeometry( 8, 8, 1, 200 );
		var largegeo = new THREE.CylinderGeometry( 27, 27, 1, 200 );
        
        board = new THREE.Object3D;

        // Vertical spots
        for(var i = 0; i < 16; i++)
        {	
        	var mat = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle1 = new THREE.Mesh( geo, mat );
        	circle1.position.set(174.5, .5, -115.5 + (PIECESPACE * i));
        	if(i < 10)
        		circle1.name = "0" + i + "Spot";
        	else
        		circle1.name = i + "Spot";
        	board.add(circle1);
        	spotList[i] = circle1;

        	var mat2 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle2 = new THREE.Mesh( geo, mat2 );
        	circle2.position.set(-174.5, .5, 233.25 - (PIECESPACE * i));
        	circle2.name = (i+30) + "Spot";
        	board.add(circle2);
        	spotList[i+30] = circle2;
        }

        // Horizontal spots
        for(var i = 0; i < 14; i++)
        {	
        	var mat = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: 0.0});
        	var circle1 = new THREE.Mesh( geo, mat );
        	circle1.position.set(151.25 - (PIECESPACE * i), .5, 233.25);
        	circle1.name = (i+16) + "Spot";
        	board.add(circle1);
        	spotList[i+16] = circle1;

        	var mat1 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle2 = new THREE.Mesh( geo, mat1 );
        	circle2.position.set(-151.25 + (PIECESPACE * i), .5, -115.5);
        	circle2.name = (i+46) + "Spot";
        	board.add(circle2);
        	spotList[i+46] = circle2;
        }

        // Initialize safety zones
        for(var i = 0; i < 5; i++)
        {	
        	var mat1 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle = new THREE.Mesh( geo, mat1 );
        	circle.position.set(151.25 - (PIECESPACE * i), .5, -69);
        	circle.name = (i+64) + "Spot";
        	board.add(circle);
        	spotList[i+64] = circle;

        	var mat2 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle1 = new THREE.Mesh( geo, mat2 );
        	circle1.position.set(128, .5, 210 - (PIECESPACE * i));
        	circle1.name = (i+70) + "Spot";
        	board.add(circle1);
        	spotList[i+70] = circle1;

        	var mat3 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        	var circle2 = new THREE.Mesh( geo, mat3 );
        	circle2.position.set(-151.25 + (PIECESPACE * i), .5, 186.75);
        	circle2.name = (i+76) + "Spot";
        	board.add(circle2);
        	spotList[i+76] = circle2;

        	var mat4 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
			var circle3 = new THREE.Mesh( geo, mat4 );
        	circle3.position.set(-127.75, .5, -92 + (PIECESPACE * i));
        	circle3.name = (i+81) + "Spot";
        	board.add(circle3);
        	spotList[i+81] = circle3;
        }


        // Initialize start zones
        var mat1 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        var largecircle = new THREE.Mesh(largegeo, mat1);
    	largecircle.position.set( 134, .5, -22 );
    	largecircle.name = "60Spot-Start";
    	board.add(largecircle);
    	spotList[60] = largecircle;

    	var mat2 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle1 = new THREE.Mesh(largegeo, mat2);
    	largecircle1.position.set( 82, .5, 193 );
    	largecircle1.name = "61Spot-Start";
    	board.add(largecircle1);
    	spotList[61] = largecircle1;

    	var mat3 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle2 = new THREE.Mesh(largegeo, mat3);
    	largecircle2.position.set( -133, .5, 139.5 );
    	largecircle2.name = "62Spot-Start";
    	board.add(largecircle2);
    	spotList[62] = largecircle2;

    	var mat4 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle3 = new THREE.Mesh(largegeo, mat4);
    	largecircle3.position.set( -81.5, 2, -73.5 );
    	largecircle3.name = "63Spot-Start";
    	board.add(largecircle3);
    	spotList[63] = largecircle3;

        // Initialize home zones
        var mat5 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle = new THREE.Mesh(largegeo, mat5);
    	largecircle.position.set( 25, .5, -67.5 );
    	largecircle.name = "69Spot-Home";
    	board.add(largecircle);
    	spotList[69] = largecircle;

    	var mat6 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle1 = new THREE.Mesh(largegeo, mat6);
    	largecircle1.position.set( 128, .5, 85 );
    	largecircle1.name = "75Spot-Home";
    	board.add(largecircle1);
    	spotList[75] = largecircle1;

    	var mat7 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle2 = new THREE.Mesh(largegeo, mat7);
    	largecircle2.position.set( -24, .5, 185 );
    	largecircle2.name = "81Spot-Home";
    	board.add(largecircle2);
    	spotList[81] = largecircle2;

		var mat8 = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
    	var largecircle3 = new THREE.Mesh(largegeo, mat8);
    	largecircle3.position.set( -127, .5, 35 );
    	largecircle3.name = "86Spot-Home";
    	board.add(largecircle3);
    	spotList[86] = largecircle3;

    	scene.add(board);

	}

	function loadPieces()
	{
		for( var i=0; i<4; i++ )
		{
			loadPiece('pawn','r',i);
			loadPiece('pawn','g',i+4);
			loadPiece('pawn','b',i+8);
			loadPiece('pawn','y',i+12);
		}
		setTimeout(waitForPiecesToLoad, 500);
	}
	
	function loadPiece( modelname, color, index )
	{
		// instantiate a loader
		var loader = new THREE.OBJMTLLoader();
		
		// load an obj / mtl resource pair
		loader.load(
			// OBJ resource URL
			'models/' + modelname + '.obj',

			// MTL resource URL	
			'models/' + modelname + color + '.mtl',
			
			// Function when both resources are loaded			// Function when both resources are loaded
			function ( object ) 
			{
				// Added to fix raycasting
				object.castShadow = true;
				object.receiveShadow = true;
				object.scale.set( .3, .3, .3 );
				
				var obj = new THREE.Object3D();
				obj.name = 'Piece';
				object.parent = obj;
				obj.add( object );
				pieceList[index] = obj;

				obj.rotation.x = -(Math.PI/2);
			}
		);
	}

	function waitForPiecesToLoad()
	{
		var allloaded = true;
		for( var i=0; i<16; i++ )
		{
			if( pieceList[i] == null )
			{
				allloaded = false;
				break;
			}
		}
		
		if( !allloaded )
		{
			setTimeout(waitForPiecesToLoad, 500);
		}
		else
		{
			piecesLoaded = true;
			placePieces();
		}
	}
	
	const PIECESPACE = 23.25;
	function placePieces()
	{
		// Position 0, 0 = (175, -21)
		// Difference of 23.25
		// X: left = larger value; right = smaller value
		for( var i=0; i<2; i++ )
		{
			pieceList[i].position.x = 70 + (i * PIECESPACE);
			pieceList[i].position.z = 180;

			pieceList[i+2].position.x = 70 + (i * PIECESPACE);
			pieceList[i+2].position.z = 180 + PIECESPACE;
			
			pieceList[i].name = "0" + i + "Piece-Red";
			pieceList[i+2].name = "0" + (i+2) + "Piece-Red";

			scene.add( pieceList[i] );
			scene.add( pieceList[i+2] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+4].position.x = 120 + (i * PIECESPACE);
			pieceList[i+4].position.z = -33;

			pieceList[i+6].position.x = 120 + (i * PIECESPACE);
			pieceList[i+6].position.z = -33 + PIECESPACE;
			
			pieceList[i+4].name = "0" + (i+4) + "Piece-Green";
			pieceList[i+6].name = "0" + (i+6) + "Piece-Green";
			scene.add( pieceList[i+4] );
			scene.add( pieceList[i+6] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+8].position.x = -142 + (i * PIECESPACE);
			pieceList[i+8].position.z = 130;

			pieceList[i+10].position.x = -142 + (i * PIECESPACE);
			pieceList[i+10].position.z = 130 + PIECESPACE;
			
			pieceList[i+8].name = "0" + (i+8) + "Piece-Blue";
			pieceList[i+10].name = (i+10) + "Piece-Blue";
			scene.add( pieceList[i+8] );
			scene.add( pieceList[i+10] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+12].position.x = -93 + (i * PIECESPACE);
			pieceList[i+12].position.z = -84;

			pieceList[i+14].position.x = -93 + (i * PIECESPACE);
			pieceList[i+14].position.z = -84 + PIECESPACE;
	
			pieceList[i+12].name = (i+12) + "Piece-Yellow";
			pieceList[i+14].name = (i+14) + "Piece-Yellow";
			scene.add( pieceList[i+12] );
			scene.add( pieceList[i+14] );
		}	
	}

	function createCards()
	{	
		var texture = new THREE.ImageUtils.loadTexture("images/sorrycard.JPG");
		var geo = new THREE.BoxGeometry( 30, 10, 50 );
        var mat = new THREE.MeshPhongMaterial({transparent: false, map: texture,opacity: 0.0});
        var cards = new THREE.Mesh( geo, mat );

        cards.position.set(39, 5, 21);
        cards.rotation.y = 45 * RAD;

        cards.name = "Card Stack"

        scene.add(cards);
	}

	function shuffleCards()
	{
		var curIndex = cardValues.length, temp, n;

		// While there remain elements to shuffle...
		while (0 !== curIndex) {

			// Pick a remaining element...
			n = Math.floor(Math.random() * curIndex);
			curIndex -= 1;

			// And swap it with the current element.
			temp = cardValues[curIndex];
			cardValues[curIndex] = cardValues[n];
			cardValues[n] = temp;
		}

		/*
		for(i = 0; i < 45; i++)
			console.log(cardValues[i]);
		*/
	}
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera(45 ,window.innerWidth/window.innerHeight,0.1,1000);
		camera.position.x = 0;
		camera.position.y = 200;
		camera.position.z = -250;
		camera.lookAt(new THREE.Vector3(0,0,0));
	}

	// Original camera controls
	/* function setupCamera()
	{
		camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
		camera.position.x = 0;
		camera.position.y = 200;
		camera.position.z = -250;
		camera.lookAt(new THREE.Vector3(0,0,0));
	} */
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
	}
	
	function addPlane()
	{	
		var texture = new THREE.ImageUtils.loadTexture("images/sorryboard.jpg");
		plane = new THREE.Mesh(new THREE.PlaneGeometry(24*16, 24*16, 10, 10), new THREE.MeshBasicMaterial({transparent: false, map: texture,opacity: 0.0}));
		plane.position.z = 60;
		plane.rotation.x = -(Math.PI/2);
		plane.name = "Plane";
		scene.add( plane );
	}
	
	function onDocumentMouseMove( event ) 
	{
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
		projector.unprojectVector( vector, camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		
		if( selectedobject != null )
		{
			var intersects2 = raycaster.intersectObject(plane);
			selectedobject.position.copy( intersects2[0].point );
		}
	}

	var x,y,z;
	var piece;
	var noValidMoves = false;
	function onDocumentMouseDown( event ) 
	{	
		if(cardDrawn == false)
		// Prevent default action for mouse down
		event.preventDefault();
		
		// Stores mouse location
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );

		// Uses camera projection matrix to transform into 3D space
		projector.unprojectVector( vector, camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length > 0 )
		{	
			var pickedUp = false;

			// Identify object being picked up
			for( var i=0; i<intersects.length; i++ )
			{
				var obj = intersects[i].object;
				var name = obj.name;

				if(name == 'Card Stack')
				{
					playMove();
				}

				// Return if card has not been drawn to prevent pieces moving
				if(cardDrawn == false) return;

				if( name.length == 0 )
				{
					var par = obj.parent;
					name = par.name;

					// Pawn Pieces
					if( name == '' )
					{	
						par = par.parent;
						name = par.name;
						obj = par;
						selectedobject = obj;

						// Get piece number from name
						var str = name.substring( 0, 2 );
						piece = parseInt(str);

						// Original Spot
						selectedSpot = piecePosition[piece];

						// Check if piece is at start
						/*if(piecePosition[piece] >= 60 && piecePosition[piece] < 64)
						{
							selectedSpot = originalPosition[piece];
						}*/

						console.log("piece " + piece + "located at" + piecePosition[piece])
						getLegalMoves(piece);


						// Change color of spots
						for( var j = 0; j < movelist.length; j++ )
						{	
							if(movelist[j] == -1)
							{	
								noValidMoves = true;
								break;
							}
							spotList[movelist[j]].material.transparent = false;
							spotList[movelist[j]].material.color.set(0xff0000);
						}


						//break;
						//check if on slide
					}
					else
					{
						obj = par;
						selectedobject = obj;
					}

					pickedUp = true;
					x = selectedobject.position.x;
					y = selectedobject.position.y;
					z = selectedobject.position.z;
					break;
				}				
			}	
		}		
	}

	function onDocumentMouseUp( event ) 
	{
		event.preventDefault();

		if (selectedobject == null)
			return;

		if(noValidMoves == true)
		{
			snapSelectedPieceToSpot(selectedSpot);
			cardDrawn = false;
			selectedobject = null;
			noValidMoves = false;
			return;
		}

		var spot2 = -1;

		var legalmovemade = false;
		for(var i = 0; i<movelist.length; i++)
		{	
			// Legal move made
			var position = spotList[movelist[i]].position;
			var xrange = [position.x - 10, position.x + 10];
			var zrange = [position.z - 10, position.z + 10];

			if(selectedobject.position.x >= xrange[0] && selectedobject.position.x <= xrange[1])
			{
				if(selectedobject.position.z >= zrange[0] && selectedobject.position.z <= zrange[1])
				{
					legalmovemade = true;
					snapSelectedPieceToSpot(movelist[i])
					piecePosition[piece] = movelist[i];
					cardDrawn = false;
					console.log("piece " + piece + "now moved to spot" + piecePosition[piece]);
				}
			}

			if( !legalmovemade )
			{
				snapSelectedPieceToSpot(selectedSpot);
			}

			selectedobject = null;
			for(var i = 0; i < 87; i++)
			{
				spotList[i].material.transparent = true;
				spotList[i].material.color.set("blue");
			}
		}
	}

	var music, click;
	function loadSounds()
	{
		music = new Audio("sounds/Bespin.mp3");
		click = new Audio("sounds/click.mp3");
		console.log('playing music');
		music.addEventListener('ended', function() 
		{
			this.currentTime = 0;
			this.play();
		}, false);

		music.volume = .3;
		//music.play();
	}


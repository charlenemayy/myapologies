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

	// 45 cards total
	var cardValues = [1,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,
			 5,5,5,5,7,7,7,7,8,8,8,8,10,10,10,10,
			 11,11,11,11,12,12,12,12,13,13,13,13];

	// Check if card is taken
	var cardTaken = [false,false,false,false,false,false,false,false,false,
			 false,false,false,false,false,false,false,false,false,
			 false,false,false,false,false,false,false,false,false,];
	
	function init()
	{
		scene = new THREE.Scene();
		
		setupCamera();
		setupRenderer();
		addSpotLight();
		addPlane();

		// Output to the stream
		document.body.appendChild( renderer.domElement );
		
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
		renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		
		loadPieces();
		createCards();
		shuffleCards();
		
		// Call render
		render();
	}
	
	function render()
	{
		if( Key.isDown(Key.A))
		{
			board.rotation.x -= 0.1;
		}
		if( Key.isDown(Key.D))
		{
			board.rotation.x += 0.1;
		}
		
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
	
	window.onload = init;

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
			
			pieceList[i].name = "Piece-RedPawn";
			pieceList[i+2].name = "Piece-RedPawn";

			scene.add( pieceList[i] );
			scene.add( pieceList[i+2] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+4].position.x = 120 + (i * PIECESPACE);
			pieceList[i+4].position.z = -33;

			pieceList[i+6].position.x = 120 + (i * PIECESPACE);
			pieceList[i+6].position.z = -33 + PIECESPACE;
			
			pieceList[i+4].name = "Piece-GreenPawn";
			pieceList[i+6].name = "Piece-GreenPawn";
			scene.add( pieceList[i+4] );
			scene.add( pieceList[i+6] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+8].position.x = -142 + (i * PIECESPACE);
			pieceList[i+8].position.z = 130;

			pieceList[i+10].position.x = -142 + (i * PIECESPACE);
			pieceList[i+10].position.z = 130 + PIECESPACE;
			
			pieceList[i+8].name = "Piece-BluePawn";
			pieceList[i+10].name = "Piece-BluePawn";
			scene.add( pieceList[i+8] );
			scene.add( pieceList[i+10] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+12].position.x = -93 + (i * PIECESPACE);
			pieceList[i+12].position.z = -84;

			pieceList[i+14].position.x = -93 + (i * PIECESPACE);
			pieceList[i+14].position.z = -84 + PIECESPACE;
	
			pieceList[i+12].name = "Piece-YellowPawn";
			pieceList[i+14].name = "Piece-YellowPawn";
			scene.add( pieceList[i+12] );
			scene.add( pieceList[i+14] );
		}	
	}

	function createCards()
	{
		var geo = new THREE.BoxGeometry( 30, 10, 50 );
        var mat = new THREE.MeshPhongMaterial({color: 'blue'});
        var cards = new THREE.Mesh( geo, mat );

        cards.position.set(39, 5, 21);
        cards.rotation.y = 45 * RAD;

        cards.name = "Card Stack"
        console.log(cards.name)

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
		
		if( selectedobject != null )
		{
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			projector.unprojectVector( vector, camera );
			raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		
			var intersects = raycaster.intersectObject( plane );
			selectedobject.position.copy( intersects[0].point );
		}
		
	}

	// Error probably results from translation of mouse location to vector in 3d space
	// Changing camera changes the mouse position needed to select object

	var x,y,z;
	function onDocumentMouseDown( event ) 
	{	
		// Prevent default action for mouse down
		event.preventDefault();
		
		// Stores mouse location
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
		console.log('mouse position:' + mouse.x + ', ' + mouse.y);

		// Uses camera projection matrix to transform into 3D space
		projector.unprojectVector( vector, camera ); // ??? Shouldn't it automatically adapt to new camera position

		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( scene.children, true );
		if ( intersects.length > 0 )
		{	
			// Identify object being picked up
			for( var i=0; i<intersects.length; i++ )
			{
				var obj = intersects[i].object;
				var name = obj.name;

				if(name == 'Card Stack')
				{
					console.log(name);
				}

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
					}
					else
					{
						obj = par;
						selectedobject = obj;
					}
					x = selectedobject.position.x;
					y = selectedobject.position.y;
					z = selectedobject.position.z;
					return;
				}				
			}			
		}		

	}

	function onDocumentMouseUp( event ) 
	{
		event.preventDefault();
		
		if( selectedobject != null )
		{
			selectedobject.position.x = x;
			selectedobject.position.y = y;
			selectedobject.position.z = z;
			selectedobject = null;
		}
	}
	

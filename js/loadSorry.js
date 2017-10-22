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

	// Array of spots
	var spotList = [];
	
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
		
		loadSpots();
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

	function loadSpots()
	{
		var geo = new THREE.CylinderGeometry( 8, 8, 1, 200 );
		var largegeo = new THREE.CylinderGeometry( 27, 27, 1, 200 );
        var mat = new THREE.MeshPhongMaterial({color: 'blue', transparent: true, opacity: .8});
        
        // Vertical lines
        for(var i = 0; i < 16; i++)
        {	
        	var circle1 = new THREE.Mesh( geo, mat );
        	circle1.position.set(174.5, .5, -115.5 + (PIECESPACE * i));
        	scene.add(circle1);
        	spotList[i] = circle1;

        	var circle2 = new THREE.Mesh( geo, mat );
        	circle2.position.set(-174.5, .5, 233.25 - (PIECESPACE * i));
        	scene.add(circle2);
        	spotLight[i+30] = circle2;
        }

        for(var i = 0; i < 14; i++)
        {
        	var circle1 = new THREE.Mesh( geo, mat );
        	circle1.position.set(151.25 - (PIECESPACE * i), .5, 233.25);
        	scene.add(circle1);
        	spotList[i+16] = circle1;

        	var circle2 = new THREE.Mesh( geo, mat );
        	circle2.position.set(-151.25 + (PIECESPACE * i), .5, -115.5);
        	scene.add(circle2);
        	spotLight[i+46] = circle2;
        }

        // Initialize start zones
        var largecircle = new THREE.Mesh(largegeo, mat);
    	largecircle.position.set( 134, .5, -22 );
    	scene.add(largecircle);
    	spotList[60] = largecircle;

    	var largecircle1 = new THREE.Mesh(largegeo, mat);
    	largecircle1.position.set( 82, .5, 193 );
    	scene.add(largecircle1);
    	spotList[61] = largecircle1;

    	var largecircle2 = new THREE.Mesh(largegeo, mat);
    	largecircle2.position.set( -133, .5, 139.5 );
    	scene.add(largecircle2);
    	spotList[62] = largecircle2;

    	var largecircle3 = new THREE.Mesh(largegeo, mat);
    	largecircle3.position.set( -81.5, .5, -73.5 );
    	scene.add(largecircle3);
    	spotList[63] = largecircle3;

        // Initialize home zones
    	var largecircle = new THREE.Mesh(largegeo, mat);
    	largecircle.position.set( 25, .5, -67.5 );
    	scene.add(largecircle);
    	spotList[69] = largecircle;

    	var largecircle1 = new THREE.Mesh(largegeo, mat);
    	largecircle1.position.set( 128, .5, 85 );
    	scene.add(largecircle1);
    	spotList[75] = largecircle1;

    	var largecircle2 = new THREE.Mesh(largegeo, mat);
    	largecircle2.position.set( -24, .5, 185 );
    	scene.add(largecircle2);
    	spotList[81] = largecircle2;

    	var largecircle3 = new THREE.Mesh(largegeo, mat);
    	largecircle3.position.set( -127, .5, 35 );
    	scene.add(largecircle3);
    	spotList[86] = largecircle3;

        // Initialize safety zones
        for(var i = 0; i < 5; i++)
        {
        	var circle = new THREE.Mesh( geo, mat );
        	circle.position.set(151.25 - (PIECESPACE * i), .5, -69);
        	scene.add(circle);
        	spotList[i+64] = circle;

        	var circle1 = new THREE.Mesh( geo, mat );
        	circle1.position.set(128, .5, 233.25 - (PIECESPACE * i));
        	scene.add(circle1);
        	spotList[i+70] = circle1;

        	var circle2 = new THREE.Mesh( geo, mat );
        	circle2.position.set(-151.25 + (PIECESPACE * i), .5, 186.75);
        	scene.add(circle2);
        	spotList[i+76] = circle2;

			var circle3 = new THREE.Mesh( geo, mat );
        	circle3.position.set(-127.75, .5, -92 + (PIECESPACE * i));
        	scene.add(circle3);
        	spotList[i+81] = circle3;
        }
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
			
			pieceList[i].name = "StartPiece-Red" + i;
			pieceList[i+2].name = "StartPiece-Red" + (i+2);

			scene.add( pieceList[i] );
			scene.add( pieceList[i+2] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+4].position.x = 120 + (i * PIECESPACE);
			pieceList[i+4].position.z = -33;

			pieceList[i+6].position.x = 120 + (i * PIECESPACE);
			pieceList[i+6].position.z = -33 + PIECESPACE;
			
			pieceList[i+4].name = "StartPiece-Green" + i;
			pieceList[i+6].name = "StartPiece-Green" + (i+2);
			scene.add( pieceList[i+4] );
			scene.add( pieceList[i+6] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+8].position.x = -142 + (i * PIECESPACE);
			pieceList[i+8].position.z = 130;

			pieceList[i+10].position.x = -142 + (i * PIECESPACE);
			pieceList[i+10].position.z = 130 + PIECESPACE;
			
			pieceList[i+8].name = "StartPiece-Blue" + i;
			pieceList[i+10].name = "StartPiece-Blue" + (i+2);
			scene.add( pieceList[i+8] );
			scene.add( pieceList[i+10] );
		}

		for( var i=0; i<2; i++ )
		{
			pieceList[i+12].position.x = -93 + (i * PIECESPACE);
			pieceList[i+12].position.z = -84;

			pieceList[i+14].position.x = -93 + (i * PIECESPACE);
			pieceList[i+14].position.z = -84 + PIECESPACE;
	
			pieceList[i+12].name = "StartPiece-Yellow" + i;
			pieceList[i+14].name = "StartPiece-Yellow" + (i+2);
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

	var x,y,z;
	function onDocumentMouseDown( event ) 
	{	
		// Prevent default action for mouse down
		event.preventDefault();
		
		// Stores mouse location
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );

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

				console.log(name);

				if(name == 'Card Stack')
				{
					playMove();
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

			for( var i=0; i<intersects.length; i++ )
			{
				var obj = intersects[i].object;
				var name = obj.name;

				console.log(name)
				

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
	

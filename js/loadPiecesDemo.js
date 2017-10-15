	var renderer;
	var scene;
	var camera;
	var plane;

	var mouse = new THREE.Vector2();
	var selectedobject = null;
	
	var raycaster = new THREE.Raycaster();
	var projector = new THREE.Projector();
	
	var pieceList = [null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null,
			 null,null,null,null,null,null,null,null];

	var piecesToLoad = ['Rook','Knight','Bishop','King','Queen','Bishop','Knight','Rook'];
	
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
        spotLight = new THREE.SpotLight( 0xffffff, 1 );
        spotLight.position.set( 0, 300, 0 );
        spotLight.shadowCameraNear = 1;
        spotLight.shadowCameraFar = 50;
        spotLight.castShadow = true;
        scene.add(spotLight);
	}
	
	window.onload = init;

	function loadPieces()
	{
		for( var i=0; i<8; i++ )
		{
			loadPiece('pawn','',i);
			loadPiece('pawn','w',i+16);
			loadPiece(piecesToLoad[i],'',i+8);
			loadPiece(piecesToLoad[i],'w',i+24);
		}
		setTimeout(waitForPiecesToLoad, 500);
	}
	
	function loadPiece( modelname, white, index )
	{
		// instantiate a loader
		var loader = new THREE.OBJMTLLoader();
		
		// load an obj / mtl resource pair
		loader.load(
			// OBJ resource URL
			'models/' + modelname + '.obj',

			// MTL resource URL	
			'models/' + modelname + white + '.mtl',
			
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
		for( var i=0; i<32; i++ )
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
	
	function placePieces()
	{
	
		for( var i=0; i<8; i++ )
		{
			pieceList[i].position.x = -24 * 3 + i * 24 - 12;
			pieceList[i].position.z = 24 * 3 - 12;
			pieceList[i].name = "Piece-BlackPawn";
			scene.add( pieceList[i] );
		}
		
		for( var i=0; i<8; i++ )
		{
			pieceList[i+8].position.x = -24 * 3 + i * 24 - 12;
			pieceList[i+8].position.z = 24 * 4 - 12;
			pieceList[i+8].name = "Piece-Black" + piecesToLoad[i];
			scene.add( pieceList[i+8] );
		}
		
		for( var i=0; i<8; i++ )
		{
			pieceList[i+16].position.x = -24 * 3 + i * 24 - 12;
			pieceList[i+16].position.z = -24 * 2 - 12;
			pieceList[i+16].name = "Piece-WhitePawn";
			scene.add( pieceList[i+16] );
		}
		
		for( var i=0; i<8; i++ )
		{
			pieceList[i+24].position.x = -24 * 3 + i * 24 - 12;
			pieceList[i+24].position.z = -24 * 3 - 12;
			pieceList[i+24].name = "Piece-White" + piecesToLoad[i];
			scene.add( pieceList[i+24] );
		}
		
	}
	
	function setupCamera()
	{
		camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
		camera.position.x = 0;
		camera.position.y = 200;
		camera.position.z = -250;
		camera.lookAt(new THREE.Vector3(0,0,0));
	}
	
	function setupRenderer()
	{
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0x000000, 1.0 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
	}
	
	function addPlane()
	{
		plane = new THREE.Mesh(new THREE.PlaneGeometry(24*8+48, 24*8+48, 10, 10), new THREE.MeshBasicMaterial({transparent: true, color: 0x0000ff,opacity: 0.0}));
		plane.position.z = .5;
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
		event.preventDefault();
		
		var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
		projector.unprojectVector( vector, camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( scene.children, true );
		if ( intersects.length > 0 )
		{
			for( var i=0; i<intersects.length; i++ )
			{
				var obj = intersects[i].object;
				var name = obj.name;
				if( name.length == 0 )
				{
					var par = obj.parent;
					name = par.name;
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
	

"use strict";

window.Game = window.Game || {};
Game.util = Game.util || {};

/**
 * clamp
 * @param number 
 * @param from 
 * @param to 
 * return 
 */
Game.util.clamp = function(number, from, to) {
	/* The Math.min() function returns the smallest of zero or more numbers.
	 * The Math.max() function returns the largest of zero or more numbers.
	 */
	return Math.max(Math.min(number, to), from);
}

/**
 * randomInt BASED on this.randomFloat
 * @param from
 * @param to
 * @param seed
 * return 
 */
Game.util.randomInt = function(from, to, seed) {
	return Math.floor(Game.util.randomFloat(from, to + 1, seed));
}

/**
 * randomFloat BASED on this.random
 * @param from
 * @param to
 * @param seed
 * return 
 */
Game.util.randomFloat = function(from, to, seed) {
	return Game.util.random(seed)*(to-from)+from;
}

/**
 * random
 * @param seed
 * return 
 */
Game.util.random = function(seed) {
	var scope = Game.util.random;
	
	/* Math.pow
	 * The Math.pow() function returns the base to the exponent power, 
	 * that is, base^exponent.
	 * Math.pow(base, exponent)
	 */
	scope.MAX = scope.MAX || Math.pow(2, 32);
	/*
	 * 
	 */
	scope.a = 1664525;
	scope.c = 1013904223;
	
	scope.seeds = scope.seeds || {};
	seed = seed || 0;
	
	var key = seed;
	// detects if seed is a string
	if (typeof seed == "string") {
		
		if (scope.seeds[seed] == undefined) {
			//
			var numeric = Game.util.numberFromString(seed);
			scope.seeds[seed] = numeric; // Memoization
			seed = numeric;
		} else {
			seed = scope.seeds[seed];
		}
	} 
	
	scope.series = scope.series || {};
	scope.series[key] = scope.series[key] || seed;
	
	var lastRandom = scope.series[key];
	var newRandom = (scope.a * lastRandom + scope.c) % scope.MAX;
	
	scope.series[key] = newRandom;
	
	return newRandom / scope.MAX;
}

/**
 * To do 
 */
Game.util.resetRandomSeries = function(prefix) {
	var toBeCleared = [];
	for (var i in Game.util.random.series) {
		if (i.indexOf(prefix) == 0) toBeCleared.push(i);
	}
	for (var i in toBeCleared) {
		delete Game.util.random.series[toBeCleared[i]];
	}
}

/**
 * To do 
 */
Game.util.makeSpecifiedArray1D = function(size, value, array) {
	var valueFloat = value;
	for (var x = 0; x < size; x++) {
		if (typeof(value) == "function") valueFloat = value(x);
		array[x] = valueFloat;
	}
	return array;
}

window.N = 256*256;
window.G = Game.util.makeSpecifiedArray1D(N, Math.random, new Float32Array(N));
window.P = Game.util.makeSpecifiedArray1D(N, function() {return Game.util.randomInt(0, N-1)}, new Uint32Array(N));
/**
 * To do 
 */
Game.util.random4 = function(i, j, k) {
	return G[(i + P[(j + P[k % N]) % N]) % N];
}

/**
 * The camera 
 * Rotating the camera id mouse button is down. handels the rotation and zooming of 
 * the camera.
 * @param camera
 * @param document
 * @param startRadius
 * @param cameraStartPos
 * @param originObject
 * 
 */
Game.util.EditorCamera = function(camera, document, startRadius, cameraStartPos, originObject) {
	/** this
	 * 
	 * A function's this keyword behaves a little differently in JavaScript 
	 * compared to other languages. 
	 * It also has some differences between strict mode and non-strict mode.
	 * 
	 * In most cases, the value of this is determined by how a function is called. 
	 * It can't be set by assignment during execution, and it may be different each 
	 * time the function is called. ES5 introduced the bind method to set the value 
	 * of a function's this regardless of how it's called, and ECMAScript 2015 
	 * introduced arrow functions whose this is lexically scoped 
	 * (it is set to the this value of the enclosing execution context).
	 * 
	 * In strict mode, the value of this remains at whatever it's set to when entering 
	 * the execution context. If it's not defined, it remains undefined. 
	 * It can also be set to any value, such as null or 42 or "I am not this".
	 * 
	 * Reade more: 
	 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/this
	 */
	this.camera = camera;
	this.mouseDown = false;
	this.crtlDown = false;
	this.startRadius = startRadius || 20;
	this.startExp = 6;
	this.radius = this.startExp;
	this.originObject = originObject || {position: new THREE.Vector3()};
	this.cameraStartPos = cameraStartPos || new THREE.Vector2(Math.PI/8, -Math.PI/4);
	this.cameraPos = this.cameraStartPos.clone();
	this.mouseClickPos = new THREE.Vector2();
	
	var editorCamera = this;
	
	/**
	 * ADding the listeners for the camera movment.
	 */
	var addEventListeners = function() {
		var x;
		var y;
		
		document.addEventListener('mousedown', function(event) {
			;
		});
		
		document.addEventListener('mouseup', function(event) {
			;
		});
		
		document.addEventListener('mousemove', function(event) {
			x = event.clientX;
			y = event.clientY;
			var mousePos = new THREE.Vector2(x, y);
			if (editorCamera.mouseDown == true) {
				var diff = mousePos.clone().sub(editorCamera.mouseClickPos).multiplyScalar(1/250);
				editorCamera.cameraPos = editorCamera.cameraStartPos.clone().add(diff);
				editorCamera.rotateCamera();
		    }
		});
		
		window.addEventListener("keydown", function(event) {
		    if (event.keyCode == 17){
		    	if(!editorCamera.mouseDown){
			    	var mousePos = new THREE.Vector2(x,y);			
					editorCamera.mouseClickPos = mousePos;
			    	editorCamera.mouseDown = true;
		    	}
		    }
		}, false);
		window.addEventListener("keyup", function(event) {
		    if (event.keyCode == 17){
		    	if(editorCamera.mouseDown){
					editorCamera.cameraStartPos = editorCamera.cameraPos;
			    	editorCamera.mouseDown = false;
		    	}
		    }
		}, false);
		
		
		
		document.addEventListener('mousewheel', function(event) {
			var delta = event.wheelDelta/20000;
			if (editorCamera.getScaledRadius(editorCamera.radius - delta) >= 0) {
				editorCamera.radius -= delta;
				editorCamera.zoomCamera();
			}
		});
	}

	/**
	 * 
	 */
	this.getScaledRadius = function(radius) {
		/* Math.exp()
		 * 	The Math.exp() function returns e^x, where x is the argument, 
		 * 	and e is Euler's number (also known as Napier's constant), 
		 * 	the base of the natural logarithms.
		 * 	Zoom - if we don't want zoom capabillitys we can remove the variables belove.
		 * 		Math.exp(radius) - Math.exp(this.startExp)
		 */
		return Math.exp(radius) - Math.exp(this.startExp) + this.startRadius
	}
	/**
	 * Used to normalize the camera distans. 
	 */
	this.zoomCamera = function() {
		this.camera.position.normalize().multiplyScalar(this.getScaledRadius(this.radius));
	}
	/**
	 * The algorithm for rotating the camera.
	 */
	this.rotateCamera = function() {
		this.camera.position.y = -this.cameraPos.y;
		this.camera.position.x = Math.sin(this.cameraPos.x);
		this.camera.position.z = Math.cos(this.cameraPos.x);
		
		this.zoomCamera();
		// Sets so that the camera looks at the planet.
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		this.camera.position.add(this.originObject.position);
	}
	// Adds the camera event listeners. 
	addEventListeners();
	
	this.rotateCamera();
}


/**
 * This listener function adds a listener to the window. 
 * changes the camera aspect ration and the window size. 
 */
Game.util.addResizeListener = function() {
	window.addEventListener('resize', function() {
		// Sets the render area to the screens area. 
		renderer.setSize(window.innerWidth, window.innerHeight);
		/*.aspect
		 * Camera frustum aspect ratio, window width divided by window height.
		 */
		camera.aspect = window.innerWidth / window.innerHeight;
		/* .updateProjectionMatrix ()
		 * Updates the camera projection matrix. 
		 * Must be called after change of parameters.
		 */
		camera.updateProjectionMatrix();
	});
}
/**
 * Wixes the states and the geometry of the new sphere element.
 */
Game.util.computeGeometry = function(geometry) {	
	geometry.makeGroups();
	/**.computeVertexNormals ()
	 * 	Computes vertex normals by averaging face normals.
	 * 	Face normals must be existing / computed beforehand.
	 */
	geometry.computeVertexNormals();
	/**.computeFaceNormals ()
	 * 	Computes face normals.
	 */
	geometry.computeFaceNormals();
	/**.computeMorphNormals ()
	 * 	Computes morph normals.
	 */
	geometry.computeMorphNormals();
	/**.computeBoundingSphere ()
	 * 	Computes bounding sphere of the geometry, updating
	 * 	Geometry.boundingSphere attribute.
	 * 
	 * 	Neither bounding boxes or bounding spheres are computed by default.
	 * 	They need to be explicitly computed, otherwise they are null.
	 */
	geometry.computeBoundingSphere();
	/**.computeBoundingBox ()
	 * 	Computes bounding box of the geometry, updating 
	 * 	Geometry.boundingBox attribute.
	 */
	geometry.computeBoundingBox();
	/**.computeLineDistances ()
	 * 	Compute distances between vertices for Line geometries.
	 */
	geometry.computeLineDistances();
	
	
	
	
	/**.verticesNeedUpdate
	 * 	Set to true if the vertices array has been updated.
	 */
	geometry.verticesNeedUpdate = true;
	/**.elementsNeedUpdate
	 * 	Set to true if the faces array has been updated.
	 */
	geometry.elementsNeedUpdate = true;
	/**.uvsNeedUpdate
	 * 	Set to true if the uvs array has been updated.
	 */
	geometry.uvsNeedUpdate = true;
	/**.normalsNeedUpdate
	 * 	Set to true if the normals array has been updated.
	 */
	geometry.normalsNeedUpdate = true;

	geometry.tangentsNeedUpdate = true;
	
	/**.colorsNeedUpdate
	 * 	Set to true if the colors array has been updated.
	 */
	geometry.colorsNeedUpdate = true;
	/**.lineDistancesNeedUpdate
	 * 	Set to true if the linedistances array has been updated.
	 */
	geometry.lineDistancesNeedUpdate = true;
	
	geometry.buffersNeedUpdate = true;
	geometry.groupsNeedUpdate = true;
}
/**
 * Interpolation
 * At the moment we are not using this Interpolation we are using a 
 * webGL based one. But the idée is the same. Interpolation is very 
 * interesting. 
 * 
 * So we are going to sample each texel coordinate in the field. 
 * But of course, the coordinates on the sphere is probably not going to align 
 * perfectly with a coordinate in the field, so we need to interpolate between 
 * the nearest neighbours. There are many ways to interpolate.
 */

/**
 * Trilinear interpolation
 * 
 * This is prettier, but it is easy to see the squarish/linear look. 
 * It is slower than nearest neighbour because 4 neigbour values are 
 * used in 7 linear equations, but it still is a very fast way to get a 
 * smooth look.  
 */
Game.util.trilinearInterpolation = function(coordFloat, scalarField, interpolation) {
	interpolation = interpolation || function(a, b, x) {
		return  a*(1-x) + b*x;
	}	

	var coord0 = {x: Math.floor(coordFloat.x), y: Math.floor(coordFloat.y), z: Math.floor(coordFloat.z)};
	var coord1 = {x: coord0.x+1, y: coord0.y+1, z: coord0.z+1};
	var xd 	= (coordFloat.x - coord0.x)/Math.max(1, (coord1.x-coord0.x));
	var yd 	= (coordFloat.y - coord0.y)/Math.max(1, (coord1.y-coord0.y));
	var zd 	= (coordFloat.z - coord0.z)/Math.max(1, (coord1.z-coord0.z));
	var c00 = interpolation(scalarField(coord0.x, coord0.y, coord0.z), scalarField(coord1.x, coord0.y, coord0.z), xd);
	var c10 = interpolation(scalarField(coord0.x, coord1.y, coord0.z), scalarField(coord1.x, coord1.y, coord0.z), xd);
	var c01 = interpolation(scalarField(coord0.x, coord0.y, coord1.z), scalarField(coord1.x, coord0.y, coord1.z), xd);
	var c11 = interpolation(scalarField(coord0.x, coord1.y, coord1.z), scalarField(coord1.x, coord1.y, coord1.z), xd);
	var c0 	= interpolation(c00, c10, yd);
	var c1 	= interpolation(c01, c11, yd);
	var c 	= interpolation(c0, c1, zd);
	
	return c;
}

/**
 * Nearest neighbour interpolation
 * 
 * Ugly, but it is very fast
 */
Game.util.nearestNeighbour = function(coordFloat, scalarField) {
	return scalarField(Math.floor(coordFloat.x), Math.floor(coordFloat.y), Math.floor(coordFloat.z));
}

/**
 * Tricosine interpolation
 * 
 * This is a very good compromise. 
 * The result is almost as smooth as the tricubic, and almost as fast as the 
 * trilinear. In most cases, it is indistuingishable from tricubic interpolation. 
 * This is what we are going to use. The algorithm is basically the same as 
 * trilinear interpolation, but with a cosine function instead of the linear one.
 */
Game.util.tricosineInterpolation = function(coordFloat, scalarField) {
	var interpolation = function(a, b, x) {
		var ft = x * 3.1415927;
		var f = (1 - Math.cos(ft)) * 0.5;
		return  a*(1-f) + b*f
	}
	return Game.util.trilinearInterpolation(coordFloat, scalarField, interpolation);
}

/**
 * Create´s a normal map 
 * 
 * In 3D computer graphics, normal mapping, or "Dot3 bump mapping", 
 * is a technique used for faking the lighting of bumps and dents – 
 * an implementation of bump mapping. 
 * It is used to add details without using more polygons.
 * A common use of this technique is to greatly enhance the appearance and 
 * details of a low polygon model by generating a normal map from a high 
 * polygon model or height map.
 * 
 * Normal maps are commonly stored as regular RGB images where the RGB components 
 * correspond to the X, Y, and Z coordinates, respectively, of the surface normal.
 */
Game.util.heightToNormalMap = function(map, intensity) {
    var width = map.image.width;
	var height = map.image.height;
	var nofPixels = width*height;
    
    intensity = intensity || 1.0;
    
    var getHeight = function(x, y) {
        x = Math.min(x, width-1);
        y = Math.min(y, height-1);
        return (
            map.image.data[(y*width + x) * 4 + 0]/255 + 
            map.image.data[(y*width + x) * 4 + 1]/255 +
            map.image.data[(y*width + x) * 4 + 2]/255
        )/3*intensity;
    }
    
    var normalMap = THREE.ImageUtils.generateDataTexture(
    		width, 
    		height, 
    		new THREE.Color(0x000000)
    );

	for (var i = 0; i < nofPixels; i++) {		
		var x = i%width;
		var y = height-Math.floor(i/width);
		
        var pixel00 = new THREE.Vector3(0, 0, getHeight(x    , y));
        var pixel01 = new THREE.Vector3(0, 1, getHeight(x    , y + 1));
        var pixel10 = new THREE.Vector3(1, 0, getHeight(x + 1, y));
        var orto = pixel10.sub(pixel00).cross(pixel01.sub(pixel00)).normalize();
        
        normalMap.image.data[i*3 + 0] = (orto.x/2 + 0.5)*255;
		normalMap.image.data[i*3 + 1] = (orto.y/2 + 0.5)*255;
		normalMap.image.data[i*3 + 2] = (orto.z/2 + 0.5)*255;
    }
    
    return normalMap;
}
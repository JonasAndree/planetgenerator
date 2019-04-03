/**
 *  Defines that JavaScript code should be executed in "strict mode".
 *  With strict mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.main = Game.main || {};

/**
 * main
 *  init render 
 */
Game.main.main = function() {
	/**
	 * WebGLRenderer
	 * The WebGL renderer displays your beautifully crafted scenes using WebGL.
	 * 
	 * WebGLRenderer( parameters )
	 * 	canvas 		— A Canvas where the renderer draws its output.
	 * 	context 	— The RenderingContext context to use.
	 * 	precision 	— Shader precision. Can be "highp", "mediump" or "lowp". 
	 * 				  Defaults to "highp" if supported by the device.
	 * 	alpha 					— Boolean, default is false.
	 * 	premultipliedAlpha 		— Boolean, default is true.
	 * 	antialias 				— Boolean, default is false.
	 * 	stencil 				— Boolean, default is true.
	 * 	preserveDrawingBuffer	— Boolean, default is false.
	 * 	depth 					— Boolean, default is true.
	 * 	logarithmicDepthBuffer 	— Boolean, default is false.
	 */
	window.renderer = new THREE.WebGLRenderer({
		// Makes the image smoother 
		antialias: true
	});
	var renderer = window.renderer;
	/* .gammaInput
	 * 	If set, then it expects that all textures and 
	 *  colors are premultiplied gamma.
	 */
	renderer.gammaInput = true;
	/* .gammaOutput
	 * 	If set, then it expects that all textures and colors need to be 
	 *  outputted in premultiplied gamma.
	 */
	renderer.gammaOutput = true;
	/* .setClearColor ( color, alpha )
	 *	Sets the clear color and opacity of the background.
	 */
	renderer.setClearColor(0x010101, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// Sets doom id to renderer
	renderer.domElement.setAttribute('id', 'renderer');
	// Appends renderer to the body.
	document.body.appendChild(renderer.domElement);
	
	/* Scene
	 * 	Scenes allow you to set up what and where is to be rendered by three.js. 
	 * 	This is where you place objects, lights and cameras.
	 */
	window.scene = new THREE.Scene();
	// Ratio for the rendering area.
	var ratio = renderer.getContext().drawingBufferWidth / 
				renderer.getContext().drawingBufferHeight;
	/* Camera with perspective projection.
	 * PerspectiveCamera( fov, aspect, near, far )
	 * 	fov 	— Camera frustum vertical field of view.
	 * 	aspect 	— Camera frustum aspect ratio.
	 * 	near 	— Camera frustum near plane.
	 * 	far		— Camera frustum far plane.
	 */
	window.camera = new THREE.PerspectiveCamera(120, ratio, 0.1, 10000);
	
	/*
	 * Handels the rotation of the camera.
	 * camera, 
	 * document, 
	 * startRadius, 
	 * cameraStartPos, 
	 * originObject
	 */
	window.editorCamera = new Game.util.EditorCamera(
		camera, 
		document, 
		15, 
		new THREE.Vector2( 
				-Math.PI * (1/4), -
				Math.PI * (1/4) 
		)
	);
	// Adds a listener that listens if the window size changes.
	Game.util.addResizeListener();
	// Add's al the scen's content.
	Game.main.addSceneContent(scene);
	// Starts the render 
	Game.main.render();
}
/**
 * This will create a loop that causes the renderer to draw the scene 60 
 * times per second.
 */
Game.main.render = function() {
	/**
	 * 	requestAnimationFrame has a number of advantages.
	 * 	Perhaps the most important one is that it pauses when the user navigates 
	 * 	to another browser tab, hence not wasting their precious processing power
	 *  and battery life.
	 */
	requestAnimationFrame(Game.main.render);
	
	/* This will rotate the planet.Using the editor camera.
	 */
	window.time = window.time || new Date().getTime();
	var newTime = new Date().getTime();
	var diff = newTime - time;
	if (editorCamera.mouseDown == false) {
		editorCamera.cameraPos.x += diff/1000*(2*3.1415)*(1/3600/24)*3000;
		editorCamera.cameraStartPos = editorCamera.cameraPos;
		editorCamera.rotateCamera();
	}
	time = newTime;
	// renders it al.
	window.renderer.render(window.scene, window.camera);
};
/**
 * addSceneContent
 * Adds to scene:
 * 	sunLight
 * 	generates texture and adds it to the planet
 * 	planet
 */
Game.main.addSceneContent = function(scene) {
	/* PointLight(hex, intensity, distance, decay)
	 * hex 		 — Numeric value of the RGB component of the color. 
	 * intensity — Numeric value of the light's strength/intensity. 
	 * distance -- The distance of the light where the intensity is 0. 
	 * 			   When distance is 0, then the distance is endless. 
	 * decay -- The amount the light dims along the distance of the light.
	 */
	window.sunLight = new THREE.PointLight(new THREE.Color(0xffffff), 1.0);
	sunLight.position.set(-80, 0, 0);
	scene.add(sunLight);
	
	// Generats two maps 
	var textureMaps = Game.main.generateTextures();
	// Time to go into the planet creation.
	var planet = new Game.planet.Planet(
			5, 
			textureMaps.textureMaps, 
			textureMaps.bumpMaps
	);
	// Adds the planet to the scene.
	scene.add(planet);

	// Time to go into the planet creation.
/*	var clouds = new Game.clouds.Clouds(
			5
	);
	
	scene.add(clouds);
*/
	
	/*var cloudsMaterial = Game.material.cloudShaderMaterial();
	    
	var cloudsGeometry = new THREE.SphereGeometry( 5, 32, 32 );
	    	
	var cloudSphere = new THREE.Mesh( 
	   	cloudsGeometry, 
	   	cloudsMaterial
	);
		
	scene.add( cloudSphere );*/

	var geometry = new THREE.SphereGeometry( 5.2, 32, 32 );
	var material = Game.material.cloudShaderMaterial();
	var sphere = new THREE.Mesh( geometry, material );
	scene.add( sphere );
	
}



/**
 * This function will generate two types of plane maps
 * First a texture map that will decide the look of the planet.
 * The other a bumpMap generated from the texture map. 
 */
Game.main.generateTextures = function() {
	var textureMaps = [];
	var bumpMaps 	= [];
	var resolution 	= 1024;
	
	for (var index = 0; index < 6; index++) {
		/** WebGLRenderTarget
		 * 	A render target is a buffer where the video card draws 
		 * 	pixels for a scene that is being rendered in the background. 
		 * 	It is used in different effects.
		 * 	
		 * WebGLRenderTarget(width, height, options)
		 * 	width 	-- The width of the renderTarget. 
		 * 	height 	-- The height of the renderTarget. 
		 * 	options -- The options sets the properties of the render 
		 * 				target.
		 */
		var texture = new THREE.WebGLRenderTarget(
				resolution, 
				resolution, 
				{
					minFilter: 	THREE.LinearFilter, 
					magFilter: 	THREE.LinearFilter, 
					format: 	THREE.RGBFormat
				}
		);
		/**OrthographicCamera
		 * 	Camera with orthographic projection.
		 * 
		 * OrthographicCamera( left, right, top, bottom, near, far )
		 * 	left 	— Camera frustum left plane.
		 * 	right 	— Camera frustum right plane.
		 * 	top 	— Camera frustum top plane.
		 * 	bottom 	— Camera frustum bottom plane.
		 * 	near 	— Camera frustum near plane.
		 * 	far 	— Camera frustum far plane.
		 */
		var textureCamera = new THREE.OrthographicCamera(
				-resolution/2, 
				resolution/2, 
				resolution/2, 
				-resolution/2, 
				-100, 
				100);
		textureCamera.position.z = 10;
		
		var textureScene = new THREE.Scene();
		var plane = new THREE.Mesh(
			/**PlaneGeometry
			 * 	A class for generating plane geometries
			 * 
			 * PlaneGeometry(width, height, widthSegments, heightSegments)
			 * 	width 			— Width along the X axis.
			 * 	height 			— Height along the Y axis.
			 * 	widthSegments 	— Optional. Default is 1. 
			 * 	heightSegments 	— Optional. Default is 1.
			 */
			new THREE.PlaneGeometry(resolution, resolution), 
			/* Generated texture for the plain. */
			new Game.material.textureGeneratorMaterial(index)
		);
		
		plane.position.z = -10;
		textureScene.add(plane);
		/**.render ( scene, camera, renderTarget, forceClear )
		 * 
		 * Render a scene using a camera.
		 * The render is done to the renderTarget (if specified) or 
		 * to the canvas as usual.
		 * If forceClear is true, the depth, stencil and color buffers 
		 * will be cleared before rendering even if the renderer's 
		 * autoClear property is false.
		 * Even with forceClear set to true you can prevent certain 
		 * buffers being cleared by setting either the .autoClearColor, 
		 * .autoClearStencil or .autoClearDepth properties to false.
		 */
		renderer.render(textureScene, textureCamera, texture, true);
		
		var buffer = new Uint8Array(resolution * resolution * 4);
		/**.getContext ()
		 * Return the WebGL context
		 */
		var gl = renderer.getContext();
		/**gl.readPixels(x, y, width, height, format, type, pixels)
		 *  x - A GLint specifying the first horizontal pixel that is read 
		 * 		from the lower left corner of a rectangular block of pixels.
		 *  y - A GLint specifying the first vertical pixel that is read 
		 *  	from the lower left corner of a rectangular block of pixels.
		 *  width 	- A GLsizei specifying the width of the rectangle.
		 *  height 	- A GLsizei specifying the height of the rectangle.
		 *  format 	- A GLenum specifying the format of the pixel data. 
		 *  		  Possible values:
		 *  			gl.ALPHA: 	Discards the red, green and blue components and reads the alpha component.
		 *  			gl.RGB: 	Discards the alpha components and reads the red, green and blue components.
		 *  			gl.RGBA: 	Red, green, blue and alpha components are read from the color buffer.
		 *  type	- A GLenum specifying the data type of the pixel data. 
		 *  		  Possible values:
		 *  			gl.UNSIGNED_BYTE
		 *  			gl.UNSIGNED_SHORT_5_6_5
		 *  			gl.UNSIGNED_SHORT_4_4_4_4
		 *  			gl.UNSIGNED_SHORT_5_5_5_1
		 *  			gl.FLOAT
		 *  pixels	- An ArrayBufferView object to read data into. 
		 *  		  The array type must match the type of the type parameter.
		 *  			Uint8Array for gl.UNSIGNED_BYTE.
		 *  			Uint16Array for gl.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_4_4_4_4, or gl.UNSIGNED_SHORT_5_5_5_1.
		 *  			Float32Array for gl.FLOAT.
		 */
		gl.readPixels( 
				0, 
				0,
				resolution, 
				resolution, 
				gl.RGBA, 
				gl.UNSIGNED_BYTE, 
				buffer
		);
		// Adds the new texture to the texture map.
		textureMaps.push(texture);
		/*
		 * creates and pushes the bump map 
		 */
		bumpMaps.push({
			image: {
				data: buffer, 
				height: resolution, 
				width: resolution
			}
		});
	}
	return {
		textureMaps: textureMaps, 
		bumpMaps: bumpMaps
	};
}
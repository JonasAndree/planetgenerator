"use strict";

window.Game = window.Game || {};
Game.main = Game.main || {};

/**
 * Setting upp:
 * 	the renderer
 * 	creating a doom element 
 *	adding it to the html 
 */
Game.main.main = function() {
	/**
	 * WebGLRenderer
	 * 	The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
	 * 	This renderer has way better performance than CanvasRenderer.
	 * Constructor
	 * 	WebGLRenderer( parameters )parameters is an optional object with properties defining the renderer's behaviour. 
	 *  The constructor also accepts no parameters at all. In all cases, it will assume sane defaults when parameters are missing.
	 *  	canvas — A Canvas where the renderer draws its output.
	 *  	context — The RenderingContext context to use.
	 *  	precision — Shader precision. Can be "highp", "mediump" or "lowp". Defaults to "highp" if supported by the device.
	 *  	alpha — Boolean, default is false.
	 *  	premultipliedAlpha — Boolean, default is true.
	 *  	antialias — Boolean, default is false.
	 *  	stencil — Boolean, default is true.
	 *  	preserveDrawingBuffer — Boolean, default is false.
	 *  	depth — Boolean, default is true.
	 *  	logarithmicDepthBuffer — Boolean, default is false.
	 */
	window.renderer = new THREE.WebGLRenderer({
		// antialias - makes it more smooth.
		antialias: true
	});
	
	var renderer = window.renderer;
	/**.gammaInput 
	 * 	Default is false.
	 * 	If set, then it expects that all textures and colors are premultiplied gamma.
	 */
	renderer.gammaInput = true;
	/**.gammaOutput 
	 * 	Default is false.
	 * 	If set, then it expects that all textures and colors need to be outputted in premultiplied gamma.
	 */ 
	renderer.gammaOutput = true;
	/**.setClearColor ( color, alpha )
	 * 	Sets the clear color and opacity.
	 */ 
	renderer.setClearColor(0x000000, 1);
	/**.setSize ( width, height, updateStyle )
	 * 	Resizes the output canvas to (width, height), and also sets the viewport to fit that size, 
	 * starting in (0, 0). Setting updateStyle to true adds explicit pixel units to the output canvas style.
	 */ 
	renderer.setSize(window.innerWidth, window.innerHeight);
	/**
	 * Used to give the renderer an css id.
	 */
	renderer.domElement.setAttribute('id', 'renderer');
	// Add's it to the html
	document.body.appendChild(renderer.domElement);

	/** Scene
	 * 	Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
	 * Properties
	 * 	Default is true. If set, then the renderer checks every frame if the scene and its objects needs matrix updates. 
	 * 	When it isn't, then you have to maintain all matrices in the scene yourself.
	 */
	window.scene = new THREE.Scene();
	
	var ratio = renderer.getContext().drawingBufferWidth / renderer.getContext().drawingBufferHeight;
	/** PerspectiveCamera
	 * 	 Camera with perspective projection.
	 * 
	 * 	PerspectiveCamera( fov, aspect, near, far )
	 * 		fov 	— Camera frustum vertical field of view.
	 * 		aspect 	— Camera frustum aspect ratio.
	 * 		near 	— Camera frustum near plane.
	 * 		far 	— Camera frustum far plane.
	 */
	window.camera = new THREE.PerspectiveCamera(120, ratio, 0.1, 10000);
	/********************************************************************************
	 * 																				*
	 * 							To do 												*
	 * 																				*
	 ********************************************************************************/
	window.editorCamera = new Game.util.EditorCamera(camera, 
			  										 document, 
			  										 15, 
			  										 new THREE.Vector2(-Math.PI*(1/4),-Math.PI*(1/4)));
	// Detects if the screen is resized. 
	Game.util.addResizeListener();
	// Runs the local method that adds al the content to the scene.
	Game.main.addSceneContent(scene);
	// Running local method render. 
	Game.main.render();
}

/**
 * This will create a loop that causes the renderer to draw the scene 60 times per second.
 */
Game.main.render = function() {
	/* requestAnimationFrame has a number of advantages. 
	 * 	Perhaps the most important one is that it pauses when the user navigates to another browser tab, 
	 * 	hence not wasting their precious processing power and battery life.
	 */
	requestAnimationFrame(Game.main.render);
	
	
	/************************************************************************************
	 * 																					*
	 * 									To do											*
	 * 																					*
	 ************************************************************************************/
	window.time = window.time || new Date().getTime();
	var newTime = new Date().getTime();
	var diff = newTime - time;
	if (editorCamera.mouseDown == false) {
		editorCamera.cameraPos.x += diff/1000*(2*3.1415)*(1/3600/24)*3000;
		editorCamera.cameraStartPos = editorCamera.cameraPos;
		editorCamera.rotateCamera();
	}
	time = newTime;
	
	// Renders the game scene and camera view.
	window.renderer.render(window.scene, window.camera);
};

/**
 * addSceneContent
 * 	adds light to the scene
 * 	Generated textures for the planet 
 * 	adds the planet witht the textures 
 */
Game.main.addSceneContent = function(scene) {
	/**
	 * PointLight
	 * 	Affects objects using MeshLambertMaterial or MeshPhongMaterial.
	 * 
	 * PointLight(hex, intensity, distance, decay)
	 * 	hex — Numeric value of the RGB component of the color. 
	 * 	intensity — Numeric value of the light's strength/intensity. 
	 * 	distance -- The distance of the light where the intensity is 0. When distance is 0, then the distance is endless. 
	 * 	decay -- The amount the light dims along the distance of the light.
	 * 	Creates a light at a specific position in the scene. The light shines in all directions (roughly similar to a light bulb.)
	 */
	window.sunLight = new THREE.PointLight(new THREE.Color(0xffffff), 1.0);
	// x, y, z
	sunLight.position.set(100, -100, 100);
	scene.add(sunLight);
	
	//
	var maps = Game.main.generateTextures();
	
	scene.add(new Game.planet.Planet(5, maps.textureMaps, maps.bumpMaps));
	
	//scene.add(new Game.starbox.StarBox(4000));
}
/**
 * 
 */
Game.main.generateTextures = function() {
	var textureMaps = [];
	var bumpMaps = [];
	var resolution = 1024;
	
	for (var index = 0; index < 6; index++) {
		/**
		 * WebGLRenderTarget
		 * 	A render target is a buffer where the video card draws pixels for a scene that is being rendered in the background. 
		 * 	It is used in different effects.
		 * 
		 * WebGLRenderTarget(width, height, options)
		 * 	width -- The width of the renderTarget -- resolution.
		 * 	height -- The height of the renderTarget -- resolution.
		 * 	options -- The options sets the properties of the render target.
		 * 
		 * 	Creates a new renderTarget with a certain width and height.
		 */
		var texture = new THREE.WebGLRenderTarget(resolution, resolution, {
			/** .minFilter
			 * 	How the texture is sampled when a texel covers less than one pixel. 
			 * 	The default is THREE.LinearMipMapLinearFilter, which uses mipmapping and a trilinear filter. 
			 * 	Other choices are THREE.NearestFilter, 
			 * 					  THREE.NearestMipMapNearestFilter, 
			 * 					  THREE.NearestMipMapLinearFilter, 
			 * 					  THREE.LinearFilter, and 
			 * 					  THREE.LinearMipMapNearestFilter. 
			 * These vary whether the nearest texel or nearest four texels are retrieved on the nearest mipmap or nearest two mipmaps. 
			 * Interpolation occurs among the samples retrieved.
			 */
			minFilter: 	THREE.LinearFilter,
			/** .magFilter
			 * 	How the texture is sampled when a texel covers more than one pixel. 
			 * 	The default is THREE.LinearFilter, which takes the four closest texels and bilinearly interpolates among them. 
			 * 	The other option is THREE.NearestFilter, which uses the value of the closest texel.
			 */
			magFilter: 	THREE.LinearFilter,
			/**.format
			 * The default is THREE.RGBAFormat for the texture. 
			 * Other formats are: THREE.AlphaFormat, 
			 * 					  THREE.RGBFormat, 
			 * 					  THREE.LuminanceFormat, and 
			 * 					  THREE.LuminanceAlphaFormat. 
			 * There are also compressed texture formats, if the S3TC extension is supported: 
			 * 					  THREE.RGB_S3TC_DXT1_Format, 
			 * 					  THREE.RGBA_S3TC_DXT1_Format, 
			 * 					  THREE.RGBA_S3TC_DXT3_Format, and 
			 * 					  THREE.RGBA_S3TC_DXT5_Format.
			 */
			format: 	THREE.RGBFormat
		});
		/**
		 * OrthographicCamera
		 * Camera with orthographic projection. Read more abour orthographic projection at wikipedia.
		 * 
		 * OrthographicCamera( left, right, top, bottom, near, far )
		 * 	left 	— Camera frustum left 	plane.
		 * 	right 	— Camera frustum right 	plane.
		 * 	top 	— Camera frustum top 	plane.
		 * 	bottom 	— Camera frustum bottom plane.
		 * 	near 	— Camera frustum near 	plane.
		 * 	far 	— Camera frustum far 	plane.
		 * 
		 * Used to project the generated textur onto a to a 2D texture.
		 */
		var textureCamera = new THREE.OrthographicCamera(-resolution/2, resolution/2, resolution/2, -resolution/2, -100, 100);
		textureCamera.position.z = 10;

		// This new scene will be used to project a texture to a plane geometric object.
		var textureScene = new THREE.Scene();
		// Creats the plain and adds generated material. 
		var plane = new THREE.Mesh(
			// Creats a plane geometry.
			new THREE.PlaneGeometry(resolution, resolution), 
			// GPU generated texture.
			new Game.material.textureGeneratorMaterial(index)
		);
		plane.position.z = -10;
		textureScene.add(plane);
		/**
		 * .render ( scene, camera, renderTarget, forceClear )
		 * 		Render a scene using a camera.
		 * 		The render is done to the renderTarget (if specified) or to the canvas as usual.
		 * 		If forceClear is true, the depth, stencil and color buffers will be cleared before rendering even if the renderer's autoClear property is false.
		 * 		Even with forceClear set to true you can prevent certain buffers being cleared by setting either the 
		 * 			.autoClearColor, 
		 * 			.autoClearStencil or 
		 * 			.autoClearDepth properties to false.
		 */
		renderer.render(textureScene, textureCamera, texture, true);
		
		/**
		 * The Uint8Array typed array represents an array of 8-bit unsigned integers. 
		 * The contents are initialized to 0. 
		 * Once established, you can reference elements in the array using the object's methods, 
		 * or using standard array index syntax (that is, using bracket notation).
		 *  param length 
		 */
		var buffer = new Uint8Array(resolution * resolution * 4);
		/**.getContext ()
		 * 	Return the WebGL context.
		 */
		var gl = renderer.getContext();
		/**.readPixels(GLint x, GLint y, GLsizei width, GLsizei height, GLenum format, GLenum type, ArrayBufferView? pixels) 
		 * 	Fills pixels with the pixel data in the specified rectangle of the frame buffer. 
		 * 	The data returned from readPixels must be up-to-date as of the most recently sent drawing command.
		 * 	The type of pixels must match the type of the data to be read. 
		 * 	For example, if it is UNSIGNED_BYTE, a Uint8Array must be supplied; if it is UNSIGNED_SHORT_5_6_5, 
		 * 	UNSIGNED_SHORT_4_4_4_4, or UNSIGNED_SHORT_5_5_5_1, a Uint16Array must be supplied; if it is FLOAT, 
		 * 	a Float32Array must be supplied. If the types do not match, an INVALID_OPERATION error is generated. 
		 * 	
		 * 	Only two combinations of format and type are accepted. The first is format RGBA and type UNSIGNED_BYTE. 
		 * 	The second is an implementation-chosen format. The values of format and type for this format may be determined 
		 * 	by calling getParameter with the symbolic constants IMPLEMENTATION_COLOR_READ_FORMAT and IMPLEMENTATION_COLOR_READ_TYPE, 
		 * 	respectively. The implementation-chosen format may vary depending on the format of the currently bound rendering surface. 
		 * 	Unsupported combinations of format and type will generate an INVALID_OPERATION error. 
		 * 
		 * 	If pixels is null, an INVALID_VALUE error is generated. If pixels is non-null, but is not large enough to retrieve 
		 *  all of the pixels in the specified rectangle taking into account pixel store modes, an INVALID_OPERATION error is generated. 
		 * 	For any pixel lying outside the frame buffer, the corresponding destination buffer range remains untouched; see Reading Pixels Outside the Framebuffer. 
		 * 
		 * 	If this function attempts to read from a complete framebuffer with a missing color attachment, 
		 * 	an INVALID_OPERATION error is generated per Reading from a Missing Attachment.
		 */ 
		gl.readPixels( 0, 0, resolution, resolution, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
		
		textureMaps.push(texture);
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
/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.main = Game.main || {};

/**
 * main init render
 */
Game.main.main = function() {
	$(document).ready(
			function() {
				/**
				 * WebGLRenderer The WebGL renderer displays your beautifully
				 * crafted scenes using WebGL.
				 * 
				 * WebGLRenderer( parameters ) canvas — A Canvas where the
				 * renderer draws its output. context — The RenderingContext
				 * context to use. precision — Shader precision. Can be "highp",
				 * "mediump" or "lowp". Defaults to "highp" if supported by the
				 * device. alpha — Boolean, default is false. premultipliedAlpha —
				 * Boolean, default is true. antialias — Boolean, default is
				 * false. stencil — Boolean, default is true.
				 * preserveDrawingBuffer — Boolean, default is false. depth —
				 * Boolean, default is true. logarithmicDepthBuffer — Boolean,
				 * default is false.
				 */
				window.renderer = new THREE.WebGLRenderer({
					// Makes the image smoother
					antialias : true
				});
				var renderer = window.renderer;
				/*
				 * .gammaInput If set, then it expects that all textures and
				 * colors are premultiplied gamma.
				 */
				renderer.gammaInput = true;
				/*
				 * .gammaOutput If set, then it expects that all textures and
				 * colors need to be outputted in premultiplied gamma.
				 */
				renderer.gammaOutput = true;
				/*
				 * .setClearColor ( color, alpha ) Sets the clear color and
				 * opacity of the background.
				 */
				renderer.setClearColor(0x010101, 1);
				renderer.autoClear = false;
				renderer.setSize(window.innerWidth, window.innerHeight);
				// Sets doom id to renderer
				renderer.domElement.setAttribute('id', 'renderer');
				// Appends renderer to the body.
				document.getElementById("canvas").appendChild(
						renderer.domElement);

				/*
				 * Scene Scenes allow you to set up what and where is to be
				 * rendered by three.js. This is where you place objects, lights
				 * and cameras.
				 */
				window.scene = new THREE.Scene();
				window.scene2 = new THREE.Scene();
				// Ratio for the rendering area.
				var ratio = renderer.getContext().drawingBufferWidth
						/ renderer.getContext().drawingBufferHeight;
				/*
				 * Camera with perspective projection. PerspectiveCamera( fov,
				 * aspect, near, far ) fov — Camera frustum vertical field of
				 * view. aspect — Camera frustum aspect ratio. near — Camera
				 * frustum near plane. far — Camera frustum far plane.
				 */
				window.camera = new THREE.PerspectiveCamera(60, ratio, 0.1,
						100000);

				window.camera2 = new THREE.PerspectiveCamera(30, ratio, 0.01,
						100);
				/*
				 * Handels the rotation of the camera. camera, document,
				 * startRadius, cameraStartPos, originObject
				 */
				window.editorCamera = new Game.util.EditorCamera(camera,
						document, 400, new THREE.Vector2(-Math.PI * (1 / 8),
								-Math.PI * (1 / 8)));
				/*
				 * window.editorCamera2 = new Game.util.EditorCamera(camera2,
				 * document, 30, new THREE.Vector2(-Math.PI * (1 / 8), -Math.PI *
				 * (1 / 8)));
				 */// Adds a listener that listens if the window size changes.
				Game.util.addResizeListener();
				// Starts the render
				Game.main.render();
			});
}
var cloudsAdded = false;
/**
 * This will create a loop that causes the renderer to draw the scene 60 times
 * per second.
 */
Game.main.render = function() {
	/**
	 * requestAnimationFrame has a number of advantages. Perhaps the most
	 * important one is that it pauses when the user navigates to another
	 * browser tab, hence not wasting their precious processing power and
	 * battery life.
	 */
	requestAnimationFrame(Game.main.render);

	/*
	 * This will rotate the planet.Using the editor camera.
	 */
	window.time = window.time || new Date().getTime();
	var newTime = new Date().getTime();
	var diff = newTime - time;
	if (editorCamera.mouseDown == false) {
		editorCamera.cameraPos.x -= diff / 5000 * (2 * 3.1415)
				* (1 / 3600 / 24) * 3000;
		editorCamera.cameraStartPos = editorCamera.cameraPos;
		editorCamera.rotateCamera();

	}
	time = newTime;

	var fixedPosition = new THREE.Vector3(-1, -1, 0);
	if (cloudsAdded) {
		Game.main.uniforms.time.value += time / 100000000000000;

		var ratio = window.innerWidth / window.innerHeight;
		Game.main.asteroid.position.set(window.innerWidth / 750, 1.4, -6);
	}

	window.renderer.render(window.scene, window.camera);
	//window.renderer.render(window.scene2, window.camera2);
};
/**
 * PointLight(hex, intensity, distance, decay) hex — Numeric value of the RGB
 * component of the color. intensity — Numeric value of the light's
 * strength/intensity. distance -- The distance of the light where the intensity
 * is 0. When distance is 0, then the distance is endless. decay -- The amount
 * the light dims along the distance of the light.
 */
Game.main.addLight = function() {
	window.sunLight = new THREE.PointLight(new THREE.Color(0xffffff), 1.0);
	sunLight.position.set(-80, 0, 0);
	scene.add(sunLight);
}
Game.main.addLight2 = function() {
	window.sunLight2 = new THREE.PointLight(new THREE.Color(0xffffff), 1.0);
	sunLight2.position.set(40, -40, 0);
	scene.add(sunLight2);
}
/**
 * Adds the scene content
 */
Game.main.addSceneContent = function(scene) {
	Game.main.addLight2();
	Game.main.addPlanet();
	Game.planetCore.addDarkPlanetCore();
	Game.galaxy.addGalaxy();
	Game.main.addMenuBar();
}

/**
 * Adds menubar effect
 */
Game.main.addMenuBar = function() {
	Game.main.addAsteroid();

	Game.main.initMesh();
}
var mesh = null;
Game.main.initMesh = function() {
    var loader = new THREE.JSONLoader();
    loader.load('json/object/nav.json', function(geometry, materials) {
        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 2.75;
        //mesh.translation = THREE.GeometryUtils.center(geometry);
        scene2.add(mesh);
    });
}




/**
 * Adds the menu asteroid
 */
Game.main.addAsteroid = function() {
	var resolution = 1024;
	var textureMaps = Game.textures.generateAsteroidTextures(resolution);
	var asteroid = new Game.asteroid.Ansteroid(0.1, textureMaps.textureMaps,
			textureMaps.bumpMaps);
	Game.main.asteroid = asteroid;
	scene2.add(asteroid);

}

function loadJSON(callback) {
	console.log("INIT JSON object load...")
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'json/object/nav.json', true); // Replace 'my_data' with
	// the path
	// to your file
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a
			// value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

/**
 * Adds the planet.
 */
Game.main.addPlanet = function() {
	// Generats a bumpmap and a texturemap
	var textureMaps = Game.textures.generateTextures();
	// Time to go into the planet creation.
	var planet = new Game.planet.Planet(planetRadius * 1.02,
			textureMaps.textureMaps, textureMaps.bumpMaps);
	// Adds the planet to the scene.
	Game.main.planet = planet;
	scene.add(planet);
}

/**
 * Adds the planets clouds.
 */
Game.main.addClouds = function(cloudTexture, cloudTexture2) {
	Game.main.addLight();
	// Create our clouds
	var uniforms = {
		time : {
			type : 'f',
			value : window.time / 100000000000
		},
		texture1 : {
			type : 't',
			value : cloudTexture2
		},
		texture2 : {
			type : 't',
			value : cloudTexture
		},
		randRedColor : {
			type : 'f',
			value : redPlanetColor
		},
		randGreenColor : {
			type : 'f',
			value : greenPlanetColor
		},
		randBlueColor : {
			type : 'f',
			value : bluePlanetColor
		}
	};
	this.uniforms = uniforms

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.Repeat;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.Repeat;

	var geometry = new THREE.SphereGeometry(planetRadius * 1.03, 32, 32);
	var material = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : cloudsVertexShader,
		fragmentShader : cloudsFragmentShader,
		overdraw : 0.5,
		transparent : true,
		depthWrite : true
	});
	var cloudsMesh = new THREE.Mesh(geometry, material);

	// Save it away so we can rotate it
	this.cloudsMesh = cloudsMesh;

	scene.add(cloudsMesh);
	cloudsAdded = true;

	// Add's all the scen's content.
	Game.main.addSceneContent(scene);
}
/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.clouds = Game.clouds || {};

/**
 * Adds the planets clouds.
 */
Game.clouds.addClouds = function(cloudTexture, cloudTexture2) {
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

	var geometry = new THREE.SphereGeometry(5.07, 32, 32);
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
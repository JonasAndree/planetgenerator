"use strict";

window.Game = window.Game || {};
Game.galaxy = Game.galaxy || {};

Game.lowgraphics = true;
// 256 = 11 seconds (before), 512 = 5 seconds (now)
var maxDetail = Game.lowgraphics ? 16 : 512;
/**
 * 
 */
Game.galaxy.Galaxy = function(planetRadius, textureMaps) {
	THREE.Object3D.call(this);

	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push(
		// Game.material.shaderMaterial(textureMaps[i])
		Game.material.galaxyMaterial(textureMaps[i]));
	}

	/*
	 * Makes the spehere and by changing the faces normals and dos the
	 * bumpmaping.
	 */
	var sphere = new Game.galaxymap.Sphere(planetRadius, materialArray);
	this.add(sphere);
}
Game.galaxy.Galaxy.prototype = Object.create(THREE.Object3D.prototype);
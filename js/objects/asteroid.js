"use strict";

window.Game = window.Game || {};
Game.asteroid = Game.asteroid || {};

Game.lowgraphics = true;
// 256 = 11 seconds (before), 512 = 5 seconds (now)
var maxDetail = Game.lowgraphics ? 16 : 512;

Game.asteroid.Ansteroid = function(planetRadius, textureMaps, bumpMaps) {
	THREE.Object3D.call(this);

	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push(Game.material.asteroidShaderMaterial(textureMaps[i],
				bumpMaps[i]));
	}
	var sphere = new Game.spheremap.Sphere(planetRadius, materialArray);
	this.add(sphere);
}
Game.asteroid.Ansteroid.prototype = Object.create(THREE.Object3D.prototype);
"use strict";

window.Game = window.Game || {};
Game.planet = Game.planet || {};
	
Game.lowgraphics = true;
var maxDetail = Game.lowgraphics ? 16 : 512; //256 = 11 seconds (before), 512 = 5 seconds (now)

Game.planet.Planet = function(planetRadius, textureMaps, bumpMaps) {
	THREE.Object3D.call(this);
	
	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push(Game.material.shaderMaterial(textureMaps[i], bumpMaps[i]));
	}
	
	var sphere = new Game.spheremap.Sphere(planetRadius, materialArray);
	this.add(sphere);
}
Game.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);
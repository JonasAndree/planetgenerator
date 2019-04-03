/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.planetCore = Game.planetCore || {};

/**
 * Adds the dark planet core.
 */
Game.planetCore.addDarkPlanetCore = function() {
	var geometry = new THREE.SphereGeometry(planetRadius*0.999, 32, 32);
	var material = new THREE.MeshBasicMaterial({
		color : 0x000000,
		depthWrite : true
	});
	var black = new THREE.Mesh(geometry, material);
	scene.add(black);
}
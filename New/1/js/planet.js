"use strict";

window.Game = window.Game || {};
Game.planet = Game.planet || {};

Game.lowgraphics = true;
//256 = 11 seconds (before), 512 = 5 seconds (now)
var maxDetail = Game.lowgraphics ? 16 : 512; 

Game.planet.Planet = function(planetRadius, textureMaps, bumpMaps) {
	/**Object3D
	 * 	Base class for scene graph objects.
	 * 
	 * .call javascript
	 * 	The call() method calls a function with a given 
	 * 	this value and arguments provided individually.
	 */
	THREE.Object3D.call(this);
	
	var materialArray = [];
	for (var i = 0; i < 6; i++) {
		materialArray.push(
				Game.material.shaderMaterial(
						textureMaps[i], 
						bumpMaps[i]
				)
		);
	}
	/* Makes the spehere and by changing the faces normals and 
	 * dos the bumpmaping. 
	 */
	var sphere = new Game.spheremap.Sphere(
					planetRadius, 
					materialArray);
	this.add(sphere);
}
Game.planet.Planet.prototype = Object.create(THREE.Object3D.prototype);
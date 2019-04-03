"use strict";

window.Game = window.Game || {};
Game.galaxymap = Game.galaxymap || {};

/**
 * Sphere
 * 
 * @param radius -
 *            the readius of the planet.
 * @param materialArray -
 *            an array with the materials
 */
Game.galaxymap.Sphere = function(radius, materialArray) {
	THREE.Object3D.call(this);
	radius = radius || 1;
	var geometry = new THREE.BoxGeometry(1, 1, 1, 64, 64, 64);

	for ( var i in geometry.vertices) {
		var vertex = geometry.vertices[i];
		vertex.normalize().multiplyScalar(radius);
	}
	Game.util.computeGeometry(geometry);
	var computeVertexNormals = function(geometry) {
		for (var f = 0; f < geometry.faces.length; f++) {
			var face = geometry.faces[f];
			face.vertexNormals[0] = geometry.vertices[face.a].clone()
					.normalize();
			face.vertexNormals[1] = geometry.vertices[face.b].clone()
					.normalize();
			face.vertexNormals[2] = geometry.vertices[face.c].clone()
					.normalize();
		}
	}
	computeVertexNormals(geometry);

	var sphereMaterial = new THREE.MeshFaceMaterial(materialArray);
	var sphere = new THREE.Mesh(geometry, sphereMaterial);

	this.add(sphere);
}
Game.galaxymap.Sphere.prototype = Object.create(THREE.Object3D.prototype);
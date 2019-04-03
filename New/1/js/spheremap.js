"use strict";

window.Game = window.Game || {};
Game.spheremap = Game.spheremap || {};
/**
 * Sphere
 * @param radius - the readius of the planet.
 * @param materialArray - an array with the materials  
 */
Game.spheremap.Sphere = function(radius, materialArray) {
	THREE.Object3D.call(this);
	// if no radius defult radius = 1 
	radius = radius || 1;
	
	/**
	 * The idé here is to create a qube and bend it like  a sphere 
	 * due to the fact that when we later uv map a plane texture to it we 
	 * will we will not get a strange bent look. 
	 * BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
	 * width — Width of the sides on the X axis.
	 * height — Height of the sides on the Y axis.
	 * depth — Depth of the sides on the Z axis.
	 * widthSegments — Optional. 
	 * 					Number of segmented faces along the width of the sides. Default is 1.
	 * heightSegments — Optional. 
	 * 					Number of segmented faces along the height of the sides. Default is 1.
	 * depthSgments — Optional. 
	 * 					Number of segmented faces along the depth of the sides. Default is 1.
	 */
	var geometry = new THREE.BoxGeometry(1, 1, 1, 64, 64, 64);
	/** 
	 * Normalises the direction of the vertex and then multiplies 
	 * the radius. This makes the cube round
	 */
	for (var i in geometry.vertices) {
		var vertex = geometry.vertices[i];
		vertex.normalize().multiplyScalar(radius);
	}
	// Fixes the bounding box geometry. Basicly setting the orgins of the geo.
	Game.util.computeGeometry(geometry);
	
	var computeVertexNormals = function(geometry) {
		/**.faces
		 * Array of triangles.
		 * The array of faces describe how each vertex in the model 
		 * is connected with each other.
		 * To signal an update in this array, 
		 * Geometry.elementsNeedUpdate needs to be set to true.
		 */
		for (var f = 0; f < geometry.faces.length; f++) {
			var face = geometry.faces[f];
			/** Face3( a, b, c, normal, color, materialIndex )
			 * 	a 		— Vertex A index.
			 * 	b 		— Vertex B index.
			 * 	c 		— Vertex C index.
			 * 	normal 	— Face normal or array of vertex normals.
			 * 	color 	— Face color or array of vertex colors.
			 * 	materialIndex — Material index.
			 * 
			 * .vertexNormals
			 * 	Array of 3 vertex normals.
			 * 
			 * .clone()
			 * 	Creates a new clone of the Face3 object.
			 * 
			 * http://threejs.org/docs/#Reference/Core/Face3
			 */
			face.vertexNormals[0] = geometry.vertices[face.a].clone().normalize();
			face.vertexNormals[1] = geometry.vertices[face.b].clone().normalize();
			face.vertexNormals[2] = geometry.vertices[face.c].clone().normalize();
		}
	}
	// TODO: Why is this neccessary? 
	//(Why does geometry.computeVertexNormals not work correctly?)
	computeVertexNormals(geometry); 
	
	var sphereMaterial = new THREE.MeshFaceMaterial(materialArray);
	var sphere = new THREE.Mesh(geometry, sphereMaterial);
	
	this.add(sphere);
}
Game.spheremap.Sphere.prototype = Object.create(THREE.Object3D.prototype);
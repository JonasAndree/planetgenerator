/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.stars = Game.stars || {};

/**
 * Adds the stars
 */
Game.stars.addStars = function() {
	
	var geometry, color, size, materials = [], parameters = {}, parameterCount, particles;
	var geometry = new THREE.Geometry();

	var stars = 500;
	for (var i = 0; i < stars; i++) {
		var vertex = new THREE.Vector3();
		var radDias = 1400;
		var radius = (Math.random() * 4 + 4) * radDias;
		var theta = Math.random() * 2 * Math.PI;
		var varphi = Math.random() * Math.PI;

		vertex.x = radius * Math.cos(theta) * Math.sin(varphi);
		vertex.y = radius * Math.sin(theta) * Math.sin(varphi);
		vertex.z = radius * Math.cos(varphi);

		geometry.vertices.push(vertex);
	}
	for (i = 0; i < stars; i++) {
		materials[i] = new THREE.PointCloudMaterial({
			size : 75,
			map : starTexture,
			blending : THREE.AdditiveBlending,
			transparent : true
		});
		materials[i].color.setHSL(Math.random(), Math.random(), 1);
		particles = new THREE.PointCloud(geometry, materials[i]);
	}
	var geometry = new THREE.Geometry();
	scene.add(particles);

	var stars = 5000;
	for (var i = 0; i < stars; i++) {
		var vertex = new THREE.Vector3();
		var radDias = 1400;
		var radius = (Math.random() * 4 + 4) * radDias;
		var theta = Math.random() * 2 * Math.PI;
		var varphi = Math.random() * Math.PI;

		vertex.x = radius * Math.cos(theta) * Math.sin(varphi);
		vertex.y = radius * Math.sin(theta) * Math.sin(varphi);
		vertex.z = radius * Math.cos(varphi);

		geometry.vertices.push(vertex);
	}

	for (i = 0; i < stars; i++) {
		materials[i] = new THREE.PointCloudMaterial({
			size : 10,
		// map: starTexture,
		// blending: THREE.AdditiveBlending,
		// transparent: true
		});
		materials[i].color.setHSL(Math.random(), Math.random(), 1);
		particles = new THREE.PointCloud(geometry, materials[i]);
	}
	scene.add(particles);
}
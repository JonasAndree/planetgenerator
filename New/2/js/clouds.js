"use strict";

window.Game = window.Game || {};
Game.clouds = Game.clouds || {};

Game.lowgraphics = true;
var maxDetail = Game.lowgraphics ? 16 : 512; 

Game.clouds.Clouds = function(planetRadius){
	// Create a group to hold our clouds mesh and light
	THREE.Object3D.call(this);

    var cloudsMaterial = Game.material.cloudShaderMaterial();
    
	var cloudsGeometry = new THREE.SphereGeometry(
    		planetRadius + 0.2, 
    		32, 
    		32
    );
    	
	var cloudSphere = new THREE.Mesh( 
    	cloudsGeometry, 
    	cloudsMaterial
    );
    this.add(cloudSphere);
}   
Game.clouds.Clouds.prototype = Object.create(THREE.Object3D.prototype);
	// Tuck away the uniforms so that we can animate them over time
	//this.uniforms = uniforms;

	// Set up a clock to drive the animation
	//this.clock = new THREE.Clock();

    // Add it to our group
    //this.object3D.add(cloudsMesh);
	
    // Save it away so we can rotate it
    //this.cloudsMesh = cloudsMesh;
    
	//var light = new THREE.PointLight( 0xffffff, 1.2, 1000 );   

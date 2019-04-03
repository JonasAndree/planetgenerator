"use strict";
/**
 * Defines that JavaScript code should be executed in "strict mode".
 * 	With strict mode, you can not, for example, use undeclared variables.
 * 
 * You can read more at:
 * 	http://www.w3schools.com/js/js_strict.asp
 */

window.Game = window.Game || {};
Game.material = Game.material || {};
/**
 * WebGl shaderbased material.
 */
Game.material.shaderMaterial = function(textureMap, bumpMap) {
	/**
	 * Variables seen by the fragment shader and vertex shader.
	 */
	var uniforms = {
		"pointLightPosition": {
			"type": "v3", 
			"value": sunLight.position
		},
		"map": {
			"type": "t", 
			"value": textureMap
		},
		"normalMap": {
			"type": "t", 
			"value": Game.util.heightToNormalMap(bumpMap, 4.0)
		}
	};
	/**
	 * ShaderMaterial
	 * 
	 * Material rendered with custom shaders. A shader is a small program written in GLSL to run on the GPU. 
	 * You may want to use a custom shader if you need to:
	 * 	implement an effect not included with any of the built-in materials
	 * 	combine many objects into a single Geometry or BufferGeometry in order to improve performance
	 * 	There are the following notes to bear in mind when using a ShaderMaterial:
	 * 		A ShaderMaterial will only be rendered properly by WebGLRenderer, 
	 * 		since the GLSL code in the vertexShader and fragmentShader properties must be compiled and run on the GPU using WebGL.
	 * 		As of THREE r72, directly assigning attributes in a ShaderMaterial is no longer supported. 
	 * 		A BufferGeometry instance (instead of a Geometry instance) must be used instead, using BufferAttribute instances to define custom attributes.
	 * 
	 * ShaderMaterial(parameters)
	 * 	parameters -- An object containing various parameters setting up shaders and their uniforms.
	 * 	shading — Define shading type. Default is THREE.SmoothShading.
	 * 	fog — Define whether the material color is affected by global fog settings. Default is true.
	 * 	wireframe — render geometry as wireframe. Default is false.
	 * 	wireframeLinewidth — Line thickness. Default is 1.
	 * 	vertexColors — Define how the vertices gets colored. Default is THREE.NoColors.
	 * 	skinning — Define whether the material uses skinning. Default is false.
	 * 	morphTargets — Define whether the material uses morphTargets. Default is false.
	 */
	return new THREE.ShaderMaterial({
		/** .uniforms
		 * 		Object specifying the uniforms to be passed to the shader code; 
		 * 		keys are uniform names, values are definitions of the form
		 */
		uniforms: uniforms,
		/**.vertexShader
		 * 	Vertex shader GLSL code. This is the actual code for the shader.
		 */
		vertexShader: planetVertexShader,
		/**.fragmentShader
		 * 	Fragment shader GLSL code. This is the actual code for the shader.
		 */
		fragmentShader: planetPragmentShader,
		transparent: true
	});
}





/**
 * Clods material
 */
Game.material.cloudShaderMaterial = function() {
	var cloudsMap = "img/earth_clouds_1024.png";
	var NOISEMAP = "img/cloud.png";
	var loader = new THREE.TextureLoader();
	
	// load a texture, set wrap mode to repeat
	//var texture1 = 
	/*texture1.wrapS = THREE.RepeatWrapping;
	texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set( 4, 4 );*/

	// load a texture, set wrap mode to repeat
	//var texture2 = loader.load( NOISEMAP );
	/*texture2.wrapS = THREE.RepeatWrapping;
	texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat.set( 4, 4 );*/
	
	//uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
	//uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.Repeat;
	
	// Create our clouds
	var uniforms = {
		/*time: { 
			"type": "f", 
			"value": 1.0 
		},*/
		texture1: {
			"type": "t", 
			"value": 0, 
			"texture": loader.load( cloudsMap )
		},
		texture2: { 
			"type": "t", 
			"value": 1, 
			"texture": loader.load( NOISEMAP )
		}
	};
	
	return new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: cloudsVertexShader,
		fragmentShader: cloudsFragmentShader,
		color: 0xFFFFFF, 
		map: cloudsMap, 
		transparent: true
	});
}









/**
 * Generated 
 */
Game.material.textureGeneratorMaterial = function(index) {
	var uniforms = {
		index: {type: "i", value: index}
	};
	return new THREE.ShaderMaterial({
		uniforms: 		uniforms,
		vertexShader: 	textureGeneratorVertexShader,
		fragmentShader: textureGeneratorFragmentShader,
		transparent: 	true,
		depthWrite: 	false
	});
}
"use strict";
/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 * 
 * You can read more at: http://www.w3schools.com/js/js_strict.asp
 */

window.Game = window.Game || {};
Game.material = Game.material || {};

/**
 * WebGl shaderbased material.
 */
Game.material.planetShaderMaterial = function(textureMap, bumpMap) {
	/**
	 * Variables seen by the fragment shader and vertex shader.
	 */

	var uniforms = {
		pointLightPosition : {
			type : 'v3',
			value : sunLight.position
		},
		map : {
			type : 't',
			value : textureMap
		},
		normalMap : {
			type : 't',
			value : Game.util.heightToNormalMap(bumpMap, 4.0)
		},
		randRedColor : {
			type : 'f',
			value : redPlanetColor
		},
		randGreenColor : {
			type : 'f',
			value : greenPlanetColor
		},
		randBlueColor : {
			type : 'f',
			value : bluePlanetColor
		},
	};
	/**
	 * ShaderMaterial
	 * 
	 * Material rendered with custom shaders. A shader is a small program
	 * written in GLSL to run on the GPU. You may want to use a custom shader if
	 * you need to: implement an effect not included with any of the built-in
	 * materials combine many objects into a single Geometry or BufferGeometry
	 * in order to improve performance There are the following notes to bear in
	 * mind when using a ShaderMaterial: A ShaderMaterial will only be rendered
	 * properly by WebGLRenderer, since the GLSL code in the vertexShader and
	 * fragmentShader properties must be compiled and run on the GPU using
	 * WebGL. As of THREE r72, directly assigning attributes in a ShaderMaterial
	 * is no longer supported. A BufferGeometry instance (instead of a Geometry
	 * instance) must be used instead, using BufferAttribute instances to define
	 * custom attributes.
	 * 
	 * ShaderMaterial(parameters) parameters -- An object containing various
	 * parameters setting up shaders and their uniforms. shading — Define
	 * shading type. Default is THREE.SmoothShading. fog — Define whether the
	 * material color is affected by global fog settings. Default is true.
	 * wireframe — render geometry as wireframe. Default is false.
	 * wireframeLinewidth — Line thickness. Default is 1. vertexColors — Define
	 * how the vertices gets colored. Default is THREE.NoColors. skinning —
	 * Define whether the material uses skinning. Default is false. morphTargets —
	 * Define whether the material uses morphTargets. Default is false.
	 */
	return new THREE.ShaderMaterial({
		/**
		 * .uniforms Object specifying the uniforms to be passed to the shader
		 * code; keys are uniform names, values are definitions of the form
		 */
		uniforms : uniforms,
		/**
		 * .vertexShader Vertex shader GLSL code. This is the actual code for
		 * the shader.
		 */
		vertexShader : planetVertexShader,
		/**
		 * .fragmentShader Fragment shader GLSL code. This is the actual code
		 * for the shader.
		 */
		fragmentShader : planetFragmentShader,
		transparent : true,
	});
}


Game.material.asteroidShaderMaterial = function(textureMap, bumpMap) {
	var uniforms = {
		pointLightPosition : {
			type : 'v3',
			value : sunLight2.position
		},
		map : {
			type : 't',
			value : textureMap
		},
		normalMap : {
			type : 't',
			value : Game.util.heightToNormalMap(bumpMap, 4.0)
		},
		randRedColor : {
			type : 'f',
			value : redPlanetColor
		},
		randGreenColor : {
			type : 'f',
			value : greenPlanetColor
		},
		randBlueColor : {
			type : 'f',
			value : bluePlanetColor
		},
	};
	return new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : asteroidAtmoVertexShader,
		fragmentShader : asteroidAtmoFragmentShader,
		transparent : true,
	});
}
/**
 * Galaxy shader material.
 */
Game.material.galaxyMaterial = function(textureMaps, bumpMap) {
	return new THREE.MeshBasicMaterial({
		map : textureMaps,
		side : THREE.BackSide,
		transparent : true,
		depthWrite : true
	});
	// material.side = THREE.BackSide;
}

/**
 * Generater for planet texture
 */
Game.material.textureGeneratorMaterial = function(index) {
	var uniforms = {
		index : {
			type : 'i',
			value : index
		},
		randomFloatX : {
			type : 'f',
			value : randomFloatXV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatYV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatYV
		},
		randomRed : {
			type : 'f',
			value : randomFloatR
		},
		randomGreen : {
			type : 'f',
			value : randomFloatG
		},
		randomBlue : {
			type : 'f',
			value : randomFloatB
		},
	};
	return new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : textureGeneratorVertexShader,
		fragmentShader : textureGeneratorFragmentShader,
		transparent : true,
		depthWrite : true
	});
}


/**
 * Generater for asteroid texture
 */
Game.material.asteroidTextureGeneratorMaterial = function(index, resolution) {
	var uniforms = {
		res : {
			type : 'i',
			value : resolution
		},
		index : {
			type : 'i',
			value : index
		},
		randomFloatX : {
			type : 'f',
			value : randomFloatXV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatYV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatYV
		},
		randomRed : {
			type : 'f',
			value : randomFloatR
		},
		randomGreen : {
			type : 'f',
			value : randomFloatG
		},
		randomBlue : {
			type : 'f',
			value : randomFloatB
		},
	};
	return new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : asteroidVertexShader,
		fragmentShader : asteroidFragmentShader,
		transparent : true,
		depthWrite : true
	});
}

/**
 * Generater for galaxy material
 */
Game.material.textureGalaxyGeneratorMaterial = function(index) {
	var uniforms = {
		index : {
			type : 'i',
			value : index
		},
		randomFloatX : {
			type : 'f',
			value : randomFloatXV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatYV
		},
		randomFloatY : {
			type : 'f',
			value : randomFloatZV
		},
		randomRed : {
			type : 'f',
			value : redPlanetColor * randomFloatR
		},
		randomGreen : {
			type : 'f',
			value : greenPlanetColor * randomFloatG
		},
		randomBlue : {
			type : 'f',
			value : bluePlanetColor * randomFloatB
		},
	};
	return new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : textureGalaxyGeneratorVertexShader,
		fragmentShader : textureGalaxyGeneratorFragmentShader,
		transparent : true,
		depthWrite : true
	});
}
/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.textures = Game.textures || {};

/**
 * This function will generate two types of plane maps First a texture map that
 * will decide the look of the planet. The other a bumpMap generated from the
 * texture map.
 */
Game.textures.generateTextures = function() {
	var textureMaps = [];
	var bumpMaps = [];
	var resolution = 1024;

	for (var index = 0; index < 6; index++) {
		/**
		 * WebGLRenderTarget A render target is a buffer where the video card
		 * draws pixels for a scene that is being rendered in the background. It
		 * is used in different effects.
		 * 
		 * WebGLRenderTarget(width, height, options) width -- The width of the
		 * renderTarget. height -- The height of the renderTarget. options --
		 * The options sets the properties of the render target.
		 */
		var texture = new THREE.WebGLRenderTarget(resolution, resolution, {
			minFilter : THREE.LinearFilter,
			magFilter : THREE.LinearFilter,
			format : THREE.RGBFormat
		});
		/**
		 * OrthographicCamera Camera with orthographic projection.
		 * 
		 * OrthographicCamera( left, right, top, bottom, near, far ) left —
		 * Camera frustum left plane. right — Camera frustum right plane. top —
		 * Camera frustum top plane. bottom — Camera frustum bottom plane. near —
		 * Camera frustum near plane. far — Camera frustum far plane.
		 */
		var textureCamera = new THREE.OrthographicCamera(-resolution / 2,
				resolution / 2, resolution / 2, -resolution / 2, -100, 100);
		textureCamera.position.z = 10;

		var textureScene = new THREE.Scene();
		var plane = new THREE.Mesh(
		/**
		 * PlaneGeometry A class for generating plane geometries
		 * 
		 * PlaneGeometry(width, height, widthSegments, heightSegments) width —
		 * Width along the X axis. height — Height along the Y axis.
		 * widthSegments — Optional. Default is 1. heightSegments — Optional.
		 * Default is 1.
		 */
		new THREE.PlaneGeometry(resolution, resolution),
		/* Generated texture for the plain. */
		new Game.material.textureGeneratorMaterial(index));

		plane.position.z = -10;
		textureScene.add(plane);
		/**
		 * .render ( scene, camera, renderTarget, forceClear )
		 * 
		 * Render a scene using a camera. The render is done to the renderTarget
		 * (if specified) or to the canvas as usual. If forceClear is true, the
		 * depth, stencil and color buffers will be cleared before rendering
		 * even if the renderer's autoClear property is false. Even with
		 * forceClear set to true you can prevent certain buffers being cleared
		 * by setting either the .autoClearColor, .autoClearStencil or
		 * .autoClearDepth properties to false.
		 */
		renderer.render(textureScene, textureCamera, texture, true);

		renderer.sortObjects = false;
		var buffer = new Uint8Array(resolution * resolution * 4);
		/**
		 * .getContext () Return the WebGL context
		 */
		var gl = renderer.getContext();
		/**
		 * gl.readPixels(x, y, width, height, format, type, pixels) x - A GLint
		 * specifying the first horizontal pixel that is read from the lower
		 * left corner of a rectangular block of pixels. y - A GLint specifying
		 * the first vertical pixel that is read from the lower left corner of a
		 * rectangular block of pixels. width - A GLsizei specifying the width
		 * of the rectangle. height - A GLsizei specifying the height of the
		 * rectangle. format - A GLenum specifying the format of the pixel data.
		 * Possible values: gl.ALPHA: Discards the red, green and blue
		 * components and reads the alpha component. gl.RGB: Discards the alpha
		 * components and reads the red, green and blue components. gl.RGBA:
		 * Red, green, blue and alpha components are read from the color buffer.
		 * type - A GLenum specifying the data type of the pixel data. Possible
		 * values: gl.UNSIGNED_BYTE gl.UNSIGNED_SHORT_5_6_5
		 * gl.UNSIGNED_SHORT_4_4_4_4 gl.UNSIGNED_SHORT_5_5_5_1 gl.FLOAT pixels -
		 * An ArrayBufferView object to read data into. The array type must
		 * match the type of the type parameter. Uint8Array for
		 * gl.UNSIGNED_BYTE. Uint16Array for gl.UNSIGNED_SHORT_5_6_5,
		 * gl.UNSIGNED_SHORT_4_4_4_4, or gl.UNSIGNED_SHORT_5_5_5_1. Float32Array
		 * for gl.FLOAT.
		 */
		gl.readPixels(0, 0, resolution, resolution, gl.RGBA, gl.UNSIGNED_BYTE,
				buffer);
		// Adds the new texture to the texture map.
		textureMaps.push(texture);
		// creates and pushes the bump map
		bumpMaps.push({
			image : {
				data : buffer,
				height : resolution,
				width : resolution
			}
		});
	}
	return {
		textureMaps : textureMaps,
		bumpMaps : bumpMaps
	};
}
/**
 * Generates the 2d textures 6 for the cubes 2 for the clouds
 */
Game.textures.generate2dTextures = function(numberOfTexturs) {
	var textureMaps = [];
	var resolution = 1024;

	for (var index = 0; index < numberOfTexturs; index++) {
		var texture = new THREE.WebGLRenderTarget(resolution, resolution, {
			minFilter : THREE.LinearFilter,
			magFilter : THREE.LinearFilter,
			format : THREE.RGBFormat
		});
		var textureCamera = new THREE.OrthographicCamera(-resolution / 2,
				resolution / 2, resolution / 2, -resolution / 2, -100, 100);
		textureCamera.position.z = 10;

		var textureScene = new THREE.Scene();
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(resolution,
				resolution), new Game.material.textureGalaxyGeneratorMaterial(
				index));

		plane.position.z = -10;
		textureScene.add(plane);
		renderer.render(textureScene, textureCamera, texture, true);
		renderer.sortObjects = false;

		var buffer = new Uint8Array(resolution * resolution * 4);
		var gl = renderer.getContext();
		gl.readPixels(0, 0, resolution, resolution, gl.RGBA, gl.UNSIGNED_BYTE,
				buffer);
		textureMaps.push(texture);
	}

	return {
		textureMaps : textureMaps
	};
}
/**
 * This function will generate two types of plane maps First a texture map that
 * will decide the look of the planet. The other a bumpMap generated from the
 * texture map.
 */
Game.textures.generateAsteroidTextures = function(resolution) {
	var textureMaps = [];
	var bumpMaps = [];

	for (var index = 0; index < 6; index++) {
		var texture = new THREE.WebGLRenderTarget(resolution, resolution, {
			minFilter : THREE.LinearFilter,
			magFilter : THREE.LinearFilter,
			format : THREE.RGBFormat
		});
		var textureCamera = new THREE.OrthographicCamera(-resolution / 2,
				resolution / 2, resolution / 2, -resolution / 2, -100, 100);
		textureCamera.position.z = 10;
		
		var textureScene = new THREE.Scene();
		var plane = new THREE.Mesh(
		new THREE.PlaneGeometry(resolution, resolution),
		/* Generated texture for the plain. */
		new Game.material.asteroidTextureGeneratorMaterial(index, resolution));

		plane.position.z = -10;
		textureScene.add(plane);

		renderer.render(textureScene, textureCamera, texture, true);

		renderer.sortObjects = false;
		var buffer = new Uint8Array(resolution * resolution * 4);

		var gl = renderer.getContext();

		gl.readPixels(0, 0, resolution, resolution, gl.RGBA, gl.UNSIGNED_BYTE,
				buffer);
		// Adds the new texture to the texture map.
		textureMaps.push(texture);
		// creates and pushes the bump map
		bumpMaps.push({
			image : {
				data : buffer,
				height : resolution,
				width : resolution
			}
		});
	}
	return {
		textureMaps : textureMaps,
		bumpMaps : bumpMaps
	};
}
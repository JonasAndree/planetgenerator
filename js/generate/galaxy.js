/**
 * Defines that JavaScript code should be executed in "strict mode". With strict
 * mode, you can not, for example, use undeclared variables.
 */
"use strict";

window.Game = window.Game || {};
Game.galaxy = Game.galaxy || {};

/**
 * Adds the galaxy noice.
 */
Game.galaxy.addGalaxy = function() {
	var numborOfSids = 6;
	var textureMaps = Game.textures.generate2dTextures(numborOfSids);
	var galaxy = new Game.galaxy.Galaxy(80000, textureMaps.textureMaps);
	scene.add(galaxy);
}
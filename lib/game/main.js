/*
 * This code was created by Mu Beer Folly (@MuBeerFolly) for the Spectre Prison project
 * The full source for the original Spectre Prision is avaiable on GitHub:
 * https://github.com/mtg101/Spectre-Prison
 *
 * This is code is liscenced under Creative Commons Attribution
 * https://creativecommons.org/licenses/by/3.0/
 *
 */

ig.module(
	'game.main'
) .requires(
	'impact.game',
	'game.startscreen',
	'game.levelscreen',
	'impact.debug.debug'
) .defines(function(){

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.global.level = LevelOne;
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});

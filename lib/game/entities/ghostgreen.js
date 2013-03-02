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
  'game.entities.ghostgreen'
).requires(
  'impact.entity',
  'game.entities.ghost'
).defines(function() {
	
	 EntityGhostgreen = EntityGhost.extend({
        animSheet: new ig.AnimationSheet( 'media/ghost-green.png', 16, 16 ),
        handleEnterLight: function() {
          console.log('green ghost enter light: ' + this.name);
          this.kill();
        },
        handleExitLight: function() {
          console.log('green ghost exit light? I should be dead... ' + this.name);
        }
   });
});
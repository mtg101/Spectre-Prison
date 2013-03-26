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
  'game.entities.ghostyellow'
).requires(
  'impact.entity',
  'game.entities.ghost'
).defines(function() {
	
	 EntityGhostyellow = EntityGhost.extend({
    	  ghostType: 'yellow',
        inLight: false,
        animSheet: new ig.AnimationSheet( 'media/ghost-yellow.png', 16, 16 ),
        handleEnterLight: function() {
          this.currentAnim.alpha = 0.3;
          this.inLight = true;
        },
        handleExitLight: function() {
          this.currentAnim.alpha = 1;
          this.inLight = false;
        },
        check: function(other) {
          if(this.inLight == true) {
            return;
          }
          this.parent(other);
        }
   });

});

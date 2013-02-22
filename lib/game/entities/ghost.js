/*
 * This code was created by Mu Beer Folly (@MuBeerFolly) for the Spectre Prison project
 * The full source for the original Spectre Prision is avaiable on GitHub:
 * https://github.com/mtg101/Spectre-Prison
 *
 * This is code is liscenced under Creative Commons Attribution
 * https://creativecommons.org/licenses/by/3.0/
 *
 */

// Specific types of ghosts are imlemented as subclasses.
// This was mainly done as a way of learning how to use impactJS's classing system.
// It may be better to have the type of ghost as a parameter of the class.

ig.module(
  'game.entities.ghost'
).requires(
  'impact.entity'
).defines(function() {
	
	 EntityGhost = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/ghost.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 2},
        flip: false,
        friction: {x: 150, y: 0},
        gravityFactor: 0,
        speed: 14,
        maxVel: {x: 100, y: 150},
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'haunt', 0.04, [0,1,2,3] );
        },
        update: function() {
          var xdir = this.flip ? -1 : 1;
          this.vel.x = this.speed * xdir;
          this.currentAnim.flip.x = this.flip;
          this.parent();
        },
        handleMovementTrace: function( res ) {
          //ovverride collisions with background
          res.collision.x = false;
          res.pos.x = this.pos.x + this.vel.x * ig.system.tick;          
          res.collision.y = false;
          res.pos.y = this.pos.y + this.vel.y * ig.system.tick;          
          this.parent( res );
        }
   });
});
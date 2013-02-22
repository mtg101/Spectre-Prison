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

// paths are based on cmd: properties
// cmd: 'die' # kills entity
// cmd: 'stop' dur: N # stops for N seconds
// cmd: 'move', dur: N, vel {x: vX, y: vY} # moves in direction 'vel' for N seconds
// cmd: 'goto', index: I # goes to index I in the path

ig.module(
  'game.entities.ghost'
).requires(
  'impact.entity'
).defines(function() {
	
	 EntityGhost = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/ghost.png', 16, 16 ),
        gravityFactor: 0,
        pathIndex: 0,
        path: [{cmd: 'move', dur: 3, vel: {x: 10, y:0}}, {cmd: 'move', dur: 3, vel: {x: -10, y:0}}, {cmd: 'move', dur: 3, vel: {x: 0, y:-10}}, {cmd: 'move', dur: 3, vel: {x: 0, y:10}}, {cmd: 'goto', index: 0}],
        maxVel: {x: 100, y: 150},
        timer: null,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'haunt', 0.1, [0,1,2,3] );
          this.doPathAction();
        },
        update: function() {
          if(this.timer && this.timer.delta() > 0) {
            this.nextPathMovement();
          }
          this.parent();
        },
        handleMovementTrace: function( res ) {
          //ovverride collisions with background
          res.collision.x = false;
          res.pos.x = this.pos.x + this.vel.x * ig.system.tick;          
          res.collision.y = false;
          res.pos.y = this.pos.y + this.vel.y * ig.system.tick;          
          this.parent( res );
        },
        nextPathMovement: function() {
          this.pathIndex++;
          this.doPathAction();
        },
        doPathAction: function() {
          //check end of path
          if(this.pathIndex > this.path.length) {
            this.kill(); // well we don't want them hanging around
            return;
          }
          switch(this.path[this.pathIndex].cmd) {
            case 'move':
              this.vel.x = this.path[this.pathIndex].vel.x;
              this.vel.y = this.path[this.pathIndex].vel.y;
              if (this.vel.x) {
                this.currentAnim.flip.x = this.vel.x > 0 ? false : true;
              }
              break;
            case 'goto':
              this.pathIndex = this.path[this.pathIndex].index;
              this.doPathAction();
              return; // we're done here, 'recursive' call has done the biz
            case 'stop':
              this.vel.x = 0;
              this.vel.y = 0;
              break;
            case 'die':
            default:
              this.kill();
              return; //we're done here
          }
          if(this.path[this.pathIndex].dur > 0){
            if(!this.timer) {
              this.timer = new ig.Timer();
            }
            this.timer.set(this.path[this.pathIndex].dur);
          } else {
            this.timer = null;
          }
        }
   });
});
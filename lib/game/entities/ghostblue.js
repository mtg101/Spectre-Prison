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
  'game.entities.ghostblue'
).requires(
  'impact.entity',
  'game.entities.ghost'
).defines(function() {
	
	 EntityGhostblue = EntityGhost.extend({
        animSheet: new ig.AnimationSheet( 'media/ghost-blue.png', 16, 16 ),
        handleEnterLight: function() {
          console.log('blue ghost enter light: ' + this.name);
          this.pausePath();
        },
        handleExitLight: function() {
          console.log('blue ghost exit light: ' + this.name);
          this.resumePathMovement();
        },
        drawPauseEffect: function() {
          if(!this.pauseTimer) {
            this.pauseTimer = new ig.Timer(Math.random()/2);
          }
          if(this.pauseTimer.delta() < 0)
            return;
          ig.game.spawnEntity(EntityGhostPauseParticle, this.pos.x, this.pos.y, {colorOffset: 0});
          this.pauseTimer.set(Math.random()/2);
        }
   });

    EntityGhostPauseParticle = ig.Entity.extend({
      size: {x: 2, y: 2},
      maxVel: {x: 160, y: 200},
      gravityFactor: 0.3,
      lifetime: .5,
      fadetime: .7,
      bounciness: 0,
      friction: {x:100, y: 100},
      vel: {x:100, y: 100},
      collides: ig.Entity.COLLIDES.LITE,
      colorOffset: 0,
      totalColors: 7,
      animSheet: new ig.AnimationSheet( 'media/rgparticles.png', 2, 2 ),
      init: function( x, y, settings ) {
        this.parent( x, y, settings );
        var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
        this.addAnim( 'idle', 0.2, [frameID] );
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        this.idleTimer = new ig.Timer();
      },
      update: function() {
        if( this.idleTimer.delta() > this.lifetime ) {
          this.kill();
          return;
        }
        this.currentAnim.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime, 1, 0 );
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
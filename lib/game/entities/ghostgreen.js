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
        ghostType: 'green',	
        animSheet: new ig.AnimationSheet( 'media/ghost-green.png', 16, 16 ),
        handleEnterLight: function() {
          this.kill();
        },
        handleExitLight: function() {
          console.log('green ghost exit light? I should be dead... ' + this.name);
        },
        kill: function(){
          this.parent();
          ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y );
        }
   });

    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        particles: 10,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityGhostDeathParticle, x, y, {colorOffset: 1});
                this.idleTimer = new ig.Timer();
            },
            update: function() {
                if( this.idleTimer.delta() > this.lifetime ) {
                    this.kill();
                }
            }
    });

    EntityGhostDeathParticle = ig.Entity.extend({
      size: {x: 2, y: 2},
      maxVel: {x: 160, y: 200},
      lifetime: 1,
      fadetime: 1,
      bounciness: 0,
      vel: {x: 50, y: 0},
      friction: {x:100, y: 0},
      collides: ig.Entity.COLLIDES.LITE,
      colorOffset: 0,
      totalColors: 7,
      animSheet: new ig.AnimationSheet( 'media/rgparticles.png', 2, 2 ),
      init: function( x, y, settings ) {
        this.parent( x, y, settings );
        var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
        this.addAnim( 'idle', 0.2, [frameID] );
        this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
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

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
  'game.entities.player'
).requires(
  'impact.entity',
	'game.entities.chatbubble'
).defines(function() {
	
	 EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 2},
        flip: false,
        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        frictionGround: {x: 600, y: 0},
        frictionAir: {x: 50, y: 0},
        accelGround: 400,
        accelAir: 0,
        jump: 80,
        startPosition: null,
        speaking: false,
        fallSpeed: 0,
        previousFalling: false,
        invincible: true,
        invincibleDelay: 2,
        invincibleTimer:null,
        type: ig.Entity.TYPE.A,
        init: function( x, y, settings ) {
          this.startPosition = {x:x,y:y};
          this.parent( x, y, settings );
          this.addAnim( 'idle', 1, [0] );
          this.addAnim( 'run', 0.07, [0,1,2,3,4,5] );
          this.addAnim( 'jump', 1, [9] );
          this.addAnim( 'fall', 0.4, [6,7] );
          this.invincibleTimer = new ig.Timer();
          this.makeInvincible();
        },
        update: function() {
          //check for falling death
          if (this.previousFalling && this.standing) {
            if (this.fallSpeed > 145) {
              this.kill();
              return;
            }
          }
          //remember falling state
          this.previousFalling = !this.standing;
          this.fallSpeed = this.vel.y;
          // check for climbable
          //is tile the way I'm facing a wall?
          if (this.standing == true) {
            var adjacentTile = ig.game.collisionMap.getTile(this.pos.x + (this.flip ? -1 : this.size.x), this.pos.y);
            if( adjacentTile ) {
              //console.log('I am facing a wall.');
              var adjacentAboveTile = ig.game.collisionMap.getTile(this.pos.x + (this.flip ? -1  : this.size.x), this.pos.y - this.size.y);
              if( !adjacentAboveTile) {
              //console.log('This wall can be climbed');
                if( this.flip == false && ig.input.pressed('right') ) {
                  //console.log('I should climb this wall to my right!');
                  this.pos.x += this.size.x;
                  this.pos.y -= this.size.y + 2;
                  return;
                } else if (this.flip == true && ig.input.pressed('left')) {
                  //console.log('I should climb this wall to my left!');
                  this.pos.x -= this.size.x;
                  this.pos.y -= this.size.y + 2;
                  return;
                }
              } else {
                var adjacentAboveAboveTile = ig.game.collisionMap.getTile(this.pos.x + (this.flip ? -1  : this.size.x), this.pos.y - (2*this.size.y));
                if (!adjacentAboveAboveTile) {
                  //console.log('This wall can be jump climbed');
                  if(ig.input.pressed('jump')) {
                    if( this.flip == false && ig.input.state('right') ) {
                      //console.log('I should jump climb this wall to my right!');
                      this.pos.x += this.size.x;
                      this.pos.y -= (this.size.y + 2) * 2;
                      return;
                    } else if (this.flip == true && ig.input.state('left')) {
                      //console.log('I should jump climb this wall to my left!');
                      this.pos.x -= this.size.x;
                      this.pos.y -= (this.size.y + 2) * 2;
                      return;
                    }
                  }
                } else {
                  //console.log('This wall too tall.');
                }
              }
            }
          }
          // realistic jumping
          this.friction = this.standing ? this.frictionGround : this.frictionAir;
          // move left or right
          var accel = this.standing ? this.accelGround : this.accelAir;
          if( ig.input.state('left') ) {
            this.accel.x = -accel;
            this.flip = true;
          }else if( ig.input.state('right') ) {
            this.accel.x = accel;
            this.flip = false;
          }else{
            this.accel.x = 0;
          }
          //check for edge of platform
          if (this.standing) {
            if( this.flip ) {
              if( !ig.game.collisionMap.getTile(this.pos.x +3 , this.pos.y + this.size.y+1) ) {
                if(this.vel.x <= 0) {
                  //console.log('not off the edge: left');
                  this.vel.x = 0;
                  this.accel.x = 0;
                }
                if (ig.input.pressed('left')) {
                  //console.log('OK move off left...');
                  this.pos.x -= 5;
                  this.vel.x = -40;
                }
                if (ig.input.pressed('jump')) {
                  //console.log('OK jump off left...');
                  this.pos.x -= 5;
                  this.pos.y -= 4;
                  this.vel.x = -40;
                }
              }
            } else { //not flipped
              if( !ig.game.collisionMap.getTile(this.pos.x + this.size.x -3 , this.pos.y + this.size.y+1) ) {
                if(this.vel.x >= 0) {
                  //console.log('not off the edge: right');
                  this.vel.x = 0;
                  this.accel.x = 0;
                }
                if (ig.input.pressed('right')) {
                  //console.log('OK move off right...');
                  this.pos.x += 5;
                  this.vel.x = 40;
                }
                if (ig.input.pressed('jump')) {
                  //console.log('OK jump off right...');
                  this.pos.x += 5;
                  this.pos.y -= 4;
                  this.vel.x = 40;
                }
              }
            }
          }
          //check jump
          if( this.standing && ig.input.pressed('jump') ) {
            this.vel.y = -this.jump;
          }
          // set the current animation, based on the player's speed
          if( this.vel.y < 0 ) {
            this.currentAnim = this.anims.jump;
          } else if( this.vel.y > 0 ) {
              this.currentAnim = this.anims.fall;
          }else if( this.vel.x != 0 ) {
              this.currentAnim = this.anims.run;
          }else{
              this.currentAnim = this.anims.idle;
          }
          //speech
          if( ig.input.pressed('speak') ) {
            if(!this.speaking) {
              this.speaking = true;
              var parameters = {text: 'I pwn.', tracks: this, margin: 0, lifeSpan: 5, shape: 'square', callback: this.onSpeachOver.bind(this)};
              ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
            }
          }
          //action
          if( ig.input.pressed('action') ) {
            this.fixFuse();
            this.flipLightswitch();
          }
          //flipping
          this.currentAnim.flip.x = this.flip;
          // invincibility
          if( this.invincibleTimer.delta() > this.invincibleDelay ) {
            this.invincible = false;
            this.currentAnim.alpha = 1;
          }
          // move!
          this.parent();
        },
        fixFuse: function() {
          var fuseboxes = ig.game.getEntitiesByType(EntityFusebox);
          if (fuseboxes.length == 0) {
            return;
          }
          for (var i=0; i<fuseboxes.length; i++) {
            if(this.touches(fuseboxes[i])) {
              fuseboxes[i].setWorking(true);
            }
          }
        },
        flipLightswitch: function() {
          var lightswitches = ig.game.getEntitiesByType(EntityLightswitch);
          if (lightswitches.length == 0) {
            return;
          }
          for (var i=0; i<lightswitches.length; i++) {
            if(this.touches(lightswitches[i])) {
              lightswitches[i].flipSwitch(true);
            }
          }
        },
        onSpeachOver: function() {
          this.speaking = false;
        },
        kill: function() {
          this.parent();
          var x = this.startPosition.x;
          var y = this.startPosition.y; ig.game.spawnEntity(EntityPlayerDeathExplosion, this.pos.x, this.pos.y,
            {callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
        },
        makeInvincible: function(){
          this.invincible = true;
          this.invincibleTimer.reset();
        },
        draw: function(){
          if(this.invincible)
            this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
          this.parent();
        },
        receiveDamage: function(amount, from){
          if(this.invincible)
            return;
          this.parent(amount, from);
        } 
    });
   
   
    EntityPlayerDeathExplosion = ig.Entity.extend({
      lifetime: 1,
      callBack: null,
      particles: 25,
      init: function( x, y, settings ) {
        this.parent( x, y, settings );
        for(var i = 0; i < this.particles; i++)
          ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
        this.idleTimer = new ig.Timer();
      },
      update: function() {
        if( this.idleTimer.delta() > this.lifetime ) {
          this.kill();
          if(this.callBack) {
            this.callBack();
          }
          return;
        }
      }
  });

   
    EntityDeathExplosionParticle = ig.Entity.extend({
      size: {x: 2, y: 2},
      maxVel: {x: 160, y: 200},
      lifetime: 2,
      fadetime: 1,
      bounciness: 0,
      vel: {x: 100, y: 30},
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
        this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        this.idleTimer = new ig.Timer();
      },
      update: function() {
        if( this.idleTimer.delta() > this.lifetime ) {
          this.kill();
          return;
        }
        this.currentAnim.alpha = this.idleTimer.delta().map( this.lifetime - this.fadetime, this.lifetime,1, 0);
        this.parent();
      }
    });   
   
   
   
});

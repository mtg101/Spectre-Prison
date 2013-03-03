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
        gravityFactor: 0,
        pathIndex: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        name: 'Noman',
        pathState: 'onPath',
        chaseSpeed: 0,
        path: [{cmd: 'stop', dur: 0}],
        pathSyntax: [{cmd: 'stop'}],
        maxVel: {x: 100, y: 100},
        savedPos: null,
        savedPathIndex: 0,
        savedPathTimer: 0,
        size: {x: 8, y: 8},
        offset: {x: 4, y: 4},
        timer: null,
        inLight: false,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'haunt', 0.1, [0,1,2,3] );
          if( !ig.global.wm ) {
            this.doPathAction(); //Weltmeister throws up on eval() and getEntitiesByType()
          }
        },
        update: function() {
          this.checkLight();
          this.doPathMovement();
          this.parent();
        },
        doPathMovement: function() {
          switch(this.pathState) {
            case 'onPath':
              this.handleOnPath();
              break;
            case 'chasingPlayer':
              this.handleChasingPlayer();
              break;
            case 'fleeingPlayer':
              this.handleFleeingPlayer();
              break;
            case 'returningToPath':
              this.handleReturningToPath();
              break;
            case 'paused':
              this.drawPauseEffect();
              break;
            default:
              console.log('ghost update: unknown pathState');
          }
        },
        checkLight: function() {
          var lightrects = ig.game.getEntitiesByType(EntityLightrect);
          for(var l in lightrects) {
            var ent = lightrects[l];
            if( ent && ent instanceof EntityLightrect ) {
              if(!ent.isOn()) {
                if(this.inLight == true) {
                  this.inLight = false;
                  this.handleExitLight();
                }
                break;
              }
              if(this.touches(ent)) {
                if(!this.inLight == true) {
                  this.inLight = true;
                  this.handleEnterLight();
                }
              } else {
                if(this.inLight == true) {
                  this.inLight = false;
                  this.handleExitLight();
                }
              }
            }
          }
        },
        handleOnPath: function() {
          if(this.timer && this.timer.delta() > 0) {
            this.nextPathMovement();
          }
        },
        handleChasingPlayer: function() {
          //check timer
          if(this.timer && this.timer.delta() > 0) {
            this.nextPathMovement();
          } else {
            //player may have moved, so update vector
            this.moveTowardsPlayer( this.chaseSpeed );
          }
        },
        handleFleeingPlayer: function() {
          //check timer
          if(this.timer && this.timer.delta() > 0) {
            this.nextPathMovement();
          } else {
            //player may have moved, so update vector
            this.moveAwayFromPlayer( this.chaseSpeed );
          }
        },
        handleReturningToPath: function() {
          if(this.timer && this.timer.delta() > 0) {
            this.pos = this.savedPos; // in case of timing issues
            this.resumePathMovement();
          }
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
          // usig eval() is very insecure, but then again we're taking this from Weltmeister, so it's not that bad
          var pathStep = eval("(" + this.path[this.pathIndex] + ')');
          switch(pathStep.cmd) {
            case 'move':
              this.pathState = 'onPath';
              this.vel.x = pathStep.vel.x;
              this.vel.y = pathStep.vel.y;
              break;
            case 'goto':
              this.pathState = 'onPath';
              this.pathIndex = pathStep.index;
              this.doPathAction();
              return; // we're done here, 'recursive' call has done the biz
            case 'stop':
              this.pathState = 'onPath';
              this.vel.x = 0;
              this.vel.y = 0;
              break;
            case 'chasePlayer':
              this.chasePlayer(pathStep.speed);
              break;
            case 'fleePlayer':
              this.fleePlayer(pathStep.speed);
              break;
            case 'returnToPath':
              this.returnToPath(pathStep.speed);
              break;
            case 'die':
            default:
              this.kill();
              return; //we're done here
          }
          if (this.vel.x) { //face rigth direction, but only change if we're moving
            this.currentAnim.flip.x = this.vel.x > 0 ? false : true;
          }
          if(pathStep.dur > 0){
            if(!this.timer) {
              this.timer = new ig.Timer();
            }
            this.timer.set(pathStep.dur);
          } else if (pathStep.dur == 0) {
            this.timer = null;
          } //do nothing if .dur is not defined, like for returnToPath which does its own timer stuff
        },
        check: function(other) {
        	if (other instanceof EntityPlayer) {
            //console.log('I hit  the player! Name: ' + this.name);
          }
        },
        chasePlayerForDuration: function( speed, dur ) {
          if(!this.timer) {
            this.timer = new ig.Timer();
          }
          this.timer.set( dur );
          this.chasePlayer( speed );
        },
        chasePlayer: function( speed ) {
          switch(this.pathState) {
           case 'chasingPlayer':
            console.log('chasePlayer: already chasing');
            return; //we're done here
           case 'onPath':
            this.savePathState();
            break;
           case 'fleeingPlayer':
           case 'returningToPath':
           case 'paused':
            //don't save state, we'll return to old saved state
            break;
           default:
            console.log('chasePlayer: unknown pathState');
            return; // don't chase if we're not sure what's going on
          }
          this.pathState = 'chasingPlayer';
          this.chaseSpeed = speed;
          this.moveTowardsPlayer(this.chaseSpeed);
        },
        fleePlayerForDuration: function( speed, dur ) {
          if(!this.timer) {
            this.timer = new ig.Timer();
          }
          this.timer.set( dur );
          this.fleePlayer( speed );
        },
        fleePlayer: function( speed ) {
          switch(this.pathState) {
           case 'fleeingPlayer':
            console.log('fleePlayer: already fleeing');
            return; //we're done here
           case 'onPath':
            this.savePathState();
            break;
           case 'chasingPlayer':
           case 'returningToPath':
           case 'paused':
            //don't save state, we'll return to old saved state
            break;
           default:
            console.log('fleePlayer: unknown pathState');
            return; // don't chase if we're not sure what's going on
          }
          this.pathState = 'fleeingPlayer';
          this.chaseSpeed = speed;
          this.moveAwayFromPlayer(this.chaseSpeed);
        },
        moveAwayFromPlayer: function( speed ) {
          var player = ig.game.getEntitiesByType(EntityPlayer)[0];
          if(!player) {
            console.log('moveAwayFromPlayer: Don\'t panic... but I can\'t find the player!');
            return;
          }          
          this.moveAwayFromLocation(player.pos, speed);
        },
        moveTowardsPlayer: function( speed ) {
          var player = ig.game.getEntitiesByType(EntityPlayer)[0];
          if(!player) {
            console.log('moveTowardsPlayer: Don\'t panic... but I can\'t find the player!');
            return;
          }          
          this.moveTowardsLocation(player.pos, speed);
        },
        moveTowardsLocation: function( pos, speed ) {
          var velx = pos.x - this.pos.x;
          var vely = pos.y - this.pos.y;
          
          var maxspeed = Math.sqrt((velx*velx) + (vely*vely));
          var speedFactor = maxspeed / speed;
          
          velx = velx / speedFactor;
          vely = vely / speedFactor;
          
          this.vel.x = velx;
          this.vel.y = vely;

          if (this.vel.x) { //face right direction, but only change if we're moving
            this.currentAnim.flip.x = this.vel.x > 0 ? false : true;
          }
        },
        moveAwayFromLocation: function( pos, speed ) {
          var velx = pos.x - this.pos.x;
          var vely = pos.y - this.pos.y;
          
          var maxspeed = Math.sqrt((velx*velx) + (vely*vely));
          var speedFactor = maxspeed / speed;
          
          velx = velx / speedFactor;
          vely = vely / speedFactor;
          
          this.vel.x = -1 * velx;
          this.vel.y = -1 * vely;

          if (this.vel.x) { //face right direction, but only change if we're moving
            this.currentAnim.flip.x = this.vel.x > 0 ? false : true;
          }
        },
        returnToPath: function( speed ) {
          switch(this.pathState) {
           case 'chasingPlayer':
           case 'fleeingPlayer':
           case 'paused':
            break;
           case 'onPath':
            //console.log('ghost returnToPath: already on path')
            return; //ingore this redundant nonsense
           case 'returningToPath':
            console.log('ghost returnToPath: already returning to path')
            return; //ingore this redundant nonsense
            break;
           default:
            console.log('creturnToPath: unknown pathState');
            return; // don't chase if we're not sure what's going on
          }
          this.pathState = 'returningToPath';
          this.moveTowardsLocation(this.savedPos, speed);
          var dX = this.pos.x-this.savedPos.x;
          var dY = this.pos.y-this.savedPos.y;
          var distanceToReturn = Math.sqrt(dX*dX+dY*dY);
          var timeToReturn = distanceToReturn / speed;
          if(!this.timer) {
            this.timer = new ig.Timer();
          }
          this.timer.set(timeToReturn);
        },
        savePathState: function() {
          this.savedPos = this.pos;
          this.savedPathIndex = this.pathIndex;
          this.savedPathTimer = 0;
          if (this.timer) {
            this.savedPathTimer = this.timer.delta() > 0 ? 0 : this.timer.delta * -1;            
          }
        },
        pausePath: function() {
          this.savePathState();
          this.pathState = 'paused';
          this.vel.x = 0;
          this.vel.y = 0;
        },
        resumePathMovement: function () {
          this.pathState = 'onPath';
          this.pathIndex = this.savedPathIndex;
          if(!this.timer) {
            this.timer = new ig.Timer();
          }
          this.timer.set(this.savedTimer);
        }        
   });
});

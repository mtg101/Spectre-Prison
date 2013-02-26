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
  'game.entities.lightbulb'
).requires(
  'impact.entity'
) .defines(function(){
    EntityLightbulb = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/lightbulb.png', 16, 16 ),
        direction: 'down',
        state: 'off',
        initd: false,
        gravityFactor: 0,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'verticalOff', 1, [0] );
          this.addAnim( 'horizontalOff', 1, [2] );
          this.addAnim( 'verticalOn', 1, [1] );
          this.addAnim( 'horizontalOn', 1, [3] );
        },
        update: function () {
          if( !this.initd ) { // have to wait for main loop (rather than init()) so all entities have loaded
            this.setAnim();
            this.registerWithFuseboxes();
            this.initd = true;
          }
          this.parent();
        },
        setAnim: function() {
          switch(this.direction) {
            case 'down':
              if(this.state=='on' && !this.anyBrokenFuseboxes()) {
                this.anims.verticalOn.flip.y = false;
                this.currentAnim=this.anims.verticalOn;
              } else {
                this.anims.verticalOff.flip.y = false;
                this.currentAnim=this.anims.verticalOff;
              }
              break;
            case 'up':
              if(this.state=='on' && !this.anyBrokenFuseboxes()) {
                this.anims.verticalOn.flip.y = true;
                this.currentAnim=this.anims.verticalOn;
              } else {
                this.anims.verticalOff.flip.y = true;
                this.currentAnim=this.anims.verticalOff;
              }
              break;
            case 'left':
              if(this.state=='on' && !this.anyBrokenFuseboxes()) {
                this.anims.horizontalOn.flip.x = true;
                this.currentAnim=this.anims.horizontalOn;
              } else {
                this.anims.horizontalOff.flip.x = true;
                this.currentAnim=this.anims.horizontalOff;
              }
              break;
            case 'right':
              if(this.state=='on' && !this.anyBrokenFuseboxes()) {
                this.anims.horizontalOn.flip.y = false;
                this.currentAnim=this.anims.horizontalOn;
              } else {
                this.anims.horizontalOff.flip.x =false;
                this.currentAnim=this.anims.horizontalOff;
              }
              break;
            default:
              console.log('lightbulb direction not set');
          }
        },
        flipState: function() {
          this.state = this.state=='on' ? 'off' : 'on';
          this.setAnim();
        },
        registerWithFuseboxes: function() {
          for(var t in this.target) {
            var ent = ig.game.getEntityByName( this.target[t] );
            if( ent && ent instanceof EntityFusebox ) {
              ent.registerLightbulb(this);
            } else {
              console.log('registerWithFuseboxes: this isn\'t a fuse!');
            }
          }
        },
        anyBrokenFuseboxes: function() {
          for(var t in this.target) {
            var ent = ig.game.getEntityByName( this.target[t] );
            if( ent && ent instanceof EntityFusebox ) {
              if(ent.state=='broken') {
                return true; //one broken is enough
              }
            } else {
              console.log('anyBrokenFuseboxes: this isn\'t a fuse!');
            }
          }
          return false; //nothing broken
        }
    });  
});

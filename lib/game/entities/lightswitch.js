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
  'game.entities.lightswitch'
).requires(
  'impact.entity'
) .defines(function(){
    EntityLightswitch = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/lightswitch.png', 16, 16 ),
        state: 'up',
        gravityFactor: 0,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'up', 1, [0] );
          this.addAnim( 'down', 1, [1] );
          this.setAnim();
        },
        setAnim: function() {
          this.currentAnim = this.state=='up' ? this.anims.up : this.anims.down;
        },
        flipSwitch: function() {
          //flip gfx
          this.state = this.state=='up' ? 'down' : 'up';
          this.setAnim();
          //flip connected lighbulbs
          for (var t in this.target) {
            var ent = ig.game.getEntityByName( this.target[t] );
            if( ent && ent instanceof EntityLightbulb ) {
                ent.flipState();
            } else {
              console.log('flipSwitch: why isn\'t this target a light bulb?');
            }
          }
        }
    });  
});

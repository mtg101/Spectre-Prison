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
        state: 'off',
        gravityFactor: 0,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'off', 1, [0] );
          this.addAnim( 'on', 1, [1] );
          this.setAnim();
        },
        setAnim: function() {
          this.currentAnim = this.state=='on' ? this.anims.on : this.anims.off;
        },
        flipSwitch: function() {
          this.state = this.state=='on' ? 'off' : 'on';
          this.setAnim();
        }
    });  
});

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
  'game.entities.fusebox'
).requires(
  'impact.entity'
) .defines(function(){
    EntityFusebox = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/fusebox.png', 16, 16 ),
        state: 'broken',
        gravityFactor: 0,
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'working', 1, [0] );
          this.addAnim( 'broken', 0.1, [1,2,3] );
          this.setAnim();
        },
        setAnim: function() {
          this.currentAnim = this.state=='working' ? this.anims.working : this.anims.broken;
        },
        setWorking: function() {
          this.state = 'working';
          this.setAnim();
        }
    });  
});

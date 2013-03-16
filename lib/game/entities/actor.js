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
  'game.entities.actor'
).requires(
  'impact.entity',
	'game.entities.chatbubble'
).defines(function() {
	
	 EntityActor = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/zombie.png', 16, 16 ),
        size: {x: 8, y:14},
        offset: {x: 4, y: 2},
        flip: false,
        friction: {x: 150, y: 0},
        speed: 14,
        speaking: false,
        maxVel: {x: 100, y: 150},
        init: function( x, y, settings ) {
          this.parent( x, y, settings );
          this.addAnim( 'walk', 0.04, [0,1,2,3,4,5] );
        },
        update: function() {
          this.parent();
        },
        speak: function() {
          if (this.speaking) return;
          //var parameters = {text: 'BRAINS!', tracks: this, margin: 0, lifeSpan: 2, shape: 'square', color:[30,70,30], callback: this.onSpeachOver.bind(this)};
          //ig.game.spawnEntity(EntityChatbubble, 0, 0, parameters);
        },
        onSpeachOver: function() {
          this.speaking = false;
        }
   });
});
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
	'game.startscreen'
) .requires(
	'impact.game',
  'game.game',
  'plugins.button'
) .defines(function(){

StartScreen = ig.Game.extend({
  instructText: new ig.Font( 'media/04b03.font.png' ),
  background: new ig.Image('media/screen-bg.png'),
  clearColor: null,
  init: function() {
    ig.input.bind( ig.KEY.SPACE, 'start');
    ig.input.bind( ig.KEY.MOUSE1, 'click' );
    
    ig.game.spawnEntity( Button, ig.system.width / 2 - 50, ig.system.height / 2 - 17, {
      size: { x: 100, y: 34 },
      animSheet: new ig.AnimationSheet( 'media/follow.png', 100, 34 ),
      
      pressedUp: function() {
        // https://twitter.com/intent/user?screen_name=MuBeerFolly&target='_blank'
        window.open('https://twitter.com/intent/user?screen_name=MuBeerFolly', '_blank')
        alert('It was popup blocked, right? Better done with HTML overlay...')
      }
    });
  },
  update: function() {
    if(ig.input.pressed ('start')){
      ig.system.setGame(MyGame)
    }
    this.parent();
  },
  draw: function() {
    this.background.draw(0,0);
    var x = ig.system.width/2, y = ig.system.height - 10;
    this.instructText.draw( 'Press Spacebar To Start', x+40, y, ig.Font.ALIGN.CENTER );
    this.parent();
  }
 });
});

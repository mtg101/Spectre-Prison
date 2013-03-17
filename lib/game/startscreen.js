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
  'game.game'
) .defines(function(){

StartScreen = ig.Game.extend({
  instructText: new ig.Font( 'media/04b03.font.png' ),
  background: new ig.Image('media/screen-bg.png'),
  clearColor: null,
  init: function() {
    ig.input.unbindAll();
    ig.input.bind( ig.KEY.SPACE, 'start');
    ig.input.bind( ig.KEY.MOUSE1, 'click' );
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

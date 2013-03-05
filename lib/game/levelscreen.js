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
	'game.levelscreen'
) .requires(
	'impact.game',
  'game.game'
) .defines(function(){

LevelScreen = ig.Game.extend({
  instructText: new ig.Font( 'media/04b03.font.png' ),
  background: new ig.Image('media/screen-bg.png'),
  init: function() {
    ig.input.unbindAll();
    ig.input.bind( ig.KEY.SPACE, 'start');
  },
  update: function() {
    if(ig.input.pressed ('start')){
      ig.system.setGame(MyGame)
    }
    this.parent();
  },
  draw: function() {
    this.parent();
    this.background.draw(0,0);
    var x = ig.system.width/2, y = ig.system.height - 10;
    this.instructText.draw( 'Level Up! Press Spacebar To Start', x+40, y, ig.Font.ALIGN.CENTER );
  }
 });
});

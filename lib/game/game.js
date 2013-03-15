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
	'game.game'
) .requires(
	'impact.game',
	'game.levels.one',
	'game.levels.two',
	'game.levels.blue',
	'game.levels.red',
	'game.levels.yellow',
	'game.levels.green',
	'game.levels.climb'
) .defines(function(){

MyGame = ig.Game.extend({
	gravity: 300,
	init: function() {
    ig.input.unbindAll();
    ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
    ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
    ig.input.bind( ig.KEY.SPACE, 'jump' );
    ig.input.bind( ig.KEY.S, 'speak' );
    ig.input.bind( ig.KEY.UP_ARROW, 'action' );
    this.loadLevel( ig.global.level );
  },
	update: function() {
		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
				this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - ig.system.height/2;
		}
		// Update all entities and backgroundMaps
		this.parent();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});
});

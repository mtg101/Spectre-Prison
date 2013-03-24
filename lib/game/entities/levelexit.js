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
  'game.entities.levelexit'
).requires(
  'impact.entity'
) .defines(function(){
    EntityLevelexit = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        size: {x: 8, y: 8},
        level: null,
        checkAgainst: ig.Entity.TYPE.A,
        update: function(){},
        check: function(other) {
        	if (other instanceof EntityPlayer) {
            if (this.level) {
              var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b) {
              return a.toUpperCase() + b;
            });
              ig.global.levelName = levelName;
              ig.system.setGame(LevelScreen);
            }
          }
        }
    });  
});

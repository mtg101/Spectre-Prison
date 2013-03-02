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
  'game.entities.lightrect'
).requires(
  'impact.entity'
).defines(function() {	
	 EntityLightrect = ig.Entity.extend({
    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(255, 255, 0, 0.7)',
    _context:null,
    
   	init: function(x, y, settings) {
      this.parent(x, y, settings);
			this._context = ig.system.context;
    },
    update: function() {
      this.parent();
    },
    draw: function() {
      if(ig.global.wm) {
        return; //WM doesn't do native drawing
      }
      if(this.isOn()) {
        var x = ig.system.scale*(this.pos.x-ig.game.screen.x);
        var y = ig.system.scale*(this.pos.y-ig.game.screen.y);
        var width = this.size.x * ig.system.scale;
        var height = this.size.y * ig.system.scale;
        this._context.fillStyle = 'rgba(255, 255, 0, 0.7)';
        this._context.fillRect(x, y, width, height);
      }
    },
    isOn: function() {
      var ent = ig.game.getEntityByName( this.target[0] );
      return ent.state == 'on' && !ent.anyBrokenFuseboxes();
    }
  });	
});
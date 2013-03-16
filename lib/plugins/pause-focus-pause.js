ig.module(
	'plugins.pause-focus-pause'
)
.requires(
	'impact.game'
)
.defines(function() {

	ig.Game.inject({

		staticInstantiate: function() {

			// https://gist.github.com/775473
			window.addEventListener("blur", function () {
				if (ig.system) {
					ig.music.stop();
					ig.system.stopRunLoop();
          // draw a black rect on full screen with low opacity.
          ig.system.context.fillStyle = 'black';
          var oldAlpha = ig.system.context.globalAlpha;
          ig.system.context.globalAlpha = 0.2;
          ig.system.context.fillRect(0,0, ig.system.canvas.width, ig.system.canvas.height);
          ig.system.context.globalAlpha = 1.0;
          ig.system.context.fillStyle = 'black';
          ig.system.context.fillRect(ig.system.canvas.width*0.35, ig.system.canvas.height*0.2, ig.system.canvas.width*0.1, ig.system.canvas.height*0.6);
          ig.system.context.fillRect(ig.system.canvas.width*0.55, ig.system.canvas.height*0.2, ig.system.canvas.width*0.1, ig.system.canvas.height*0.6);
          ig.system.context.fillStyle = 'gray';
          ig.system.context.fillRect(ig.system.canvas.width*0.36, ig.system.canvas.height*0.21, ig.system.canvas.width*0.08, ig.system.canvas.height*0.58);
          ig.system.context.fillRect(ig.system.canvas.width*0.56, ig.system.canvas.height*0.21, ig.system.canvas.width*0.08, ig.system.canvas.height*0.58);
          ig.system.context.globalAlpha = oldAlpha;
				}
			}, false);
			window.addEventListener("focus", function () {
				if (ig.system) {
					ig.music.play();
					ig.system.startRunLoop();
				}
			}, false);

			return this.parent();
		}

	});

});
class AnimaUtil {
	public static biling(view, time: number, loopCount: number) {
		view.alpha = 0.1;
		if (loopCount <= 0) {
			egret.Tween.get(view, { loop: true }).to({ alpha: 1.0 }, time, egret.Ease.elasticInOut)
				.to({ alpha: 0.2 }, time, egret.Ease.elasticInOut).play()
				// .call(function () {
				// 	console.log('[INFO] biling');
				// });
		} else {
			egret.Tween.get(view).to({ alpha: 1.0 }, time, egret.Ease.elasticInOut).call(
				function () {
					this.biling(view, time, --loopCount);
				}.bind(this)
			).play()
			// .call(function () {
			// 	console.log('[INFO] biling');
			// });
		}
	}
	public static floating(image: egret.DisplayObject) {
		var tox = image.x;
		var toy = image.y - 100;
		var srcx = image.x;
		var srcy = image.y;
		egret.Tween.get(image, { "loop": true })
			.to({ "x": tox, "y": toy, }, 1000, egret.Ease.bounceIn)
			.to({ "x": srcx, "y": srcy, }, 1500, egret.Ease.bounceOut)
			.play().call(function () {
				// console.log('[INFO] floating');
			});
	}
}
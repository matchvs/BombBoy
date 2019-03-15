class BombEffectLayer extends eui.Group {

	private cache: Array<Array<particle.GravityParticleSystem>> = [[]];
	public constructor() {
		super();
		this.name = "BombEffect";
	}
	public init(x, y, nodew, nodeh) {
		var aw = nodew / 2;
		var ah = nodeh / 2;
		for (var j = 0; j < y; j++) {
			this.cache[j] = [];
			for (var i = 0; i < x; i++) {
				var effect = new particle.GravityParticleSystem(RES.getRes("snow_png"), RES.getRes("snow_json"));
				effect.x = nodew * i;
				effect.y = nodeh * j;
				effect.anchorOffsetX = aw;
				effect.anchorOffsetX = ah;
				effect.visible = false;
				effect.name = "bombeffect:" + i + "," + j;
				this.addChild(effect);
				this.cache[j][i] = effect;
			}
		}
	}
	/**
	 * 爆炸中心 
	 */
	public bombCenter(x, y) {
		var a = RES.getRes("bombfire_mc_json");
		var b = RES.getRes("bombfire_tex_png");
		var bombCenterAnimation = new egret.MovieClip(new egret.MovieClipDataFactory(a, b).generateMovieClipData("bombfire"));
		bombCenterAnimation.x = x * GameConfig.NodeW;
		bombCenterAnimation.y = y * GameConfig.NodeH;
		bombCenterAnimation.anchorOffsetY = GameConfig.AnchorX;
		bombCenterAnimation.anchorOffsetX = GameConfig.AnchorY;
		bombCenterAnimation.name = "bombeffect_" + x + "_" + y;
		var self = this;
		bombCenterAnimation.addEventListener(egret.Event.LOOP_COMPLETE, function (e: egret.Event): void {
			// console.log('[INFO] bombCenterAnimation,e : '+e.target.name);
			// console.log('[INFO] bombCenterAnimation: '+bombCenterAnimation.name);
			self.removeChild(e.target);
		}, this);
		bombCenterAnimation.gotoAndPlay(0, 3);
		this.addChild(bombCenterAnimation);
	}

	/**
	 * 爆炸边缘 
	 */
	public bombSide(x, y) {
		this.bombCenter(x, y);
	}

	public bomb(x, y, power) {
		var bombList = [];
		var arrows = [[1, 0], [-1, 0], [0, 1], [0, -1]];
		for (var i = 0; i < power; i++) {
			for (var j = 0; j < arrows.length; j++) {
				var arrow = arrows[j];
				var ix = y + (i * arrow[1]);
				var iy = x + (i * arrow[0]);
				console.log('[INFO] bomb x,y' + x + "," + y);
				var bombeffect = this.cache[iy][ix];
				console.log('[INFO] bombeffect x,y' + bombeffect.x + "," + bombeffect.y);
				bombeffect.visible = true;
				bombList.push(bombeffect);
			}
		}

		var index = 0;
		for (var i = 0; i < bombList.length; i++) {
			setTimeout(function () {
				bombList[index].start(500);
				index++;
			}, i * 10);
		}
	}
}
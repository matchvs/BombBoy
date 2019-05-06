class Player {
	public constructor(playerID, teamID) {
		this.ID = playerID;
		console.log('[INFO] Player.ID:%s ,teamID:%s',playerID,teamID);
		// this.teamID = teamID?teamID:playerID%2;
		this.teamID = playerID%2;
	}

	public static STATE = { "null": -1, "live": 0, "weak": 1, "dead": 2 };
	private animaTime: number = 125;
	public ID: number = 0;
	public teamID = 0;
	public arrow = 0;
	public xInMap = 0;
	public yInMap = 0;
	public x = 4;
	public y = 4;
	public power = 2;
	public animaView: egret.MovieClip;
	public viewLayout: eui.Group;
	public controller: JoyStickPlayer;
	private myIdentity: eui.Image;
	public state: number;

	public buringBomb() {
		NetWork.send("buring", this.ID);
		// Toast.show("buring:" + this.x + "," + this.y);
	}
	public isEnable = false;

	public initView(playerLayer, joystickContainer) {
		this.viewLayout = new eui.Group();
		this.viewLayout.name = "player_" + this.ID;
		if (this.ID == GameData.userID) {
			this.myIdentity = new eui.Image();
			this.myIdentity.source = "resource/bombboy/boy/arrow.png";
			this.myIdentity.x = + 20;
			this.myIdentity.y = - 56;
			this.myIdentity.width = 20;
			this.myIdentity.height = 20;
			this.viewLayout.addChild(this.myIdentity);
			BaseLayer.floatingAnima(this.myIdentity);
			NetWork.send("team", this.teamID);
		}
		playerLayer.addChild(this.viewLayout);

		Player.bornPlayer(this, playerLayer);
		this.controller = new JoyStickPlayer(this.animaView, joystickContainer, (this.ID == GameData.userID));
	}

	private lastArrow = VirtualJoystick.Arrow.UP;


	public creatAnimaView(dataName, textureName, animaName, frameName?): egret.MovieClip {
		var data = RES.getRes(dataName);
		var txtr = RES.getRes(textureName);
		var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
		var mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(animaName));
		mc1.name = dataName;
		mc1.gotoAndPlay(frameName ? frameName : 0, -1);
		mc1.x = this.xInMap;
		mc1.y = this.yInMap;
		mc1.anchorOffsetY = GameConfig.AnchorY / 3;
		mc1.anchorOffsetX = GameConfig.AnchorX;
		if (this.teamID == 0) {
			var colorMatrix = [
				.2, 0, 0, 0, 0,
				0.6, 0, 0, 0, 0,
				0, 0, 1, 0, 0,
				0, 0, 0, 1, 0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			mc1.filters = [colorFlilter];
		}
		return mc1;
	}

	private static stopAnima(player: Player) {
		console.log('[INFO] player:' + player.ID + " stop state:" + player.state);
		player.animaView && player.animaView.gotoAndPlay(player.animaView.totalFrames - 1, 1);
		player.animaView && player.viewLayout.removeChild(player.animaView);
	}

	public static switchState(state: number, player, playerLayout) {
		console.log('[INFO] player:' + player.ID + " switch to State:" + state);
		switch (state) {
			case Player.STATE.live:
				Player.revivePlayer(player, playerLayout);
				break;
			case Player.STATE.weak:
				Player.stuckPlayer(player, playerLayout);
				break;
			case Player.STATE.dead:
				Player.diePlayer(player, playerLayout);
				break;
			default:
			case Player.STATE.null:
				Player.bornPlayer(player, playerLayout);
				break;
		}
	}
	public setEnable(state: boolean) {
		this.isEnable = state;
		this.controller.isEnable = state;
	}
	public setPostion(x, y) {
		this.x = x;
		this.y = y;
		this.viewLayout.x = x * GameConfig.NodeW;
		this.viewLayout.y = y * GameConfig.NodeH;
	}


	public move(player: any) {
		egret.Tween.get(this.viewLayout).to({ "y": player["yInMap"], "x": player["xInMap"] }, this.animaTime).play();
		try {
			var arrow = player["arrow"];
			// console.log('[INFO]move arrow:' + arrow);
			if (arrow == 0) {
				this.animaView.stop();
				this.lastArrow = arrow;
				return;
			}
			if (this.lastArrow == arrow) {
				return;
			}
			this.animaView.gotoAndPlay("walk_" + VirtualJoystick.KeyArrowValue[arrow], -1);
			this.lastArrow = arrow;
		} catch (e) {
			console.warn('[WARN] moveByArrow err:' + e.message + " arrow:" + VirtualJoystick.KeyArrowValue[arrow]);
		}
	}

	/**
	* 复活玩家
	*/
	public static revivePlayer(player: Player, viewLayout: egret.DisplayObjectContainer) {
		Player.stopAnima(player);
		var newAnima = player.creatAnimaView("revive_json", "revive_png", "revive");
		newAnima.gotoAndPlay(0, -1);
		newAnima.addEventListener(egret.Event.LOOP_COMPLETE, function (e: egret.Event): void {
			console.log('[INFO] revivePlayer.anima complete');
			newAnima.stop();
			Player.switchState(Player.STATE.null, player, viewLayout);
		}, player);
		player.animaView = newAnima;
		player.viewLayout.addChild(newAnima);
		Music.play("save_mp3");
	}
	public static bornPlayer(player: Player, viewLayout: egret.DisplayObjectContainer) {
		Player.stopAnima(player);
		var anima = player.creatAnimaView("bazzi_json", "bazzi_png", "boy", "walk_" + VirtualJoystick.Arrow.RIGHT)
		player.animaView = anima;
		anima.stop();
		player.controller && (player.controller.node = anima);
		player.viewLayout.addChild(anima);
		Music.play("start_mp3");
	}

	/**
	 * 困住玩家
	 */
	public static stuckPlayer(player, viewLayout) {
		Player.stopAnima(player);
		var anima = player.creatAnimaView("be_trapped_json", "be_trapped_png", "dead");
		player.animaView = anima;
		player.viewLayout.addChild(anima);
		anima.gotoAndPlay(0, -1);
		Music.play("explode_mp3");
	}

	//从UI中移除一个玩家
	public static diePlayer(player, viewLayout) {
		Player.stopAnima(player);
		var anima = player.creatAnimaView("die_json", "die_png", "die");
		player.animaView = anima;
		player.viewLayout.addChild(anima);
		player.animaView.addEventListener(egret.Event.LOOP_COMPLETE, function (e: egret.Event): void {
			console.log('[INFO] die animation is complete');
		}, player);
		anima.gotoAndPlay(0, 1);
		Music.play("die_mp3");
	}

}
class Game extends BaseScene implements eui.UIComponent {
	public constructor() {
		super();
	}
	public mapbg: eui.Image;
	public mapLayer: eui.Group;
	public playerLayer: eui.Group;
	public mapitem: eui.Group;
	public avator: eui.Image;
	public bg: eui.Rect;
	public p1: eui.Label;
	public joystickContainer: eui.Group;
	public skillContainer: eui.Group;
	public btn_bomb: eui.Image;
	public skill_magic: eui.Image;
	public me: Player;
	public playerMap = {};
	public bombEffectLayer: BombEffectLayer; //爆炸效果
	public bombLayer: eui.Group;
	public map: TileMap;
	public destroyTileLayer: TileLayer;
	public destroyLayer: egret.DisplayObjectContainer;
	public propLayer: PropLayer;

	public loadingContainer: eui.Group;
	public loadingBg: eui.Rect;
	public loadingTipsImage: eui.Image;
	public loadingTips: eui.Label;
	public loadingText: eui.Label;
	public loadingImage: eui.Image;
	public loadingDialog: LoadingDialog;
	private static pingWindow: PingWindow;


	public loadComplete = false;
	public isGameStart = true;

	private pingTimer;
	private reconnectDialog: LoadingDialog;

	public onCreated(): void {
		console.log("[Lobby] [onCreated] " + this.name);
		TileMap.createTileMap("chinese.tmx", "resource/bombboy/map/chinese/", function (map: TileMap, progress: number, total: number) {
			if (progress == total) {

				TileMap.render(map, this.mapLayer, 0, 0, this.mapLayer.width, this.mapLayer.height);
				this.map = map;
				for (var i = 0; i < map.layers.length; i++) {
					if (map.layers[i].name = "destroyable") { this.destroyTileLayer = map.layers[i]; }
				}
				this.destroyLayer = this.mapLayer.getChildByName("destroyable");

				GameConfig.NodeW = map.tilewidth;
				GameConfig.NodeH = map.tileheight;
				var baseIndex = 2;
				this.mapLayer.addChildAt(this.propLayer, baseIndex);
				this.bombEffectLayer = new BombEffectLayer();
				// this.bombEffectLayer.init(map.width, map.height, map.tilewidth, map.tileheight);
				this.mapLayer.addChildAt(this.bombLayer, ++baseIndex);
				this.mapLayer.addChildAt(this.bombEffectLayer, ++baseIndex);
				this.mapLayer.addChildAt(this.playerLayer, ++baseIndex);

				// console.log('[INFO] map:'+data);
				this.loadComplete = true;
			}
			// console.log('[INFO] [Load TileMap] [' + map.name + '] is ' + progress + "/" + total);
		}.bind(this));
		this.playerLayer = new eui.Group();
		this.playerLayer.name = "playerLayer";
		this.bombLayer = new eui.Group();
		this.bombLayer.name = "bombLayer"
		this.propLayer = new PropLayer();
		this.propLayer.name = "propLayer";
		if (GameData.isShowPingWindow) {
			Game.pingWindow = new PingWindow();
			var s = Game.pingWindow.init(1280, 360);
			s.y = 80;
			Game.pingWindow.toggle();
			this.addChild(s);
			NetWork.receive("ping", function (data) {
				let obj = JSON.parse(JSON.parse(data).data);
				if (obj.userID === GameData.userID) {
					var ping = new Date().getTime() - obj.time;
					GameData.isShowPingWindow && Game.pingWindow.update(ping);
				}
			}.bind(this));
			this.pingTimer = setInterval(function () {
				NetWork.send("ping", JSON.stringify({ "time": new Date().getTime(), "userID": GameData.userID }));
			}, 1000)
		}




		var roomUserChangedListener = function (rsp) {
			var userChanged = rsp;
			if (rsp.constructor.name == "Uint8Array") {
				var userChanged = JSON.parse(utf8ByteArrayToString(rsp));
			}

			console.log("[Rsp]roomUserChanged: ", userChanged);

			var currentUserList = userChanged["currentUserList"];
			if (userChanged["userAction"] == "enter") {

				if ((currentUserList.length) > 0) {
					// if ((GameData.MAX_ROOM_USER_COUNT - currentUserList.length) == 0) {
					this.gameStart();
				} else {
					this.loadingText.text = " 还需等待" + (GameData.MAX_ROOM_USER_COUNT - currentUserList.length) + "名玩家进入";
				}

				for (var i = 0; i < currentUserList.length; i++) {
					UI.printLog("[Rsp]room UserList[" + i + "]:" + currentUserList[i]["userID"]);
					var id = currentUserList[i]["userID"];
					this.onUserEnter(id, currentUserList[i]["teamID"]);
					this.notifyPlayerGameStateChanged(id);
					// Toast.show("玩家 " + currentUserList[i]["userID"] + " 进入房间");
				}
				// ListViewUtil.refreshData(this.roomListView, newList);

			} else if (userChanged["userAction"] == "exit") {
				Toast.show("玩家 " + userChanged["userID"] + " 离开房间");
				this.onUserExit(userChanged["userID"]);
				if (!this.isGameStart) {
					this.loadingText.text = " 还需等待" + (GameData.MAX_ROOM_USER_COUNT - currentUserList.length) + "名玩家进入";
				}
			}
		}.bind(this);

		this.loadingDialog = new LoadingDialog(
			this.loadingContainer, this.loadingBg
			, this.loadingTipsImage, this.loadingTips
			, this.loadingText, this.loadingImage);

		NetWork.connect(roomUserChangedListener);
		var sync = new MoveSync(function (playerList) {

			for (var i = 0; i < playerList.length; i++) {
				if (this.playerMap[playerList[i]["ID"]]) {
					this.playerMap[playerList[i]["ID"]].move(playerList[i]);
				};
			}
		}.bind(this));


		//TODO 更新玩家坐标
		NetWork.receive("move", function (data) {
			// console.log("move:" + JSON.stringify(data));
			for (var i = 0; i < data.length; i++) {
				var player = <Player>this.playerMap[data[i].ID];
				if (player) {
					player.x = data[i].x;
					player.y = data[i].y;
				}
			}
			sync.update(data);
		}.bind(this));

		NetWork.receive("buring", function (data) {
			this.createAndShowBomb(data);
			Music.play("appear_mp3");
		}.bind(this));

		NetWork.receive("bomb", function (data) {
			this.showBombEffect(data);
		}.bind(this));
		NetWork.receive("pick", function (data) {
			this.propLayer.hide(data.x, data.y);
			Music.play("get_mp3");
		}.bind(this));
		NetWork.receive("born", function (data) {
			for (var i = 0; i < data.length; i++) {
				var player = <Player>this.playerMap[data[i].ID];
				player && player.setPostion(data[i].x, data[i].y);
				console.log("player bron:", player);
			}
		}.bind(this));

		NetWork.receive("player", function (data) {
			if (this.playerMap[data.ID]) {
				var player = <Player>this.playerMap[data.ID];
				Player.switchState(data["state"], player, this.playerLayer);
				if (data["state"] == Player.STATE.dead) {
					this.playerMap[data.ID] = null;
				}
				player.state = data["state"];
			}

		}.bind(this));

		NetWork.receive("drop", function (data) {

			for (var i = 0; i < data.length; i++) {
				var dropProp = data[i];
				for (var j = 0; j < dropProp["props"].length; j++) {
					var prop = dropProp["props"][j];
					this.propLayer.show(prop.x, prop.y, prop["type"], dropProp.x, dropProp.y);
				}
			}

		}.bind(this));

		NetWork.receive("over", function (data) {
			var dialog = new LoadingDialog(
				this.loadingContainer, this.loadingBg
				, this.loadingTipsImage, this.loadingTips
				, this.loadingText, this.loadingImage);
			dialog.loadingText.text = "游戏结束";
			this.isGameStart = false;
			this.notifyPlayerGameStateChanged(this.me.ID);
			dialog.setOKListener(function () {
				// dialog.hide();
				Toast.show("Game Over");
			});

			setTimeout(function () {
				Music.play("bg_mp3").stop();
				RombBoyMatchvsEngine.getInstance.leaveTeam();
				RombBoyMatchvsEngine.getInstance.leaveRoom("");
				SceneManager.backToThePast(HomePage);
			}, 3000);
		}.bind(this));

		KeyBoard.addTapListener(KeyBoard.KeyCode.SPACE, function () {
			this.me.buringBomb();
		}.bind(this));

		if (GameData.isShowPingWindow) {
			var pingWingdow = new PingWindow();
			this.addChild(pingWingdow.init(720, 360));

			NetWork.receive("ping", function (data) {
				var current = new Date().getTime();
				console.log('[INFO] ping.rsp:' + current);
				var ping = current - data;
				console.log('[INFO] ping.rsp:' + data);
				pingWingdow.update(ping);
			}.bind(this));

			setInterval(function () {
				NetWork.send("ping", new Date().getTime());
			}, 1000)
		}

		NetWork.receive("map", function (data) {
			this.joinAtMidway(data);
			this.reconnectDialog.hide();
		}.bind(this));
		NetWork.receive("bombed", function (data) { }.bind(this));

	}
	private joinAtMidway(data) {
		if (!this.loadComplete) {
			setTimeout(function () {
				this.joinAtMidway(data);
				console.log("waiting for  loading  map");
			}.bind(this), 500);
			return;
		}
		for (var n = 0; n < data.length; n++) {
			// console.log(data[n]);
			for (var m = 0; m < data[n].length; m++) {
				var node: any = { type: data[n][m], x: m, y: n };
				if (node.type == 0) {
					this.removeMapNode(node);
				} else if (node.type > 4) {
					this.propLayer.show(node.x, node.y, node.type);
					this.removeMapNode(node);
				} else if (node.type == 3) {
					this.createAndShowBomb(node);
					this.removeMapNode(node);
				}
			}
		}
	}
	private removeMapNode(node) {
		var localNode = TileMap.getNode(this.destroyTileLayer, this.destroyLayer, node.x, node.y);
		localNode && TileMap.removeNode(this.destroyTileLayer, this.destroyLayer, node.x, node.y);
	}
	public gameStart() {
		this.loadingDialog.hide();

		Delay.run(function () {
			Music.play("bg_mp3").setLoop();
		}, 1000);
	}
	public onUserEnter(ID, teamID) {
		if (!this.playerMap[ID]) {
			this.playerMap[ID] = new Player(ID, teamID);
			var player = <Player>this.playerMap[ID];
			player.initView(this.playerLayer, this.joystickContainer);
			if (ID == GameData.userID) { this.me = player; }
		};
	}
	public notifyPlayerGameStateChanged(ID) {
		if (this.playerMap[ID]) {
			this.playerMap[ID].setEnable(this.isGameStart);
		};
	}

	public onUserExit(ID) {
		if (this.playerMap[ID]) {
			Player.diePlayer(this.playerMap[ID], this.playerLayer);
		};

	}

	public onClick(name: string, v: egret.DisplayObject) {
		switch (name) {
			case "bomb":
				this.me.buringBomb();
				break;
			case "avator":
				Toast.show("bomb");
				break;
			case "pingtogle":
				Game.pingWindow.toggle();
				break;
			case "skill_magic":
				RombBoyMatchvsEngine.getInstance.close();
				break;
		}
	}


	private list2object(list, o, field, key?) {
		o[field] = [];
		if (!list || list.length <= 0) {
			return;
		}
		var e = list.split("#");
		if (!e) { return; }
		for (var i = 0; i < e.length; i++) {
			var data = e[i].split(",");
			if (key && data && data.length > 2) {
				o[field][i] = { x: data[0], y: data[1] };
				o[field][i][key] = data[2];
			} else {
				o[field][i] = { x: data[0], y: data[1] };
			}
		}
	}
	private showBombEffect(bombeffect: any) {
		//{"type":"bomb","data":{"power":2,"type":0,
		// "destroyList":[{"x":0,"y":2}],"bombingList":[{"x":0,"y":1}],"effectList":[{"x":0,"y":0},{"x":1,"y":1},{"x":0,"y":2}],
		// "beFoundPropList":[{"type":3,"x":0,"y":2}],"deadPlayerList":[],"deadPropList":[],"x":0,"y":1}}  
		bombeffect = JSON.parse(bombeffect);
		this.list2object(bombeffect.ds, bombeffect, "destroyList");
		this.list2object(bombeffect.b, bombeffect, "bombingList", "playerID");
		this.list2object(bombeffect.e, bombeffect, "effectList");
		this.list2object(bombeffect.f, bombeffect, "beFoundPropList", "type");
		this.list2object(bombeffect.du, bombeffect, "deadPlayerList", "ID");
		this.list2object(bombeffect.dp, bombeffect, "deadPropList", "type");


		for (var i = 0; i < bombeffect.bombingList.length; i++) {
			var b = bombeffect.bombingList[i];
			var bombView = this.bombLayer.getChildByName("bomb:" + b.x + "," + b.y);
			if (bombView) {
				this.bombLayer.removeChild(bombView);
				// console.log("bomb:" + b.x + "," + b.y + " view:" + bombView.name);
				// bombView.visible = false;
			} else {
				console.warn("[warn] bomb:" + b.x + "," + b.y + " view: is null");
			}
			this.bombEffectLayer.bombCenter(b.x, b.y);
			Music.play("explode_mp3");
		}
		for (var i = 0; i < bombeffect.effectList.length; i++) {
			var b = bombeffect.effectList[i];
			this.bombEffectLayer.bombSide(b.x, b.y);
		}
		for (var i = 0; i < bombeffect.destroyList.length; i++) {
			var b = bombeffect.destroyList[i];
			TileMap.removeNode(this.destroyTileLayer, this.destroyLayer, b.x, b.y);
			Music.play("click_mp3");
		}
		for (var i = 0; i < bombeffect.beFoundPropList.length; i++) {
			var prop = bombeffect.beFoundPropList[i];
			this.propLayer.show(prop.x, prop.y, prop["type"]);
		}
		for (var i = 0; i < bombeffect.deadPlayerList.length; i++) {
			// this.removePlayer(bomb.deadPlayerList[i]["ID"]);
		}

		for (var i = 0; i < bombeffect.deadPropList.length; i++) {
			var prop = bombeffect.deadPropList[i];
			this.propLayer.hide(prop.x, prop.y);
		}

	}


	private createAndShowBomb(player: Player) {
		var BombData = RES.getRes("bomb_mc_json");
		var BombTxtr = RES.getRes("bomb_tex_png");
		var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(BombData, BombTxtr);
		var behavior2 = new egret.MovieClip(mcFactory.generateMovieClipData(("bomb")));
		behavior2.x = player.x * GameConfig.NodeW;
		behavior2.y = player.y * GameConfig.NodeH;
		behavior2.width = GameConfig.NodeW;
		behavior2.height = GameConfig.NodeH;
		behavior2.anchorOffsetX = -GameConfig.NodeW / 2;
		behavior2.anchorOffsetY = -GameConfig.NodeH / 2;
		behavior2.name = "bomb:" + player.x + "," + player.y;
		this.bombLayer.addChild(behavior2);
		behavior2.gotoAndPlay(0, -1);
		// console.log('[INFO] bomb - new :' + behavior2.name);
	}

	public onShow() {
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_DISCONNECTRESPONSE, this.onEvent, this);
	}
	public onHide(): void {
		this.pingTimer && clearInterval(this.pingTimer);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_DISCONNECTRESPONSE, this.onEvent, this);
	}
	private onEvent(e) {
		var data = e.data;
		switch (e.type) {
			case MatchvsMessage.MATCHVS_DISCONNECTRESPONSE:
				this.reconnectDialog = new LoadingDialog(
					this.loadingContainer, this.loadingBg
					, this.loadingTipsImage, this.loadingTips
					, this.loadingText, this.loadingImage);
				this.reconnectDialog.loadingText.text = "网络已断开，是否重试？";
				Toast.show("网络已断开");
				this.notifyPlayerGameStateChanged(this.me.ID);
				this.reconnectDialog.setOKListener(function () {
					RombBoyMatchvsEngine.getInstance.reconnect();
					Toast.show("开始重连请等待");
				});
				break;
		}
	}
}
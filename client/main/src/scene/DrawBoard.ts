class DrawBoard extends BaseScene {
	public board: egret.DisplayObjectContainer;
	public userName: eui.Label;
	public step: eui.Button;
	public next: eui.Button;
	public drawer: eui.Button;
	public join: eui.Button;
	public guesser: eui.Button;
	public netStateBar: egret.DisplayObject;
	public isDrawer: boolean = false;
	public pointList: Array<Array<Point>> = [];
	public words: Array<Object> = [];
	public word: Object;

	public roomLayout: egret.DisplayObjectContainer;
	public ctx: egret.Graphics;
	public inputviews: eui.Group;
	public input: eui.TextInput;
	public tip: eui.Label;

	public chatviews: eui.Group;
	public chat: eui.Label;

	public userList: Array<any> = [];
	public roomListLayout: eui.Group;
	public roomListView: eui.List;
	public roomListTitle: egret.DisplayObject;
	public constructor() {
		super();
	}

	public getCanvasCtx(): egret.Graphics {
		// ctx.clear();
		var ctx = this.ctx;
		ctx.lineStyle(10, 0x333333);
		return ctx;
	}

	public retry() {
		this.isHasDraw = true;
		var ctx = this.getCanvasCtx();
		ctx.clear();
		ctx.lineStyle(10, 0x333333);
		for (var i = 0; i < this.pointList.length; i++) {
			for (var j = 0; j < this.pointList[i].length; j++) {
				if (j == 0) {
					ctx.moveTo(this.pointList[i][j].x, this.pointList[i][j].y);
				} else {
					ctx.lineTo(this.pointList[i][j].x, this.pointList[i][j].y);
					ctx.endFill;
				}
			}
		}

	}
	public freshBoard() {
		var ctx = this.getCanvasCtx();
		ctx.clear();
		ctx.lineStyle(10, 0x333333);
		for (var i = 0; i < this.pointList.length; i++) {
			for (var j = 0; j < this.pointList[i].length; j++) {
				if (j == 0) {
					ctx.moveTo(this.pointList[i][j].x, this.pointList[i][j].y);
				} else {
					ctx.lineTo(this.pointList[i][j].x, this.pointList[i][j].y);
				}
			}
		}

		ctx.endFill;
	}
	protected onCreated(): void {
		try {
			getWxUserInfo(function (data) {
				UI.printLog("WX login:" + data)
			});
		} catch (error) {
			console.log('[INFO] error:' + error);
		}
		try {
			var a = new egret.Shape();
			this.board.addChild(a);
			this.ctx = a.graphics;
			var ctx = this.getCanvasCtx();
			var points: Array<Point> = [];
			var lastX, lastY, dx, dy;
			var point: egret.Point = egret.Point.create(0, 0);
			this.board.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e: egret.TouchEvent) {
				point.x = e.localX;
				point.y = e.localY;
				console.log('[INFO] begin' + JSON.stringify(point));
				ctx.moveTo(point.x, point.y);
				points = [];
				points.push(new Point(e.localX, e.localY));
				this.isHasDraw = true;
			}, this);
			this.board.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e: egret.TouchEvent) {
				points.push(new Point(e.localX, e.localY));
				ctx.lineTo(e.localX, e.localY);
				ctx.endFill();
			}, this);
			this.board.addEventListener(egret.TouchEvent.TOUCH_END, function (e: egret.TouchEvent) {
				console.log('[INFO] end :' + points.length);
				this.pointList.push(points);
				this.isHasDraw = true;
			}, this);
			this.board.touchEnabled = false;
			this.board.touchChildren = false;
		} catch (error) {
			console.warn('[WARN] ' + error);
		}
		FileLoader.load("resource/config/words.txt", function (context: string) {
			if (context) {
				var lines = context.split(/\s+/);
				for (var i = 0; i < lines.length; i++) {
					if (lines[i].indexOf("【") > 0) {
						var t = lines[i].split('【');
						this.words[i] = { "word": t[0], "tip": ("【" + t[1]) };
					}
				}
				this.word = this.words[MathUtils.random(this.words.length)]
			}
		}.bind(this));

		ListViewUtil.initListView(this.roomListLayout, this.roomListView, this.userList, RoomUserList);
		this.switchState(0);
		// this.chatviews.visible = true;
		this.userName.text = "ID: " + GameData.userName;
		console.log('[INFO] netStateBar' + this.netStateBar);
	}


	public login() {
		var loginRsp = function (rsp) {
			UI.printLog("[Rsp]login.status:" + utf8ByteArrayToString(rsp.payload));

			this.match();
		}.bind(this);
		var that = this;
		var linstener = {
			onConnect: function (host) {
				UI.printLog("[NetWork] [Connect success]: host:" + host + "] ");

			}.bind(that),
			onErr: function (errCode, errMsg) {
				UI.printLog("[NetWork] [onErr]:[" + errCode + "] errMsg:" + errMsg);
			}.bind(that),
			onDisConnect: function (errCode, errMsg, host) {
				UI.printLog("[NetWork] [disConnect] host:" + host + ", errCode:" + errCode + " errMsg:" + errMsg);
			}.bind(that)
		};
		// UmspManager.login(loginRsp, linstener);
	}

	public match() {
		var rsp = function (rsp) {
			var json = JSON.parse(utf8ByteArrayToString(rsp.payload));
			if (json["isSuccess"] === true) {
				var room = json["room"];
				UI.printLog("=========================================================");
				UI.printLog("[Rsp]matchRoomID:" + room["roomID"]);
				UI.printLog("=========================================================");
				UI.printLog("                                                         ");
				this.switchState(3);
			} else {
				UI.printLog("[W] match fail");
			}
		}.bind(this);
		var ui = this;
		var linstener = {
			onConnect: function (host) {
				UI.printLog("[NetWork] [Connect success]: host:" + host + "] ");
				this.netStateBar.state(NetStateBar.Connect);
			}.bind(ui),
			onErr: function (errCode, errMsg) {
				UI.printLog("[NetWork] [onErr]:[" + errCode + "] errMsg:" + errMsg);
				Toast.show("网络异常,请返回重试");
			}.bind(ui),
			onDisConnect: function (errCode, errMsg, host) {
				UI.printLog("[NetWork] [disConnect] host:" + host + ", errCode:" + errCode + " errMsg:" + errMsg);
				this.switchState(0);
				this.netStateBar.state(NetStateBar.Disconnect);
			}.bind(ui)
		};
		var roomUserChangedListener = function (rsp) {
			var userChanged = JSON.parse(utf8ByteArrayToString(rsp.payload));
			UI.printLog("[Rsp]room userID:" + userChanged["userID"] + " changed :" + userChanged["userAction"]);
			var currentUserList = userChanged["currentUserList"];
			var newList = [currentUserList.length];
			for (var i = 0; i < currentUserList.length; i++) {
				UI.printLog("[Rsp]room UserList[" + i + "]:" + currentUserList[i]["userID"]);
				newList[i] = currentUserList[i]["userID"];
			}
			ListViewUtil.refreshData(this.roomListView, newList);
			if (userChanged["userAction"] == "enter") {
				if (this.isDrawer) {
					this.requestIAmDrawer();
					this.syncWord();
					this.isHasDraw = true;
				}
				Toast.show("玩家 " + userChanged["userID"] + " 进入房间");
			} else if (userChanged["userAction"] == "exit") {
				Toast.show("玩家 " + userChanged["userID"] + " 离开房间");
			}

			this.userList = currentUserList;
		}.bind(this);
		var roomMsgListener = function (data) {
			// UI.printLog("[Rsp]room data:" + data);
			this.onMsg(data);
		}.bind(this);
		// UmspManager.match(rsp, roomUserChangedListener, linstener, roomMsgListener);
	}

	private timer;
	private isHasDraw;
	public startSync() {
		if (!this.timer) {
			this.timer = setInterval(function () {
				if (this.isHasDraw) {
					// UmspManager.send("guess", JSON.stringify(this.pointList));
					this.isHasDraw = false;
				}
			}.bind(this), 100);
		}

	}
	public clearBoard() {
		this.pointList.length = 0;
		this.isHasDraw = true;
	}
	public stopSync() {
		if (!this.timer) { clearInterval(this.timer); }
	}
	public answer() {
		if (!this.isDrawer) {
			// UmspManager.send("answer", JSON.stringify({ userName: GameData.userName, "context": this.input.text }));
		} else {
			Toast.show("画家不可说话");
		}
	}
	public requestIAmDrawer() {
		// UmspManager.send("drawer", GameData.userName + "");
	}
	public iAmDrawser(isDraw: boolean) {
		this.switchState(isDraw ? 1 : 2);
	}
	public syncWord() {
		// UmspManager.send("tip", JSON.stringify(this.word));
	}
	public nextWord() {
		this.word = this.words[MathUtils.random(this.words.length - 1)];
		var word = this.word["word"];
		var tip = this.word["tip"];
		this.clearBoard();
		this.syncWord();
	}


	public switchState(state: number) {
		if (0 == state) {
			this.drawer.visible = false;
			this.guesser.visible = false;
			this.join.visible = true;
			this.roomLayout.visible = true;

			this.isDrawer = false;
			this.chatviews.visible = false;
			this.inputviews.visible = false;
			this.step.visible = false;
			this.next.visible = false;
			this.board.touchEnabled = false;
			this.board.touchChildren = false;

			this.stopSync();

			this.pointList.length = 0;
		} else if (1 == state) {
			this.drawer.enabled = false;
			this.guesser.enabled = false;
			this.join.enabled = true;
			this.roomLayout.visible = false;

			this.isDrawer = true;
			this.chatviews.visible = false;
			this.inputviews.visible = false;
			this.step.visible = true;
			this.next.visible = true;
			this.board.touchEnabled = true;
			this.board.touchChildren = true;

			this.startSync();
			this.nextWord();
		} else if (3 == state) {
			this.drawer.visible = true;
			this.guesser.visible = true;
			this.join.visible = false;
			this.roomLayout.visible = true;

			this.isDrawer = false;
			this.chatviews.visible = false;
			this.inputviews.visible = false;
			this.step.visible = false;
			this.next.visible = false;
			this.board.touchEnabled = false;
			this.board.touchChildren = false;

			this.stopSync();

			this.pointList.length = 0;
		} else {
			this.drawer.enabled = false;
			this.guesser.enabled = false;
			this.join.enabled = true;
			this.roomLayout.visible = false;

			this.isDrawer = false;
			this.chatviews.visible = true;
			this.inputviews.visible = true;
			this.step.visible = false;
			this.next.visible = false;
			this.board.touchEnabled = false;
			this.board.touchChildren = false;

			this.stopSync();
		}


	}


	public onClick(name: string, v: egret.DisplayObject) {
		switch (name) {
			case "board":
				Toast.show("draw:" + v.name);
				break;
			case "tip":
				Toast.show(this.word["tip"]);
				break;
			case "step":
				this.pointList.pop();
				this.retry();
				break;
			case "next":
				this.nextWord();
				break;
			case "send":
				this.answer();
				break;
			case "drawer":
				this.requestIAmDrawer();
				break;
			case "guesser":
				Toast.show("等待画家开始");
				break;
			case "join":
				this.login();
				break;
			case "chatSwitch":
				this.chatviews.visible = !this.chatviews.visible;
				break;
			case "roomListTitle":
				this.roomListLayout.visible = !this.roomListLayout.visible;
				break;
			case "back":
				// UmspManager.logout();
				SceneManager.back();
				break;
			default:
				Toast.show("onclick:" + name);
		}
	}
	public onMsg(data: string) {
		if (!data) {
			return;
		}
		var cmd = data.match(/#(.+?)#/ig).toString();
		if (cmd) {
			var cmdValue = data.split(cmd)[1];
			switch (cmd) {
				case "#answer#":
					var record = JSON.parse(cmdValue);
					var text = record.userName + ":" + record.context;
					if (record.context == this.word["word"]) {
						text = "\r\n恭喜 " + record.userName + " 猜中了!答案是" + record.context;
						text = "\r\n3秒后开始下一题.";
						if (this.isDrawer) {
							setTimeout(function () {
								this.nextWord();
								Toast.show("开始下一个");
								this.clearBoard();
							}.bind(this), 3000);
						}
					} else {
						text += "\r\n " + record.userName + "猜是:" + record.context + " ,可惜错了";
					}
					this.chat.text += text;
					Toast.show(text);

					break;
				case "#guess#":
					if (!this.isDrawer) {
						this.pointList = JSON.parse(cmdValue);
						this.freshBoard();
					}
					break;
				case "#tip#":
					this.word = JSON.parse(cmdValue);
					if (this.isDrawer) {
						this.tip.text = this.word["word"];
						this.chat.text += "\r\n题目:" + this.tip.text;
					} else {
						this.tip.text = this.word["tip"];
						this.chat.text += "\r\n提示:" + this.tip.text;
					}
					BilingBiling.biling(this.tip, 400, 3);
					Toast.show("提示:" + this.tip.text);


					break;

				case "#drawer#":
					Toast.show("画家是:" + cmdValue);
					this.iAmDrawser(cmdValue == GameData.userName);
					break;
				default:
					console.log("unkonw cmd:" + data);
					break;
			}
		} else {

		}
	}
}
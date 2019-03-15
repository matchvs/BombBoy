class NetWork {
	public static listener = {};

	public static send(msgType: string, msg: any) {
		//TODO 更换网络模块
		// UmspManager.send(msgType, msg);
		RombBoyMatchvsEngine.getInstance.sendEventEx(msgType,msg);
	}
	private static receiveMap = {};
	public static receive(msgType: string, callBack: Function) {
		NetWork.receiveMap[msgType] = callBack;
	}

	public static onMsg(data) {
		// console.log('[INFO] ' + data);
		var json = JSON.parse(data);
		NetWork.receiveMap[json["type"]] && NetWork.receiveMap[json["type"]](json["data"]);
	}


	public static teamArray2PlayerArray() {
		for (var i = 0; i < TeamHome.otherTeamUserList.length; i++) {
			TeamHome.myTeamUserList.push(TeamHome.otherTeamUserList[i]);
		}
		GameData.MAX_ROOM_USER_COUNT = TeamHome.myTeamUserList.length;
		let data = { userAction: "enter", currentUserList: TeamHome.myTeamUserList };
		return data;
	}

	public static connect(roomUserChangedListener: Function) {
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_GAME_SERVER_NOTIFY,NetWork.gameServerNotify,this);
		NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY] = function (data) {
			//TODO mvs2Player
			let msg = {userAction:"exit",userID:data.userID};
			roomUserChangedListener(stringToUtf8ByteArray(JSON.stringify(NetWork.teamArray2PlayerArray())));
		};
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY, NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM, NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_NETWORKSTATE,NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		// NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM] = function (data) {
		// 	let msg = {userAction:"exit",userID:data.userID};
		// 	roomUserChangedListener(data);
		// };
		roomUserChangedListener(stringToUtf8ByteArray(JSON.stringify(NetWork.teamArray2PlayerArray())));
		// TeamHome.myTeamUserList;
		// TeamHome.otherTeamUserList;

		// var loginRsp = function (rsp) {
		// 	UI.printLog("[Rsp]login.status:" + utf8ByteArrayToString(rsp.payload));
		// 	this.match(NetWork.onMsg, roomUserChangedListener);
		// }.bind(this);
		// var that = this;
		// var linstener = {
		// 	onConnect: function (host) {
		// 		UI.printLog("[NetWork] [Connect success]: host:" + host + "] ");
		// 	}.bind(that),
		// 	onErr: function (errCode, errMsg) {
		// 		UI.printLog("[NetWork] [onErr]:[" + errCode + "] errMsg:" + errMsg);
		// 	}.bind(that),
		// 	onDisConnect: function (errCode, errMsg, host) {
		// 		UI.printLog("[NetWork] [disConnect] host:" + host + ", errCode:" + errCode + " errMsg:" + errMsg);
		// 	}.bind(that)
		// };
		// UmspManager.login(loginRsp, linstener);
	}

	private static gameServerNotify(e:egret.Event) {
		// switch (e.data.type) {

		// }
		NetWork.onMsg(e.data.cpProto);
	}

	private static match(roomMsgListener, roomUserChangedListener) {
		var rsp = function (rsp) {
			var json = JSON.parse(utf8ByteArrayToString(rsp.payload));
			if (json["isSuccess"] === true) {
				var room = json["room"];
				UI.printLog("=========================================================");
				UI.printLog("[Rsp]matchRoomID:" + room["roomID"]);
				UI.printLog("=========================================================");
				UI.printLog("                                                         ");
			} else {
				UI.printLog("[W] match fail");
			}
		}.bind(this);
		var ui = this;
		var connectListener = {
			onConnect: function (host) {
				UI.printLog("[NetWork] [Connect success]: host:" + host + "] ");
				// this.netStateBar.state(NetStateBar.Connect);
			}.bind(ui),
			onErr: function (errCode, errMsg) {
				UI.printLog("[NetWork] [onErr]:[" + errCode + "] errMsg:" + errMsg);
				Toast.show("网络异常,请返回重试");
			}.bind(ui),
			onDisConnect: function (errCode, errMsg, host) {
				UI.printLog("[NetWork] [disConnect] host:" + host + ", errCode:" + errCode + " errMsg:" + errMsg);
			}.bind(ui)
		};
		// var roomUserChangedListener = function (rsp) {
		// 	var userChanged = JSON.parse(utf8ByteArrayToString(rsp.payload));
		// 	UI.printLog("[Rsp]room userID:" + userChanged["userID"] + " changed :" + userChanged["userAction"]);
		// 	var currentUserList = userChanged["currentUserList"];
		// 	var newList = [currentUserList.length];
		// 	for (var i = 0; i < currentUserList.length; i++) {
		// 		UI.printLog("[Rsp]room UserList[" + i + "]:" + currentUserList[i]["userID"]);
		// 		newList[i] = currentUserList[i]["userID"];
		// 	}
		// 	ListViewUtil.refreshData(this.roomListView, newList);
		// 	if (userChanged["userAction"] == "enter") {
		// 		if (this.isDrawer) {
		// 			this.requestIAmDrawer();
		// 			this.syncWord();
		// 			this.isHasDraw = true;
		// 		}
		// 		Toast.show("玩家 " + userChanged["userID"] + " 进入房间");
		// 	} else if (userChanged["userAction"] == "exit") {
		// 		Toast.show("玩家 " + userChanged["userID"] + " 离开房间");
		// 	}

		// 	this.userList = currentUserList;
		// }.bind(this);
		// var roomMsgListener = function (data) {
		// 	// UI.printLog("[Rsp]room data:" + data);
		// 	this.onMsg(data);
		// }.bind(this);
		// UmspManager.match(rsp, roomUserChangedListener, connectListener, roomMsgListener);
	}
}
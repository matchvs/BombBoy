class Matching extends BaseScene implements eui.UIComponent {
	private roomUserList: eui.List;
	private room: eui.Group;
	private sourceArr: any[] = [];

	protected onCreated(): void {
		// ListViewUtil.initListView(this.room, this.roomUserList, this.sourceArr, RoomUserListItem);
		// var refreshRoomUserList = function (userList: User[]) {
		// 	ArrayUtil.clear(this.sourceArr);
		// 	for (var i = 0; i < userList.length; i++) {
		// 		this.sourceArr.push({ label: userList[i].userID });
		// 	}
		// 	(<any>this.roomUserList.dataProvider).refresh();
		// }.bind(this);
		var match = function () {
			// var matchOption = new Match(2);
			// matchOption.maxUserCount = 4;
			// matchOption.roomName = "开房";
			// UmspManager.engine.match(function (rsp) {
			// 	var json = JSON.parse(utf8ByteArrayToString(rsp.payload));
			// 	if (json["isSuccess"] === true) {
			// 		var room = json["room"];
			// 		UI.printLog("=========================================================");
			// 		UI.printLog("[Rsp]matchRoomID:" + room["roomID"]);
			// 		UI.printLog("=========================================================");
			// 		UI.printLog("                                                         ");
			// 	} else {
			// 		UI.printLog("[W] match fail");
			// 	}


			// },
			// 	function (rsp) {
			// 		var userChanged = JSON.parse(utf8ByteArrayToString(rsp.payload));
			// 		UI.printLog("[Rsp]room userID:" + userChanged["userID"] + " changed :" + userChanged["userAction"]);
			// 		var currentUserList = userChanged["currentUserList"];
			// 		for (var i = 0; i < currentUserList.length; i++) {
			// 			UI.printLog("[Rsp]room UserList[" + i + "]:" + currentUserList[i]["userID"]);

			// 		}
			// 		refreshRoomUserList(currentUserList);
			// 	}, {
			// 		onConnect: function (host) {
			// 			UI.printLog("[NetWork] [Connect success]: host:" + host + "] ");
			// 		},
			// 		onErr: function (errCode, errMsg, host) {
			// 			UI.printLog("[NetWork] [onErr]:[" + errCode + "] errMsg:" + errMsg);
			// 		},
			// 		onDisConnect: function (errCode, errMsg, host) {
			// 			UI.printLog("[NetWork] [disConnect] host:" + host + ", errCode:" + errCode + " errMsg:" + errMsg);
			// 		}
			// 	},matchOption);
			// UI.printLog("matchOption-> "+JSON.stringify(matchOption));
		};
		match();
	}

	public onClick(name: string, v: egret.DisplayObject) {
		Toast.show("click:" + name);
		if ("cancel" == name) {
			SceneManager.back();
		}
	}

}
class NetWork {
	public static myTeamUserList = [];
	public static otherTeamUserList = [];

	private static listener = {};
	private static receiveMap = {};

	public static send(msgType: string, msg: any) {
		RombBoyMatchvsEngine.getInstance.sendEventEx(msgType, msg);
	}
	public static receive(msgType: string, callBack: Function) {
		NetWork.receiveMap[msgType] = callBack;
	}

	public static onMsg(data) {
		// console.log('[INFO] ' + data);
		if (!data) {
			console.warn('onMsg.data is null ');
			return;
		}
		try {
			var json = JSON.parse(data);
			NetWork.receiveMap[json["type"]] && NetWork.receiveMap[json["type"]](json["data"]);
		} catch (error) {
			console.warn("par msg err: %s %s %s", error, " msg: ", data);
		}
	}


	private static teamArray2PlayerArray() {
		for (var i = 0; i < NetWork.otherTeamUserList.length; i++) {
			NetWork.myTeamUserList.push(NetWork.otherTeamUserList[i]);
		}
		GameData.MAX_ROOM_USER_COUNT = NetWork.myTeamUserList.length;
		let data = { userAction: "enter", currentUserList: NetWork.myTeamUserList };
		return data;
	}

	private static roomUserList = [];
	private static appendUser(user) {
		NetWork.roomUserList.push({
			userID: user.userID,
			userProfile: user.userProfile
		});
		return NetWork.roomUserList;
	}
	private static resetUserList(userInfoList) {
		NetWork.roomUserList = userInfoList;
		return NetWork.roomUserList;
	}
	private static getUserList() {
		return NetWork.roomUserList;
	}
	public static connect(roomUserChangedListener: Function) {

		//房间成员变化监听
		NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY] = function (data) {
			//TODO mvs2Player
			roomUserChangedListener(stringToUtf8ByteArray(JSON.stringify(NetWork.teamArray2PlayerArray())));
		};
		//房间已经存在的玩家
		NetWork.listener[MatchvsMessage.MATCHVS_JOINROOM_RSP] = function (event) {
			var roomUserInfoList = event.data;
			var userInfoList = [];
			for (var i = 0; i < roomUserInfoList.length; i++) {
				userInfoList.push(roomUserInfoList[i]);
			}
			userInfoList.push({
				userID: GameData.userID,
				userProfile: GameData.userName
			})
			roomUserChangedListener({ userAction: "enter", currentUserList: NetWork.resetUserList(userInfoList) });
		};
		NetWork.listener[MatchvsMessage.MATCHVS_JOINROOM_NOTIFY] = function (event) {
			roomUserChangedListener({ userAction: "enter", currentUserList: NetWork.appendUser(event.data) });
		};

		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_GAME_SERVER_NOTIFY, NetWork.gameServerNotify, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY, NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM, NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_NETWORKSTATE, NetWork.listener[MatchvsMessage.MATCHVS_LEVAE_ROOM_NOTIFY], this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_JOINROOM_RSP, NetWork.listener[MatchvsMessage.MATCHVS_JOINROOM_RSP], this);

		roomUserChangedListener(stringToUtf8ByteArray(JSON.stringify(NetWork.teamArray2PlayerArray())));


	}

	private static gameServerNotify(e: egret.Event) {
		NetWork.onMsg(e.data.cpProto);
	}
}
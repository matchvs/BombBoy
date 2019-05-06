class RombBoyMatchvsEngine {


	private static _instance;

	private constructor() {

	}


	public static get getInstance(): RombBoyMatchvsEngine {
		if (this._instance == null) {
			this._instance = new RombBoyMatchvsEngine();
		}
		return this._instance;
	}

	/**
	 * 初始化
	 */
	public init(pChannel: string, pPlatform: string, gameID: number, threshold?: number): number {
		var result = MatchvsData.enging.init(MatchvsData.MatchvsRep, pChannel, pPlatform, gameID, MatchvsData.appKey, MatchvsData.gameVision, threshold);
		egret.log("初始化result：" + result);
		return result;
	}


	public getNodeList() {
		var data = MatchvsData.enging.getNodeList();
		return data;
	}


	public premiseInit() {
		MatchvsData.enging.premiseInit(MatchvsData.MatchvsRep, "zdxz.matchvs.com", MatchvsData.PremiseGameID, MatchvsData.PremiseAppkey);
	}

	/**
	 * 注册
	 */
	public registerUser(): number {
		var result = MatchvsData.enging.registerUser();
		egret.log("注册result：" + result);
		return result;
	}

	/**
	 * 登录
	 */
	public login(pUserID: number, pToken: string, nodeID?: number): number {
		var result = MatchvsData.enging.login(pUserID, pToken, MatchvsData.DeviceID, nodeID);
		egret.log("登录result：" + result);
		return result;
	}

	/**
	 * 快速匹配
	 */
	public joinRandomRoom(cpProto: string) {
		var result = MatchvsData.enging.joinRandomRoom(MatchvsData.maxPlayer, cpProto);
		egret.log("快速匹配result :" + result);
		return result;
	}

	/**
	 * 离开房间
	 */
	public leaveRoom(cpProto: string) {
		var result = MatchvsData.enging.leaveRoom(cpProto);
		egret.log("离开房间result :" + result);
		return result;
	}

	public loginOut(): number {
		var result = MatchvsData.enging.logout("累了困了");
		egret.log("登出：", result);
		return result;
	}
	public unInit(): number {
		var result = MatchvsData.enging.uninit();
		egret.log("登出：", result);
		return result;
	}

	/**
	 * 创建房间
	 * @param roomPropety 传递自己的微信昵称与微信头像地址
	 */
	public creatRoom(roomName: string, roomPropety: string, maxPlayer: number, userProfile: string) {
		var defaultRoomInfo: MsCreateRoomInfo = new MsCreateRoomInfo(roomName, 3, maxPlayer, 1, 1, roomPropety);
		var result = MatchvsData.enging.createRoom(defaultRoomInfo, userProfile);
		egret.log("创建房间result:" + result);
		return result;
	}

	/**
	 * 踢人
	 */
	public kickPlayer(userID: number, name: string) {
		var obj = { nickName: name, proto: "你无法跟我一起游戏了" }
		var result = MatchvsData.enging.kickPlayer(userID, JSON.stringify(obj));
		egret.log("踢出" + userID + "result:" + result);
		return result;
	}

	/**
	 * 加入房间
	 * @param userProfile 传递自己的微信昵称与微信头像地址
	 */
	public joinRoom(roomID: string, userProfile: string,isReconnect:boolean) {
		var result = MatchvsData.enging.joinRoom(roomID, userProfile,isReconnect);
		egret.log("加入房间result:" + result);
		return result;
	}

	/**
	 * 获取房间详情
	 */
	public getRoomDetail(roomID: string) {
		var result = MatchvsData.enging.getRoomDetail(roomID);
		egret.log("获取房间详情result:" + result);
		return result;
	}

	/**
	 * 创建小队
	 */
	public creatTeam(teaminfo: MVS.MsCreateTeamInfo) {
		var result = MatchvsData.enging.createTeam(teaminfo);
		egret.log("创建小队result:" + result);
		return result;
	}

	/**
	 * 加入小队
	 */
	public joinTeam(teamInfo) {
		var result = MatchvsData.enging.joinTeam(teamInfo);
		egret.log("加入小队result:" + result);
		return result;
	}

	/**
	 * 离开小队
	 */
	public leaveTeam() {
		var result = MatchvsData.enging.leaveTeam();
		console.log("离开小队result" + result);
		return result;
	}

	/**
	 * 发起队伍匹配
	 * @param canWatch 是否开启观战
	 * @param mode 玩家自定义数据
	 * @param visibility 房间是否可见
	 * @param roomPropety 房间自定义信息
	 */
	public TeamMatch(canWatch: number, mode: number, visibility: number, roomPropety: string) {
		const watchSet = new MVS.MsWatchSet(0, 0, 0, false);
		const full = 0;  //	是否人满匹配，0-人不满也可以匹配，1-人满匹配 (人不满匹配不到会超时报422错误码)
		const teamMatchCond = new MVS.MsTeamMatchCond(2, GameData.TeamMaxPlayer, MatchvsData.teamStartMatchCountDown, 10, 5, 0, full);
		const info = new MVS.MsTeamMatchInfo("", MatchvsData.maxPlayer, canWatch, mode, visibility, roomPropety, teamMatchCond, watchSet);
		var result = MatchvsData.enging.teamMatch(info);
		console.log("队伍匹配result：" + result);
		return result;
	}


	/**
	 * 发送消息扩展接口，给gameServer
	 */
	public sendEventEx(action, cpProto: any) {
		var result = MatchvsData.enging.sendEventEx(1, JSON.stringify({ "type": action, "data": cpProto }), 1, []);
		// console.log("Ex发送消息 result" + result);
		return result;
	}

	public sendEvetn(cpProto: string) {
		var result = MatchvsData.enging.sendEvent(cpProto);
		console.log("发送消息 result" + result);
		return result;
	}
	public reconnect() {
		var result = MatchvsData.enging.reconnect();
		console.log("reconnect result" + result);
		return result;
	}
	public setReconnectTimeOut() {
		MatchvsData.enging.setTeamReconnectTimeout(30);
		MatchvsData.enging.setReconnectTimeout(30);
	}
	public close() {
		MatchvsData.enging.close();
	}
}

class onGetProgress {

	public onMsg = function (buf) {

	}


	public onErr = function (errCode, errMsg) {

	}


}
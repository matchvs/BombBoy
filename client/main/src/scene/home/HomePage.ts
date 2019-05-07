class HomePage extends BaseScene implements eui.UIComponent {

	private loadGame: any;
	private nodeDataList;
	private nodeName: eui.Label;
	private nodeDelay: eui.Label;
	private nodeSelectImage: eui.Image;
	private nodeGroup: eui.Group;
	private nodeList: eui.List;
	private nodeID: number;


	public constructor() {
		super();

	}



	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance)
		switch (partName) {
			case "nodeName":
				this.nodeName = instance;
				break;
			case "nodeDelay":
				this.nodeDelay = instance;
				break;
			case "btn_selet_node":
				this.nodeSelectImage = instance;
				break;
			case "node_group":
				this.nodeGroup = instance;
				break;
			case "nodeList":
				this.nodeList = instance;
				break;
		}
	}




	private matchvsInit(): void {
		if (MatchvsData.isPremise) {
			RombBoyMatchvsEngine.getInstance.premiseInit();
		} else {
			Toast.show("正在获取服务器信息");
			RombBoyMatchvsEngine.getInstance.init(MatchvsData.pChannel, MatchvsData.pPlatform, MatchvsData.gameID, MatchvsData.netDelay);
		}
	}


	private matchvsGetNodeList() {
		this.nodeDataList = RombBoyMatchvsEngine.getInstance.getNodeList();
		if (this.nodeDataList) {
			this.nodeName.text = this.nodeDataList[0].area;
			this.nodeDelay.text = this.nodeDataList[0].latency + "ms";
			this.nodeID = this.nodeDataList[0].nodeID;
		}
	}

	public onClick(name: string, v: egret.DisplayObject) {
		super.onClick(name, v);
		switch (name) {
			case "btn_load_game":
				if (MatchvsData.isPremise) {
					var id = new Date().getMilliseconds();
					RombBoyMatchvsEngine.getInstance.login(id, "121321321321321321321321");
					GameData.userID = id;
					GameData.avatar = "http://pic.vszone.cn/upload/avatar/1464079972.png";
				} else {
					RombBoyMatchvsEngine.getInstance.registerUser();
				}
				break;
			case "btn_selet_node":
				this.nodeSelectImage.source = "resource/assets/HomePage/network_node_select.png"
				this.nodeGroup.visible = true;
				this.nodeList.dataProvider = new eui.ArrayCollection(this.nodeDataList);
				this.nodeList.itemRenderer = NodeListIRSkin;
				break;
			case "test":
				// this.reconnectDialog && (this.reconnectDialog.hide())
				// this.reconnectDialog = new Dialog().show(this, "网络已断开，是否重试？", function () {
				// 	Toast.show("开始重连,请等待");
					
				// }, "提示", function () {
				// 	Toast.show("网络已断开，点击确认重连");
				// });
				break;
		}
	}
	private reconnectDialog: Dialog;
	public onEvent(e: egret.Event): void {
		switch (e.type) {
			case MatchvsMessage.MATCHVS_INIT:
				if (e.data === 200) {
					this.matchvsGetNodeList();
				} else {
					Toast.show("获取节点信息失败");
				}

				break;
			case MatchvsMessage.MATCHVS_REGISTERUSER:
				GameData.userID = e.data.id;
				RombBoyMatchvsEngine.getInstance.login(e.data.id, e.data.token, this.nodeID);
				break;
			case MatchvsMessage.MATCHVS_LOGIN:
				if (e.data.status == 200) {
					if (e.data.roomID != "0") {
						SceneManager.showScene(Game, e.data);//重连去游戏
						RombBoyMatchvsEngine.getInstance.joinRoom(e.data.roomID, "reconnect", true);
						// SceneManager.showScene(Lobby, e.data);//重连取组队
						// console.error("当前不支持游戏断线重连,调整为重连至小队,等待游戏结束");
						console.log("reconnect to game ");
						Toast.show("continued game");
						//
					} else if (e.data.teamID != "0") {
						SceneManager.showScene(Lobby, e.data);//重连取组队
						Toast.show("reconnect team");
						// RombBoyMatchvsEngine.getInstance.leaveRoom("");
					} else {
						SceneManager.showScene(Lobby);
					}
				} else {
					console.log("登录失败");
				}
				break;
			case MatchvsMessage.NODE_ITEM_ONCLICK:
				this.nodeGroup.visible = false;
				this.nodeSelectImage.source = "resource/assets/HomePage/network_node.png"
				this.nodeID = e.data.nodeID;
				this.nodeName.text = e.data.area;
				this.nodeDelay.text = e.data.latency + "ms";
				break;
		}
	}

	public onHide() {
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_INIT, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_REGISTERUSER, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_LOGIN, this.onEvent, this);
	}

	public onShow(par) {
		// LocalStore_Clear();
		RombBoyMatchvsEngine.getInstance.loginOut();
		RombBoyMatchvsEngine.getInstance.unInit();
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_INIT, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_REGISTERUSER, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LOGIN, this.onEvent, this);
		// new NodeListIRSkin.addEventListener(MatchvsMessage.NODE_ITEM_ONCLICK,this.onEvent,this);
		// var node = new NodeListIRSkin();
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.NODE_ITEM_ONCLICK, this.onEvent, this)
		this.matchvsInit();
	}



}


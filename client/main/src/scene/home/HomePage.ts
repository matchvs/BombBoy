class HomePage extends BaseScene implements eui.UIComponent {

	private loadGame: any;
	private isInit: boolean = false;
	private nodeDataList;
	private nodeName: eui.Label;
	private nodeDelay: eui.Label;
	private nodeSelectImage: eui.Image;
	private nodeGroup: eui.Group;
	private nodeList: eui.List;
	private nodeID:number;


	public constructor() {
		super();
	}

	protected onShow(par) {
		LocalStore_Clear();
		this.initEvent();
		this.matchvsInit();
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


	/**
	 * 初始化监听
	 */
	private initEvent(): void {
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_INIT, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_REGISTERUSER, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LOGIN, this.onEvent, this);
		// new NodeListIRSkin.addEventListener(MatchvsMessage.NODE_ITEM_ONCLICK,this.onEvent,this);
		// var node = new NodeListIRSkin();
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.NODE_ITEM_ONCLICK, this.onEvent, this)
	}


	private matchvsInit(): void {
		if (MatchvsData.isPremise) {
			RombBoyMatchvsEngine.getInstance.premiseInit();
		} else {
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
				if (this.isInit) {
					if (MatchvsData.isPremise) {
						var id = new Date().getMilliseconds();
						RombBoyMatchvsEngine.getInstance.login(id, "121321321321321321321321");
						GameData.userID = id;
						GameData.avatar = "http://pic.vszone.cn/upload/avatar/1464079972.png";
					} else {
						RombBoyMatchvsEngine.getInstance.registerUser();
					}
				} else {
					this.matchvsInit();
					Toast.show("初始化失败，请重试");
				}
				break;
			case "btn_selet_node":
				this.nodeSelectImage.source = "resource/assets/HomePage/network_node_select.png"
				this.nodeGroup.visible = true;
				this.nodeList.dataProvider = new eui.ArrayCollection(this.nodeDataList);
				this.nodeList.itemRenderer = NodeListIRSkin;
				break;

		}
	}

	public onEvent(e: egret.Event): void {
		switch (e.type) {
			case MatchvsMessage.MATCHVS_INIT:
				if (e.data === 200) {
					this.isInit = true;
					this.matchvsGetNodeList();
				} else {
					this.isInit = false;
				}

				break;
			case MatchvsMessage.MATCHVS_REGISTERUSER:
				GameData.userID = e.data.id;
				RombBoyMatchvsEngine.getInstance.login(e.data.id, e.data.token,this.nodeID);
				break;
			case MatchvsMessage.MATCHVS_LOGIN:
				if (e.data.status == 200) {
					if (e.data.roomID != "0") {
						RombBoyMatchvsEngine.getInstance.leaveRoom("");
					}
					SceneManager.showScene(Lobby);
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

	protected onHide() {
		this.removeEvent();
	}


	/**
	 * 移除监听
	 */
	private removeEvent() {
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_INIT, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_REGISTERUSER, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_LOGIN, this.onEvent, this);
	}



}


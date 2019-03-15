class TeamHome extends BaseScene implements eui.UIComponent {

	private playerList: any = [];
	private ownerID: number = 0;
	private teamID: String = "";
	private leaderView;
	private userView_one;
	private userView_two;
	private userView_therr;
	private userViewList: any = [];
	private teamIDLable;
	private btnStartMatch: eui.Image;
	private startMatchTipLable;
	private startMatchCountDown: number = MatchvsData.teamStartMatchCountDown;
	private startMatchTipGroup;
	private leaveTeamGroup;
	private matchTiemOutGroup;
	private matchSuccessGroup: eui.Group;
	private isStraMatchOnClick: boolean = true;
	private back: eui.Button;
	private createTeamTip: eui.Image;
	private isLeader: boolean = false;
	private userListView: eui.List;
	private time = undefined;
	public static myTeamUserList;
	public static otherTeamUserList;


	public constructor() {
		super();
	}


	protected onShow(par) {
		console.log("[TeamHome] onShow:" + par);
		if (par != undefined) {
			this.playerList = par.data;
			this.ownerID = par.ownerID;
			if (par.teamID != "") {
				this.teamID = par.teamID;
			}
		}
		this.initEvent();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
		switch (partName) {
			case "leader":
				this.leaderView = instance;
				this.userViewList.push(this.leaderView);
				break;
			case "user_one":
				this.userView_one = instance;
				this.userViewList.push(this.userView_one);
				break;
			case "user_two":
				this.userView_two = instance;
				this.userViewList.push(this.userView_two);
				break
			case "user_three":
				this.userView_therr = instance;
				this.userViewList.push(this.userView_therr);
				break;
			case "team_id":
				this.teamIDLable = instance;
				break;
			case "start_match":
				this.btnStartMatch = instance;
				break;
			case "start_match_tip":
				this.startMatchTipLable = instance;
				break;
			case "match_group":
				this.startMatchTipGroup = instance;
				break;
			case "leave_team_group":
				this.leaveTeamGroup = instance;
				break;
			case "match_tiem_out":
				this.matchTiemOutGroup = instance;
				break;
			case "back":
				this.back = instance;
				break;
			case "create_team_tip":
				this.createTeamTip = instance;
				break;
			case "match_success":
				this.matchSuccessGroup = instance;
				break;
			case "user_list":
				this.userListView = instance;
				break;
		}
	}

	public onClick(name: string, v: egret.DisplayObject) {
		switch (name) {
			case "back":
				if (!this.leaveTeamGroup.visible) {
					this.leaveTeamGroup.visible = true;
				}
				break;
			case "start_match":
				if (this.isStraMatchOnClick) {
					this.starMatch();
				}
				break;
			case "cancel_leave_team":
				if (this.leaveTeamGroup.visible) {
					this.leaveTeamGroup.visible = false;
				}
				break;
			case "btn_leave_team":
				RombBoyMatchvsEngine.getInstance.leaveTeam();
				break;
			case "btn_abort_match":
				this.abortMatch();
				break;
			case "btn_to_match":
				this.matchTiemOutGroup.visible = false;
				this.starMatch();
				break;
		}
	}



	private initEvent() {
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_TEAM_MATCH_STAR, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_TEAM_MATCH_RESULT_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.addEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM, this.onEvent, this);
	}

	protected childrenCreated(): void {
		super.childrenCreated();
		this.initView();
		console.log("TeamHome childrenCreated:");
	}

	public initView() {
		this.teamIDLable.text = this.teamID;
		this.isLeader = this.ownerID === GameData.userID ? true : false
		for (var i = 0; i < GameData.TeamMaxPlayer; i++) {
			if (this.playerList[i] !== undefined) {
				this.playerList[i].isLeader = i === 0 ? true : false;
				this.playerList[i].avatar = this.playerList[i].avatar === undefined ? this.playerList[i].userProfile : this.playerList[i].avatar;
				// this.playerList[i].avatarTex = ImageLoader.Texture(this.playerList[i].avatar);
			} else {
				var player = { avatar: "resource/assets/TeamHome/team_default_avatar.jpg", userID: "", isLeader: false };
				// player.avatarTex =  ImageLoader.Texture(player.avatar);
				this.playerList.push(player);
			}
		}
		this.userListView.dataProvider = new eui.ArrayCollection(this.playerList);
		this.userListView.itemRenderer = userListIRSkin;
		if (!this.isLeader) {
			this.btnStartMatch.source = "resource/assets/TeamHome/wait_start_game.png";
			this.isStraMatchOnClick = false;
		} else {
			this.btnStartMatch.source = "resource/assets/TeamHome/btn_start_match.png";
			this.isStraMatchOnClick = true;
		}

	}


	public onEvent(e: egret.Event): void {
		var data = e.data;
		switch (e.type) {
			case MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY:
				if (data.action === "leaveTeam" && data.player.userID === GameData.userID) {
					SceneManager.back();
				} else {
					this.playerList = data.data;
					if (data.ownerID !== 0) {
						this.ownerID = data.ownerID;
					}
					this.initView();
				}
				break;
			case MatchvsMessage.MATCHVS_TEAM_MATCH_STAR:
				if (data.status === 200) {
					this.startMatchCountDown = MatchvsData.teamStartMatchCountDown;
					this.MatchCountDown(this);
				}
				break;
			case MatchvsMessage.MATCHVS_TEAM_MATCH_RESULT_NOTIFY:
				if (data.status === 200) {
					this.matchSuccess(data, this);
				} else {
					this.matchBust();
				}
				break;
			case MatchvsMessage.MATCHVS_LEVAE_ROOM:
				this.matchSuccessGroup.visible = false;
				SceneManager.back();
				break;

		}

	}

	/**
	 * 开始匹配
	 */
	private starMatch() {
		const canWatch = 1;  //	是否可以观战 1-可以观战 2不可以观战。
		const mode = 0;      // 根据mode 进行队伍匹配
		const visibility = 1;  //匹配的房间是否可见（是否可以被getRoomListEx查看到）。0-不可见 1- 可见
		const roomProperty = ""; //房间自定义信息
		RombBoyMatchvsEngine.getInstance.TeamMatch(canWatch, mode, visibility, roomProperty);
	}

	/**
	 * 匹配倒计时
	 */
	private MatchCountDown(self) {
		this.back.visible = false;
		this.createTeamTip.visible = false;
		this.startMatchTipGroup.visible = true;
		this.startMatchTipLable.text = "正在匹配玩家：" + self.startMatchCountDown;
		if (this.isLeader) {
			this.isStraMatchOnClick = false;
			this.btnStartMatch.source = "resource/assets/TeamHome/btn_in_the_match.png";
		} else {
			this.btnStartMatch.source = "resource/assets/TeamHome/tips.png";
		}

		if (this.time !== undefined) {
			clearInterval(this.time);
			this.time = undefined;
		}
		this.time = setInterval(function () {
			self.startMatchCountDown--;
			if (self.startMatchCountDown < 0) {
				clearInterval(self.time);
				self.time = undefined;
			} else {
				self.startMatchTipLable.text = "正在匹配玩家：" + self.startMatchCountDown;
			}
		}, 1000);
	}

	/**
	 * 匹配超时
	 */
	private matchBust() {
		this.startMatchTipGroup.visible = false;
		if (this.isLeader) {
			this.matchTiemOutGroup.visible = true;
			this.btnStartMatch.source = "resource/assets/TeamHome/btn_start_match.png";
		} else {
			//打印toast
			this.back.visible = true;
			this.createTeamTip.visible = true;
			Toast.show("匹配失败，等待队长重新开始游戏");
			this.btnStartMatch.source = "resource/assets/TeamHome/wait_start_game.png";
		}
	}

	/**
	 * 匹配成功
	 */
	private matchSuccess(data, self) {
		// this.maskBg.visible = true;
		TeamHome.myTeamUserList = data.brigades[0].playerList;
		TeamHome.otherTeamUserList = data.brigades[1].playerList;
		let myTeamViewList = [];
		let otherTeamViewList = [];
		this.matchSuccessGroup.visible = true;
		for (var i = 2; i < 10; i++) {
			if (i > 5) {
				otherTeamViewList.push(this.matchSuccessGroup.getElementAt(i))
			} else {
				myTeamViewList.push(this.matchSuccessGroup.getElementAt(i));
			}
		}
		let ImageX = 0,ImageY =0,ImageWidth = 61,ImageHeight = 61;
		for (var a = 0; a < TeamHome.myTeamUserList.length; a++) {
			ImageLoader.showAsyncByCrossUrl(myTeamViewList[a],TeamHome.myTeamUserList[a].userProfile,ImageX,ImageY,ImageWidth,ImageHeight);
			myTeamViewList[a].getElementAt(1).text = TeamHome.myTeamUserList[a].userID;
			TeamHome.myTeamUserList[a].teamID = 0;
			if (GameData.userID == TeamHome.myTeamUserList[a].userID) {
				GameData.teamID = 0;
			}
		}
		for (var b = 0; b < TeamHome.otherTeamUserList.length; b++) {
			ImageLoader.showAsyncByCrossUrl(otherTeamViewList[b],TeamHome.otherTeamUserList[b].userProfile,ImageX,ImageY,ImageWidth,ImageHeight);
			otherTeamViewList[b].getElementAt(1).text = TeamHome.otherTeamUserList[b].userID;
			TeamHome.otherTeamUserList[b].teamID = 1;
			if (GameData.userID == TeamHome.otherTeamUserList[b].userID) {
				GameData.teamID = 1;	
			}
		}
		// setTimeout(function() {
		RombBoyMatchvsEngine.getInstance.sendEventEx("team", GameData.teamID);
		SceneManager.showScene(Game);
        // },1000);

	}

	/**
	 * 取消匹配
	 */
	private abortMatch() {
		this.back.visible = true;
		// this.maskBg.visible = false;
		this.createTeamTip.visible = true;
		this.matchTiemOutGroup.visible = false;
		this.startMatchTipGroup.visible = false;
		this.isStraMatchOnClick = true;
		this.btnStartMatch.source = "resource/assets/TeamHome/btn_start_match.png";
	}


	protected onHide(): void {
		this.removeEvent();
	}

    /**
     * 移除监听
     */
	public removeEvent() {
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_TEAM_USER_INFO_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_TEAM_MATCH_STAR, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_TEAM_MATCH_RESULT_NOTIFY, this.onEvent, this);
		RomeBoyMatchvsRep.getInstance.removeEventListener(MatchvsMessage.MATCHVS_LEVAE_ROOM, this.onEvent, this);
	}


}
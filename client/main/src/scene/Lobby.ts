class Lobby extends BaseScene implements eui.UIComponent {


	private avatarView:eui.Group;
	private nameView: eui.Label;
	private btnChaosFaction:eui.Button; //  乱斗模式

	public constructor() {
		super();
		console.log('[INFO] Lobby');

	}
	protected onShow(par) {
		console.log("[Lobby] onShow:" + par);
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance)
		switch (partName) {
			case "avatar" :
				this.avatarView = instance;
				break;
			case "name" :
				this.nameView = instance;
				break;
			case "chaos_faction":
				this.btnChaosFaction = instance;
				break;
		}
	}

	protected onCreated(): void {
		console.log("[Lobby] [onCreated] " + this.name);
		let ImageX = 0,ImageY =0,ImageWidth = 72,ImageHeight = 72;
		ImageLoader.showAsyncByCrossUrl(this.avatarView,GameData.avatar,ImageX,ImageY,ImageWidth,ImageHeight);
		this.nameView.text = GameData.userID+"";
		this.btnChaosFaction.enabled = false;
	}


	public onClick(name: string, v: egret.DisplayObject) {
		switch (name) {
			case "back":
				RombBoyMatchvsEngine.getInstance.loginOut();
				SceneManager.back();
				break;
			case "chaos_faction":
				egret.log("大乱斗模式还不能玩");
				break;
			case "player_team":
				egret.log("组队开始喽");
				SceneManager.showScene(TeamReady);
				break;
		}
	}

}
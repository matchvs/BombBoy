class LoadingDialog {

	public loadingContainer: eui.Group;
	public loadingBg: eui.Rect;
	public loadingTipsImage: eui.Image;
	public loadingTips: eui.Label;
	public loadingText: eui.Label;
	public loadingImage: eui.Image;

	public constructor(loadingContainer, loadingBg, loadingTipsImage, loadingTips, loadingText, loadingImage) {
		this.loadingContainer = loadingContainer;
		this.loadingBg = loadingBg;
		this.loadingTipsImage = loadingTipsImage;
		this.loadingTips = loadingTips;
		this.loadingText = loadingText;
		this.loadingImage = loadingImage;
		AnimaUtil.biling(loadingText, 1000, -1);
		AnimaUtil.floating(loadingImage);
		this.loadingContainer.visible = true;
	}
	public hide() {
		this.loadingContainer.visible = false;
		egret.Tween.removeTweens(this.loadingImage);
		egret.Tween.removeTweens(this.loadingText);
	}
	public setOKListener(cb) {
		this.loadingBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent) {
			return cb();
		}, this.loadingBg);
	}
	public setCancleListener(cb) {
		this.loadingBg.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent) {
			return cb();
		}, this.loadingBg);
	}
}
class Dialog extends eui.Component implements eui.UIComponent {
	public OK: eui.Button;
	public Cancle: eui.Button;
	public title: eui.Label;
	public message: eui.Label;
	public img: eui.Image;

	public s_message;
	public OKListener;
	public cancleListener;
	public s_title;
	public constructor() {
		super();

	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
		console.log('[INFO] partAdded');


	}

	protected childrenCreated(): void {
		super.childrenCreated();
		console.log('[INFO] childrenCreated');
	}
	public show(context: egret.DisplayObjectContainer, message: string, OKListener?: Function, title?: string, cancleListener?: Function) {
		context.addChild(this);
		this.s_message = message;
		this.OKListener = OKListener;
		this.cancleListener = cancleListener;
		this.s_title = title;
		console.log('[INFO] show');
		this.message && (this.message.text = this.s_message);
		this.title && (this.title.text = this.s_title);
		this.OKListener && this.setOKListener(this.OKListener);
		this.cancleListener && this.setCancleListener(this.cancleListener);
		return this;

	}
	public hide() {
		this.parent && this.parent.removeChild(this);
	}
	public setOKListener(cb) {
		this.OK.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent) {
			this.hide();
			return cb();
		}.bind(this), this.OK);
	}
	public setCancleListener(cb) {
		this.Cancle.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e: egret.TouchEvent) {
			this.hide();
			return cb();
		}.bind(this), this.OK);
	}
}
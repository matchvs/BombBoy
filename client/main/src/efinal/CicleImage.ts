class CicleImage extends egret.DisplayObjectContainer {
	private image: eui.Image;
	public constructor() {
		super();
		this.image = new eui.Image();
		var circle: egret.Shape = new egret.Shape();
		circle.graphics.beginFill(0x0000ff);
		circle.graphics.drawCircle(60, 60, 60);
		circle.graphics.endFill();
		this.addChild(circle);
		this.image.mask = circle;
	}
}
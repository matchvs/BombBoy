class PropLayer extends BaseLayer {
	public constructor() {
		super();
	}
	public SURNAME = "porp";
	//道具和道具图片映射表
	public static Type = { 0: "item_78", 5: "item_64", 6: "item_61", 7: "item_62" };
	public show(x, y, type,srcx?,srcy?) {
		this.addImage(x, y, PropLayer.Type[type],srcx,srcy);
	}
	public hide(x, y) {
		this.removeChildWithAnima(x, y);
	}
}
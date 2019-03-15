class userListIRSkin extends eui.ItemRenderer {

    private leader_avatar:eui.Group;
    private maskFillColor:number = 0x0000ff;
    private maskX = 100;
    private maskY = 100;
    private maskRadius = 115;

    protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance)
        switch (partName) {
            case "leader_avatar":
                this.leader_avatar = instance;
                break;
        }

    }


    protected createChildren():void {
        super.createChildren();
        var shaBeMask = new egret.Shape;
        shaBeMask.graphics.drawRect(this.x,this.y,this.width,this.height);
        shaBeMask.graphics.beginFill(this.maskFillColor);
        shaBeMask.graphics.drawCircle(this.maskX,this.maskY,this.maskRadius);
        shaBeMask.graphics.endFill();
        this.addChild(shaBeMask);
        this.leader_avatar.mask = shaBeMask;
    }

    protected dataChanged():void {
        ImageLoader.showAsyncByCrossUrl( this.leader_avatar,this.data.avatar,0,0,178,178);
    }





}
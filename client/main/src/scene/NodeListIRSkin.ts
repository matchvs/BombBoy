class NodeListIRSkin extends eui.ItemRenderer {


    private nodeInfoName: eui.Label;
    private nodeItem: eui.Group;


    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
        switch (partName) {
            case "nodeInfoName":
                this.nodeInfoName = instance;
                break;
            case "nodeItem":
                this.nodeItem = instance;
                break;
        }

    }

    protected createChildren(): void {
        super.createChildren();
        this.nodeItem.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onclick,this);

    }

    private onclick(evt:egret.Event) {
        // R.dispatchEvent(new egret.Event(MatchvsMessage.NODE_ITEM_ONCLICK, false, false, this.data));
        RomeBoyMatchvsRep.getInstance.dispatchEvent(new egret.Event(MatchvsMessage.NODE_ITEM_ONCLICK, false, false, this.data));
        // console.log(this.data);
        // console.log("11111111111111111");
    }

    protected dataChanged(): void {
        this.nodeInfoName.text = this.data.area + "  " + this.data.latency + "ms";
    }


}
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
        this.nodeItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick, this);

    }

    private onclick(evt: egret.Event) {
        RomeBoyMatchvsRep.getInstance.dispatchEvent(MatchvsMessage.NODE_ITEM_ONCLICK, this.data);
    }

    protected dataChanged(): void {
        this.nodeInfoName.text = this.data.area + "  " + this.data.latency + "ms";
    }


}
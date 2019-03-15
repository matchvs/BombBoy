class LoadingUtil extends egret.Sprite {

    private bgImageWidth:number = 65;
    private bgImageHeight:number = 65;  
    private bg:eui.Image;
    private loadingImage:eui.Image;

    public constructor(stageWidth,stageHeight,) {
        super();
        this.createView(stageWidth,stageHeight);
    }


    private createView(stageWidth,stageHeight): void {
        this.bg = new eui.Image("resource/assets/icon_loading_bg.png");
        this.bg.x = stageWidth/2- this.bgImageWidth;
        this.bg.y = stageHeight/2 - this.bgImageHeight;
        this.addChild(this.bg);
        this.loadingImage = new eui.Image("resource/assets/icon_loading.png");
        this.loadingImage.anchorOffsetX = this.bgImageWidth/2;
        this.loadingImage.anchorOffsetY = this.bgImageWidth/2;
        this.loadingImage.x = stageWidth/2;
        this.loadingImage.y = stageHeight/2;
        this.addChild(this.loadingImage);

        egret.Tween.get(this.loadingImage,{loop:false})
            .to({rotation:360*5},5000,egret.Ease.sineIn);

    }






}
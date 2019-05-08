class BaseLayer extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }
    public SURNAME = "porp";
    public genName(x, y) {
        return this.SURNAME + x + "," + y;
    }
    public addImage(x, y, resName, fromX?, fromY?) {
        var image = new egret.Bitmap();
        ImageLoader.show(image, resName)
        image.name = this.genName(x, y);
        image.x = x * GameConfig.NodeW;
        image.y = y * GameConfig.NodeH;
        image.width = GameConfig.NodeW;
        image.height = GameConfig.NodeH;
        // image.anchorOffsetX = GameConfig.NodeW / 2;
        // image.anchorOffsetY = -GameConfig.NodeH / 4;
        // image.scaleX = 1.5;
        // image.scaleY = 1.5;
        this.addChild(image);
        var tox = image.x + 4;
        var toy = image.y - 8;
        var srcx = image.x;
        var srcy = image.y;
        if (fromX && fromY) {
            egret.Tween.get(image)
                .to({ "x": fromX * GameConfig.NodeW, "y": fromY * GameConfig.NodeH }, 10, egret.Ease.quadIn)
                .to({ "x": x * GameConfig.NodeW, "y": y * GameConfig.NodeH }, 200, egret.Ease.quadIn)
                .play().call(function () {
                    egret.Tween.get(image, { "loop": true })
                        .to({ "x": tox, "y": toy, }, 3000, egret.Ease.bounceIn)
                        .to({ "x": srcx, "y": srcy, }, 5000, egret.Ease.bounceOut)
                        .play();
                });
        } else {
            egret.Tween.get(image, { "loop": true })
                .to({ "x": tox, "y": toy, }, 3000, egret.Ease.bounceIn)
                .to({ "x": srcx, "y": srcy, }, 5000, egret.Ease.bounceOut)
                .play();
        }

    }
    public static floatingAnima(image: egret.DisplayObject) {
        var tox = image.x;
        var toy = image.y - 10;
        var srcx = image.x;
        var srcy = image.y;
        egret.Tween.get(image, { "loop": true })
            .to({ "x": tox, "y": toy, }, 1000, egret.Ease.bounceIn)
            .to({ "x": srcx, "y": srcy, }, 1500, egret.Ease.bounceOut)
            .play();
    }
    public removeChildWithAnima(x, y) {
        var child = this.getChildByName(this.genName(x, y));
        // child && egret.Tween.get(child).to({ "alpha": 0.5, "scaleX": 1.1, "scaleY": 1.1 }, 300).play().call(function () {
        child && this.removeChild(child);
        // }, this);
    }
}
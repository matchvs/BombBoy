class TileSet {
	public firstgid: number;
	public lastgid: number;
	public source: string;
	public tileArr: Tile[] = [];

	public name: string
	public tilewidth: number;
	public tileheight: number;
	public tilecount: number;
	public columns: number;

	public constructor() {
	}

	public static creatByXML(map: TileMap, node: any, callback?: Function) {
		var tileset: any = new TileSet();
		tileset["firstgid"] = Number(node.$firstgid);
		tileset["source"] = node.$source;
		if (null == tileset.source) {//check source in tileset 
			tileset.lastgid = Number(tileset.firstgid) + Number(node.$tilecount);
			tileset.name = node.$name;
			tileset.tilewidth = node.$tilewidth;
			tileset.tileheight = node.$tileheight;
			tileset.tilecount = node.$tilecount;
			tileset.columns = node.$columns;
			// console.log('[INFO]  tileset.name:'+tileset.name);
			// console.log('[INFO]  node.tilecount:'+node.$tilecount);
			// console.log('[INFO] parse tileset.firstgid:'+tileset.firstgid);
			// console.log('[INFO] parse tileset.lastgid:'+tileset.lastgid);
			var image = node.children[0];//the 0th should is <Image> tag
			for (var i = 0; i < tileset.tilecount; i++) {
				tileset.tileArr.push(Tile.creatByImage(tileset, i, image));
			}
			// console.log('[INFO] tileset.name'+tileset.name);
			callback && callback(tileset);
		} else {
			console.log('[INFO] tileset#tsx: ' + tileset.source);
			var source: string = tileset["source"];
			if (source.indexOf(".tsx") > 0) {
				FileLoader.loadXML(map.baseURL + source, function (xml: egret.XML) {
					for (var i = 0; i < xml.children.length; i++) {
						if ((<any>xml.children[i]).name == "tile") {
							tileset.tileArr.push(Tile.creatByXML(tileset, <any>xml.children[i]));
						}
					}
					tileset.lastgid = tileset.firstgid + tileset.tileArr.length;
					console.log("[INFO] parse " + source + ", the Tile count:" + tileset.tileArr.length);
					callback && callback(tileset);
				}.bind(this));
			}
		}

		return tileset;
	}
}
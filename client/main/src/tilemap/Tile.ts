class Tile {
	public id: number;
	public width: number;
	public height: number;
	public image: TileImage;
	public constructor() {
	}

	public static creatByXML(tileSet: TileSet, node: any) {
		var o: any = new Tile();
		o["id"] = Number(tileSet.firstgid) + Number(node.$id);
		o["image"] = TileImage.creatByXML(o, node.children[0]);
		// console.log('[INFO] tileset: ' + o.id);
		return o;
	}
	public static creatByImage(tileSet: TileSet, index: number, image: egret.XMLNode): Tile {
		//  <tileset firstgid="25" name="map_flopy5" tilewidth="40" tileheight="40" tilecount="3" columns="3">
		//   <image source="map_flopy5.png" width="124" height="52"/>
		//  </tileset>
		var o: Tile = new Tile();
		o["id"] = Number(tileSet.firstgid) + Number(index);
		o.width = tileSet.tilewidth;
		o.height = tileSet.tileheight;
		o["image"] = TileImage.creatByImage(o, index, image);
		// console.log('[INFO] creatByImage ,ID:' + o.id + " image.source" + o.image.source + "#" + o.image.subSource);
		return o;

		// console.log('[INFO] tileset: ' + o.id);
	}
}
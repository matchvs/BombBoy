class TileImage {
	public width: number = 0;
	public height: number = 0;
	public source: string;
	public subSource: string|number;//for subbitmap in a big texture
	public x: number;
	public y: number;
	public constructor(a1, a2, a3) {
		this.width = a1;
		this.height = a2;
		this.source = a3;
	}

	public static creatByXML(map: Tile, node: any) {
		var o: any = new TileImage(Number(node.$width),Number(node.$height),node.$source);
		// console.log('[INFO] tileset: ' + o.source);
		return o
	}
	public static creatByImage(tile: Tile,id:number, node: any) :TileImage{
		var o: TileImage = new TileImage(Number(node.$width),Number(node.$height),node.$source);
		o.subSource = id;
		o.width = Number(tile.width);
		o.height = Number(tile.height);
		// console.log('[INFO] Tile.Image: '+id+" srcouce:" + o.source+"#"+o.subSource);
		return o;
	}
}
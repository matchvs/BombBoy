class TileMap {
	public name: string;
	public tilewidth: number;
	public tileheight: number;
	public width: number;
	public height: number;
	public orientation: string;
	public version: string;
	public renderorder: string;
	public nextobjectid: number;

	public layers: TileLayer[] = [];
	public tilesets: TileSet[] = [];

	public baseURL: string;

	private xml: egret.XML;

	public constructor(tmxFileName, baseURL) {
		this.name = tmxFileName;
		this.baseURL = baseURL;

	}

	/**
	 * TM中所有的texture数据都在一个一维数组中,
	 */
	public getImageByID(dataID: number): TileImage {
		for (var i = 0; i < this.tilesets.length; i++) {
			if (dataID >= this.tilesets[i].firstgid && dataID <= this.tilesets[i].lastgid) {
				var tileArray = this.tilesets[i].tileArr;
				var firstgid = this.tilesets[i].firstgid;
				var index = Math.max(dataID - firstgid, 0);
				var title = tileArray[index];
				if (title && title.image) {
					return title.image;
				} else {
					console.warn('[WARN] index:' + index + "dataID:" + dataID);
				}
			}
		}
		return null;
	}
	private loadTiles(callback?: Function) {
		var progress = 0;
		var total = this.xml.children.length;

		for (var i = 0; i < this.xml.children.length; i++) {
			var node: any = this.xml.children[i];
			progress++;
			if (node.name == "layer") {
				this.layers.push(TileLayer.creatByXML(this, node, ));
			} else if (node.name == "tileset") {
				this.tilesets.push(TileSet.creatByXML(this, node));
				// console.log('[INFO]============== this.tilesets.len:' + this.tilesets.length);
			}
			callback(this, progress, total);
		}


	}

	public static createTileMap(tmxFileName, baseURL, callback?: Function): void {
		FileLoader.loadXML(baseURL + tmxFileName, function (xml: egret.XML) {
			var tilemap: TileMap = new TileMap(tmxFileName, baseURL);
			tilemap.xml = xml;
			tilemap.tilewidth = (<any>xml).$tilewidth;
			tilemap.tileheight = (<any>xml).$tileheight;
			tilemap.width = (<any>xml).$width;
			tilemap.height = (<any>xml).$height;
			tilemap.loadTiles(function (a1, a2, a3) {
				callback(tilemap, a2, a3);
			});
		}.bind(this));
	}

	public static getRenderImageArr(map: TileMap, renderRect, tileDataArray): Array<any> {
		var renderImageArr = [];

		for (var i = 0; i < renderRect.renderRow; i++) {
			renderImageArr[i] = [];
			for (var j = 0; j < renderRect.renderColumn; j++) {
				var index = j * map.width + i;
				var indexInTileSet = Number(tileDataArray[index]);
				if (indexInTileSet != 0) {
					var image: TileImage = map.getImageByID(indexInTileSet);
					if (null != image) {
						image.x = i;
						image.y = j;
						// console.log('[INFO] found a TileImage , id:' + id);
						renderImageArr[i][j] = image;
					} else {
						console.log('[WARN] fail , find the TileImage by  : index:' + index + " id:" + indexInTileSet);//TODO
					}
				}
			}
		}
		return renderImageArr;
	}
	public static renderImageArrayFromRemote(renderImageArr, url: string, mapLayer: egret.DisplayObjectContainer) {
		mapLayer.removeChildren();
		for (var i = 0; i < renderImageArr.length; i++) {
			for (var j = 0; j < renderImageArr[i].length; j++) {
				var image: TileImage = renderImageArr[i][j];
				if (image) {
					ImageLoader.showAsyncByCrossUrl(mapLayer, url + image.source, (i * 48) - image.width + 48, (j * 32) - image.height + 32, image.width, image.height);
				}
			}
		}
	}

	public static renderImageArray(renderImageArr, mapLayer: egret.DisplayObjectContainer) {
		mapLayer.removeChildren();
		for (var i = 0; i < renderImageArr.length; i++) {
			for (var j = 0; j < renderImageArr[i].length; j++) {
				var image: TileImage = renderImageArr[i][j];
				if (image) {
					console.log('[INFO] =>      (' + i + "," + j + ")" + image.source + "#" + image.subSource);
					ImageLoader.showAndCreate(mapLayer, image.source + "#" + image.subSource, (i * image.width), (j * image.height), true);
				} else {
					// no tile,so no render
				}
			}
		}
	}

	public static removeNode(map: TileLayer, childlayer: egret.DisplayObjectContainer, x, y) {
		// console.log('[Tiled Map] remove Node:' + x + " ," + y);
		var child = childlayer.getChildByName(map.name + ":" + x + "," + y);
		child && egret.Tween.get(child).to({ "alpha": 0.5, "scaleX": 1.1, "scaleY": 1.1 }, 400).play().call(function (name, childlayer2, x, y) {
			var newc = childlayer.getChildByName(name + ":" + x + "," + y);
			newc && childlayer2.removeChild(newc);
		}, this, [map.name, childlayer, x, y]);
	}
	public static render(map: TileMap, mapLayer: egret.DisplayObjectContainer, x, y, renderMaxW, renderMaxH) {

		for (var i = 0; i < map.layers.length; i++) {
			var layer: TileLayer = map.layers[i];
			var renderRect = {
				renderRow: Math.ceil(renderMaxW / map.tilewidth),
				renderColumn: Math.ceil(renderMaxH / map.tileheight),
				renderOffsetX: Math.floor(x),
				renderOffsetY: Math.floor(y),
			}
			var layerView = new egret.DisplayObjectContainer();
			layerView.width = renderMaxW;
			layerView.height = renderMaxH;
			layerView.name = layer.name;
			mapLayer.addChild(layerView);

			this.renderLayer(map, layerView, layer, renderRect);

		}
	}
	private static renderLayer(map: TileMap, mapLayer: egret.DisplayObjectContainer, layer: TileLayer, renderRect) {
		if (null == layer.data.dataArr) {
			console.log('[warn] layer.data.dataArr is null ' + layer.name);
			return;
		}
		var dataArr = layer.data.dataArr;
		// console.log('[INFO] layer: ' + layer.name + ' ,Title length:' + dataArr.length);
		mapLayer.removeChildren();
		var renderImageArr = [];
		for (var i = 0; i < renderRect.renderRow; i++) {
			renderImageArr[i] = [];
			for (var j = 0; j < renderRect.renderColumn; j++) {
				var index = j * map.width + i;
				var indexInTileSet = dataArr[index] ? Number(dataArr[index]) : 0;
				// console.log('[INFO] indexInTileSet:' + indexInTileSet);
				if (indexInTileSet == 0 || indexInTileSet == NaN) {
					continue;
				}
				var image: TileImage = map.getImageByID(indexInTileSet);
				if (null != image) {
					image.x = i;
					image.y = j;
					// console.log('[INFO] found a TileImage , id:' + id);
					renderImageArr[i][j] = image;
					// console.log('[INFO] =>      (' + i + "," + j + ")" + image.source + "#" + image.subSource);
					var bitmapView = ImageLoader.showAndCreate(mapLayer, image.source + "#" + image.subSource, (i * map.tilewidth), (j * map.tileheight), true);
					// ImageLoader.showAndCreate(mapLayer, image.source + "#" + image.subSource, (i * image.width), (j * image.height), image.width, image.height);
					bitmapView.name = layer.name + ":" + i + "," + j;
				} else {
					console.log('[WARN] fail , find the TileImage by  : index:' + index + " indexInTileSet:" + indexInTileSet);//TODO
				}
			}
		}
	}
}
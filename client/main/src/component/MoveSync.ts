class MoveSync {
	public static FPS: number = 30;

	private cacheSize: number = 1;
	// private cacheSize: number = Math.floor(Math.max(MoveSync.FPS,12) / 3);
	private cacheQueue = [];
	private timer;
	private isCacheing = true;

	public constructor(onMoveSync: Function) {
		this.timer = setInterval(function () {
			if (this.cacheQueue.length > 0) {
				if (!this.isCacheing) {
					onMoveSync(this.cacheQueue.pop());
					if (this.cacheSize > 0 && this.cacheQueue.length > this.cacheSize) {
						while (this.cacheQueue.length > (this.cacheSize - 1)) {
							onMoveSync(this.cacheQueue.pop());
							// console.warn('[WARN] should jump frame ! the cacheQueue.len' + this.cacheQueue.length + '  >  ' + this.cacheSize);
						}
						this.isCacheing = true;
					}
				} else {
					// console.log('[INFO] caching, queue.size:' + this.cacheQueue.length);
				}
			} else {
				// console.warn('[WARN] the cache is not enough !');
			}

		}.bind(this), 1000 / MoveSync.FPS);
	}

	public update(arrow) {
		this.cacheQueue.unshift(arrow);
		if (this.isCacheing && this.cacheQueue.length >= this.cacheSize) {
			this.isCacheing = false;
		}
	}
	public dispose() {
		clearInterval(this.timer);
	}

}
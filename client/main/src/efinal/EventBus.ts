class EventBus {
	public static LEAVE_ROOM_NOTIFY = 1;
	public static checkStatsEeception(stats: number): boolean {
		if (stats === 200) {
			return false;
		}
		EventBus.boardcastException(stats);
		return true;

	}
	private static listeners: Object = { "boardcast": [] };
	public static boardcastException(stats: number) {
		for (var i = 0; i < EventBus.listeners["boardcast"].length; i++) {
			var l = EventBus.listeners["boardcast"][i];
			l && l(stats);
		}
	}
	public static instance = new EventBus();

	public static addEventListener(callback: Function, key?: any) {
		if (!key) {
			key = "boardcast";
		}
		if (!this.listeners[key]) {
			this.listeners[key] = [];
		}
		this.listeners[key].push(callback);
	}
	public removeEventListener(callback: Function, key: any) {
		if (!EventBus.listeners[key]) return;

		for (var i = 0; i < EventBus.listeners[key].length; i++) {
			if (EventBus.listeners[key][i]) {
				console.log(`removeEventListener ${key} success`)
				EventBus.listeners[key].splice(i, 1)
			}
		}
	}
	public static dispatchEvent(key: any, data?: any) {
		if (!EventBus.listeners[key]) return;

		for (var i = 0; i < EventBus.listeners[key].length; i++) {
			if (EventBus.listeners[key][i]) {
				console.log(`dispatchEvent ${key} success`)
				EventBus.listeners[key][i](key, data);
			}
		}

	}
}
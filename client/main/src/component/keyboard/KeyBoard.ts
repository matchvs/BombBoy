class KeyBoard extends egret.EventDispatcher {
	private inputs: Object = {
		37: 0,
		38: 0,
		39: 0,
		40: 0,
	};

	public static KeyCode = {
		"NULL": 0,
		"LEFT": 37,
		"UP": 38,
		"RIGHT": 39,
		"DOWN": 40,
		"SPACE": 32,
		"NUMPAD_ENTER": 13,
		"A": 65,
		"S": 83,
		"D": 68,
		"W": 87,
	}

	public static TapListenerMap = {};
	public static TouchListenerMap = {};
	public constructor() {
		super();

		// this.init();
		var handU = function (event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			// console.log('[INFO] up:' + e.code);
			if (KeyBoard.TapListenerMap[e.keyCode]) {
				KeyBoard.TapListenerMap[e.keyCode](e.keyCode);
			}
			if (KeyBoard.TouchListenerMap[e.keyCode]) {
				KeyBoard.TouchListenerMap[e.keyCode](e.keyCode, "up");
			}
		};
		var handD = function (event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			// console.log('[INFO] down:' + e.code);
			if (KeyBoard.TouchListenerMap[e.keyCode]) {
				KeyBoard.TouchListenerMap[e.keyCode](e.keyCode, "down");
			}
		};
		try {
			document.onkeyup = handU;
			document.onkeydown = handD;
		} catch (error) {
			console.log(error);
		}
	}

	public static addTapListener(keyCode, listener: Function) {
		KeyBoard.TapListenerMap[keyCode] = listener;

	}
	public static addTouchListener(keyCode, listener: Function) {
		KeyBoard.TouchListenerMap[keyCode] = listener;

	}

	/**
	 * 判断data字符串数组中是否包含某个字符串
	 */
	public isContain(data, keyCode) {
		return data[keyCode] && data[keyCode] == 1;
	}



}
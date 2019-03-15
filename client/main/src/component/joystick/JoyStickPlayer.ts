class JoyStickPlayer {
	public node: egret.MovieClip;
	private speed: number = 4;
	private animaTime: number = 1000 / MoveSync.FPS;
	private lastArrow = VirtualJoystick.Arrow.UP;
	private lastDst = { x: 0, y: 0 };
	private arrow = 0;
	private view;
	private container: egret.DisplayObjectContainer;
	private timer;
	public isEnable = false;
	public constructor(node: egret.MovieClip, joystickContainer: egret.DisplayObjectContainer, isNeedSync?: boolean) {
		this.node = node;
		this.lastDst.x = node.x;
		this.lastDst.y = node.y;
		this.container = joystickContainer;
		if (isNeedSync) {
			var vj = new VirtualJoystick(joystickContainer, "joystick2_png", "joystick4_png");
			vj.addEventListener("vj_start", this.onStart, this);
			vj.addEventListener("vj_move", this.onChange, this);
			vj.addEventListener("vj_end", this.onEnd, this);

			var lastSyncKeyArrow = 0;
			vj.onKeyPressedListener = function (arrow) {
				if (lastSyncKeyArrow == arrow) {
					// console.log('[INFO] --------------- ignore : ' + lastSyncKeyArrow );
					return;
				}
				// console.log('[INFO] xxxxxxx  go : ' + arrow);
				if (!this.isEnable) {
					return;
				}
				lastSyncKeyArrow = arrow;
				NetWork.send("input", arrow);
			}.bind(this);

			joystickContainer.addChild(vj);
			this.view = vj;

			var lastSyncArrow = 0;
			this.timer = setInterval(function () {
				if (lastSyncArrow < 0 || lastSyncArrow == this.arrow) {
					// console.log('[INFO] --------------- ignore : ' + lastSyncArrow);
					return;
				}
				if (!this.isEnable) {
					return;
				}
				console.log('[INFO] XXXXXXXXXXXXXXXXX  send  :  ' + this.arrow);
				lastSyncArrow = this.arrow;
				NetWork.send("input", this.arrow);
			}.bind(this), 1000 / (MoveSync.FPS));
		}
	}
	public disposed() {
		this.view && this.container.removeChild(this.view);
		this.timer && clearInterval(this.timer);
	}

	private onStart() {
		// this.node.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}

	//触摸摇杆的角度改变，人物的移动速度方向也随之改变
	private onChange(e: egret.Event) {
		this.arrow = e.data;
		console.log('[INFO] arrow' + this.arrow);
	}

	//停止摇杆，人物停止移动
	private onEnd() {
		this.arrow = 0;
		// this.node.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}
	//每帧更新，人物移动
	private onEnterFrame() {

	}
	public moveByArrow(arrow) {
		if (arrow < 0) {
			return;
		}
		switch (arrow) {
			case VirtualJoystick.KeyArrow.LEFT:
				this.lastDst.x -= this.speed;
				break;
			case VirtualJoystick.KeyArrow.RIGHT:
				this.lastDst.x += this.speed;
				break;
			case VirtualJoystick.KeyArrow.UP:
				this.lastDst.y -= this.speed;
				break;
			case VirtualJoystick.KeyArrow.DOWN:
				this.lastDst.y += this.speed;
				break;
			case VirtualJoystick.KeyArrow.LEFT_DOWN:
				this.lastDst.y += this.speed;
				this.lastDst.x -= this.speed;
				break;
			case VirtualJoystick.KeyArrow.LEFT_UP:
				this.lastDst.y -= this.speed;
				this.lastDst.x -= this.speed;
				break;
			case VirtualJoystick.KeyArrow.RIGHT_DOWN:
				this.lastDst.y += this.speed;
				this.lastDst.x += this.speed;
				break;
			case VirtualJoystick.KeyArrow.RIGHT_UP:
				this.lastDst.x += this.speed;
				this.lastDst.y -= this.speed;
				break;
		}

		// console.log('[INFO] arrow to ' + arrow + "[" + this.lastDst.x + "," + this.lastDst.y + "] + " + new Date().getMilliseconds());
		egret.Tween.get(this.node).to({ "y": this.lastDst.y, "x": this.lastDst.x }, this.animaTime).play();
		if (this.lastArrow == arrow) {
			return;
		}
		this.lastArrow = arrow;
		try {
			this.node.gotoAndPlay("walk_" + VirtualJoystick.KeyArrowValue[arrow], -1);
		} catch (e) {
			console.warn('[WARN] moveByArrow err:' + e.message + " arrow:" + VirtualJoystick.KeyArrowValue[arrow]);
		}
	}

}
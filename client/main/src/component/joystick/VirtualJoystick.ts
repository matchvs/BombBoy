class VirtualJoystick extends eui.Component {

	public static Arrow = {
		UP: "UP", RIGHT_UP: "RIGHT_UP",
		RIGHT: "RIGHT", RIGHT_DOWN: "RIGHT_DOWN",
		DOWN: "DOWN", LEFT_DOWN: "LEFT_DOWN",
		LEFT: "LEFT", LEFT_UP: "LEFT_UP"
	};

	public static KeyArrow = {
		NULL: 0,//1 << 0
		LEFT: 1,//1 << 0
		UP: 2,//1 << 1
		RIGHT: 4,//1 << 2
		DOWN: 8,//1 << 3
		LEFT_UP: 3,
		RIGHT_UP: 6,
		LEFT_DOWN: 9,
		RIGHT_DOWN: 12,
	};

	public static KeyArrowValue = {
		1: VirtualJoystick.Arrow.LEFT,
		2: VirtualJoystick.Arrow.UP,
		4: VirtualJoystick.Arrow.RIGHT,
		8: VirtualJoystick.Arrow.DOWN,
		3: VirtualJoystick.Arrow.LEFT_UP,
		6: VirtualJoystick.Arrow.RIGHT_UP,
		9: VirtualJoystick.Arrow.LEFT_DOWN,
		12: VirtualJoystick.Arrow.RIGHT_DOWN,
	};

	public static AngleRange = [45, 90, 135, 180, 225, 270, 315,360];
	public static Angle2Arrow = {
		0: VirtualJoystick.KeyArrow.UP,
		1: VirtualJoystick.KeyArrow.RIGHT,
		2: VirtualJoystick.KeyArrow.RIGHT,
		3: VirtualJoystick.KeyArrow.DOWN,
		4: VirtualJoystick.KeyArrow.DOWN,
		5: VirtualJoystick.KeyArrow.LEFT,
		6: VirtualJoystick.KeyArrow.LEFT,
		7: VirtualJoystick.KeyArrow.UP,
	};


	private ball: eui.Image = new eui.Image();          //圆环
	private circle: eui.Image = new eui.Image();        //小球
	private circleRadius: number = 0; //圆环半径
	private ballRadius: number = 0;   //小球半径
	private centerX: number = 0;      //中心点坐标
	private centerY: number = 0;
	private touchID: number;          //触摸ID
	private keyBoard: KeyBoard;          //触摸ID


	//触摸移动，设置小球的位置
	private lastDownPoint: egret.Point = new egret.Point();
	private currentPoint: egret.Point = new egret.Point();

	public constructor(joystickContainer: egret.DisplayObjectContainer, resBG, resBall) {
		super();
		// this.skinName = "VirtualJoystickSkin";
		joystickContainer.addChild(this);
		this.width = this.parent.width;
		this.height = this.parent.height;
		this.centerX = this.width / 2;
		this.centerY = this.height / 2;

		this.circle = new eui.Image();
		ImageLoader.show(this.circle, resBG);

		this.ball = new eui.Image(resBall);
		ImageLoader.show(this.ball, resBall);


		this.addChild(this.circle);
		this.addChild(this.ball);
		this.init();

	}
	public onKeyPressedListener;
	public childrenCreated() {
		//获取圆环和小球半径
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.keyBoard = new KeyBoard();
		//添加监听事件
		KeyBoard.addTouchListener(KeyBoard.KeyCode.W, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.S, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.A, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.D, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.LEFT, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.RIGHT, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.UP, this.handkeyboard.bind(this));
		KeyBoard.addTouchListener(KeyBoard.KeyCode.DOWN, this.handkeyboard.bind(this));
	}
	private lastDownKeyCode = 0;
	private handkeyboard(code, downOrUp) {
		var arrow = 0;
		if (downOrUp == 'down') {
			this.lastDownKeyCode = code;
		}

		if (downOrUp == 'up') {
			if (this.lastDownKeyCode == code) {
				this.onKeyPressedListener && this.onKeyPressedListener(VirtualJoystick.KeyArrow.NULL);
				return;
			} else {
				// console.log('[INFO] ignore keyup ,' + code);
				return;
			}
		}
		switch (code) {
			case KeyBoard.KeyCode.W:
			case KeyBoard.KeyCode.UP:
				arrow = VirtualJoystick.KeyArrow.UP;
				break;
			case KeyBoard.KeyCode.A:
			case KeyBoard.KeyCode.LEFT:
				arrow = VirtualJoystick.KeyArrow.LEFT;
				break;
			case KeyBoard.KeyCode.D:
			case KeyBoard.KeyCode.RIGHT:
				arrow = VirtualJoystick.KeyArrow.RIGHT;
				break;
			case KeyBoard.KeyCode.S:
			case KeyBoard.KeyCode.DOWN:
				arrow = VirtualJoystick.KeyArrow.DOWN;
				break;
		}
		this.onKeyPressedListener && this.onKeyPressedListener(arrow);
	}
	public init() {
		this.touchEnabled = true;
		this.circleRadius = this.circle.height / 2;
		this.ballRadius = this.circle.height / 2 / 2;
		this.ball.width = this.circle.width / 2;
		this.ball.height = this.circle.height / 2;
		this.ball.touchEnabled = false;
		this.ball.x = this.centerX - this.ballRadius;
		this.ball.y = this.centerY - this.ballRadius;
		this.circle.x = this.centerX - this.circleRadius;
		this.circle.y = this.centerY - this.circleRadius;
		this.circle.touchEnabled = false;
		this.hide();
	}
	//停止虚拟摇杆
	public destory() {
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
	}

	//触摸开始，显示虚拟摇杆
	private onTouchBegin(e: egret.TouchEvent) {
		this.show();
		var x = this.centerX;
		var y = this.centerY;
		this.touchID = e.touchPointID;
		this.lastDownPoint.x =x;
		this.lastDownPoint.y =y;
		// console.log('[INFO] lastdown:' +x + "," +y+"    this:"+this.x+","+this.y);
		this.circle.x =x - this.circleRadius;
		this.circle.y =y - this.circleRadius;

		this.ball.x =x - this.ballRadius;
		this.ball.y =y - this.ballRadius;
		console.log('[INFO] ball:' + this.ball.x + "," + this.ball.y);
		this.dispatchEvent(new egret.Event("vj_start"));
	}

	//触摸结束，隐藏虚拟摇杆
	private onTouchEnd(e: egret.TouchEvent) {
		if (this.touchID != e.touchPointID) {
			return;
		}
		this.hide();
		this.dispatchEvent(new egret.Event("vj_end"));
	}


	private onTouchMove(e: egret.TouchEvent) {
		if (this.touchID != e.touchPointID) {
			return;
		}
		//获取手指和虚拟摇杆的距离
		this.currentPoint.x = Math.min(e.localX, this.circle.x + this.circle.width);
		this.currentPoint.y = Math.min(e.localY, this.circle.y + this.circle.height);
		this.currentPoint.x = Math.max(this.circle.x, this.currentPoint.x);
		this.currentPoint.y = Math.max(this.circle.y, this.currentPoint.y);
		this.ball.x = this.currentPoint.x - this.ballRadius;
		this.ball.y = this.currentPoint.y - this.ballRadius;
		// console.log('[INFO] move:' + e.localX + "," + e.localY+"    this:"+this.x+","+this.y);

		// var dist = egret.Point.distance(this.lastDownPoint, this.currentPoint);
		var angle: number = this.angle(this.lastDownPoint, this.currentPoint);

		var arrow;
		for (var i = 0; i < VirtualJoystick.AngleRange.length; i++) {
			if (angle <= VirtualJoystick.AngleRange[i]) {
				arrow = VirtualJoystick.Angle2Arrow[i];
				break;
			}
		}

		// 派发事件
		this.dispatchEventWith("vj_move", false, arrow);
		// console.log('[INFO] angle:' + angle+" arrow:"+arrow);
	}
	//亮点正Y轴之间的角度
	private angle(start, end) {
		var px = start.x, py = start.y, mx = end.x, my = end.y;
		var x = Math.abs(px - mx);
		var y = Math.abs(py - my);
		var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var cos = y / z;
		var radina = Math.acos(cos);//用反三角函数求弧度
		var angle = Math.floor(180 / (Math.PI / radina));//将弧度转换成角度
		if (mx > px && my > py) {//鼠标在第四象限
			angle = 180 - angle;
		}
		if (mx == px && my > py) {//鼠标在y轴负方向上
			angle = 180;
		}
		if (mx > px && my == py) {//鼠标在x轴正方向上
			angle = 90;
		}
		if (mx < px && my > py) {//鼠标在第三象限
			angle = 180 + angle;
		}
		if (mx < px && my == py) {//鼠标在x轴负方向
			angle = 270;
		}
		if (mx < px && my < py) {//鼠标在第二象限
			angle = 360 - angle;
		}
		return angle;
	}
	private hide() {
		// this.ball.alpha = 0x33;
		// this.circle.alpha = 0x33;
	}
	private show() {
		// this.ball.alpha = 0xcc;
		// this.circle.alpha = 0xcc;
	}

}
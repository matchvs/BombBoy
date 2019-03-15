public class GameConfig {
    public final static int FPS = 10;

    public final static int MAX_MAP_WIDTH = 12;
    public final static int MAX_MAP_HEIGHT = MAX_MAP_WIDTH;

    public final static int BASE_NODE_WIDTH = 60;
    public final static int BASE_NODE_HEIGHT = BASE_NODE_WIDTH;

    public final static int MAX_BOMB_POWER = 5;
    public final static int MAX_BOMB_COUNT = 4;
    public final static int MAX_MOVE_SPEED = 8;

    public final static int MIN_BOMB_POWER = 2;
    public final static int MIN_BOMB_COUNT = 1;
    public final static int MIN_MOVE_SPEED = 1;

    /**
     * 爆率
     */
    public final static int PROP_PROBABILITY = 2;

    /**
     * 忽略碰撞检查的范围
     */
    public static final double CHECK_IGNORE = 0;
    //    public static final double CHECK_IGNORE = 0.33;
    public static final long BOMB_DELAY = 3000;

    public static final long TIME_WEAK_TO_DEAD = 10000;

    public static final String ACTION_MOVE = "move";
    public static final String ACTION_BURING = "buring";
    public static final String ACTION_BORN = "born";
    public static final String ACTION_PICK = "pick";
    public static final String ACTION_INPUT = "input";
    public static final String ACTION_BOMB = "bomb";
    public static final String ACTION_STATE_PLAYER = "state";
    public static final String ACTION_TEAM = "team";
    public static final String ACTION_OVER = "over";
    public static final String ACTION_DROP = "drop";
    public static final String ACTION_PING = "ping";

    public static final String RoomServerIP = "192.168.8.114";
//        public static final String RoomServerIP = "118.24.53.22";
    public static String EventServerIP = "118.24.53.22";
    private static double MoveSpeedConfig[] = new double[]{
            150 / FPS,
            175 / FPS,
            200 / FPS,
            225 / FPS,
            250 / FPS,
            280 / FPS,
            320 / FPS,
            370 / FPS,
    };

    /**
     * 根据鞋子数量计算速度
     *
     * @param speed
     * @return
     */
    public static double caluSpeed(int speed) {
        speed = Math.max(MIN_MOVE_SPEED, speed);
        speed = Math.min(MoveSpeedConfig.length, speed);
        return MoveSpeedConfig[speed - 1];
    }
}

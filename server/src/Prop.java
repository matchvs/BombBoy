import java.util.Random;

public class Prop extends Position {
    public static final Random r = new Random();
    public int type;

    public Prop(int x, int y, int type) {
        super(x, y);
        this.type = type;
    }

    /**
     * 根据道具爆率配置计算是否爆出物品
     *
     * @return
     */
    public static int genType() {
        if (r.nextInt(GameConfig.PROP_PROBABILITY) == 0) {
            return r.nextInt(Map.ITEM_NUM) + Map.ITEM_INDEX + 1;
        }
        return Map.NULL;
    }

    @Override
    public String toString() {
        return super.toString() + "," + type;
    }
}

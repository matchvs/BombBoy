public class Input {
    public final static int LEFT = 1;//1 << 0
    public final static int UP = 2;//1 << 1
    public final static int RIGHT = 4;//1 << 2
    public final static int DOWN = 8;//1 << 3
    public final static int LEFT_UP = 3;
    public final static int RIGHT_UP = 6;
    public final static int LEFT_DOWN = 9;
    public final static int RIGHT_DOWN = 12;
    public int arrowX;
    public int arrowY;

    public static int[] arrow2xy(int arrow) {
        int x = 0, y = 0;
        switch (arrow) {
            case LEFT:
                x = -1;
                y = 0;
                break;
            case UP:
                x = 0;
                y = -1;
                break;
            case RIGHT:
                x = 1;
                y = 0;
                break;
            case DOWN:
                x = 0;
                y = 1;
                break;
            case LEFT_UP:
                x = -1;
                y = -1;
                break;
            case RIGHT_UP:
                x = 1;
                y = -1;
                break;
            case LEFT_DOWN:
                x = -1;
                y = 1;
                break;
            case RIGHT_DOWN:
                x = 1;
                y = 1;
                break;
        }
        return new int[]{
                x, y
        };
    }
}

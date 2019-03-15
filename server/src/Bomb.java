import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Bomb extends Position {


    public int playerID;//炸弹的归属玩家ID

    private transient volatile Runnable timer ;
    public transient int power;
    public transient int type;//0为定时炸弹,1为遥控炸弹
    private transient boolean isBombed = false;

    public Bomb(int x, int y, int playerID, int power) {
        super(x, y);
        this.playerID = playerID;
        this.power = power;
    }

    public Bomb(Player p) {
        super(p.x, p.y);
        this.playerID = p.ID;
        this.power = p.power;
    }

    public void bombDelay(Map map, long bombDelay, BombController bombController, BombEffect.BombListener listener, Player.StateListener playerListener) {
        Runnable runnable = () -> {
            BombEffect bf = new BombEffect(map);
            bombController.bomb(Bomb.this, bf,playerListener);
            bombController.bombAfter(this,bf,playerListener);
            if (listener != null) {
                listener.onBomb(bf);
            }
        };
        GameEngine.getInstance().setTimeOut(runnable, bombDelay);
        timer = runnable;
        //log.info("Timer: new ->" + timer);
    }

    /**
     * 取消定时器
     */
    public void bombed() {
        GameEngine.getInstance().clearInterval(timer);
        this.isBombed = true;
//        log.info("Timer: clear ->" + timer);
    }
    public String toString() {
        return super.toString() + "," + playerID;
    }
}

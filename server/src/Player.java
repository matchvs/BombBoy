import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class Player extends Position {

    public interface MoveListener {
        void onMove(Player player, int x, int y);
    }

    public transient final static Player[] EmptyPlayers = new Player[0];
    public final static int STATE_LIVE = 0;
    public final static int STATE_WEAK = 1;
    public final static int STATE_DEAD = 2;

    public transient boolean isHasSyncStop;
    private List<Bomb> currentBombList;
    public transient Input input = new Input();
    public int ID;
    public int teamID;
    private int arrow;
    public int xInMap, yInMap;
    public int speed = GameConfig.MIN_MOVE_SPEED;
    public int power = GameConfig.MIN_BOMB_POWER;
    public int bombCount = GameConfig.MIN_BOMB_COUNT;
    //    public int speed = GameConfig.MIN_MOVE_SPEED;
//    public int power = GameConfig.MIN_BOMB_POWER;
//    public int bombCount = GameConfig.MIN_BOMB_COUNT;
    public int state = STATE_LIVE;
    public transient Runnable deadTimer;
    public transient boolean isStopMove = false;

    public Player(int ID, int x, int y, int teamID) {
        super(x, y);
        this.ID = ID;
        this.teamID = teamID;
        currentBombList = new ArrayList<>();
    }

    public void setPosition(int x, int y) {
        this.x = x;
        this.y = y;
        this.xInMap = x * GameConfig.BASE_NODE_WIDTH;
        this.yInMap = y * GameConfig.BASE_NODE_HEIGHT;
    }

    public void updateTeam(int team) {
        this.teamID = team;
    }

    public boolean isStopMove() {
        return isStopMove;
    }

    public void updateInput(int arrowX, int arrowY) {
        if (state != STATE_LIVE) {
            return;
        }
        this.input.arrowX = arrowX;
        this.input.arrowY = arrowY;

    }

    public void setArrow(int currentArrow) {
        if (currentArrow != 0) {
            isHasSyncStop = false;
        }
        this.isStopMove = (currentArrow == 0);
        this.arrow = currentArrow;
    }

    public Bomb tryBuried() {
        if (currentBombList.size() < bombCount) {
            Bomb bomb = new Bomb(this);
            currentBombList.add(bomb);
            return bomb;
        }
        return null;
    }

    public boolean removeBomb(Bomb b) {
        return currentBombList.remove(b);
    }

    public boolean move(int xArrow, int yArrow, MovePathLimit limit, MoveListener listener) {
        if (xArrow == 0 && yArrow == 0) return false;
        if (state == Player.STATE_DEAD) return false;
        double dstX = xArrow * GameConfig.caluSpeed(this.speed);
        this.xInMap += dstX;
//        log.info("x changed In map:" + this.xInMap);
        double ignore = GameConfig.CHECK_IGNORE;
        if (limit.hasLimitX(this.x, this.y, xArrow)) {
            if (xArrow > 0) {
                this.xInMap = (int) Math.min(this.xInMap, (this.x + ignore) * GameConfig.BASE_NODE_WIDTH);
            } else {
                this.xInMap = (int) Math.max(this.xInMap, (this.x - ignore) * GameConfig.BASE_NODE_WIDTH);
            }
        }
        this.x = (int) Math.floor((xInMap + GameConfig.BASE_NODE_WIDTH / 2) / GameConfig.BASE_NODE_WIDTH);


        double dstY = yArrow * GameConfig.caluSpeed(this.speed);
        this.yInMap += dstY;
        if (limit.hasLimitY(this.x, this.y, yArrow)) {
            if (yArrow > 0) {
                this.yInMap = (int) Math.min(this.yInMap, (this.y + ignore) * GameConfig.BASE_NODE_HEIGHT);
            } else {
                this.yInMap = (int) Math.max(this.yInMap, (this.y - ignore) * GameConfig.BASE_NODE_HEIGHT);
            }
        }
        this.y = (int) Math.floor((yInMap + GameConfig.BASE_NODE_HEIGHT / 2) / GameConfig.BASE_NODE_HEIGHT);

        listener.onMove(this, x, y);
        return true;
    }

    public void addPower() {
        power = Math.min(GameConfig.MAX_BOMB_POWER, ++power);
    }

    public void addBombCount() {
        bombCount = Math.min(GameConfig.MAX_BOMB_COUNT, ++bombCount);
    }

    public void addSpeed() {
        speed = Math.min(GameConfig.MAX_MOVE_SPEED, ++speed);
    }

    public void pick(int type) {
        switch (type) {
            case Map.ITEM_SPEED:
                addSpeed();
                break;
            case Map.ITEM_POWER:
                addPower();
                break;
            case Map.ITEM_COUNT:
                addBombCount();
                break;
            default:
                log.warn("[warn] unknown prop type:" + type);
                break;
        }
    }

    public int weak() {
        state = STATE_WEAK;
        input.arrowX = 0;
        input.arrowY = 0;
        return state;
    }

    public int die() {
        state = STATE_DEAD;
        GameEngine.getInstance().clearInterval(deadTimer);
        log.info("[player to dead  ] " + ID + "team:" + teamID + " ," + deadTimer);
        return state;
    }

    public int relive() {
        state = STATE_LIVE;
        GameEngine.getInstance().clearInterval(deadTimer);
        log.info("[player to relive] " + ID + "team:" + teamID + " ," + deadTimer);
        return state;
    }
    public String toString() {
        return super.toString() + "," + ID;
    }
    public static interface StateListener {
        void onStateChange(Player pl, int state);
    }
}

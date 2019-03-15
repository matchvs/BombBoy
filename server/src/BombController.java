import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class BombController {
    private final Map map;
    /**
     * 炸弹爆炸的方向坐标变换基数,默认上左下右4方向.
     */
    private final Position[] ArrowArray = new Position[]{
            new Position(0, -1),
            new Position(1, 0),
            new Position(0, 1),
            new Position(-1, 0),
    };

    public BombController(Map map) {
        this.map = map;
    }

    /**
     * @param bomb 炸弹
     * @param bf   炸弹爆炸效果
     */
    public void bomb(Bomb bomb, BombEffect bf, Player.StateListener ps) {
        if (bomb == null) {
            return;
        }
        int x = bomb.x;
        int y = bomb.y;
//        log.info("bomb:" + x + "," + y);
        bf.bombingList.add(map.getBomb(x, y));
        map.setNode(x, y, Map.NULL);
        map.removeBomb(bomb);

        isBombPlayer(bf.deadPlayerList, x, y, ps);
        List<Position> bombListNext = new ArrayList<>();
        //根据威力半径计算炸弹周围的障碍物,可摧毁物,其他炸弹
        for (int j = 0; j < ArrowArray.length; j++) {
            for (int i = 1; i < bomb.power; i++) {
                Position arrow = ArrowArray[j];
                int nx = arrow.x * (i) + x;
                int ny = arrow.y * (i) + y;
                if (nx < 0 || nx + 1 > map.getWidth() || ny < 0 || ny + 1 > map.getHeight()) {
                    continue;
                }
                int node = map.getNode(nx, ny);
                boolean isBreak = false;//是否需要在这个方向上扩大范围计算
                switch (node) {
                    case Map.DESTROY:
//                        map.setNode(nx, ny, Map.NULL);
                        bf.destroyList.add(new Position(nx, ny));
                        bf.effectList.add(new Position(nx, ny));
                        isBreak = true;

                        //检查是否有道具被炸出
                        Prop p = map.getProp(nx, ny);
                        if (p != null) {
                            map.setNode(nx, ny, p.type);
                            bf.beFoundPropList.add(p);
                        }

                        break;
                    case Map.Bomb:
                        log.info("link BombEffect:" + nx + "," + ny);
//                        map.setNode(nx, ny, Map.Bombing); //@see BombController.bombAfter();
                        bombListNext.add(new Position(nx, ny));
//                        isBreak = true;
                        break;
                    case Map.OBSTACLES:
                        isBreak = true;
                        break;
                    case Map.NULL:
                        bf.effectList.add(new Position(nx, ny));
                        break;
//                    case Map.Bombing:
//                        break;
                    case Map.ITEM_COUNT:
                    case Map.ITEM_POWER:
                    case Map.ITEM_SPEED:
                        Prop prop1 = map.getProp(nx, ny);
                        bf.deadPropList.add(prop1);
                        map.removeProp(nx, ny);
                    default:
                        break;

                }
                isBombPlayer(bf.deadPlayerList, nx, ny, ps);
                if (isBreak) {
                    break;
                }

            }
        }

        for (int i = 0; i < bombListNext.size(); i++) {
            Position p = bombListNext.get(i);
            bomb(map.getBomb(p.x, p.y), bf, ps);
        }
    }

    //是否炸到玩家
    private void isBombPlayer(List<Player> weakPlayerList, int nx, int ny, Player.StateListener ps) {
        List<Player> hasPlayerList = map.getPlayer(nx, ny);
        if (hasPlayerList != null) {
            for (int i = 0; i < hasPlayerList.size(); i++) {
                Player player = hasPlayerList.get(i);
                if (player != null&&player.state==Player.STATE_LIVE) {
                    int s = player.weak();
                    ps.onStateChange(player, s);
                    player.deadTimer = () -> {
                        int s1 = player.die();
                        ps.onStateChange(player, s1);
//                       map.removePlayer(player);
                    };
                    GameEngine.getInstance().setTimeOut(player.deadTimer, GameConfig.TIME_WEAK_TO_DEAD);
                }
            }
            weakPlayerList.addAll(hasPlayerList);
        }
    }

    public void bombAfter(Bomb bomb, BombEffect bf, Player.StateListener playerListener) {
        if (bf.destroyList != null && bf.destroyList.size() > 0) {
            for (Position position : bf.destroyList) {
                if (map.getNode(position.x, position.y) == Map.DESTROY) {
                    map.setNode(position.x, position.y, Map.NULL);
                }
            }
        }
    }
}

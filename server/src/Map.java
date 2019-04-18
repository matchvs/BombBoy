import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

@Slf4j
public class Map implements MovePathLimit {

    public final static int NULL = 0;//空
    public final static int DESTROY = 1;//可摧毁的物体
    public final static int OBSTACLES = 2;//不可摧毁的物体
    public final static int Bomb = 3;//炸弹


    public final static int ITEM_INDEX = 4;//道具起点
    public final static int ITEM_SPEED = 5;//道具:增加鞋子速度
    public final static int ITEM_COUNT = 6;//道具:增加可放置炸弹数量
    public final static int ITEM_POWER = 7;//道具:增加炸弹的威力

    public final static int ITEM_NUM = 3;//道具种类的个数,增加道具必须增加这个数

    public List<Player> trappedPlayerList;//被困的玩家
    public List<Player> relivePlayerList;//被救复活的玩家列表

    public Map() {
        trappedPlayerList = new ArrayList<>();
        relivePlayerList = new ArrayList<>();
        initProp(this);
    }

    private int startPoint[][] = {{0, 0}, {14, 10}, {14, 0}, {0, 10}, {7, 0}, {0, 5}, {14, 5}, {7, 10}};
    public int[][] mapArray = new int[][]{
            {0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0},
            {0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0},
            {1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1},
            {1, 1, 1, 1, 2, 2, 2, 0, 2, 2, 2, 1, 1, 1, 1},
            {0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 0, 1, 0},
            {0, 0, 1, 1, 0, 1, 2, 0, 2, 1, 0, 1, 0, 0, 0},
            {0, 1, 1, 1, 2, 1, 1, 0, 1, 1, 2, 1, 1, 1, 0},
            {1, 1, 1, 1, 2, 2, 2, 0, 2, 2, 2, 1, 1, 1, 1},
            {1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1},
            {0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0},
            {0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0},
    };
    public int[][] mapPropArray = new int[0][0];
    private BombController bombController = new BombController(this);
    public List<Player> playerList = new LinkedList<>();
    public List<Bomb> bombList = new LinkedList<>();

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < mapArray.length; i++) {
            sb.append("\r\n    [ ");
            for (int k = 0; k < mapArray[i].length; k++) {
                sb.append(mapArray[i][k] + ",");
            }
            sb.append(" ]");
        }
        return sb.toString();
    }

    @Override
    public boolean hasLimitX(int x, int y, int xArrow) {
        int newX = x + xArrow;
        if (newX + 1 > mapArray[0].length || newX < 0) {
            return true;
        }
        if (y > mapArray.length || y < 0) {
            return true;
        }
        return mapArray[y][newX] != Map.NULL && mapArray[y][newX] < Map.ITEM_INDEX;

    }

    @Override
    public boolean hasLimitY(int x, int y, int yArrow) {
        int newY = y + yArrow;
        if (newY + 1 > mapArray.length || newY < 0) {
            return true;
        }
        if (x > mapArray[0].length || x < 0) {
            return true;
        }
        return mapArray[newY][x] != Map.NULL && mapArray[newY][x] < Map.ITEM_INDEX;
    }

    public int getNode(int x, int y) {
        return mapArray[y][x];
    }

    public void setNode(int x, int y, int value) {
        mapArray[y][x] = value;
    }

    public int getBombPower(int x, int y) {
        Bomb bomb = getBomb(x, y);
        return bomb == null ? GameConfig.MIN_BOMB_POWER : bomb.power;
    }

    public Bomb getBomb(int x, int y) {
        for (int i = 0; i < this.bombList.size(); i++) {
            Bomb position = bombList.get(i);
            if (position.x == x && position.y == y) {
                return position;
            }
        }
        return null;
    }
//
//    public List<Player> removePlayerInPosition(List<Position> positionList) {
//        List<Player> removedPlayerList = new ArrayList<>();
//        for (int i = 0; i < positionList.size(); i++) {
//            Position p = positionList.get(i);
//            for (int j = 0; j < playerList.size(); j++) {
//                Player player = playerList.get(j);
//                if (p.x == player.x && p.y == player.y) {
//                    removedPlayerList.add(player);
//                }
//            }
//        }
//        playerList.remove(removedPlayerList);
//        return removedPlayerList;
//    }

    public int getWidth() {
        return (mapArray == null || mapArray[0] == null) ? 0 : mapArray[0].length;
    }

    public int getHeight() {
        return mapArray.length;
    }

    /**
     * 将房间放入地图,并重置出生点
     *
     * @param players
     */
    public void addPlayer(Player... players) {
        for (int i = 0; i < players.length; i++) {
            this.playerList.add(players[i]);
        }
        for (int i = 0; i < this.playerList.size(); i++) {
            Player player = this.playerList.get(i);
            if (player.x == 0 && player.y == 0&&player.state==Player.STATE_LIVE) {
                player.setPosition(startPoint[i][0], startPoint[i][1]);
            }
        }
    }

    public void removePlayer(IGameServerRoomHandler.User user) {
        Player player = getPlayer(user.userID);
        if (player != null) playerList.remove(player);
    }

//    public void removePlayer(Player user) {
//        Player player = getPlayer(user.ID);
//        if (player != null) playerList.remove(player);
//    }

    public Player getPlayer(int userID) {
        for (int i = 0; i < playerList.size(); i++) {
            if (this.playerList.get(i).ID == userID)
                return this.playerList.get(i);
        }
        return null;
    }

    public List<Player> getPlayers() {
        return playerList;
    }

    /**
     * 在地图上放置炸弹
     *
     * @param p2
     */
    public boolean buriedBomb(Player p2, BombEffect.BombListener listener, Player.StateListener pl) {
        if (getNode(p2.x, p2.y) != Map.NULL) {
            return false;
        }
        if (p2.state != Player.STATE_LIVE) {
            return false;
        }
        Bomb bomb = p2.tryBuried();
        if (bomb == null) {
            return false;
        }
        setNode(bomb.x, bomb.y, Bomb);
        this.bombList.add(bomb);
        bomb.bombDelay(this, GameConfig.BOMB_DELAY, this.bombController, (BombEffect bf) -> {
            listener.onBomb(bf);
        }, pl);
        return true;
    }

    public void removeBomb(Bomb bomb) {
        if (bomb == null) {
            log.info(" warn , not found " + bomb);
            return;
        }
        bomb.bombed();
        Player player = getPlayer(bomb.playerID);
        if (player == null) {
            return;
        }
        player.removeBomb(bomb);
        this.bombList.remove(bomb);
    }

    public void removeBomb(int x, int y) {
        removeBomb(getBomb(x, y));
    }

//    public static void main(String[] args) {
//        Map map = new Map();
//        String path = "D:\\git\\BombBoy\\main\\resource\\bombboy\\map\\chinese\\chinese.json";
//        try {
//            map = map.fromJson(IOUtil.readString(path));
//            log.info("map:" + map.toString());
//        } catch (JSONException e) {
//            e.printStackTrace();
//        }
//    }

    public static Map fromJson(String json) throws JSONException {
        JSONObject jo = new JSONObject(json);
        JSONArray ja = jo.getJSONArray("layers");
        int h = jo.getInt("height");
        int w = jo.getInt("width");
        int tilewidth = jo.getInt("tilewidth");
        int tileheight = jo.getInt("tileheight");
        int[][] m = new int[h][w];
        int[][] mProp = new int[h][w];

        int length = ja.length();
//        System.out.println(length);
        for (int i = 0; i < length; i++) {
            JSONObject layer = ja.getJSONObject(i);
            JSONArray layerData = layer.getJSONArray("data");

            String name = layer.optString("name");
//            System.out.println(name + " :" + layerData.length());
            int value = Map.NULL;
            if ("obstacles".equals(name)) {
                value = Map.OBSTACLES;
            } else if ("destroyable".equals(name)) {
                value = Map.DESTROY;
            }
            if (value != Map.NULL) {
                for (int j = 0; j < layerData.length(); j++) {
                    int hIndex = j / w;
                    int wIndex = j - hIndex * w;
//                int src = m[hIndex][wIndex];
                    if (layerData.getInt(j) != Map.NULL) {
//                        System.out.println(hIndex + " " + wIndex + "  : " + layerData.getInt(j));
                        m[hIndex][wIndex] = value;
                        mProp[hIndex][wIndex] = Prop.genType();
                    }
                }
            }
        }

        Map map = new Map();
        map.mapArray = m;
        initProp(map);
        return map;
    }

    public static void initProp(Map map) {
        int[][] mPropA = new int[map.mapArray.length][map.mapArray[0].length];
        for (int i = 0; i < map.mapArray.length; i++) {
            for (int j = 0; j < map.mapArray[0].length; j++) {
                if (map.mapArray[i][j] != Map.NULL) {
                    mPropA[i][j] = Prop.genType();
                }
            }
        }
        map.mapPropArray = mPropA;
    }

    public void removeProp(int x, int y) {
        mapPropArray[y][x] = Map.NULL;
        mapArray[y][x] = Map.NULL;
    }

    public Prop getProp(int x, int y) {
        int type = mapPropArray[y][x];
        if (type != Map.NULL) {
            return new Prop(x, y, type);
        }
        return null;
    }

    public int hasProp(Player player, int x, int y) {
        int type = mapPropArray[y][x];
        return type;
    }

    public List<Player> getPlayer(int nx, int ny) {
        List<Player> temp = new ArrayList<>();
        for (int i = 0; i < playerList.size(); i++) {
            Player player = this.playerList.get(i);
            if (player.x == nx && player.y == ny) {
                temp.add(player);
            }
        }
        return temp.size() == 0 ? null : temp;
    }


    public List<DropProp> redistribute(List<Player> deadPlayerList) {
        if (deadPlayerList == null || deadPlayerList.size() <= 0) {
            return null;
        }
        Random random = new Random();
        List<DropProp> dp = new ArrayList<>();
        for (Player player : deadPlayerList) {
            List<Integer> count = new ArrayList();
            List<Prop> ps = new ArrayList();
            for (int i = 0; i < player.power - GameConfig.MIN_BOMB_POWER; i++) {
                count.add(Map.ITEM_POWER);
            }
            for (int i = 0; i < player.speed - GameConfig.MIN_MOVE_SPEED; i++) {
                count.add(Map.ITEM_SPEED);
            }
            for (int i = 0; i < player.bombCount - GameConfig.MIN_BOMB_COUNT; i++) {
                count.add(Map.ITEM_COUNT);
            }
            for (int i = 0; i < count.size(); i++) {
                int x = random.nextInt(getWidth());
                int y = random.nextInt(getHeight());
                if (getNode(x, y) == Map.NULL &&
                        getProp(x, y) == null) {
                    Integer integer = count.get(i);
                    setNode(x, y, integer);
                    mapPropArray[y][x] = integer;
                    ps.add(new Prop(x, y, integer));

                } else {
                    log.info(" miss the prop at:" + x + "," + y + " -> " + i);
                }
            }
            if (ps.size() > 0) {
                dp.add(new DropProp(player.x, player.y, ps));
            }
        }
        return dp;
    }

}

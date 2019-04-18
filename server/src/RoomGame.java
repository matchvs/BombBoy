import engine.GameMsg;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import stream.Simple;
import util.IOUtil;

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Slf4j
public class RoomGame implements IRoomService, Player.MoveListener, Player.StateListener, BombEffect.BombListener {
    private final IGameServerRoomHandler.Room room;
    private RoomService rs;
    private Map map = new Map();
    private volatile boolean running = true;
    private Runnable loopID;

    public RoomGame(RoomService rs, IGameServerRoomHandler.Room room) {
        this.rs = rs;
        this.room = room;
        //TODO 使用不同的地图配置.
        String path = "D:\\git\\BombBoy\\main\\resource\\bombboy\\map\\chinese\\chinese.json";
        try {
            map = Map.fromJson(IOUtil.readString(path));
            log.info("map:" + map.toString());
        } catch (Exception e) {
            log.error("load map from json ,case by:" + e);
        }
        onCreate();
    }

    private List<Player> tempPlayerList = new LinkedList();

    private void update() {
        syncPlayers();
    }

    //玩家状态
    private void syncPlayers() {
        tempPlayerList.clear();
        for (Player player : map.getPlayers()) {
            if (player.move(player.input.arrowX, player.input.arrowY, this.map, this)) {
                tempPlayerList.add(player);
            }
            if (player.isStopMove() && !player.isHasSyncStop) {
                tempPlayerList.add(player);
                player.isHasSyncStop = true;
            }
        }
        if (tempPlayerList.size() > 0) {
            rs.broadcast(new GameMsg(GameConfig.ACTION_MOVE, tempPlayerList).toString(), this.room);
        }
    }


    @Override
    public boolean onUserEnter(IGameServerRoomHandler.Room room, IGameServerRoomHandler.User user) {
        log.info("[UserEnter] " + user);
        Player player = map.getPlayer(user.userID);
        if (player == null) {
            map.addPlayer(new Player(user.userID, 0, 0, 0).bron());
        }else{
            log.info("user {} has in the room {}", user.userID, room.ID);
        }
        if (isGameStart()) {
            joinAtMidway(user);
        }
        rs.broadcast(new GameMsg(GameConfig.ACTION_BORN, map.playerList).toString(), this.room);
        return false;
    }

    /**
     * 中途加入
     *
     * @param user
     */
    private void joinAtMidway(IGameServerRoomHandler.User user) {
        log.info("join at midway,map: {}", map);
        rs.broadcastMe(new GameMsg(GameConfig.ACTION_STATE_MAP, map.mapArray).toString(), this.room, user.userID);
    }

    @Override
    public boolean onUserExit(IGameServerRoomHandler.Room oldRoom, IGameServerRoomHandler.User user) {
        log.info("[UserExit] " + user);
        map.removePlayer(user);
        if (map.getPlayers().size() == 0) {
            destroyRoom();
        }
        return false;
    }

    public void destroyRoom() {
        log.info("destroy:" + loopID);
        GameEngine.getInstance().clearInterval(loopID);
    }

    @Override
    public void onStateChange(Player pl, int state) {
        rs.broadcast(new GameMsg(GameConfig.ACTION_STATE_PLAYER, pl).toString(), RoomGame.this.room);
        log.info("[player onStateChange  ] ID:" + pl.ID + "team:" + pl.teamID + "state:" + pl.state);
        if (state == Player.STATE_DEAD) {
            ArrayList<Player> deadPlayerList = new ArrayList<>();
            deadPlayerList.add(pl);
            List<DropProp> dropList = map.redistribute(deadPlayerList);
            if (dropList != null && dropList.size() > 0) {
                rs.broadcast(new GameMsg(GameConfig.ACTION_DROP, dropList).toString(), RoomGame.this.room);
            }


            if (isGameOver()) {
                log.info("[GameOver]");
                rs.broadcast(new GameMsg(GameConfig.ACTION_OVER, map.getPlayers()).toString(), RoomGame.this.room);
            }


        }


    }

    @Override
    public boolean onUserSendMsg(Simple.Package.Frame umspHeader, IGameServerRoomHandler.Room room) {
        try {

            Gshotel.HotelBroadcast boardMsg = Gshotel.HotelBroadcast.parseFrom(umspHeader.getMessage());
//            log.info("boardMsg:{}",boardMsg);
            String msg = boardMsg.getCpProto().toStringUtf8();
            JSONObject jo = new JSONObject(msg);
            Player player = map.getPlayer(boardMsg.getUserID());
            if (player != null) {
                switch (jo.optString("type")) {
                    case GameConfig.ACTION_INPUT:
                        int arrow = jo.optInt("data");
                        int[] xy = Input.arrow2xy(arrow);
                        player.setArrow(arrow);
                        player.updateInput(xy[0], xy[1]);
                        return true;
                    case GameConfig.ACTION_TEAM:
                        int team = jo.optInt("data");
                        player.updateTeam(team);
                        log.info("[team] player:" + player.ID + " team:" + player.teamID + " <- " + team);
                        return true;
                    case GameConfig.ACTION_BURING:
                        if (player != null) {
                            int buringBombID = jo.optInt("data");

                            boolean b = map.buriedBomb(
                                    player,
                                    RoomGame.this,
                                    RoomGame.this);
                            if (b) {
                                rs.broadcast(new GameMsg(GameConfig.ACTION_BURING, player).toString(), this.room);
                            }
                            return true;
                        }
                    case GameConfig.ACTION_PING:
                        rs.broadcast(new GameMsg(GameConfig.ACTION_PING, msg).toString(), this.room);
                        return true;
                    default:
                        log.warn("unknown msg type:" + jo);
                        return false;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("onUserSendMsg.err:" + e);
        }
        return false;

    }

    private boolean isGameStart() {

        return true;
    }

    private boolean isGameOver() {
        List<Integer> teamIDList = new ArrayList<>();
        List<Player> players = map.getPlayers();
        int teamID = Integer.MIN_VALUE;
        for (int i = 0; i < players.size(); i++) {
            Player player = players.get(i);
            if (player.state != Player.STATE_DEAD) {//统计不是死亡的玩家状态
                log.info("player " + player.ID + " team:" + teamID);
                teamIDList.add(player.teamID);
                if (teamID == Integer.MIN_VALUE) {
                    teamID = player.teamID;
                    continue;
                }
                if (player.teamID != teamID) {
                    log.info("game is not over," + player.ID + " is live");
                    return false;
                }
            }
        }
        return true;
    }


    public void onCreate() {
        KeyListener listener = new KeyListener() {

            @Override
            public void keyTyped(KeyEvent e) {

            }

            @Override
            public void keyPressed(KeyEvent e) {
//                System.out.println(e.getKeyChar());
                if (map.getPlayers().size() < 2)
                    return;
                Player p1, p2;
                p1 = map.getPlayers().get(0);
                p2 = map.getPlayers().get(1);
                switch (e.getKeyCode()) {
                    case KeyEvent.VK_SPACE:
                        System.out.println("space");
                        map.buriedBomb(p1, null, null);
                        break;
                    case KeyEvent.VK_S:
                        p1.move(0, 1, map, null);
                        break;
                    case KeyEvent.VK_W:
                        p1.move(0, -1, map, null);
                        break;
                    case KeyEvent.VK_A:
                        p1.move(-1, 0, map, null);
                        break;
                    case KeyEvent.VK_D:
                        p1.move(1, 0, map, null);
                        break;
                    case KeyEvent.VK_E:
                        p1.addPower();
                        System.out.println("addPower:" + p1.power);
                        break;
                    case KeyEvent.VK_Q:
                        p1.addBombCount();
                        System.out.println("addBombCount:" + p1.bombCount);
                        break;
                    case KeyEvent.VK_R:
                        p1.addSpeed();
                        System.out.println("addSpeed:" + p1.speed);
                        break;
                    case KeyEvent.VK_NUMPAD0:
                        System.out.println("space");
                        map.buriedBomb(p2, null, null);
                        break;
                    case KeyEvent.VK_DOWN:
                        p2.move(0, 1, map, null);
                        break;
                    case KeyEvent.VK_UP:
                        p2.move(0, -1, map, null);
                        break;
                    case KeyEvent.VK_LEFT:
                        p2.move(-1, 0, map, null);
                        break;
                    case KeyEvent.VK_RIGHT:
                        p2.move(1, 0, map, null);
                        break;
                }

            }

            @Override
            public void keyReleased(KeyEvent e) {

            }
        };
        Runnable runnable = () -> {
            RoomGame.this.update();
        };
        loopID = runnable;
        log.info(" start game loop:" + loopID);
        GameEngine.getInstance().setInterval(runnable, 1000 / GameConfig.FPS);
    }

    @Override
    public void onMove(Player player, int x, int y) {
        int type = map.hasProp(player, x, y);
        if (type != Map.NULL) {
            player.pick(type);
            map.removeProp(x, y);
            rs.broadcast(new GameMsg(GameConfig.ACTION_PICK, new Prop(x, y, type)).toString(), this.room);
            log.info("pick " + x + "," + y);
        }
        List<Player> playerList = map.getPlayer(x, y);
        for (int i = 0; i < playerList.size(); i++) {
            Player p1 = playerList.get(i);
            if (p1.ID != player.ID) {
                if (p1.state == Player.STATE_WEAK) {
                    if (player.teamID == p1.teamID) {
                        p1.relive();
                    } else {
                        p1.die();
                    }
                    this.onStateChange(p1, p1.state);
                }
            }
        }
    }

    @Override
    public void onBomb(BombEffect bombEffect) {
        rs.broadcast(new GameMsg(GameConfig.ACTION_BOMB,
                bombEffect.toString()).toString(), RoomGame.this.room);

    }
}

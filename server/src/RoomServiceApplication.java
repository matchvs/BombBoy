

import lombok.extern.slf4j.Slf4j;
import stream.Simple;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class RoomServiceApplication implements IRoomService {
    public RoomService rs;
    private static RoomServiceApplication instance = null;

    public RoomServiceApplication(RoomService rs) {
        log.info("RoomServiceApplication");
        this.rs = rs;
        instance = this;
    }

    public static RoomServiceApplication getInstance() {
        return instance;
    }

    java.util.Map<Long, RoomGame> roomMap = new ConcurrentHashMap();

    @Override
    public boolean onUserEnter(IGameServerRoomHandler.Room room, IGameServerRoomHandler.User user) {
        log.info("[UserEnter] " + user);
        RoomGame game = roomMap.get(room.ID);
        if (game == null) {
            game = new RoomGame(rs, room);
            roomMap.put(room.ID, game);
        }
        game.onUserEnter(room, user);
        return false;
    }

    @Override
    public boolean onUserExit(IGameServerRoomHandler.Room oldRoom, IGameServerRoomHandler.User user) {
        log.info("[UserExit] " + user +" from roomID:"+oldRoom.ID);
        RoomGame game = roomMap.get(oldRoom.ID);
        if (game != null) game.onUserExit(oldRoom, user);
        return false;
    }

    @Override
    public boolean onUserSendMsg(Simple.Package.Frame msg, IGameServerRoomHandler.Room room) {
        RoomGame game = roomMap.get(room.ID);
        if (game != null) return game.onUserSendMsg(msg, room);
        return false;
    }


}

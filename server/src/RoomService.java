import com.google.protobuf.ByteString;
import lombok.extern.slf4j.Slf4j;
import stream.Simple;
@Slf4j
public class RoomService {
    App app;

    RoomService(App app) {
        this.app = app;
    }
    public void broadcast(String s, IGameServerRoomHandler.Room room) {
        app.broadcast(room.ID,s.getBytes());
    }
    public void broadcastMe(String s, IGameServerRoomHandler.Room room,int... userIDs) {
        app.sendMsgInclude(room.ID, s.getBytes(), userIDs);
    }
}

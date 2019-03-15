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
        Gshotel.PushToHotelMsg.Builder builder = Gshotel.PushToHotelMsg.newBuilder();
        builder.setCpProto(ByteString.copyFrom(s.getBytes()));
        builder.setPushType(Gshotel.PushMsgType.UserTypeAll);
        builder.setGameID(GameServerData.gameID);
        builder.setRoomID(room.ID);

        try {
            Simple.Package.Frame v = GameSeverUtil.PushToHotelBuild(1505, builder.build().toByteString());
            app.send(v, room.channel);
        } catch (Exception var8) {
            log.info("var8");
            var8.printStackTrace();
            return ;
        }
    }
}

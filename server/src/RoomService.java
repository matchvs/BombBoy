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
        Gshotel.PushToHotelMsg.Builder builder = getBuilder(s, room);
        try {
            Simple.Package.Frame v = GameSeverUtil.PushToHotelBuild(1505, builder.build().toByteString());
            app.send(v, room.channel);
        } catch (Exception var8) {
            log.info("var8");
            var8.printStackTrace();
            return ;
        }
    }
    public void broadcastMe(String s, IGameServerRoomHandler.Room room,int... userIDs) {
        Gshotel.PushToHotelMsg.Builder builder = getBuilder(s, room);
        if (userIDs != null) {
            for(int i = 0; i < userIDs.length; ++i) {
                builder.addDstUids(userIDs[i]);
                builder.setPushType(Gshotel.PushMsgType.UserTypeSpecific);
            }
        }
        try {
            Simple.Package.Frame v = GameSeverUtil.PushToHotelBuild(1505, builder.build().toByteString());
            app.send(v, room.channel);
        } catch (Exception var8) {
            log.error("onReceive fail to channelcase Exception: " + var8);
        }
    }

    private Gshotel.PushToHotelMsg.Builder getBuilder(String s, IGameServerRoomHandler.Room room) {
        Gshotel.PushToHotelMsg.Builder builder = Gshotel.PushToHotelMsg.newBuilder();
        builder.setCpProto(ByteString.copyFrom(s.getBytes()));
        builder.setPushType(Gshotel.PushMsgType.UserTypeAll);
        builder.setGameID(GameServerData.gameID);
        builder.setRoomID(room.ID);
        return builder;
    }
}

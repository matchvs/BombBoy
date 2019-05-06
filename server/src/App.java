import com.google.protobuf.ByteString;
import com.google.protobuf.InvalidProtocolBufferException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stream.Gsdirectory;
import stream.Simple;

public class App extends GameServerRoomEventHandler {

    public Logger log = LoggerFactory.getLogger("App");
    RoomServiceApplication rs = new RoomServiceApplication(new RoomService(this));

    public static void main(String[] args) {
        String[] path = new String[1];
        /**
         * 本地调试时在此处填写自己config.Json的绝对路径,正式发布上线注释下面代码即可。
         */
        path[0] = "D:\\User\\Documents\\BombBoy\\server\\src\\Config.json";
        try {
            Main.main(path);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public boolean onReceive(Simple.Package.Frame clientEvent, StreamObserver<Simple.Package.Frame> clientChannel) {
        super.onReceive(clientEvent, clientChannel);
        try {
            Gsmvs.Request request = null;
            request = Gsmvs.Request.parseFrom(clientEvent.getMessage());
            switch (clientEvent.getCmdId()) {
                /**
                 * 收到客户端发送的消息，客户端需要使用sendEVentEx()发送，具体参数参考官网文档。
                 */
                case Gshotel.HotelGsCmdID.HotelBroadcastCMDID_VALUE:
                    Gshotel.HotelBroadcast boardMsg = Gshotel.HotelBroadcast.parseFrom(clientEvent.getMessage());
                    String msg = boardMsg.getCpProto().toStringUtf8();
                    //log.info("收到消息：" + msg);
                    rs.onUserSendMsg(clientEvent, roomMap.get(boardMsg.getRoomID()));
                    examplePush(clientChannel, boardMsg.getRoomID(), msg);
                    break;
                case Gsmvs.MvsGsCmdID.MvsCreateRoomReq_VALUE:
                    log.info("创建房间成功: 房间ID：" + request.getRoomID());
                    break;
                //删除房间
                case Gshotel.HotelGsCmdID.HotelCloseConnet_VALUE:
                    log.info("删除房间: 房间ID：" + request.getRoomID());
                    break;
                // 玩家checkin
                case Gshotel.HotelGsCmdID.HotelPlayerCheckin_VALUE:
                    log.info("玩家checkin:  userID:" + request.getUserID());
                    rs.onUserEnter(roomMap.get(request.getRoomID()), new IGameServerRoomHandler.User(request.getUserID()));
                    break;
                case Gsmvs.MvsGsCmdID.MvsJoinRoomReq_VALUE:
                    log.info("进入房间成功  玩家" + request.getUserID() + "进入房间，房间ID为：" + request.getRoomID());
                    break;
                case Gsmvs.MvsGsCmdID.MvsKickPlayerReq_VALUE:
                    log.info("踢人成功: 房间：" + request.getRoomID() + "玩家：" + request.getUserID() + "被踢出");
                    break;
                case Gsmvs.MvsGsCmdID.MvsLeaveRoomReq_VALUE:
                    log.info("离开房间成功： 玩家" + request.getUserID() + "离开房间，房间ID为：" + request.getRoomID());
                    rs.onUserExit(roomMap.get(request.getRoomID()), new IGameServerRoomHandler.User(request.getUserID()));
                    break;
                case Gsmvs.MvsGsCmdID.MvsJoinOpenReq_VALUE:
                    log.info("房间打开成功:  roomID：" + request.getRoomID());
                    break;
                case Gsmvs.MvsGsCmdID.MvsJoinOverReq_VALUE:
                    log.info("房间关闭成功: roomID：" + request.getRoomID());
                    break;
                case Gsmvs.MvsGsCmdID.MvsSetRoomPropertyReq_VALUE:
                    Gsmvs.SetRoomPropertyReq roomPropertyReq = Gsmvs.SetRoomPropertyReq.parseFrom(clientEvent.getMessage());
                    log.info("修改房间属性: ");
                    log.info(roomPropertyReq + "");
                    break;
                case Gsmvs.MvsGsCmdID.MvsGetRoomDetailPush_VALUE:
                    Gsmvs.RoomDetail roomDetail = Gsmvs.RoomDetail.parseFrom(clientEvent.getMessage());
                    log.info("主动获取房间回调:");
                    log.info(roomDetail + "");
                    break;
                case Gshotel.HotelGsCmdID.GSSetFrameSyncRateNotifyCMDID_VALUE:
                    Gshotel.GSSetFrameSyncRateNotify setFrameSyncRateNotify = Gshotel.GSSetFrameSyncRateNotify.parseFrom(clientEvent.getMessage());
                    log.info("帧率通知");
                    log.info(setFrameSyncRateNotify + "");
                    break;
                case Gshotel.HotelGsCmdID.GSFrameDataNotifyCMDID_VALUE:
                    Gshotel.GSFrameDataNotify frameDataNotify = Gshotel.GSFrameDataNotify.parseFrom(clientEvent.getMessage());
                    log.info("帧数据通知");
                    log.info(frameDataNotify + "");
                    break;
                case Gshotel.HotelGsCmdID.GSFrameSyncNotifyCMDID_VALUE:
                    Gshotel.GSFrameSyncNotify frameSyncNotify = Gshotel.GSFrameSyncNotify.parseFrom(clientEvent.getMessage());
                    log.info("帧同步通知");
                    log.info(frameSyncNotify + "");
                    break;
            }
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
        return false;
    }


    @Override
    public void onStart() {
        log.info("onStart");

    }

    @Override
    public void onStop() {
        log.info("onStop");
    }


    /**
     * API使用示例
     *
     * @param msg
     */
    public void examplePush(StreamObserver clientChannel, long roomID, String msg) {
        String[] strArray = msg.split(":");
        switch (strArray[0]) {
            case "kickPlayer":
                kickPlayer(roomID, new Integer(strArray[1]));
                break;
            case "createRoom":
                createRoom(new Integer(strArray[1]));
                break;
            case "joinOver":
                joinOver(roomID);
                break;
            case "joinOpen":
                joinOpen(roomID);
                break;
            case "getRoomDetail":
                getRoomDetail(roomID);
                break;
            case "setRoomProperty":
                setRoomProperty(roomID, strArray[1]);
                break;
            case "setFrameSyncRate":
//                setFrameSyncRate(roomID, new Integer(strArray[1]), new Integer(strArray[2]));
                break;
            case "frameBroadcast":
                frameBroadcast(roomID, strArray[1], new Integer(strArray[2]));
                break;
            case "touchRoom":
                touchRoom(roomID, new Integer(strArray[1]));
                break;
            case "destroyRoom":
                destroyRoom(Long.parseLong(strArray[1]));
                break;
        }
    }


    /**
     * 跟客户端通信
     *
     * @param roomID  房间ID
     * @param msg     发送的消息  限制不能超过1024个字符
     * @param userIDs 指定接收消息ID
     */
    public void sendEvent(int roomID, byte[] msg, int... userIDs) {
        if (userIDs != null) {
            //发送给房间中的某些玩家。
            sendMsgInclude(roomID, msg, userIDs);
        } else {
            //发送给房间中的所有人
            broadcast(roomID, msg);
        }
    }

}

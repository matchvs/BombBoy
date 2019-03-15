import stream.Simple;

public interface IRoomService  {
   boolean onUserEnter(IGameServerRoomHandler.Room room, IGameServerRoomHandler.User user); //rpc
    boolean onUserExit(IGameServerRoomHandler.Room room, IGameServerRoomHandler.User user); //rpc
    boolean onUserSendMsg(Simple.Package.Frame msg, IGameServerRoomHandler.Room room); //rpc
}

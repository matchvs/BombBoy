// TypeScript file
class GameData {
    static env: string = "localhost";
    // static env: string = "fluttergo";
    static userID: number = MathUtils.random(100000000);
    static userName:string = GameData.userID+"";
    static MAX_ROOM_USER_COUNT: number = 8;
    static FPS: number = 5;
    static token: string = "xxx"
    static gameID: number = 0;
    static teamID: number = 0;
    static TeamMaxPlayer:number = 3;
	static avatar:string = "";

}

/**
 * Matchvs常量定义
 */
class MatchvsData {

	public static gameID:number = 214480;
	public static PremiseGameID:number = 2144800;
	public static PremiseAppkey:string = "b4c152d2dcd4023be653a6e3d45b738";
	public static appKey:string = "0b4c152d2dcd4023be653a6e3d45b738#M";
	public static gameVision:number = 1.0;
	public static DeviceID:string = "0";
	public static gatewayID: number = 1;
	public static pChannel:string = "Matchvs"
	public static pPlatform:string = "release";
	public static HtttpUrl:any =  (MatchvsData.pPlatform == "release" ? "https://vsopen.matchvs.com/wc5/getGameData.do?": "https://alphavsopen.matchvs.com/wc5/getGameData.do?");
	public static enging:MatchvsEngine = new MatchvsEngine();
	public static MatchvsRep:MatchvsResponse = new MatchvsResponse();
	public static maxPlayer:number = 8; 
	public static TeamPlayerArray = [];
	public static defaultRoomInfo:MsCreateRoomInfo = new MsCreateRoomInfo("",3,1,1,1,"");
	public static teamStartMatchCountDown = 5;
	public static STEP_ROT= 10;
	public static isPremise:boolean = false;
	public static netDelay = 50;




	private constructor() {
	}
	

}
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

@Slf4j
/**
 * 描述炸弹爆炸影响
 */
public class BombEffect {
    private transient final Map map;

    public interface BombListener {
        void onBomb(BombEffect bombEffect);
    }

    public List<Position> destroyList;
    public List<Bomb> bombingList;
    public List<Position> effectList;
    public List<Prop> beFoundPropList;
    public List<Player> deadPlayerList;//死亡的玩家
    public List<Prop> deadPropList;//死亡的道具

    public BombEffect(Map map) {
        this.map = map;
        destroyList = new ArrayList<>();
        bombingList = new ArrayList<>();
        effectList = new ArrayList<>();
        beFoundPropList = new ArrayList<>();
        deadPlayerList = new ArrayList<>();
        deadPropList = new ArrayList<>();
    }

    public void bombed() {
        //移除被引爆的炸弹的定时器
        for (int i = 0; i < bombingList.size(); i++) {
            Position p = bombingList.get(i);
            map.removeBomb(p.x, p.y);
        }
    }

    @Override
    public String toString() {
        JSONObject jo = new JSONObject();
        try {
            jo.put("ds", list2String(this.destroyList));
            jo.put("b", list2String(this.bombingList));
            jo.put("e", list2String(this.effectList));
            jo.put("f", list2String(this.beFoundPropList));
            jo.put("du", list2String(this.deadPlayerList));
            jo.put("dp", list2String(this.deadPropList));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo.toString();
    }

    public String list2String(List l) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < l.size(); i++) {
            if (i != 0) {
                sb.append("#");
            }
            sb.append(l.get(i).toString());

        }
        return sb.toString();
    }

//    public static void main(String[] args) {
//        BombEffect bf = new BombEffect(new Map());
//        bf.destroyList.add(new Position(0, 1));
//        bf.bombingList.add(new Bomb(0, 1, 0, 2));
//        bf.beFoundPropList.add(new Prop(0, 1, 1));
//        for (int i = 0; i < 128; i++) {
//            bf.effectList.add(new Position(0, i));
//        }
//        bf.deadPlayerList.add(new Player(0, 1, 312312, 12));
//        bf.deadPropList.add(new Prop(0, 1, 1));
//        bf.deadPropList.add(new Prop(0, 1, 1));
//        System.out.println(bf.toString());
//        System.out.println(bf.toString().length());
//    }
}

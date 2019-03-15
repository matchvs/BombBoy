package engine;

import lombok.extern.slf4j.Slf4j;
import util.JsonUtil;

@Slf4j
public class GameMsg<T> {
    public String type;
    public T data;

    public GameMsg(String type, T msg) {
        this.type = type;
        this.data = msg;

    }

    @Override
    public String toString() {
        String s = JsonUtil.toString(this);
        if ("move" != type) {
            log.info(s);
        }
        return s;
    }
}

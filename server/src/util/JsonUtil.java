package util;

import com.google.gson.Gson;

import java.lang.reflect.Type;

public class JsonUtil {

    public static <T> T fromJson(String json ,Class<T> clazz){
        return new Gson().fromJson(json, clazz);
    }
    public static <T> T fromJson(String json ,Type clazz){
        return new Gson().fromJson(json, clazz);
    }

    public static  String toString(Object object) {
        return new Gson().toJson(object);
    }
}

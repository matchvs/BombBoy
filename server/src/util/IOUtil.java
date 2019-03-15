package util;

import java.io.File;
import java.io.FileInputStream;

public class IOUtil {
    public static String readString(String path)
    {

        String str = "";


        try {
            File file = new File(path);

            FileInputStream in = new FileInputStream(file);

            // size  为字串的长度 ，这里一次性读完

            int size = in.available();

            byte[] buffer = new byte[size];

            in.read(buffer);

            in.close();

            str = new String(buffer, "UTF-8");

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return str;
    }
}

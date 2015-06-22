package cn.mingjikeji.leyi.plugin.NLP;

import cn.mingjikeji.leyi.LeyiPlugin;
import cn.mingjikeji.leyi.PluginMethod;
import org.apache.cordova.CallbackContext;
import org.fnlp.nlp.cn.ner.TimeNormalizer;
import org.fnlp.nlp.cn.ner.TimeUnit;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * Created by Tong on 06.20.
 */
public class TimeNER {

    @PluginMethod(target = "nlp_get_time")
    public void getTime(JSONArray args, CallbackContext cb) throws JSONException {
        String rawText = args.getString(0);

        File f = new File(LeyiPlugin.application.getCacheDir()+"/time.m");
        if (!f.exists()) try {

            InputStream is = LeyiPlugin.application.getAssets().open("time.m");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();


            FileOutputStream fos = new FileOutputStream(f);
            fos.write(buffer);
            fos.close();
        } catch (Exception e) { throw new RuntimeException(e); }

        TimeNormalizer normalizer = new TimeNormalizer(f.getPath());
        normalizer.parse(rawText);

        TimeUnit[] unit = normalizer.getTimeUnit();

        long startTime;
        long endTime;
        switch (unit.length) {
            case 0:
                /* Error: no time entities recognized.*/
                startTime = 0;
                endTime = 0;
                break;
            case 1:
                /* Auto increase one hour for the end time.*/
                startTime = unit[0].getTime().getTime();
                endTime = startTime + 3600000;
                break;
            default:
                /* Well defined.*/
                startTime = unit[0].getTime().getTime();
                endTime = unit[1].getTime().getTime();
        }

        JSONObject timeObject = new JSONObject();
        timeObject.put("start_time", startTime);
        timeObject.put("end_time", endTime);
        cb.success(timeObject);
    }
}

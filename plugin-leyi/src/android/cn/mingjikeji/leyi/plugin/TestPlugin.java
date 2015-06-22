package cn.mingjikeji.leyi.plugin;

import cn.mingjikeji.leyi.PluginMethod;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by Hershel on 06-09.
 */
public class TestPlugin {

    @PluginMethod(target = "test")
    public void test(JSONArray args, CallbackContext cb) throws JSONException {
        String str = args.getString(0) + args.getString(1);
        cb.success(str);
    }
}

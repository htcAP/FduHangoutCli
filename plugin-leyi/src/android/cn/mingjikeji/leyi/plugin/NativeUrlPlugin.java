package cn.mingjikeji.leyi.plugin;

import android.content.Intent;
import android.net.Uri;
import cn.mingjikeji.leyi.LeyiPlugin;
import cn.mingjikeji.leyi.PluginMethod;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by Hershel on 06-09.
 */
public class NativeUrlPlugin {


    static public void openUrl(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(android.content.Intent.ACTION_VIEW, uri);
        LeyiPlugin.activity.startActivity(intent);
    }

    @PluginMethod(target = "NativeUrl.showLocation")
    public void showLocation(JSONArray args, CallbackContext cb) throws JSONException {
        double latitude = args.getDouble(0);
        double longitude = args.getDouble(1);
        String label = args.getString(2);

        openUrl("geo:0,0?q=" + latitude + "," + longitude + "(" + label + ")");
        cb.success();
    }

    @PluginMethod(target = "NativeUrl.showQQ")
    public void showQQ(JSONArray args, CallbackContext cb) throws JSONException {
        String qq = args.getString(0);

        openUrl("mqqwpa://im/chat?chat_type=wpa&uin=" + qq);
        cb.success();
    }
}

package cn.mingjikeji.leyi;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Application;
import android.os.Build;
import android.util.Pair;
import cn.mingjikeji.leyi.plugin.*;
import edu.fdu.hangout.BaiduMapPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Hershel on 06-09.
 */
public class LeyiPlugin extends CordovaPlugin {

    public static LeyiPlugin instance;
    public static Activity activity;
    public static Application application;

    private Map<String, Pair<Object, Method>> methods = new HashMap<String, Pair<Object, Method>>();

    @TargetApi(Build.VERSION_CODES.ECLAIR)
    public LeyiPlugin() {
        instance = this;

//        Reflections reflections = new Reflections("cn.mingjikeji.leyi");
//        Set<Class<?>> annotated = reflections.getTypesAnnotatedWith(PluginMethod.class);
        Class<?>[] annotated = new Class<?>[]{
                TestPlugin.class,
                NativeUrlPlugin.class,
                BaiduMapPlugin.class
        };
        for (Class<?> claz : annotated) {
            try {
                Object obj = claz.newInstance();
                for (Method method : claz.getDeclaredMethods()) {

                    if (method.isAnnotationPresent(PluginMethod.class)) {
                        Annotation annotation = method.getAnnotation(PluginMethod.class);
                        PluginMethod pluginMethod = (PluginMethod) annotation;
                        methods.put(pluginMethod.target(), new Pair<Object, Method>(obj, method));
                    }
                }
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
    }

    @TargetApi(Build.VERSION_CODES.ECLAIR)
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext cb) throws JSONException {
        Pair<Object, Method> cxt = methods.get(action);
        if (cxt == null) {
            return false;
        }

        if (activity == null) {
            activity = this.cordova.getActivity();
            application = activity.getApplication();
        }

        try {
            cxt.second.invoke(cxt.first, args, cb);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            cb.error(e.getMessage());
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            cb.error(e.getCause().getMessage());
        }
        return true;
    }
}

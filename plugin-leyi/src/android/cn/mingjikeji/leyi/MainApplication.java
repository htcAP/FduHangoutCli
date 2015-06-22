package cn.mingjikeji.leyi;

import android.app.Application;
import com.baidu.mapapi.SDKInitializer;

/**
 * Created by Hershel on 06-09.
 */
public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        SDKInitializer.initialize(getApplicationContext());
    }
}


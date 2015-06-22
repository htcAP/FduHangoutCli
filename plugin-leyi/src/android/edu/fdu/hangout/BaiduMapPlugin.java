package edu.fdu.hangout;

import android.content.Intent;
import cn.mingjikeji.leyi.LeyiPlugin;
import cn.mingjikeji.leyi.PluginMethod;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.model.LatLng;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.ArrayList;

/**
 * Created by lifengshuang on 6/22/15.
 */

public class BaiduMapPlugin {


    @PluginMethod(target = "LocationController.startLocation")
    public void startLocation(JSONArray args, CallbackContext cb) throws JSONException {
        LocationClient mLocationClient = ((LocationApplication)LeyiPlugin.application).mLocationClient;
        LocationClientOption option = new LocationClientOption();

//        <string name="hight_accuracy_desc">高精度定位模式下，会同时使用GPS、Wifi和基站定位，返回的是当前条件下精度最好的定位结果</string>
//        <string name="saving_battery_desc">低功耗定位模式下，仅使用网络定位即Wifi和基站定位，返回的是当前条件下精度最好的网络定位结果</string>
//        <string name="device_sensor_desc">仅用设备定位模式下，只使用用户的GPS进行定位。这个模式下，由于GPS芯片锁定需要时间，首次定位速度会需要一定的时间</string>
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);

        option.setCoorType("gcj02");

        int span = 5000;//miliseconds
        option.setScanSpan(span);

        option.setIsNeedAddress(false);

        mLocationClient.setLocOption(option);
        mLocationClient.start();


        cb.success();
    }

    @PluginMethod(target = "LocationController.getLatitude")
    public void getLatitude(JSONArray args, CallbackContext cb) throws JSONException {
        LocationApplication application = (LocationApplication) LeyiPlugin.application;
        cb.success(String.valueOf(application.getLatitude()));
    }

    @PluginMethod(target = "LocationController.getLongitude")
    public void getLongitude(JSONArray args, CallbackContext cb) throws JSONException {
        LocationApplication application = (LocationApplication) LeyiPlugin.application;
        cb.success(String.valueOf(application.getLongitude()));
    }

    @PluginMethod(target = "MapActivity")
    public void startMapActivity(JSONArray args, CallbackContext cb) throws JSONException {
        JSONArray array = args.getJSONArray(0);
        MapActivity.personArrayList = new ArrayList<Person>();
        for (int i = 0; i <array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            double latitude = object.getDouble("latitude");
            double longitude = object.getDouble("longitude");
            MapActivity.personArrayList.add(new Person(latitude, longitude));
        }
        MapActivity.cb = cb;

        Intent intent = new Intent();
        intent.setClass(LeyiPlugin.activity, MapActivity.class);
        LeyiPlugin.activity.startActivity(intent);
    }

    @PluginMethod(target = "reloadLocation")
    public void reloadLocation(JSONArray args, CallbackContext cb) throws JSONException {
        JSONArray array = args.getJSONArray(0);
        MapActivity.personArrayList = new ArrayList<Person>();
        for (int i = 0; i <array.length(); i++) {
            JSONObject object = array.getJSONObject(i);
            double latitude = object.getDouble("latitude");
            double longitude = object.getDouble("longitude");
            MapActivity.personArrayList.add(new Person(latitude, longitude));
        }
    }

    @PluginMethod(target = "directionIntent")
    public void directionIntent(JSONArray args, CallbackContext cb) throws JSONException  {
        LatLng start = new LatLng(args.getDouble(0), args.getDouble(1));
        LatLng end = new LatLng(args.getDouble(2), args.getDouble(3));


        Intent intent = null;
        try {
            intent = Intent.getIntent("intent://map/direction?origin=latlng:"+start.latitude+","+start.longitude
                    +"|name:我的位置&destination=latlng:"+end.latitude+","+end.longitude+"|name:活动地点&mode=driving&region=上海&src=fdu|fduhangout#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        LeyiPlugin.activity.startActivity(intent); //启动调用
        cb.success();
    }

}

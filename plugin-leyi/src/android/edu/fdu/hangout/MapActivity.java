package edu.fdu.hangout;

import android.app.Activity;
import android.content.Intent;
import android.graphics.*;
import android.os.Bundle;
import android.widget.Toast;
import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.*;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.overlayutil.DrivingRouteOverlay;
import com.baidu.mapapi.overlayutil.OverlayManager;
import com.baidu.mapapi.overlayutil.WalkingRouteOverlay;
import com.baidu.mapapi.search.core.RouteLine;
import com.baidu.mapapi.search.core.SearchResult;
import com.baidu.mapapi.search.route.*;
import edu.fdu.hangout.R;
import org.apache.cordova.CallbackContext;

import java.net.URISyntaxException;
import java.util.ArrayList;

/**
 * Created by lifengshuang on 6/21/15.
 */
public class MapActivity extends Activity implements OnGetRoutePlanResultListener {

    private MapView mapView;
    public static ArrayList<Person> personArrayList = new ArrayList<Person>();
    private Bitmap image;
    private RouteLine route = null;
    private RoutePlanSearch mSearch = null;    // 搜索模块，也可去掉地图模块独立使用
    private OverlayManager routeOverlay = null;
    private ArrayList<Marker> markers = new ArrayList<Marker>();
    public static CallbackContext cb;
    private Thread thread;
    private boolean runThread = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SDKInitializer.initialize(getApplicationContext());
        setContentView(R.layout.map);

        mapView = (MapView) findViewById(R.id.mapView);
        mapView.showZoomControls(false);
        image = BitmapFactory.decodeResource(getResources(), R.drawable.avatar);

        LocationApplication application = (LocationApplication) getApplication();
        LatLng cenpt = new LatLng(application.getLatitude(), application.getLongitude());
        MapStatus mMapStatus = new MapStatus.Builder()
                .target(cenpt)
                .zoom(15)
                .build();

        MapStatusUpdate mMapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mMapStatus);
        mapView.getMap().setMapStatus(mMapStatusUpdate);

        mSearch = RoutePlanSearch.newInstance();
        mSearch.setOnGetRoutePlanResultListener(this);


        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (runThread) {
                    try {
                        Thread.sleep(5000);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    if (runThread) {
                        refreshPerson();
                    }
                }
            }
        });
        thread.start();
//        personArrayList.add(new Person(31.1887220, 121.5960770, "htc"));
//        personArrayList.add(new Person(31.2087220, 121.5760770, "lfs"));
//        personArrayList.add(new Person(31.2087220, 121.5860770, "tzy"));
//        personArrayList.add(new Person(31.1987220, 121.5860770, "TA"));


//        routeProcess(personArrayList.get(1).getLatLng(), personArrayList.get(0).getLatLng());
//        directionIntent(personArrayList.get(1).getLatLng(), personArrayList.get(0).getLatLng());

    }


    public void directionIntent(LatLng start, LatLng end) {
        Intent intent = null;
        try {
            intent = Intent.getIntent("intent://map/direction?origin=latlng:" + start.latitude + "," + start.longitude
                    + "|name:我的位置&destination=latlng:" + end.latitude + "," + end.longitude + "|name:活动地点&mode=driving&region=上海&src=fdu|fduhangout#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end");
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        startActivity(intent); //启动调用
    }

    @Override
    protected void onResume() {
        mapView.onResume();
        super.onResume();

    }

    private void refreshPerson() {
        for (Marker marker : markers) {
            if (marker != null) {
                marker.remove();
            }
        }
        for (Person person : personArrayList) {
            addPerson(person);
        }
    }

    private void addPerson(Person person) {
        int size = 75;
        Bitmap bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawBitmap(image, null, new Rect(0, 0, size, size), null);

        //TODO: set image to user profile photo

        OverlayOptions options = new MarkerOptions()
                .position(new LatLng(person.getLatitude(), person.getLongitude()))
                .icon(BitmapDescriptorFactory.fromBitmap(toRoundCorner(bitmap)))
                .zIndex(10)
                .draggable(false);
        markers.add((Marker) mapView.getMap().addOverlay(options));
    }

    private Bitmap toRoundCorner(Bitmap bitmap) {
        Bitmap output = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);

        final int color = 0xff424242;
        final Paint paint = new Paint();
        final Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        final RectF rectF = new RectF(rect);

        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);

        paint.setColor(color);
        canvas.drawRoundRect(rectF, bitmap.getWidth() / 2, bitmap.getHeight() / 2, paint);
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);

        return output;
    }


    public void routeProcess(LatLng start, LatLng end) {
        //重置浏览节点的路线数据
        route = null;
        mapView.getMap().clear();
        //设置起终点信息，对于tranist search 来说，城市名无意义
        PlanNode stNode = PlanNode.withLocation(start);
        PlanNode enNode = PlanNode.withLocation(end);

//        PlanNode stNode = PlanNode.withCityNameAndPlaceName("上海","张江");
//        PlanNode enNode = PlanNode.withCityNameAndPlaceName("上海", "杨浦");
        // 实际使用中请对起点终点城市进行正确的设定
        mSearch.drivingSearch((new DrivingRoutePlanOption())
                .from(stNode)
                .to(enNode));
//        mSearch.destroy();
    }

    @Override
    public void onGetWalkingRouteResult(WalkingRouteResult result) {
        if (result == null) {
            Toast.makeText(MapActivity.this, "null", Toast.LENGTH_SHORT).show();
        }
        if (result == null || result.error != SearchResult.ERRORNO.NO_ERROR) {
            Toast.makeText(MapActivity.this, "抱歉，未找到结果", Toast.LENGTH_SHORT).show();
            return;
        }
        if (result.error == SearchResult.ERRORNO.AMBIGUOUS_ROURE_ADDR) {
            //起终点或途经点地址有岐义，通过以下接口获取建议查询信息
            //result.getSuggestAddrInfo()
            return;
        }
        if (result.error == SearchResult.ERRORNO.NO_ERROR) {
            route = result.getRouteLines().get(0);
            WalkingRouteOverlay overlay = new MyWalkingRouteOverlay(mapView.getMap());
            routeOverlay = overlay;
            mapView.getMap().setOnMarkerClickListener(overlay);
            overlay.setData(result.getRouteLines().get(0));
            overlay.addToMap();
            overlay.zoomToSpan();
        }
    }

    @Override
    public void onGetTransitRouteResult(TransitRouteResult result) {

    }


    @Override
    public void onGetDrivingRouteResult(DrivingRouteResult result) {
        if (result == null || result.error != SearchResult.ERRORNO.NO_ERROR) {
            Toast.makeText(MapActivity.this, "抱歉，未找到结果", Toast.LENGTH_SHORT).show();
        }
        if (result.error == SearchResult.ERRORNO.AMBIGUOUS_ROURE_ADDR) {
            //起终点或途经点地址有岐义，通过以下接口获取建议查询信息
            //result.getSuggestAddrInfo()
            return;
        }
        if (result.error == SearchResult.ERRORNO.NO_ERROR) {
            route = result.getRouteLines().get(0);
            DrivingRouteOverlay overlay = new MyDrivingRouteOverlay(mapView.getMap());
            routeOverlay = overlay;
            mapView.getMap().setOnMarkerClickListener(overlay);
            overlay.setData(result.getRouteLines().get(0));
            overlay.addToMap();
            overlay.zoomToSpan();
        }
        Toast.makeText(MapActivity.this, "erg", Toast.LENGTH_SHORT).show();
    }

    //定制RouteOverly
    private class MyDrivingRouteOverlay extends DrivingRouteOverlay {

        public MyDrivingRouteOverlay(BaiduMap baiduMap) {
            super(baiduMap);
        }

        @Override
        public BitmapDescriptor getStartMarker() {
            return BitmapDescriptorFactory.fromResource(R.drawable.icon_st);
        }

        @Override
        public BitmapDescriptor getTerminalMarker() {
            return BitmapDescriptorFactory.fromResource(R.drawable.icon_en);
        }
    }

    private class MyWalkingRouteOverlay extends WalkingRouteOverlay {

        public MyWalkingRouteOverlay(BaiduMap baiduMap) {
            super(baiduMap);
        }

        @Override
        public BitmapDescriptor getStartMarker() {
            return BitmapDescriptorFactory.fromResource(R.drawable.icon_st);
        }

        @Override
        public BitmapDescriptor getTerminalMarker() {
            return BitmapDescriptorFactory.fromResource(R.drawable.icon_en);
        }
    }


    @Override
    protected void onDestroy() {
        if (cb != null) {
            cb.success();
        }
        runThread = false;
        mapView.onDestroy();
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        mapView.onPause();
        super.onPause();
    }
}

class Person {
    private double latitude;
    private double longitude;
    private String name;
    private String url;

    public Person(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Person(double latitude, double longitude, String name, String url) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.url = url;
    }

    public double getLatitude() {

        return latitude;
    }

    public LatLng getLatLng() {
        return new LatLng(getLatitude(), getLongitude());
    }

    public double getLongitude() {
        return longitude;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }
}

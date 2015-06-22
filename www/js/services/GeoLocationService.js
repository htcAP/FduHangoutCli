FduHangoutApp.service('geoLocationService', function (mapPlugin, $interval, accountService) {
  //var posOptions = {timeout: 10000, enableHighAccuracy: false};

  mapPlugin.startLocation();
  var self;

  $interval(function () {
    self.getGeoLocation();
  }, 30000);

  return self = {

    lat: -1,
    lng: -1,
    commit: false,

    getGeoLocation: function () {
      //if (navigator.geolocation) {
      //  navigator.geolocation.getCurrentPosition(function (position) {
      //    self.lat = position.coords.latitude;
      //    self.lng = position.coords.longitude;
      //  });
      //}
      mapPlugin.getLatitude().then(function (lat) {
        lat = parseFloat(lat);
        self.commit |= (self.lat != lat);
        self.lat = lat;
        mapPlugin.getLongitude().then(function (lng) {
          lng = parseFloat(lng);
          self.commit |= (self.lat != lat);
          self.lng = lng;
          if (self.commit) {
            accountService.postLocation(lat, lng).then(function () {
              self.commit = false;
            });
          }
        });
      });
    }
  };
});

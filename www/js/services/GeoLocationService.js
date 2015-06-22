FduHangoutApp.service('geoLocationService', function () {
  //var posOptions = {timeout: 10000, enableHighAccuracy: false};
  var self;
  return self = {

    lat: -1,
    lng: -1,

    getGeoLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          self.lat = position.coords.latitude;
          self.lng = position.coords.longitude;
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  };
});

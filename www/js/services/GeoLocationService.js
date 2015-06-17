FduHangoutApp.service('geoLocationService', function (dataShareService) {
  //var posOptions = {timeout: 10000, enableHighAccuracy: false};
  var ext = {
    getGeoLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          dataShareService.lat = position.coords.latitude;
          dataShareService.lng = position.coords.longitude;
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    }
  };
  angular.extend(this, ext);
});

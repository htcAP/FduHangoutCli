FduHangoutApp.service('mapActivityService', function (mapPlugin, $interval, activityService) {
  var self;
  return self = {
    timer: null,
    running: false,

    start: function (activityId) {
      var func = function () {
        activityService.getPosition(activityId).then(function (arr) {
          if (!self.running) {
            self.running = true;
            mapPlugin.mapActivity(arr).then(function () {
              $interval.cancel(self.timer);
              self.running = false;
            });
          } else {
            mapPlugin.reloadLocation(arr);
          }
        });
      };
      self.timer = $interval(func, 10000);
      func();
    }
  }

});
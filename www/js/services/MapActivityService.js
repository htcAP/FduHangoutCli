FduHangoutApp.service('mapActivityService', function (mapPlugin, $interval, activityService) {
  var self;
  return self = {
    timer: null,
    running: false,

    start: function (activityId) {
      self.timer = $interval(function () {
        activityService.getPosition(activityId).then(function (arr) {
          var q = mapPlugin.mapActivity(arr);
          if (!self.running) {
            self.running = true;
            q.then(function () {
              $interval.cancel(self.timer);
              self.running = false;
            })
          }
        });
      }, 10000);
    }
  }

});
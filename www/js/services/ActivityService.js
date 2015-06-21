FduHangoutApp.service('activityService',
  function (apiService) {
    var self;

    return self = {
      activityList: {},
      allActivity: [],
      myActivity: [],
      friendActivity: [],

      getAll: function () {
        return apiService.request('activity/get/list/all', '获取所有活动', {
          user_id: -1
        }).then(function (data) {
          var a = data.activities;
          self.allActivity.splice(0, self.allActivity.length);
          a.forEach(function (a) {
            self.allActivity.push(self.cacheActivity(a));
          });
          return self.allActivity;
        });

      },

      getActivity: function () {

      },

      cacheActivity: function (a) {
        var id = a.id;
        var u = self.activityList[id];
        if (!u) {
          u = self.activityList[id] = {}
        }
        angular.extend(u, a);
        return u;
      },

      getCachedUser: function (id) {
        var a = self.activityList[id];
        if (!a) {
          a = self.activityList[id] = {};
        }
        return a;
      }

    }
  });
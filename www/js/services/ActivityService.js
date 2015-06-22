FduHangoutApp.service('activityService',
  function (apiService, accountService, utilService) {
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
            a.id = a.activity_id;
            delete a.activity_id;

            self.allActivity.push(self.cacheActivity(a));
          });
          return self.allActivity;
        });

      },

      getActivity: function (id) {
        return apiService.request('activity/get/activity', '获取活动', {
          token: accountService.token,
          activity_id: id
        }).then(function (data) {
          data.id = data.activity_id;
          delete data.error;
          delete data.activity_id;

          self.cacheActivity(data);
          return data;
        });
      },

      postVote: function (id, tmId) {
        return apiService.request('activity/post/vote', '投票', {
          token: accountService.token,
          time_location_id: tmId
        }).then(function () {
          var activity = self.getCachedActivity(id);
          activity.timeLocations.forEach(function (tm) {
            if (tm.time_location_id == tmId) {
              ++tm.votes;
            }
          })
        })
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

      getCachedActivity: function (id) {
        var a = self.activityList[id];
        if (!a) {
          a = self.activityList[id] = {};
        }
        return a;
      }

    }
  });
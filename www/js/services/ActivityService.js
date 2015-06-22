FduHangoutApp.service('activityService',
  function (apiService, accountService, utilService) {
    var self;

    return self = {
      activityList: {},
      allActivity: [],
      myActivity: [],
      friendActivity: [],
      invitedActivity: [],

      getAll: function () {
        return apiService.request('activity/get/list/all', '获取所有活动', {
          user_id: -1
        }).then(function (data) {
          var a = data.activities;
          a = a.reverse();
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

      addActivity: function (title, description, deadline) {
        return apiService.request('activity/post/new', '新建活动', {
          token: accountService.token,
          title: title,
          description: description,
          deadline: utilService.dateToTimestamp(deadline)
        }).then(function (data) {
          return data.activity_id;
        });
      },

      addTimeLocation: function (id, startTime, endTime, location) {
        return apiService.request('activity/post/time_location', '添加活动时间地点', {
          token: accountService.token,
          activity_id: id,
          time: {
            start_time: utilService.dateToTimestamp(startTime),
            end_time: utilService.dateToTimestamp(endTime)
          },
          location: {
            latitude: 0,
            longitude: 0,
            place: location
          }
        });
      },

      inviteUsers: function (id, users) {
        return apiService.request('activity/post/invite', '邀请好友参加活动', {
          token: accountService.token,
          activity_id: id,
          invites: users
        });
      },

      replyInvite: function (id, attend) {
        return apiService.request('activity/post/reply_invite', '回复邀请', {
          token: accountService.token,
          activity_id: id,
          attend: attend
        });
      },

      getInvitedList: function () {
        return apiService.request('activity/get/list/activity_request', '获取活动邀请列表', {
          token: accountService.token
        }).then(function (data) {
          var a = data.activities;
          self.invitedActivity.splice(0, self.invitedActivity.length);
          a.forEach(function (a) {
            a.id = a.activity_id;
            delete a.activity_id;
            self.invitedActivity.push(self.cacheActivity(a));
          });
          return self.invitedActivity;
        });
      },

      isInvited: function (id) {
        for (var i = 0; i < self.invitedActivity.length; ++i) {
          if (self.invitedActivity[i].id == id) {
            return true;
          }
        }
        return false;
      },

      decideTimeLocation: function (id) {
        return apiService.request('activity/post/decide', '决定活动时间地点', {
          token: accountService.token,
          time_location_id: id
        });
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
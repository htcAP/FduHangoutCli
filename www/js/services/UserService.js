FduHangoutApp.service('userService', function (apiService, accountService, $q) {
  var self = this;

  self.friendList = [];
  self.userList = {};

  angular.extend(this, {

    getFriendList: function () {
      return apiService.request('list-friends', {
        token: accountService.token
      }, '获取好友列表').then(function (data) {
        var list = self.friendList;
        list.splice(0, list.length);
        for (var key in data) {
          if (data.hasOwnProperty(key) && $.isPlainObject(data[key])) {
            var u = data[key];
            list.push(u);
            self.cacheUser(u);
          }
        }
        return list;
      });
    },

    searchFriend: function (keyword) {
      return apiService.request('find-friend', {}, '搜索好友', {
        cue: keyword,
        token: accountService.token
      }).then(function (data) {
        self.cacheUser(data);
        return data;
      });
    },

    getUserInfo: function (id) {
      var ret = self.getCachedUser(id) || {};
      var p = apiService.request('get-user-info', {
        ID: id,
        token: accountService.token
      }, '获取用户信息').then(function (data) {
        self.cacheUser(data);
        angular.extend(ret, data);
        return data;
      });
      if (!ret) {
        return p;
      }
      var defer = $q.defer();
      defer.resolve(ret);
      return defer.promise;
    },

    changePassword: function (originPassword, newPassword) {
      return apiService.request('change-password', {}, '修改密码', {
        original: originPassword,
        new: newPassword,
        token: accountService.token
      })
    },

    requestValidateEmail: function (email) {
      return apiService.request('request-validate-email', {}, '发送邮箱验证码', {
        email: email,
        token: accountService.token
      });
    },

    submitValidateEmail: function (email, code) {
      return apiService.request('submit-validate-email', {}, '验证邮箱', {
        email: email,
        code: code,
        token: accountService.token
      });
    },

    sendFriendRequest: function (id, msg) {
      return apiService.request('send-friend-request', {}, '发送好友请求', {
        ID: id,
        message: msg,
        token: accountService.token
      });
    },

    getFriendRequests: function () {
      return apiService.request('get-friend-requests', {
        token: accountService.token
      }, '获取好友请求').then(function (data) {

        function cache(data) {
          self.cacheUser({
            id: data.user_id,
            image_url: data.image_url,
            name: data.name,
            gender: data.gender,
            email: data.email
          });
        }

        data.incomingRequests.forEach(cache);
        data.outgoingRequests.forEach(cache);

        return data;
      });
    },

    revokeFriendRequest: function (id) {
      return apiService.request('revoke-friend-request', {}, '撤回好友请求', {
        ID: id,
        token: accountService.token
      });
    },

    handleFriendRequest: function (id, accept) {
      return apiService.request('handle-request', {}, '处理好友请求', {
        ID: id,
        accept: accept,
        token: accountService.token
      });
    },

    getMessages: function (unread) {
      return apiService.request('get-messages', {
        unread: unread,
        token: accountService.token
      }).then(function (data) {
        return data.msg;
      });
    },

    setMessageRead: function (id) {
      return apiService.request('set-messages-read', {
        ID: id,
        token: accountService.token
      }).then(function () {
        accountService.refreshNotification();
      });
    },

    sendMessage: function (id, title, content) {
      return apiService.request('send-message', {}, '发送站内信', {
        recipientID: id,
        title: title,
        content: content,
        token: accountService.token
      });
    },

    deleteMessage: function (id) {
      return apiService.request('delete-message', {}, '删除站内信', {
        ID: id,
        token: accountService.token
      });
    },

    cacheUser: function (user) {
      var id = user.id;
      var u = self.userList[id];
      if (!u) {
        u = self.userList[id] = {}
      }
      angular.extend(u, user);
    },

    getCachedUser: function (id) {
      var user = self.userList[id];
      if (!user) {
        user = self.userList[id] = {};
      }
      return user;
    }
  });
});
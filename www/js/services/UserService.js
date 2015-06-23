FduHangoutApp.service('userService', function (apiService, accountService, $q, $rootScope) {
  var self;

  return self = $rootScope.userService = {

    friendList: [],
    requestList: [],
    userList: {},

    getFriendRequest: function () {
      return apiService.request('user/get/list/friend_request', '获取好友请求列表', {
        token: accountService.token
      }).then(function (data) {
        var list = self.requestList;
        list.splice(0, list.length);
        data.users.forEach(function (u) {
          u.id = u.user_id;
          delete u.user_id;
          delete u.error;

          list.push(u);
          self.cacheUser(u);
        });

        return list;
      });
    },

    getFriendList: function () {
      return apiService.request('user/get/friend_list', '获取好友列表', {
        token: accountService.token
      }).then(function (data) {
        var list = self.friendList;
        list.splice(0, list.length);
        data.friend_list.forEach(function (u) {
          u.id = u.user_id;
          delete u.user_id;
          delete u.error;

          list.push(u);
          self.cacheUser(u);
        });

        return list;
      });
    },

    searchFriend: function (keyword) {
      return apiService.request('user/search', '搜索好友', {
        search_text: keyword,
        token: accountService.token
      }).then(function (data) {
        var users = data.users;
        users.forEach(function (user) {
          user.id = user.user_id;
          delete user.user_id;
          delete user.error;

          self.cacheUser(user);
        });
        return users;
      });
    },

    getUserInfo: function (id) {
      var ret = self.getCachedUser(id);
      var p = apiService.request('user/get/user', '获取用户信息', {
        user_id: id,
        token: accountService.token
      }).then(function (data) {
        data.id = data.user_id;
        delete data.user_id;
        delete data.error;

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

    sendFriendRequest: function (id) {
      return apiService.request('user/friend/add', '发送好友请求', {
        target_user: id,
        token: accountService.token
      }).then(function () {
        return self.getUserInfo(id);
      });
    },

    acceptFriend: function (id) {
      return apiService.request('user/friend/accept', '接受好友请求', {
        target_user: id,
        token: accountService.token
      }).then(function () {
        self.getFriendList();
        self.getFriendRequest();
        return self.getUserInfo(id);
      });
    },

    rejectFriend: function (id) {
      return apiService.request('user/friend/reject', '拒绝好友请求', {
        target_user: id,
        token: accountService.token
      }).then(function () {
        return self.getUserInfo(id);
      });
    },

    removeFriend: function (id) {
      return apiService.request('user/friend/remove', '删除好友', {
        target_user: id,
        token: accountService.token
      }).then(function () {
        self.getFriendList();
        self.getFriendRequest();
        return self.getUserInfo(id);
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

    searchContact: function (phones) {
      return apiService.request('user/search_contact', '搜索通讯录', {
        token: accountService.token,
        phones: phones
      }).then(function (data) {
        var users = data.users;
        users.forEach(function (user) {
          user.id = user.user_id;
          delete user.user_id;
          delete user.error;

          self.cacheUser(user);
        });
        return users;
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
  };
});
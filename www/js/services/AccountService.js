/**
 * 本JS专门放跟用户账户有关的方法
 */

FduHangoutApp.service('accountService',
  function (utilService, apiService, $resource, $q, $rootScope, AUTH_EVENTS, NOTIFICATION_EVENTS, $injector) {
    var userService, self;

    return $rootScope.accountService = self = {
      token: null,

      userInfo: {},

      getSelfInfo: function () {
        if (!self.token)
          return $q.reject(null);
        return apiService.request('who-am-i', {
          token: self.token
        }, '获取个人信息').then(function (data) {
          angular.extend(self.userInfo, data);
          window.localStorage.setItem('userInfo', JSON.stringify(data));
          return data;
        }, function (data) {
          //self.logout();
          return $q.reject(data);
        });
      },

      loggedIn: function () {
        var token = self.token;
        return !(token === 'undefined' || token === 'null' || token === undefined || token === null || token === '');
      },

      login: function (phone, password) {
        return apiService.request('user/login/common', '登录', {
          phone: phone,
          password: password
        }).then(function (data) {
          self.token = data.token;
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
          localStorage.setItem('phone', phone);
          localStorage.setItem('password', password);

          if (!userService) {
            userService = $injector.get('userService');
          }
          //userService.getFriendList();
          //return self.getSelfInfo();
        });
      },


      tryAutoLogin: function () {
        var defer = $q.defer();

        if (localStorage["phone"] && localStorage["password"]) {
          self.userInfo = $.parseJSON(localStorage["userInfo"]);

          return self.login(localStorage["phone"], localStorage["password"]);

        } else {
          defer.reject();
        }

        return defer.promise;
      },

      /**
       *  用户注销操作
       */
      logout: function () {
        self.token = undefined;
        angular.copy({}, self.userInfo);
        window.localStorage.removeItem("password");
        self.notify.tweetCount = 0;
        self.notify.friendRequestCount = 0;
        self.notify.unreadMessageCount = 0;
        self.notify.fillInfoCount = 0;
        $rootScope.$broadcast(NOTIFICATION_EVENTS.notificationRefresh);
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        return utilService.resolved();
      },

      /**
       * 注册
       */
      register: function (name, phone, password) {
        return apiService.request('register', {}, '注册新账号', {
          name: name,
          phone: phone,
          password: password
        });

      },

      /**
       * 验证手机
       */
      verifyPhone: function (phone, code) {
        return apiService.request('verify-phone', {}, '验证手机', {
          phone: phone,
          code: code
        });
      },

      editProfile: function (data) {
        data.token = self.token;
        return apiService.request('edit-profile', {}, '编辑用户资料', data)
      },

      uploadImage: function (data) {
        return apiService.request('upload-image', {}, '上传图片', {
          base64: data
        }).then(function (data) {
          return data.path;
        });
      },

      updateAvatar: function (link) {
        return apiService.request('update-avatar', {}, '上传头像', {
          link: link,
          token: self.token
        });
      }

    };

  });

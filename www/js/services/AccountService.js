/**
 * 本JS专门放跟用户账户有关的方法
 */

FduHangoutApp.service('accountService',
  function (utilService, apiService, $resource, $q, $rootScope, AUTH_EVENTS, NOTIFICATION_EVENTS, $injector) {
    var userService, activityService, self;

    return $rootScope.accountService = self = {
      token: '',

      userInfo: {},

      editSignature: function (signature) {
        return apiService.request('user/signature', '修改个人签名', {
          token: self.token,
          signature: signature
        }).then(function () {
          self.userInfo.signature = signature;
        });
      },

      postLocation: function (lat, lng) {
        if (!self.loggedIn()) {
          return utilService.rejected();
        }
        return apiService.request('position/post', '提交用户位置', {
          latitude: lat,
          longitude: lng,
          token: self.token,
          time: utilService.dateToTimestamp(new Date())
        });
      },

      getSelfInfo: function () {
        if (!self.token) {
          return $q.reject(null);
        }
        return apiService.request('user/get/user', '获取个人信息', {
          user_id: -1,
          token: self.token

        }).then(function (data) {
          data.id = data.user_id;
          delete data.user_id;
          delete data.error;

          angular.extend(self.userInfo, data);
          if (!userService) {
            userService = $injector.get('userService');
          }
          userService.cacheUser(self.userInfo);
          window.localStorage.setItem('userInfo', JSON.stringify(data));
          return data;

        }, function (data) {
          self.logout();
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
          userService.getFriendList();
          userService.getFriendRequest();
          if (!activityService) {
            activityService = $injector.get('activityService');
          }
          activityService.getInvitedList();

          return self.getSelfInfo();
        });
      },


      tryAutoLogin: function () {
        var defer = $q.defer();

        if (localStorage["phone"] && localStorage["password"] && !this.loggedIn()) {
          //self.userInfo = $.parseJSON(localStorage["userInfo"]);

          return self.login(localStorage["phone"], localStorage["password"]);

        } else {
          defer.reject();
        }

        return defer.promise;
      },

      logout: function () {
        self.token = '';
        angular.copy({}, self.userInfo);
        window.localStorage.removeItem("password");
        return utilService.resolved();
      },

      /**
       * 注册
       */
      register: function (name, phone, password) {
        return apiService.request('user/register', '注册新账号', {
          username: name,
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

/**
 * API支持
 */

FduHangoutApp.service('apiService',
  function ($http, $q, utilService, $state, $ionicPopup, $rootScope, AUTH_EVENTS) {

    var loaded;

    return {
      parseIntFields: function (data, fields) {
        fields.forEach(function (key) {
          if (data.hasOwnProperty(key)) {
            data[key] = parseInt(data[key]);
          }
        });
        return data;
      },

      extractObjArray: function (data) {
        var list = [];
        for (var key in data) {
          if (data.hasOwnProperty(key) && $.isPlainObject(data[key])) {
            list.push(data[key]);
          }
        }
        return list;
      },

      parseFloatFields: function (data, fields) {
        fields.forEach(function (key) {
          data[key] = parseFloat(data[key]);
        })
      },

      /* 获取服务器接口地址 */
      getApiUrl: function (path, data) {
        var url = utilService.API_BASE + '/' + path;

        if (angular.isObject(data)) {
          var firstParam = 1;
          angular.forEach(data, function (value, key) {
            if (value == undefined) {
              return;
            }
            if (firstParam) {
              url += '?';
              firstParam = 0;
            } else {
              url += '&';
            }
            url += key + '=' + value;
          })
        }

        return url;
      },

      request: function (name, describe, body) {

        var url = this.getApiUrl(name);
        var p = $http.post(url, body);
        console.log(url);
        //if (body) {
        //    console.log(body);
        //}
        return p.then(function (rsp) {
          var data = rsp.data, error = data;

          if (data.hasOwnProperty('error')) {
            error = data.error;
          }

          console.log(data);
          if (error.errNo) {
            if (error.errNo == 1) {

              $rootScope.$broadcast(AUTH_EVENTS.openLogin);
              return $q.reject(data);
            }

            var msg = error.message || "写服务端的坑爹了...";
            utilService.err(msg, describe);
            return $q.reject(data);
          } else {
            return data;
          }
        }, function (rsp) {
          var data = rsp.data;
          if (data && data.error && data.error.errrNo) {
            var msg = data.err.message || "汪呜...出错了";
            utilService.err(msg, describe);
            return $q.reject(data);
          } else {
            utilService.err('汪呜...服务器在哪里TuT', describe);
            return $q.reject({
              errNo: '-1',
              message: '网络错误'
            });
          }
        });

      }
    };

  });
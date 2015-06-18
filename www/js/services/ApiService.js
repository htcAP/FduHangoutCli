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
          var data = rsp.data;
          // console.log(data);
          if (data.errNo) {
            if (data.errNo == -1 || data.errNo == -2) {

              if (data.errNo == -2)
                utilService.toast("您的账户在其他地方登入，您被迫下线");

              $rootScope.$broadcast(AUTH_EVENTS.openLogin);
              return $q.reject(data);
            }
            var msg = data.errMsg || "网络错误";
            utilService.err(msg, describe);
            return $q.reject(data);
          } else {
            return data;
          }
        }, function (rsp) {
          var data = rsp.data;
          if (data && data.errNo) {
            var msg = data.errMsg || "网络错误";
            utilService.err(msg, describe);
            return $q.reject(data);
          } else {
            utilService.err('网络错误', describe);
            return $q.reject({
              errNo: '1',
              errMsg: '网络错误'
            });
          }
        });

      }
    };

  });
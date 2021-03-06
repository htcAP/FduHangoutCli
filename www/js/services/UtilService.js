/**
 * 本JS专门放Util方法
 */


FduHangoutApp.service('utilService',
  function ($http, $ionicPopup, $q, $rootScope, $timeout, $sce, $cordovaToast) {

    var tsOffset = new Date().getTimezoneOffset() * 60 * 1000;

    function calcCrow(lat1, lon1, lat2, lon2) {
      if (lat1 == 0 || lat2 == 0) return null;
      var R = 6371; // km
      var dLat = toRad(lat2 - lat1);
      var dLon = toRad(lon2 - lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d;
    }

    function toRad(Value) {
      return Value * Math.PI / 180;
    }

    String.prototype.startsWith = function (start) {
      return this.indexOf(start) === 0;
    };

    var self;

    var toExtend = self = {
      API_BASE: 'https://fduhangout.realmofmusic.org/api',
      URL_BASE: 'https://fduhangout.realmofmusic.org',
      //API_BASE: 'http://mingjikeji.cn/api',
      //URL_BASE: 'http://mingjikeji.cn',

      calcCrow: calcCrow,

      err: function (msg, describe) {
        this.toast(msg);
        //$ionicPopup.alert({
        //  title: describe || "Fdu Hangout",
        //  template: '<ion-item>' + msg + '</ion-item>'
        //});
      },

      resolved: function (data) {
        var deferred = $q.defer();
        deferred.resolve(data);
        return deferred.promise;
      },

      rejected: function (data) {
        var deferred = $q.defer();
        deferred.reject(data);
        return deferred.promise;
      },

      timestampToDate: function (timestamp) {
        return new Date(timestamp + tsOffset);
      },

      dateToTimestamp: function (date) {
        return date.getTime() - tsOffset;
      },

      normalizeTime: function (a, ch) {
        return a < 10 ? (ch ? ch : '0') + a : a;
      },

      getDateDesc: function (date) {
        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();

        return y + '年' + self.normalizeTime(M, ' ') + '月' + self.normalizeTime(d, ' ') + '日';
      },

      getTimeDesc: function (arg) {
        if (_.isDate(arg)) {
          return self.normalizeTime(arg.getHours()) + ':' + self.normalizeTime(arg.getMinutes());
        }

        var date = self.timestampToDate(arg);

        var y = date.getFullYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = self.normalizeTime(date.getHours());
        var m = self.normalizeTime(date.getMinutes());
        var now = new Date();

        var delta = (now - date) / 1000 / 60;

        //if (delta <= 5) {
        //  return '刚刚';
        //}
        //if (delta < 60) {
        //  return Math.floor(delta) + '分钟前'
        //}
        if (y != now.getFullYear()) {
          return M + '月' + d + '日 ' + h + ':' + m;
        }
        if (M != now.getMonth() + 1 || d != now.getDate()) {
          return M + '月' + d + '日 ' + h + ':' + m;
        }
        return '今天 ' + h + ':' + m;
      },

      toAbsoluteURL: function (relativeURL) {
        if (!relativeURL) {
          return '//:0';
        }
        if (relativeURL.startsWith('http://') ||
          relativeURL.startsWith('https://') ||
          relativeURL.startsWith('content://') ||
          relativeURL.startsWith('file://') ||
          relativeURL.startsWith('data:'))
          return relativeURL;

        if (relativeURL.substr(0, 1) == "/") relativeURL = relativeURL.substr(1);

        return this.URL_BASE + "/" + relativeURL;
      },

      toAbsoluteURL_HTML: function (HTML) {
        return HTML.replace(/ (src|href)=(["'])(?!https?:\/\/)\/?(.+?)\2/img, " $1=$2" + this.URL_BASE + "/$3$2");
      },

      isNumeric: function (input) {
        return (input - 0) == input && ('' + input).trim().length > 0;
      },

      getSexDesc: function (id) {
        if (!id) {
          return '';
        }
        return ['', '男', '女'][id];
      },

      getEventStatusDescription: function (statusID) {
        statusID = parseInt(statusID);
        switch (statusID) {
          case 1:
            return $sce.trustAsHtml('<span style="color:green">正在招募志愿者！</span>');
            break;
          case 2:
            return $sce.trustAsHtml('<span style="color:orange">志愿者招募已经结束</span>');
            break;
          case 3:
            return $sce.trustAsHtml('<span style="color:yellowgreen">正在活动中！</span>');
            break;
          case 4:
            return $sce.trustAsHtml('<span style="color:#FF0000">活动已经结束</span>');
            break;
        }
      },

      getDateString: function (d) {
        var month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
      },

      toast: function (msg) {
        //if (window.plugins) plugins.toast.showShortBottom(msg);
        //Materialize.toast(msg, 3000);
        $cordovaToast.show(msg, 'short', 'bottom');
      },

      confirm: function (title, content) {
        return $ionicPopup.confirm({
          title: title,
          template: '<ion-item>' + content + '</ion-item>',
          cancelText: '取消',
          cancelType: 'button button-light',
          okText: '确认',
          okType: 'button button-positive'
        });
      },

      resizeImage: function (url, width, height) {
        var sourceImage = new Image();
        var defer = $q.defer();

        sourceImage.onload = function () {
          // Create a canvas with the desired dimensions
          var canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          // Scale and draw the source image to the canvas
          canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);

          // Convert the canvas to a data URL in PNG format
          defer.resolve(canvas.toDataURL());
          console.log(canvas.toDataURL());
        };

        sourceImage.src = url;

        return defer.promise;
      },

      mergeDateTime: function (date, time) {
        var ret = new Date(date);
        ret.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
        return ret;
      },

      selectDateTime: function (mode, date) {
        var defer = $q.defer();
        window.plugins.datePicker.show({
          date: date,
          mode: mode,
          allowOldDates: true
        }, function (returnDate) {
          var a = new Date('1997/01/01' + returnDate.slice(returnDate.indexOf(' ')));
          var b = new Date(returnDate);
          defer.resolve(isNaN(b.getTime()) ? a : b);
        });
        return defer.promise;
      }
    };

    angular.extend(this, toExtend);
    angular.extend($rootScope, toExtend);

    angular.extend(angular, {
      map: _.map
    });

    function resize() {
      $timeout(function () {
        //$('body>.popup-container').height(window.innerHeight);
        //$('body>.view-container').height(window.innerHeight);
        //$('body>.backdrop').height(window.innerHeight);
        $('body>*').height(window.innerHeight);
        document.body.scrollTop = 0;
      }, 0);
    }

    window.addEventListener('native.keyboardhide', function () {
      $('body').removeClass('fh-keyboard-open');
      $timeout(resize, 200);
    });

    window.addEventListener('native.keyboardshow', function () {
      $('body').addClass('fh-keyboard-open');
      $timeout(resize, 200);
    });

    $rootScope.location = window.location;

  });
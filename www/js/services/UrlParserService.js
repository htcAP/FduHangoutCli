/**
 * 解释url，将url，例如a href="http://le.yi/news/1"转成a href=""tab/news/1"的类
 */
FduHangoutApp.service('urlParserService',
  function ($http, $q, utilService, $state, $rootScope) {

    var logic = [{
      prefix: 'news/',
      func: function (data) {
        location.href = "#/news-detail?id=" + data;
      }
    }, {
      prefix: 'events/',
      func: function (data) {
        $state.go('activity-detail?id=' + data);
      }
    }, {
      prefix: 'password/email',
      func: function (data) {
        $state.go('change-password');
      }
    }];

    angular.extend(this, {
      API_BASE: utilService.API_BASE,
      URL_BASE: utilService.URL_BASE,

      processHTML: function (html) {
        //TODO
        return html;
      },

      //转到url，如执行navigate("/news/1")相当于执行location.href="tab/news/1";
      navigate: function (url) {
        //去掉绝对链接中http://xxxxx.xx/部分或相对链接中最前面的/
        url = url.replace(/^(https?:\/\/.+?)?\//img, "");

        for (var i = 0; i < logic.length; ++i) {
          var item = logic[i];
          if (url.indexOf(item.prefix) == 0) {
            item.func(url.substr(item.prefix.length));
            return true;
          }
        }

        return false;
      }
    });

    $rootScope.urlParse = this.navigate;
  });

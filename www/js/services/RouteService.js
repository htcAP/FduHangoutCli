/**
 * 路由加载相关
 */

FduHangoutApp.service('routeService',
  function ($rootScope, $timeout) {
    var self = this;

    var callbackMap = {};

    $rootScope.$on('$stateChangeSuccess', function (event, stat) {
      var s = stat.name;
      //console.log(stat.name);
      $timeout(function () {
        var func = callbackMap[s];
        if (angular.isFunction(func)) {
          func();
        }
      }, 0);
    });

    angular.extend(this, {
      on: function (name, func) {
        callbackMap[name] = func;
      }

    });

  });

leyiPlugin = angular.module('leyiPlugin', [
  'ionic',
  'ngCordova'
])

  .service('pluginService', function ($q, $ionicPlatform) {
    this.invoke = function (method) {
      var args = Array.prototype.slice.call(arguments, 1);
      var defer = $q.defer();

      console.log('INVOKE ' + method + ' ' + JSON.stringify(args));

      cordova.exec(function (data) {
        console.log('INVOKE ' + method + ' RETURN: ' + JSON.stringify(data));
        defer.resolve(data);
      }, function (err) {
        console.log('INVOKE ' + method + ' ERROR: ' + JSON.stringify(err));
        defer.reject(err);
      }, 'LeyiPlugin', method, args);

      return defer.promise;
    }
  });

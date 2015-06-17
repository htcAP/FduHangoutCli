FduHangoutApp = angular.module('FduHangoutApp', [
  'leyiPlugin',
  'ionic',
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'jrCrop',
  'ionic.rating',
  'ngCordova'
])
  .run(function ($ionicPlatform, routeService, accountService, geoLocationService, testPlugin, updateService, $q) {
    $ionicPlatform.ready(function () {
      if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
          return this.slice(0, str.length) == str;
        };
      }
      //updateService.checkForUpdate(false);
      geoLocationService.getGeoLocation();
      //accountService.tryAutoLogin(function (successful) {
      //});
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      //testPlugin.test(' a').then(function(ret) {
      //  console.log(ret);
      //}, function(reason) {
      //  console.log(reason);
      //}).finally(function() {
      //  console.log('plugin call complete');
      //});

      angular.extend(window, {
        $q: $q
      })
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $compileProvider) {

    $ionicConfigProvider.platform.android.tabs.position("bottom");
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.platform.android.backButton.icon("ion-chevron-left");
    $ionicConfigProvider.backButton.icon("ion-chevron-left");

    $ionicConfigProvider.views.maxCache(2);

// if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/main/rec');

    // disable cache
    var headers = $httpProvider.defaults.headers;
    if (!headers.get) {
      headers.get = {};
    }

    headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    headers.get['Cache-Control'] = 'no-cache';

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|geo|file|tel):/);
  });
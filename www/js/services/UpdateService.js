FduHangoutApp.service('updateService',
  function ($http, $state, $ionicPopup, $rootScope, utilService, AUTH_EVENTS, dataService) {
    var ext = {
      app_version: "0.1.0",
      checkForUpdate: function (forced) {
        dataService.getAppVersion().then(function (data) {
          if (!forced && data.data.version == localStorage["skipAppVersion"]) return;
          if (forced || (ext.parseAppVersion(data.data.version) > ext.parseAppVersion(ext.app_version))) {
            $rootScope.$broadcast("open-update-modal", {currentVersion: ext.app_version, data: data.data});
          }
        });
      },
      skipAppVersion: function (version) {
        localStorage["skipAppVersion"] = version;
      },
      parseAppVersion: function (appVersion) {
        appVersion = appVersion.split(".");
        return Number(appVersion[0]) * 10000 + Number(appVersion[1]) * 100 + Number(appVersion[2]);
      }
    };
    angular.extend(this, ext);
  })
;
FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main.setting', {
      url: '/setting',
      views: {
        mainContent: {
          templateUrl: 'js/setting/setting.html'

        }
      }
    })
  })

  .controller('SettingController',
  function ($scope, accountService) {
    $scope.logout = function () {
      accountService.logout();
    }

  });

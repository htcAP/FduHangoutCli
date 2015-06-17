FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('user-info', {
      url: '/user-info',
      params: {
        id: null,
        type: '',
        info: {}
      },
      templateUrl: 'js/user/info.html'
    })
  })

  .controller('UserInfoController',
  function ($scope, $stateParams, userService, $ionicLoading, nativeUrlPlugin) {
    var data = $scope.data = {
      id: $stateParams.id,
      info: $stateParams.info,
      type: $stateParams.type,
      user: userService.getCachedUser($stateParams.id)
    };

    $scope.refresh = function (isPull) {
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        })
      }
      userService.getUserInfo($stateParams.id).then(function (user) {
        angular.extend(data.user, user);
      }).finally(function () {
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
      })
    };
    $scope.refresh();

    $scope.openQQ = function () {
      nativeUrlPlugin.showQQ(data.user.qq);
    }
  });

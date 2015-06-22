FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main.friend-requests', {
      url: '/friend-requests',
      views: {
        'mainContent': {
          templateUrl: 'js/user/friend-requests.html'
        }
      }
    })
  })

  .controller('FriendRequestsController',
  function ($scope, userService, $ionicLoading) {

    var data = $scope.data = {
      users: userService.requestList,
      loading: false
    };

    $scope.refresh = function (isPull) {
      if (data.loading) {
        return;
      }
      data.loading = true;
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        });
      }
      userService.getFriendRequest().finally(function () {
        data.loading = false;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.$on('$ionicView.enter', $scope.refresh);

  });

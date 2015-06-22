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
  function ($scope, $stateParams, userService, $ionicLoading, nativeUrlPlugin, $ionicHistory, accountService, $state, utilService, $state) {

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

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.tryEditProfile = function () {
      if (data.id != accountService.userInfo.id) {
        return;
      }
      $state.go('profile-edit');
    };

    $scope.addFriend = function () {
      userService.sendFriendRequest(data.id).then(function () {
        utilService.toast('已发送好友请求');
      });
    };

    $scope.removeFriend = function () {
      userService.removeFriend(data.id).then(function () {
        utilService.toast('已删除好友');
      })
    };

    $scope.acceptFriend = function () {
      userService.acceptFriend(data.id).then(function () {
        utilService.toast('你们成为好友啦~');
      });
    };

    $scope.rejectFriend = function () {
      userService.rejectFriend(data.id).then(function () {
        utilService.toast('已拒绝...');
      })
    };

    $scope.showAvatar = function () {
      $state.go('big-avatar');
    }

  });

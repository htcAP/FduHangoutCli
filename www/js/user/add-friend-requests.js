FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('add-friend-requests', {
      url: '/add-friend-requests',
      templateUrl: 'js/user/add-friend-requests.html'
    })
  })

  .controller('AddFriendRequestsController',
  function ($scope, userService, $ionicHistory, $state, utilService, $ionicLoading, accountService) {
    var data = $scope.data = {
      incomingRequests: [],
      outgoingRequests: []
    };

    $scope.refresh = function (isPull) {
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        })
      }
      userService.getFriendRequests().then(function (recv) {
        data.incomingRequests = recv.incomingRequests;
        data.outgoingRequests = recv.outgoingRequests;
      }).finally(function () {
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
      });
    };
    $scope.$on('$ionicView.enter', $scope.refresh);

    $scope.cancelRequest = function (request) {
      $state.go('user-info', {
        id: request.user_id,
        type: 'cancelRequest',
        info: {
          message: request.message,

          revoke: function () {
            utilService.confirm('取消？', '确认要取消好友请求吗？').then(function (res) {
              if (!res) {
                return;
              }
              userService.revokeFriendRequest(request.id).then(function () {
                utilService.toast('已撤回好友请求');
                $ionicHistory.goBack();
                accountService.refreshNotification();
              })
            })
          }
        }
      })
    };

    $scope.handleRequest = function (request) {
      $state.go('user-info', {
        id: request.user_id,
        type: 'handleRequest',
        info: {
          message: request.message,

          accept: function () {
            userService.handleFriendRequest(request.id, true).then(function () {
              utilService.toast('已接受好友请求');
              $ionicHistory.goBack();
              userService.getFriendList();
              accountService.refreshNotification();
            })
          },

          reject: function () {
            utilService.confirm('忽略？', '确认要忽略好友请求吗？').then(function (res) {
              if (!res) {
                return;
              }
              userService.handleFriendRequest(request.id, false).then(function () {
                utilService.toast('已忽略好友请求');
                accountService.refreshNotification();
                $ionicHistory.goBack();
              })
            });
          }
        }
      })
    }

  });

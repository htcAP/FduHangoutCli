FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('message-list', {
      url: '/message-list?unread',
      templateUrl: 'js/message/list.html'
    })
  })

  .controller('MessageListController',
  function ($scope, $stateParams, userService, $state, $ionicLoading) {
    var data = $scope.data = {
      unread: parseInt($stateParams.unread),
      msg: []
    };

    $scope.refresh = function (isPull) {
      if (!isPull) {
        $ionicLoading.show({
          template: '加载中...'
        })
      }
      $scope.loading = true;
      userService.getMessages(data.unread).then(function (msg) {
        data.msg = msg;
      }).finally(function () {
        if (isPull) {
          $scope.$broadcast('scroll.refreshComplete');
        } else {
          $ionicLoading.hide();
        }
        $scope.loading = false;
      })
    };
    $scope.$on('$ionicView.enter', $scope.refresh);

    $scope.readMessage = function (message) {
      if (data.unread) {
        userService.setMessageRead(message.id);
      }
      $state.go('message-detail', {
        message: message
      });
    }

  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('message-send', {
      url: '/message-send?id',
      templateUrl: 'js/message/send.html'
    })
  })

  .controller('MessageSendController',
  function ($scope, $stateParams, userService, $ionicLoading, utilService, $ionicHistory) {
    var data = $scope.data = {
      peer: userService.getCachedUser($stateParams.id),
      title: '',
      content: ''
    };

    $scope.send = function () {
      $ionicLoading.show({
        template: '发送中...'
      });
      userService.sendMessage(data.peer.id, data.title, data.content).then(function () {
        utilService.toast('发送成功');
        $ionicHistory.goBack();
      }).finally(function () {
        $ionicLoading.hide();
      });
    }

  });

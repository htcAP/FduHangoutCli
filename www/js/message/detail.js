FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('message-detail', {
      url: '/message-detail',
      params: {
        message: null
      },
      templateUrl: 'js/message/detail.html'
    })
  })

  .controller('MessageDetailController',
  function ($scope, $stateParams, userService, utilService, $ionicHistory) {
    var data = $scope.data = {};
    angular.copy($stateParams.message, data);

    $scope.deleteMessage = function () {
      userService.deleteMessage(data.id).then(function () {
        utilService.toast('删除成功');
        $ionicHistory.goBack();
      });
    }
  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('add-friend', {
      url: '/add-friend?id',
      templateUrl: 'js/user/add-friend.html'
    })
  })

  .controller('AddFriendController',
  function ($scope, userService, $stateParams, utilService, $ionicHistory) {
    var data = $scope.data = {
      msg: ''
    };
    angular.copy(userService.getCachedUser($stateParams.id), data);

    $scope.addFriend = function () {
      userService.sendFriendRequest(data.id, data.msg).then(function () {
        utilService.toast('已发送好友请求');
        $ionicHistory.goBack();
      });
    }
  });

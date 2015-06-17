FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('friends', {
      url: '/friends',
      templateUrl: 'js/user/friends.html'
    })
  })

  .controller('FriendsController',
  function ($scope, userService) {
    var data = $scope.data = {
      friends: userService.friendList
    };

    $scope.refresh = function () {
      userService.getFriendList().finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

  });

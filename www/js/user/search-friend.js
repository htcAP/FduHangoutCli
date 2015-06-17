FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('search-friend', {
      url: '/search-friend',
      templateUrl: 'js/user/search-friend.html'
    })
  })

  .controller('SearchFriendController',
  function ($scope, userService, $state, $ionicLoading) {

    var data = $scope.data = {};

    $scope.doSearch = function () {
      data.result = [];
      if (!data.keyword) {
        return;
      }
      $ionicLoading.show({
        template: '搜索中...'
      });
      userService.searchFriend(data.keyword).then(function (res) {
        data.result = [{
          id: res.id,
          name: res.name,
          email: res.email,
          image: res.image,
          school: res.school,
          ok: res.ok,
          msg: res.msg
        }]
      }).finally(function () {
        $ionicLoading.hide();
      })
    };

    $scope.addFriend = function (user) {
      $state.go('user-info', {
        id: user.id,
        type: 'addFriend',
        info: {
          ok: user.ok,
          msg: user.msg,
        }
      });
    }

  });

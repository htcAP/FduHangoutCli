FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('search-friend', {
      url: '/search-friend',
      templateUrl: 'js/user/search-friend.html'
    })
  })

  .controller('SearchFriendController',
  function ($scope, userService, $state, $ionicLoading, $ionicHistory) {

    var data = $scope.data = {
      searchText: '',
      loading: 0,
      users: []
    };

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.clearText = function () {
      data.searchText = '';
    };

    $scope.doSearch = function () {
      if (!data.searchText) {
        return;
      }

      data.loading++;
      userService.searchFriend(data.searchText).then(function (users) {
        data.users = users;

      }).finally(function () {
        data.loading--;
      })
    }


  });

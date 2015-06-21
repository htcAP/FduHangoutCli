FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('profile-edit', {
      url: '/profile-edit',
      templateUrl: 'js/user/profile-edit.html'
    });
  })

  .controller('ProfileEditController',
  function ($scope, accountService, $ionicHistory) {

    var data = $scope.data = {
      signature: accountService.userInfo.signature
    };

    $scope.doEdit = function () {
      accountService.editSignature(data.signature).then(function () {
        $ionicHistory.goBack();
      })
    }

  });

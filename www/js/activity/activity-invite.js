FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('activity-invite', {
      url: '/activity-invite?id',
      templateUrl: 'js/activity/activity-invite.html'
    })
  })

  .controller('ActivityInviteController',
  function ($scope, $stateParams, activityService, userService, utilService, $ionicHistory) {

    var data = $scope.data = {
      friends: userService.friendList,
      isInvited: {}
    };

    $scope.submit = function () {
      var users = [];
      for (var key in data.isInvited) {
        if (data.isInvited.hasOwnProperty(key) && data.isInvited[key]) {
          users.push(key);
        }
      }
      if (users.length == 0) {
        utilService.toast('没有邀请任何人...');
        return;
      }
      activityService.inviteUsers($stateParams.id, users).then(function () {
        utilService.toast('邀请成功~');
        activityService.getActivity($stateParams.id);
        $ionicHistory.goBack();
      });
    }

  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('time-location', {
      url: '/time-location?id',
      templateUrl: 'js/activity/time-location.html'
    })
  })

  .controller('TimeLocationController',
  function ($scope, $stateParams, activityService, utilService, $state) {
    var id = $stateParams.id;
    var activity = activityService.getCachedActivity(id);
    var data = $scope.data = {
      id: $stateParams.id,
      activity: activity
    };

    $scope.postVote = function (id) {
      activityService.postVote(data.id, id).then(function () {
        utilService.toast('投票成功~');
      });
    };

    $scope.doAdd = function () {
      $state.go('activity-new-tip', {id: id});
    }

  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('time-location', {
      url: '/time-location?id',
      templateUrl: 'js/activity/time-location.html'
    })
  })

  .controller('TimeLocationController',
  function ($scope, $stateParams, activityService, utilService) {
    var id = $stateParams.id;
    var activity = activityService.getCachedActivity(id);
    var data = $scope.data = {
      id: $stateParams.id,
      activity: activity,
      tmOptions: activity.timeLocations
    };

    $scope.postVote = function (id) {
      activityService.postVote(data.id, id).then(function () {
        utilService.toast('投票成功~');
      })

    };

  });

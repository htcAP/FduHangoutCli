FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('time-location', {
      url: '/time-location?id',
      templateUrl: 'js/activity/time-location.html'
    })
  })

  .controller('TimeLocationController',
  function ($scope, $stateParams, activityService, utilService, $state, accountService, $ionicLoading, mapPlugin, geoLocationService, $ionicPopup, $ionicHistory) {
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
    };


    var confirmPopup, tid;

    $scope.tryDecide = function (id) {
      tid = id;
      if (data.activity.organizer_id != accountService.userInfo.id) {
        return;
      }
      confirmPopup = $ionicPopup.show({
        templateUrl: 'js/activity/decide-confirm.html',
        scope: $scope
      });
    };

    $scope.doCancel = function () {
      confirmPopup.close();
    };

    $scope.doConfirm = function () {
      confirmPopup.close();
      $ionicLoading.show({
        template: '正在决定...'
      });
      activityService.decideTimeLocation(tid).then(function () {
        utilService.toast('已结束活动邀请并决定活动时间地点!');
        activityService.getActivity($stateParams.id);
        $ionicHistory.goBack();

      }).finally(function () {
        $ionicLoading.hide();
      })
    };

    $scope.navigate = function (info) {
      mapPlugin.directionIntent(geoLocationService.lat, geoLocationService.lng, info.latitude, info.longitude);
    }

  });

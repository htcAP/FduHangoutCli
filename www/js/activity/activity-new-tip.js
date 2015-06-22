FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('activity-new-tip', {
      url: '/activity-new-tip?id',
      templateUrl: 'js/activity/activity-new-tip.html'
    })
  })

  .controller('NewActivityTipController',
  function ($scope, utilService, activityService, accountService, $state, $ionicLoading, $ionicHistory, $rootScope, AUTH_EVENTS, $stateParams, $timeout) {
    if (!accountService.loggedIn()) {
      utilService.toast('请先登录！');
      $ionicHistory.goBack();
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    }

    var data = $scope.data = {
      startDate: new Date(),
      startTime: new Date(),
      endDate: new Date(),
      endTime: new Date(),
      location: '',
      loading: false
    };

    $scope.selectStartDate = function () {
      utilService.selectDateTime('date', data.startDate).then(function (date) {
        data.startDate = date;
        if (date > data.endDate) {
          data.endDate = date;
        }
      });
    };

    $scope.selectEndDate = function () {
      utilService.selectDateTime('date', data.endDate).then(function (date) {
        data.endDate = date;
      });
    };

    $scope.selectStartTime = function () {
      utilService.selectDateTime('time', data.startTime).then(function (time) {
        data.startTime = time;
      });
    };

    $scope.selectEndTime = function () {
      utilService.selectDateTime('time', data.endTime).then(function (time) {
        data.endTime = time;
      });
    };


    $scope.submit = function () {
      if (data.loading) {
        return;
      }

      if (!data.location) {
        utilService.toast('填一下地点吧~');
        return;
      }
      var start = utilService.mergeDateTime(data.startDate, data.startTime);
      var end = utilService.mergeDateTime(data.endDate, data.endTime);

      if (end <= start) {
        utilService.toast('活动结束时间需要比活动开始时间更晚哦~');
        return;
      }

      data.loading = true;
      $ionicLoading.show({
        template: '添加中...'
      });

      activityService.addTimeLocation($stateParams.id, start, end, data.location).then(function () {
        utilService.toast('成功添加时间地点！');
        activityService.getActivity($stateParams.id);
        $ionicHistory.goBack();
        $timeout(function () {
          $state.go('activity-detail', {id: id});
        }, 0);

      }).finally(function () {
        data.loading = false;
        $ionicLoading.hide();
      })

    }

  });

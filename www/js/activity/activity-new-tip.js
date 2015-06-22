FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('activity-new-tip', {
      url: '/activity-new-tip?id',
      templateUrl: 'js/activity/activity-new-tip.html'
    })
  })

  .controller('NewActivityTipController',
  function ($scope, utilService, activityService, accountService, $state, $ionicLoading, $ionicHistory, $rootScope, AUTH_EVENTS, $stateParams, $timeout, nlpPlugin) {
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
      loading: false,
      upgraded: false,
      text: ''
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

    $scope.defaultSubmit = function () {
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

      }).finally(function () {
        data.loading = false;
        $ionicLoading.hide();
      })

    };


    $scope.submit = function () {
      if (data.loading) {
        return;
      }
      if (!data.upgraded) {
        $scope.defaultSubmit();
        return;
      }

      $ionicLoading.show({
        template: '正在尝试理解...'
      });

      nlpPlugin.nlp_get_time(data.text).then(function (recv) {
        var startTime = new Date(recv.start_time);
        var endTime = new Date(recv.end_time);
        console.log(startTime);
        console.log(endTime);

        nlpPlugin.nlp_get_loction(data.text).then(function (location) {
          if (!location) {
            utilService.toast('并不能知道地点...');
            data.loading = false;
            $ionicLoading.hide();
            return;
          }

          activityService.addTimeLocation($stateParams.id, startTime, endTime, location).then(function () {
            utilService.toast('成功添加时间地点！');
            activityService.getActivity($stateParams.id);
            $ionicHistory.goBack();

          }).finally(function () {
            data.loading = false;
            $ionicLoading.hide();
          })
        });
      })

    };

    $scope.upgrade = function () {
      data.upgraded = !data.upgraded;
    };

  });

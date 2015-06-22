FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('activity-new', {
      url: '/activity-new',
      templateUrl: 'js/activity/activity-new.html'
    })
  })

  .controller('NewActivityController',
  function ($scope, utilService, activityService, accountService, $state, $ionicLoading, $ionicHistory, $rootScope, AUTH_EVENTS) {
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
      ddlDate: new Date(),
      ddlTime: new Date(),
      title: '',
      description: '',
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

    $scope.selectDdlDate = function () {
      utilService.selectDateTime('date', data.endDate).then(function (date) {
        data.ddlDate = date;
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

    $scope.selectDdlTime = function () {
      utilService.selectDateTime('time', data.ddlTime).then(function (time) {
        data.ddlTime = time;
      });
    };


    $scope.submit = function () {
      if (data.loading) {
        return;
      }
      if (!data.title) {
        utilService.toast('填写一下标题吧~');
        return;
      }
      if (!data.description) {
        utilService.toast('填写一下活动内容吧~');
        return;
      }
      if (!data.location) {
        utilService.toast('填一下地点吧~');
        return;
      }
      var ddl = utilService.mergeDateTime(data.ddlDate, data.ddlTime);
      var start = utilService.mergeDateTime(data.startDate, data.startTime);
      var end = utilService.mergeDateTime(data.endDate, data.endTime);

      if (ddl <= new Date()) {
        utilService.toast('报名结束时间需要比当前时间更晚哦~');
        return;
      }
      if (start <= ddl) {
        utilService.toast('活动开始时间需要比报名结束时间更晚哦~');
        return;
      }
      if (end <= start) {
        utilService.toast('活动结束时间需要比活动开始时间更晚哦~');
        return;
      }

      data.loading = true;
      $ionicLoading.show({
        template: '添加中...'
      });
      var id;
      activityService.addActivity(data.title, data.description, ddl).then(function (recv) {
        id = recv;
        return activityService.addTimeLocation(id, start, end, data.location);

      }).then(function () {
        return activityService.inviteUsers(id, [accountService.userInfo.id]);

      }).then(function () {
        utilService.toast('成功添加活动！');
        activityService.getAll();
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

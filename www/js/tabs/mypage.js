FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('tab.mypage', {
      url: '/tab/mypage',
      views: {
        'tab-user': {
          templateUrl: 'js/tabs/mypage.html'
        }
      }
    })
  })

  .controller('TabMypageController',
  function ($scope, dataService, utilService, accountService, updateService) {

    //$scope.$on("$ionicView.enter", function () {
    //    if(!accountService.loggedIn())
    //    {
    //        $ionicHistory.goBack();
    //        $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    //    }
    //});
    accountService.getSelfInfo();

    var data = $scope.data = {
      user: accountService.userInfo,
      notify: accountService.notify
    };

    $scope.logout = function () {
      utilService.confirm('退出？', '确认退出登录吗？').then(function (res) {
        if (!res) {
          return;
        }
        accountService.logout().then(function () {
          accountService.clearNotification();
          utilService.toast("登出成功");
        });
      });
    };

    $scope.refresh = function () {
      accountService.refreshNotification().finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      })
    };
    $scope.refresh();

    $scope.checkForUpdate = function () {
      updateService.checkForUpdate(true);
    };
    //$scope.pagination = {
    //  current: 1
    //};
    //$scope.activities = [];
    //$scope.totalActivities = 0;
    //$scope.activitiesPerPage = 2;
    //getResultsPage(1);
    //
    //$scope.pageChanged = function (newPage) {
    //  // getResultsPage(newPage);
    //  console.log('page changed in mypage controller');
    //};
    //
    //function getResultsPage(pageNumber) {
    //  dataService.getActivityList(($scope.pagination.current - 1) * $scope.activitiesPerPage,
    //    $scope.activitiesPerPage, 0, false).then(function (data) {
    //      $scope.activities = data.eventSeriesList;
    //      console.log($scope.activities);
    //      $scope.totalActivities = 2;
    //    });
    //}
  });

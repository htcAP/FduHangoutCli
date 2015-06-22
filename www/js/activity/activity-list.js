FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main.activity-list', {
      url: '/activity-list',
      views: {
        'mainContent': {
          templateUrl: 'js/activity/activity-list.html'
        }
      }
    })
  })

  .controller('ActivityListController',
  function ($scope, $rootScope, $timeout, activityService, userService, utilService) {

    var data = $scope.data = {
      list: [activityService.allActivity, activityService.friendActivity, activityService.myActivity],
      n: 0,
      curList: activityService.allActivity
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $rootScope.hasSubHeader = 'fh-has-sub-header';
    });

    $scope.$on('$ionicView.afterLeave', function () {
      $rootScope.hasSubHeader = '';
    });

    $scope.$on('$ionicView.enter', function () {
      activityService.getAll();
    });

    $scope.selectTab = function (n) {
      data.n = n;
      data.curList = data.list[n];
      $scope.refresh();
    };

    $scope.refresh = function () {
      var q;
      switch (data.n) {
        case 0:
          q = activityService.getAll();
          break;
        case 1:
          if (!userService.loggedIn()) {
            utilService.toast('请先登录哦');
            return;
          }
          q = activityService.getFriendActivity();
          break;
        case 2:
          if (!userService.loggedIn()) {
            utilService.toast('请先登录哦');
            return;
          }
          q = activityService.getMyActivity();
          break;
      }
      q.finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  });

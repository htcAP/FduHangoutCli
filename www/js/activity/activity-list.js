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
  function ($scope, $rootScope, $timeout, activityService, mapPlugin) {

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
    };

    $scope.refresh = function () {

      mapPlugin.getLatitude().then(function (hasdahf) {
        console.log(hasdahf);
      });
      mapPlugin.getLongitude().then(function (hsdsf) {
        console.log(hsdsf);
      });
      activityService.getAll().then(function () {
        $scope.$broadcast('scroll.refreshComplete');
      })
    }



  });

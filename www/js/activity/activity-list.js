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
  function ($scope, $rootScope, $timeout) {

    $scope.$on('$ionicView.beforeEnter', function () {
      $rootScope.hasSubHeader = 'fh-has-sub-header';
    });

    $scope.$on('$ionicView.afterLeave', function () {
      $rootScope.hasSubHeader = '';
    });


  });

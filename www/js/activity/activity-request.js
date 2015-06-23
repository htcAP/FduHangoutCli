FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main.activity-request', {
      url: '/activity-request',
      views: {
        mainContent: {
          templateUrl: 'js/activity/activity-request.html'
        }
      }
    })
  })

  .controller('ActivityRequestController',
  function ($scope, activityService) {

    $scope.refresh = function () {
      activityService.getInvitedList().finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });

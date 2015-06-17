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
    $rootScope.hasSubHeader = 'hasSubHeader';

    $timeout(function () {
      $('ul.tabs').tabs();
    }, 100);

  });

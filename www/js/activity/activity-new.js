FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('activity-new', {
      url: '/activity-new',
      templateUrl: 'js/activity/activity-new.html'
    })
  })

  .controller('NewActivityController',
  function ($scope, $timeout) {


  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main', {
      abstract: true,
      templateUrl: 'js/main/main.html'
    })
  })

  .controller('MainController',
  function ($scope) {

  });

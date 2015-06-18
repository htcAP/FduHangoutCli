FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main', {
      abstract: true,
      templateUrl: 'js/main/main.html'
    })
  })

  .controller('MainController',
  function ($scope, $rootScope, AUTH_EVENTS, $ionicModal, $ionicLoading) {

    $scope.login = function () {
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
      //$ionicLoading.show({
      //  template: '加载中'
      //});
    };


    $rootScope.$on(AUTH_EVENTS.openLogin, function () {
      $scope.loginModal.show();
      //if(!$scope.loginData.phone)
      //  $("#phoneInput").focus().select();
    });

    $ionicModal.fromTemplateUrl('js/login/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.loginModal = modal;
    });

  });

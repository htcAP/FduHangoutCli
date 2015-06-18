FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('main', {
      abstract: true,
      templateUrl: 'js/main/main.html'
    })
  })

  .controller('MainController',
  function ($scope, $rootScope, AUTH_EVENTS, $ionicModal, $ionicLoading, $ionicPopup, accountService, utilService) {

    var data = $scope.data = {
      phone: '',
      password: ''
    };

    var loginPopup;

    $scope.login = function () {
      $rootScope.hideSideNav();
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    };

    $rootScope.$on(AUTH_EVENTS.openLogin, function () {
      data.phone = '';
      data.password = '';
      loginPopup = $ionicPopup.show({
        templateUrl: 'js/login/login.html',
        scope: $scope
      });
    });

    $scope.doLogin = function () {
      $ionicLoading.show({
        template: '登陆中...'

      });
      accountService.login(data.phone, data.password).then(function () {
        utilService.toast('登录成功~汪呜');
        loginPopup.hide();

      }).finally(function () {
        $ionicLoading.hide();

      });

    }

  });

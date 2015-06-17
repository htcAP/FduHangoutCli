FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('tab.login', {
      url: '/tab/login',
      views: {
        'tab-user': {
          templateUrl: 'js/tabs/login.html'
        }
      }
    })
  })

  .controller('TabLoginController',
  function ($scope, accountService, $ionicPopup, $location, $state, $ionicHistory, utilService) {

    var data = {
      phone: '',
      password: ''
    };
    $scope.data = data;

    //如果已经登入，就跳到个人页面
    if (accountService.loggedIn()) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        disableAnimate: true
      });
      $state.go('tab.mypage');
    }

    $scope.loggedIn = accountService.loggedIn();

    $scope.login = function () {
      accountService.login(data.phone, data.password).then(function (data) {
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('tab.mypage');
        utilService.toast('登录成功');
      }, function (data) {
        self.password = "";
      });
    };
  });

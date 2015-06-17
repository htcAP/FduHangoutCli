FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('tab', {
      abstract: true,
      templateUrl: "js/tabs/tabs.html"
    })
  })

  .controller('TabController',
  function ($scope, $rootScope, $ionicModal, $timeout, $ionicLoading,
            apiService, utilService, accountService, $ionicSideMenuDelegate, $state, $ionicHistory, $ionicViewSwitcher, AUTH_EVENTS, NOTIFICATION_EVENTS, updateService) {

    $scope.loggedIn = false;
    $('ion-tabs>.tab-nav.tabs').addClass('ly-hide-on-keyboard-open');

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
      $scope.loggedIn = accountService.loggedIn();
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
      $state.go('tab.recommendation');
    });

    $rootScope.$on(AUTH_EVENTS.openLogin, function () {
      $scope.loginModal.show();
      //if(!$scope.loginData.phone)
      //  $("#phoneInput").focus().select();
    });


    $scope.updateApp = function (url) {
      window.open(url, '_system');
      $scope.closeCheckUpdate();
    };

    $scope.skipUpdate = function (version) {
      updateService.skipAppVersion(version);
      $scope.closeCheckUpdate();
    };


    $rootScope.$on("open-update-modal", function (event, args) {
      $scope.updateInfo = {
        currentVersion: args.currentVersion,
        changeLogHTML: args.data.changeLogHTML,
        link: args.data.link,
        newestVersion: args.data.version,
        releaseDate: args.data.releaseDate
      };
      $scope.updateModal.show();

      console.log(args);
    });

    $scope.closeCheckUpdate = function () {
      $scope.updateModal.hide();
    };

    $scope.data = {
      notify: accountService.notify
    };

    $scope.loginData = {
      phone: window.localStorage['phone'],
      password: window.localStorage['password']
    };

    $ionicModal.fromTemplateUrl('js/login/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.loginModal = modal;
    });

    $ionicModal.fromTemplateUrl('js/update/update.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.updateModal = modal;
    });

    $scope.closeLogin = function () {
      $scope.loginModal.hide();
    };

    $scope.mypage = function () {
      if (accountService.loggedIn()) {
        $state.go("tab.mypage");
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.openLogin);
      }
    };

    $scope.doRegister = function () {
      $state.go("register");
      $ionicViewSwitcher.nextTransition('none');
      $scope.loginModal.hide();
    };

    $scope.login = function () {
      $rootScope.$broadcast(AUTH_EVENTS.openLogin);
    };

    $scope.doLogin = function () {
      $ionicLoading.show({
        template: '正在登入...'
      });
      accountService.login($scope.loginData.phone, $scope.loginData.password).then(function (data) {
        $ionicLoading.hide();
        $state.go('tab.mypage');
        utilService.toast('登录成功');
        $scope.loginModal.hide();
      }, function (data) {
        $ionicLoading.hide();
        self.password = "";
      });
    };
    $scope.forgetPassword = function () {
      $scope.closeLogin();
      $ionicViewSwitcher.nextTransition('none');
      $state.go("forget-password");
    };
    $scope.clearUserData = function () {
      $scope.loginData.phone = "";
      $scope.loginData.password = "";
      window.localStorage.setItem('phone', $scope.loginData.phone);
      window.localStorage.setItem('password', $scope.loginData.password);
    };


  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('forget-password-2', {
      url: '/forget-password-2',
      params: {
        phone: "",
        code: ""
      },
      templateUrl: 'js/login/forget-password-2.html'
    });
  })

  .controller('ForgetPassword2Controller',
  function ($scope, $state, utilService, accountService, $ionicPopup, $ionicHistory, $stateParams, AUTH_EVENTS, $rootScope) {

    var data = $scope.data = {
      phone: undefined,
      password: undefined,
      passwordRepeat: undefined
    };

    $scope.finish = function () {

      if (data.password.length < 8) {
        utilService.err("密码长度至少为8位", "修改密码");
        return;
      }
      if (data.password != data.passwordRepeat) {
        utilService.err("两次密码不一致", "修改密码");
        return;
      }

      accountService.submitResetPassword($stateParams.phone, $stateParams.code, data.password).then(function (data) {
        $ionicPopup.alert({
          title: '密码重置成功',
          template: '<div style="text-align: center">恭喜，密码重置成功！</div>'
        });
        $ionicHistory.goBack(-3);
        $rootScope.$broadcast(AUTH_EVENTS.openLogin);
      })
    };
  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('forget-password', {
      url: '/forget-password',
      templateUrl: 'js/login/forget-password.html'
    });
  })

  .controller('ForgetPasswordController',
  function ($scope, $state, utilService, accountService, $ionicPopup, $ionicHistory) {

    var data = $scope.data = {
      phone: undefined,
      recoveryCode: undefined
    };

    $scope.recoverPassword = function () {
      accountService.requestResetPassword(data.phone).then(function () {
        $state.go('validate-code', {
          title: '找回密码',
          subtitle: '验证码已发送到 ' + data.phone,
          actionName: '找回密码',
          isRecoverPassword: true,
          skipAction: true,
          action: function () {
            return accountService.requestResetPassword(data.phone);
          },
          validate: function (secCode) {
            accountService.tryResetPasswordCode(data.phone, secCode).then(function () {
              $state.go('forget-password-2', {
                phone: data.phone,
                code: secCode
              });
            });
          }
        });
      });
    };
  });

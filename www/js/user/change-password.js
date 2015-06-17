FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('change-password', {
      url: '/change-password',
      templateUrl: 'js/user/change-password.html'
    })
  })

  .controller('ChangePasswordController',
  function ($scope, userService, $ionicHistory, utilService) {
    var data = $scope.data = {
      originPassword: '',
      newPassword: ''
    };

    $scope.changePassword = function () {
      if (data.newPassword.length < 8) {
        utilService.err("密码长度至少为8位", "修改密码");
        return;
      }
      if (data.newPassword != data.passwordRepeat) {
        utilService.err("两次密码不一致", "修改密码");
        return;
      }
      userService.changePassword(data.originPassword, data.newPassword).then(function () {
        $ionicHistory.goBack();
        utilService.toast('修改密码成功');
      })
    };

  });

FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'js/register/register.html'
    });
  })

  .controller('RegisterController',
  function ($scope, $state, utilService, accountService, $ionicPopup, $ionicHistory) {

    var data = $scope.data = {
      name: '',
      phone: undefined,
      password: '',
      passwordRepeat: ''
    };

    $scope.register = function () {
      if (data.name.length < 2) {
        utilService.err('请填写真实姓名', '注册');
        return;
      }
      if (data.phone.toString().length != 11) {
        utilService.err('手机号码无效', '注册');
        return;
      }
      if (data.password.length < 8) {
        utilService.err('密码长度至少8位', '注册');
        return;
      }
      if (data.password != data.passwordRepeat) {
        utilService.err('两次输入的密码不一致', '注册');
        return;
      }

      $state.go('validate-code', {
        title: '手机验证',
        subtitle: '手机验证码已发送到 ' + data.phone,
        actionName: '验证手机号',

        action: function () {
          return accountService.register(data.name, data.phone.toString(), data.password);
        },

        validate: function (secCode) {
          accountService.verifyPhone(data.phone, secCode).then(function () {
            accountService.login(data.phone, data.password).then(function (data) {
              $ionicPopup.alert({
                title: '注册成功',
                template: '<div style="text-align: center">' + '欢迎：' + data.name + '</div>'
              });
              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              $state.go('tab.mypage');
            });
          })
        }
      });

    }
  });

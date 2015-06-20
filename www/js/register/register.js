FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'js/register/register.html'
    });
  })

  .controller('RegisterController',
  function ($scope, $state, utilService, accountService, $ionicPopup, $ionicHistory, $ionicLoading) {

    var data = $scope.data = {
      name: '',
      phone: undefined,
      password: '',
      passwordRepeat: ''
    };

    $scope.register = function () {
      if (data.name.length < 1) {
        utilService.err('请填写用户名', '注册');
        return;
      }
      if (data.phone.toString().length != 11) {
        utilService.err('手机号码无效', '注册');
        return;
      }
      if (data.password.length < 6) {
        utilService.err('密码长度至少6位', '注册');
        return;
      }

      $ionicLoading.show({
        template: '注册中...'
      });
      accountService.register(data.name, data.phone, data.password).then(function () {
        utilService.toast('注册成功~汪！');
        accountService.login(data.phone, data.password).then(function () {
          $ionicHistory.goBack();
        })
      }).finally(function () {
        $ionicLoading.hide();
      })



    }
  });

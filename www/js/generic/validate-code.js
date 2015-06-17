FduHangoutApp
  .config(function ($stateProvider) {

    $stateProvider.state('validate-code', {
      url: '/validate-code',
      params: {
        title: '',
        subtitle: '',
        actionName: '',
        action: null,
        validate: null,
        isRecoverPassword: false,
        skipAction: false
      },
      templateUrl: 'js/generic/validate-code.html'
    })
  })

  .controller('ValidateCodeController',
  function ($scope, $stateParams, $interval, $state, $ionicPopup, $ionicHistory, accountService) {

    var data = {
      title: $stateParams.title,
      subtitle: $stateParams.subtitle,
      actionName: $stateParams.actionName,

      countdown: 60,
      canResend: false,
      secCode: ''

    };
    $scope.action = $stateParams.action;
    $scope.validate = $stateParams.validate;

    var countdownTask;

    function startCountDown() {
      data.countdown = 60;
      data.canResend = false;
      countdownTask = $interval(function () {
        --data.countdown;
        if (data.countdown == 0) {
          $interval.cancel(countdownTask);
          data.canResend = true;
        }
      }, 1000);
    }

    if (!$stateParams.skipAction) $scope.action();
    startCountDown();

    $scope.data = data;

    $scope.resend = function () {
      if (!data.canResend) {
        return;
      }
      data.canResend = false;
      $scope.action().then(startCountDown);
    };

  });

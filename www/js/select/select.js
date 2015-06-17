FduHangoutApp
  .config(function ($stateProvider) {
    $stateProvider.state('select', {
      url: '/select?data&callback',
      templateUrl: 'js/select/select.html',
      params: {
        param: {}
      }
    })
  })

  .controller('SelectController', function ($scope, $stateParams, $ionicHistory) {
    var param = $scope.data = $stateParams.param;

    $scope.selectItem = function (item) {
      param.callback(item);
    }

  });
FduHangoutApp.service('eventApiService', function (apiService, accountService) {
  angular.extend(this, {

    signupEventSeries: function (id) {
      return apiService.request('signup-event-series', {}, '报名活动', {
        ID: id,
        token: accountService.token
      });
    },
    cancelSignupEventSeries: function (id) {
      return apiService.request('cancel-signup', {}, '临时取消', {
        ID: id,
        token: accountService.token
      });
    }
  })
});
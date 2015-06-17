FduHangoutApp.service('tweetService', function (accountService, apiService) {

  angular.extend(this, {

    getTweets: function (userID, start, count) {
      return apiService.request('get-tweets', {
        userID: userID,
        start: start,
        count: count,
        token: accountService.token
      }, '获取动态').then(function (data) {
        return apiService.extractObjArray(data);
      });
    },

    removeNewTweetNotification: function () {
      return apiService.request('remove-new-tweet-notifications', {
        token: accountService.token
      }, '标记已读新鲜事');
    },

    postTweet: function (content) {
      return apiService.request('post-tweet', {}, '发布新鲜事', {
        content: content,
        token: accountService.token
      });
    }
  });
});
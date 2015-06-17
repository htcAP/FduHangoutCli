/**
 * 本JS专门放跟服务器通信的方法
 */

FduHangoutApp.service('dataService',
  function (apiService, accountService, $http) {

    angular.extend(this, {

      getCarousels: function () {
        return apiService.request('get-carousel', {}, '获取滚动播放图片列表');
      },

      getRecommendation: function () {
        return apiService.request('get-recommendation', {}, '获取推荐活动信息');
      },

      getActivityList: function (data) {
        if (data.mineOnly) {
          data.token = accountService.token;
        }
        return apiService.request('get-event-series-list', data, '获取活动列表').then(function (data) {
          data.eventSeriesList.forEach(function (obj) {
            var edate = new Date(Date.parse(obj.datetime) + (parseFloat(obj.hours) * 3600000));
            obj.enddatetime = edate.getHours() + ":" + edate.getMinutes() + ":" + edate.getSeconds();
          });
          return data.eventSeriesList;
        });
      },

      getEventCategories: function () {
        return apiService.request('get-event-series-categories', {}, '获取活动分类').then(function (data) {
          return data.categories;
        });
      },

      getActivityDetail: function (id) {
        var request;
        if (accountService.loggedIn()) {
          request = apiService.request('get-event-series-detail', {
            token: accountService.token,
            ID: id
          }, '获取活动信息');
        } else {
          request = apiService.request('get-event-series-detail', {
            ID: id
          }, '获取活动信息');
        }
        return request.then(function (data) {
          data.location_lat = parseFloat(data.location_lat);
          data.location_lng = parseFloat(data.location_lng);
          return apiService.parseIntFields(data, ['hours', 'status', 'target_num_volunteers', 'organization_id', 'alreadySignedUp']);
        })
      },

      inviteFriends: function (title, content, ID, friendsId) {
        return apiService.request('invite-friends', {
          token: accountService.token
        }, '邀请好友一起参加', {
          ID: ID,
          title: title,
          friendsId: friendsId
        });
      },
      rateEvent: function (id, rating, comment) {
        return apiService.request('rate-event', {
          token: accountService.token
        }, '评价活动', {
          ID: id,
          rating: rating,
          comment: comment
        });
      },

      getNewsCount: function (categoryID) {
        return apiService.request('get-news-count', {
          categoryID: categoryID
        }, '获取新闻总数');
      },

      getNews: function (start, count, categoryID) {
        return apiService.request('get-news', {
          categoryID: categoryID,
          start: start,
          count: count
        }, '获取新闻列表').then(function (data) {
          return data.news;
        });
      },

      getNewsDetail: function (id) {
        return apiService.request('get-news-detail', {
          ID: id
        }, '获取新闻内容');
      },

      getAppVersion: function (id) {
        return $http.get(apiService.getApiUrl("app-version"), {cache: false});
      }
    });

  });
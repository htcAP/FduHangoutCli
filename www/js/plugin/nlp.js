leyiPlugin.service('nlpPlugin', function (pluginService, $http, $q) {

  this.nlp_get_time = function (arg) {
    return pluginService.invoke('nlp_get_time', arg);
  };

  this.nlp_get_loction = function (raw_test) {
    var defer = $q.defer();

    var parseData = function (data) {
      if (!data) {
        return '';
      }
      var loc_matcher = data.match(/.+\[(.+?)\]LOC.+/i);
      if (loc_matcher) {
        return loc_matcher[1].replace(/[\s在]/g, '');
      } else {
        return "";
      }

    };

    var base = "https://fduhangout.realmofmusic.org/analysis/?";
    //var base = "http://ltpapi.voicecloud.cn/analysis/?";
    var api_key = "73S9E7p2mVGy8InA1vyzADktNjbr2JzBvdEweG1c";
    var pattern = 'srl';
    var text = raw_test;
    var format = "plain";
    var uri = (base
    + "api_key=" + api_key + "&text=" + text
    + "&pattern=" + pattern + "&format=" + format);

    $http.get(uri).success(function (data) {
      console.log(data);
      defer.resolve(parseData(data));
    });

    return defer.promise;
  };


});
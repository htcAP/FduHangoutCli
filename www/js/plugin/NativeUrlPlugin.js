leyiPlugin.service('nativeUrlPlugin', function (pluginService) {

  return {

    showLocation: function (lat, lng, label) {
      return pluginService.invoke('NativeUrl.showLocation', lat, lng, label);
    },

    showQQ: function (qq) {
      return pluginService.invoke('NativeUrl.showQQ', String(qq));
    }

  }

});
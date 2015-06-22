leyiPlugin.service('mapPlugin', function (pluginService) {

  return {

    startLocation: function () {
      return pluginService.invoke('LocationController.startLocation');
    },

    getLatitude: function () {
      return pluginService.invoke('LocationController.getLatitude');
    },

    getLongitude: function () {
      return pluginService.invoke('LocationController.getLongitude');
    },

    mapActivity: function (personArray) {
      return pluginService.invoke('MapActivity', personArray);
    },

    reloadLocation: function (personArray) {
      return pluginService.invoke('reloadLocation', personArray);
    },

    directionIntent: function (start_latitude, start_longitude, end_latitude, end_longitude) {
      return pluginService.invoke('directionIntent', start_latitude, start_longitude, end_latitude, end_longitude);
    }

  }

});
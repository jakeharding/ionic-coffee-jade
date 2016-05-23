(function() {
  var modules;

  modules = ["ionic"];

  angular.module("tgMobile", modules).run(function($ionicPlatform, $http) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        return StatusBar.styleDefault();
      }
    });
    return $http.get('https://tree.taiga.io/conf.json', function(data) {
      return console.log(data);
    });
  });

}).call(this);

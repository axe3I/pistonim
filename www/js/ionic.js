// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ionic-toast','ngStorage','ngCordova','pouchdb', 'ion-autocomplete','app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(['$ionicPlatform','$rootScope','Labels','$state',function($ionicPlatform,$rootScope,Labels, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
	  StatusBar=false;
    }
    
    $rootScope.labels = false;
    
    Labels.getLabels().then(function(labels) {
        $rootScope.labels = labels;
    },function(reponse){
        navigator.notification.alert('Problème connexion internet',function(){navigator.app.exitApp();},'Alert');
        $rootScope.labels = reponse;
    });
    
    $rootScope.hideKeyboard =  function(){
        if(window.cordova.plugins.Keyboard.isVisible){
            window.cordova.plugins.Keyboard.close();
        }
    };
      
    $rootScope.go =  function(state){
        $state.go(state);
    };
    
  });
}]);
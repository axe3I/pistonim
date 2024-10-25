angular.module('app.routes', ['ionic'])

.config(function($stateProvider, $urlRouterProvider,$httpProvider){//,$facebookProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  
  $stateProvider
    
  .state('auth', {
    url: '/auth',
    templateUrl: 'templates/auth.html',
    abstract:true
  })

      .state('auth.sAuthentifier', {
    url: '/login',
    views: {
      'tab2': {
        templateUrl: 'templates/sAuthentifier.html',
        controller: 'sAuthentifierCtrl'
      }
    }
  })

  .state('auth.motDePasseOubli', {
    url: '/password',
    views: {
      'tab2': {
        templateUrl: 'templates/motDePasseOubli.html',
        controller: 'motDePasseOubliCtrl'
      }
    }
  })

  .state('auth.sInscrire', {
    url: '/signup',
    views: {
      'tab3': {
        templateUrl: 'templates/sInscrire.html',
        controller: 'sInscrireCtrl'
      }
    }
  })
  .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/tabs.html',
    abstract:true
  })
  .state('tabs.mesArtisans', {
    url: '/mesartisans',
    views: {
      'tab1': {
        templateUrl: 'templates/mesArtisans.html',
        controller: 'mesArtisansCtrl'
      }
    }
  })
  
  .state('tabs.lesArtisansDeMesAmis', {
    url: '/amisartisans',
    views: {
      'tab2': {
        templateUrl: 'templates/lesArtisansDeMesAmis.html',
        controller: 'lesArtisansDeMesAmisCtrl'
      }
    }
  })
  .state('amis', {
    url: '/amis',
    templateUrl: 'templates/amis.html',
     // controller: 'mesAmisCtrl',
     // controller: 'demandesAmisCtrl',
    abstract:true
  })
  .state('amis.mesAmis', {
    url: '/mesamis',
    views: {
      'tab4': {
        templateUrl: 'templates/mesAmis.html',
        controller: 'mesAmisCtrl'
      }
    }
  })
  
  .state('amis.demandesAmis', {
    url: '/demandesamis',
    views: {
      'tab5': {
        templateUrl: 'templates/demandesamis.html',
        controller: 'demandesAmisCtrl'
      }
    }
  })
  .state('mescontactsamis', {
    url: '/mescontactsamis',
    templateUrl: 'templates/mesContactsAmis.html',
    controller: 'mesContactsAmisCtrl'
  })
  .state('mescontacts', {
    url: '/mescontacts',
    templateUrl: 'templates/mesContacts.html',
    controller: 'mesContactsCtrl'
  })
  .state('updatecompte', {
    url: '/updateCompte',
    templateUrl: 'templates/modifierCompte.html',
    controller: 'updateCompteCtrl'
  })
  
  
  
    .state('afficherartisan', {
    url: '/afficherArtisan',
    templateUrl: 'templates/afficherArtisan.html',
    controller: 'modalUpdateArtisanCtrl'
  })
 
      .state('afficherartisanrech', {
    url: '/afficherArtisanRech',
    templateUrl: 'templates/afficherArtisanRech.html',
    controller: 'afficherArtisanRechCtrl'
  })
      .state('rechercheartisan', {
    url: '/rechercheArtisan',
    templateUrl: 'templates/rechercheArtisan.html',
    controller: 'rechercheArtisanCtrl'
  })
  
    .state('afficherartisanami', {
    url: '/afficherArtisanAmi',
    templateUrl: 'templates/afficherArtisanAmi.html',
    controller: 'afficherArtisanAmiCtrl'
  })
  
      .state('afficherami', {
    url: '/afficherAmi',
    templateUrl: 'templates/afficherAmi.html',
    controller: 'afficherAmiCtrl'
  })
    
      .state('afficherdemandeami', {
    url: '/afficherDemandeAmi',
    templateUrl: 'templates/afficherDemandesAmis.html',
    controller: 'afficherDemandeAmiCtrl'
  })
      .state('ajoutartisan', {
    url: '/ajoutArtisan',
    templateUrl: 'templates/ajoutArtisan.html',
    controller: 'modalAddArtisanCtrl'
  })
  
        .state('ajoutami', {
    url: '/ajoutAmi',
    templateUrl: 'templates/ajoutAmi.html',
    controller: 'modalAddAmiCtrl'
  })
  
  .state('inviterami', {
    url: '/inviterAmi',
    templateUrl: 'templates/inviterAmi.html',
    controller: 'modalInviterAmiCtrl'
  })
  
   /* .state('logoutuser', {
    url: '/logoutUser',
    templateUrl: 'templates/logoutUser.html',
    controller: 'sAuthentifierCtrl'
  })
  */
  
  .state('modifierami', {
    url: '/modifierAmi',
    templateUrl: 'templates/ajoutAmi.html',
    controller: 'modalUpdateAmiCtrl'
  })
  .state('modifierartisan', {
    url: '/modifierArtisan',
    templateUrl: 'templates/modifierArtisan.html',
    controller: 'modalUpdateArtisanCtrl'
  });

  $urlRouterProvider.otherwise('/auth/login');
$httpProvider.interceptors.push('authInterceptor');
})
/*
.factory('authInterceptor', function ($rootScope,$timeout,$localStorage,$location ,$q) {
    return {
      'request' : function (config) {
        if ($localStorage.token) {
            config.headers['Authorization'] = 'Bearer '+$localStorage.token;
        }
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return config;
      },
      'response' : function (response) {

        if (response.status === 401) {
            
            $timeout(function() {
                var url = $location.url();
                if(url.indexOf("/") != url.lastIndexOf("/")){
                    url = url.substring(url.indexOf("/"),url.lastIndexOf("/"));
                }
                if(url !== "/"){
                    $location.path('/');
                    
                }
                
            }, 2000);
        }
        return response || $q.when(response);
      },
      'responseError': function(rejection) {

        if (rejection.status === 401) {
            
            $timeout(function() {
                var url = $location.url();
                if(url.indexOf("/") != url.lastIndexOf("/")){
                    url = url.substring(url.indexOf("/"),url.lastIndexOf("/"));
                }
                if(url !== '/'){
                    $location.path('/');
                    $rootScope.user = null;
                }
            }, 2000);
        }
        return $q.reject(rejection);
      }
    };
})

.config(function ($httpProvider,$facebookProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})
*/
;
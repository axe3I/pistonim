angular.module('app.services', [])

.factory('Auth', ['myConfig','$http','$q','pouchDB','$sessionStorage','$localStorage', function (myConfig,$http,$q,pouchDB,$sessionStorage,$localStorage) {
    var db = new PouchDB('user');
    var user = null;
    var email = '';
    return{
        setEmail : function(Email){
            email = Email;
        },
        getEmail : function(){
            return email;
        },
        setUser : function(aUser,aToken,souvenir_moi){
            user = aUser;
            user.token = aToken;
            $sessionStorage.token = aToken;
            if(souvenir_moi){
                db.get('user').then(function(doc) {
                        user._id = 'user';
                        user._rev = doc._rev;
                        return db.put(user);
                  }).then(function(response) {
                        console.log(response);
                  }).catch(function (err) {
                        console.log(err);
                        user._id = 'user';
                        db.put(user).then(function (response) {
                            console.log(response);
                        }).catch(function (err) {
                            console.log(err);
                        });
                  });
            }else{
                db.get('user').then(function(doc) {
                    return db.remove(doc);
                  }).then(function (result) {
                    console.log(result);
                  }).catch(function (err) {
                    console.log(err);
                  });
                
            }
        },
        isLoggedIn : function(){
            var q = $q.defer();
            if(!user){
                db.get('user').then(function (doc) {
                if(doc && doc.token){
                    user = doc;
                    $sessionStorage.token = doc.token;
                    myConfig.getUrl().then(function(api_url) {
                        var request = $http({
                            method: "post",
                            url: api_url+"users/login.json",
                            data : user,
                            typeData : "json",
                            withCredentials: true,
                        });
                        request.success(function (json) {
                            if(json && json.user){
                                user = json.user;
                                user.token = json.token;
                                $sessionStorage.token = user.token;
                                user._id = 'user';
                                user._rev = doc._rev;
                                db.put(user).then(function (response) {
                                    console.log(response);
                                }).catch(function (err) {
                                    console.log(err);
                                });
                                q.resolve(user);
                            }else{
                                doc.token = null;
                                db.put(doc).then(function (response) {
                                    console.log(response);
                                }).catch(function (err) {
                                    console.log(err);
                                });
                                q.reject(false);
                            }
                        });

                        request.error(function (json, status, headers, config) {
                            doc.token = null;
                            db.put(doc).then(function (response) {
                                console.log(response);
                            }).catch(function (err) {
                                console.log(err);
                            });
                            q.reject(false);
                        });
                    });

                }else{

                    if(doc){
                        user = doc;
                    }

                    if(user && user.token){   
                        q.resolve(user);
                    }else{
                        q.reject(false);
                    }
                }
            
            
            }).catch(function (err) {
                if(user && user.token){   
                    q.resolve(user);
                }else{
                    q.reject(false);
                }
                console.log(err);
            });
            
            }else{
                if(user && user.token){   
                    q.resolve(user);
                }else{
                    q.reject(false);
                }
            }
            return q.promise;
        },
        getUser : function(){
            return user;
        },
        getToken : function(){
            return user.token;
        },
        logoutUser : function(){
            if(user){
                user.token = null;
                db.get('user').then(function(doc) {
                        user._id = 'user';
                        user._rev = doc._rev;
                        return db.put(user);
                  }).then(function(response) {
                        console.log(response);
                  }).catch(function (err) {
                        console.log(err);
                  });
            }
            myConfig.getUrl().then(function(api_url) {
                var request = $http({
                    method: "GET",
                    url: api_url+"users/logout.json",
                    typeData : "json",
                });
            });
            if($localStorage.user){
                email = $localStorage.user.email;
                delete $localStorage.user;
            }
        },
    };
}])

.factory('Globalization', ['$q', function($q) {
  return {
    getLanguage: function() {
        var q = $q.defer();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            navigator.globalization.getPreferredLanguage(
                function (language) {
                    q.resolve(language.value.replace("-", "_"));
                },function () {
                    q.reject('Error getting language\n');
                }
            );
        }

      return q.promise;
    }
  };
}])

.factory('myConfig', ['Globalization','$q', function(Globalization,$q) {
    
    var url = null;
    var domaine = "http://www.pistonim.com/rest/";
    return {
        getUrl : function (){
            var q = $q.defer();
            if(!url){
                Globalization.getLanguage().then(function(response) {
                    
                    var langs = ['fr_FR','en_US','nl_NL'];
                    if($.inArray(response, langs) == -1){
                        url = domaine;
                    }else{
                        url = domaine+response+'/';
                    }
                    q.resolve(url);
                }, function(response) {
                    url = domaine;
                    q.resolve(url);
                });
            }else{
                q.resolve(url); 
            }
            return q.promise;
        },
                getBaseUrl : function (){
            //url = 'http://www.pistonim.com/rest/en_US/';
            return 'http://www.pistonim.com/rest/en_US/';
        },
        getServeur : function (){
            url = domaine;
        }
    };
}])

.factory('Labels' ,['$q','$http','myConfig', function($q,$http,myConfig) {
    
    var labels = null;
    return {
        getLabels : function(){
            var q = $q.defer();
            if(!labels){
                myConfig.getUrl().then(function(api_url) {
                    var request = $http({
                        method: "GET",
                        url: api_url+"users/labels.json",
                        typeData : "json",
                    });
                    request.success(function (json) {
                        if(json && json.labels){
                            labels = json.labels;
                            q.resolve(json.labels);
                        }else{
                            q.reject(false);
                        }
                    });

                    request.error(function (json, status, headers, config) {
                        q.reject(false);
                    });
                });
            }else{
               q.resolve(labels); 
            }
            return q.promise;
        },
    };
}])

.factory('Application',[function() {
    var application = {};
    return {
        getApplication: function () {
            return application;
        },
        setApplication: function(Application) {
            application = Application;
        }
    };
}])

.factory('Artisan',[function() {
    var artisan = {};
    return {
        getArtisan: function () {
         //   console.log(artisan);
            return artisan;
        },
        setArtisan: function(Artisan) {
          //  console.log(Artisan);
            artisan = Artisan;
        }
    };
}])


.factory('Contact',[function() {
    var contact = null;
    return {
        getContact: function () {
         //   console.log(artisan);
            return contact;
        },
        setContact: function(Contact) {
          //  console.log(Artisan);
            contact = Contact;
        }
    };
}])

.factory('Phone',[function() {
    var phone = {};
    return {
        getPhone: function () {
         //   console.log(artisan);
            return phone;
        },
        setPhone: function(Phone) {
          //  console.log(Artisan);
            phone = Phone;
        }
    };
}])

.factory('Ami',[function() {
    var ami = {};
    return {
        getAmi: function () {
           // console.log(ami);
            return ami;
        },
        setAmi: function(Ami) {
           // console.log(Ami);
            ami = Ami;
        }
    };
}])


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

/*.config(function ($httpProvider,$facebookProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})*/
;

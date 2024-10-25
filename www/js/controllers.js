angular.module('app.controllers', [])


        .controller('sAuthentifierCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', '$http', 'Auth', 'myConfig', '$ionicPopup', '$state', '$localStorage', function ($scope, $rootScope, $ionicLoading, ionicToast, $http, Auth, myConfig, $ionicPopup, $state, $localStorage) {
                $rootScope.auth = true;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;
                $scope.user = {};
                $scope.user.rember = true;

                $rootScope.artisan_count = 0;
                $rootScope.amis_count = 0;
                $rootScope.artisanAmis_count = 0;
                $rootScope.demandeAmis_count = 0;

                $scope.init_email = function () {
                    $scope.user.email = Auth.getEmail();
                };
                $scope.validateSignup = false;
                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;
                    if ($localStorage.user && $localStorage.user.rember) {
                        $scope.user = $localStorage.user;
                        login_user();
                    }
                    function login_user() {

                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/token.json',
                            data: $scope.user,
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                Auth.setUser(json.user, json.data.token);
                                if ($scope.user.rember) {
                                    $localStorage.user = $scope.user;
                                }
                                $state.go('tabs.mesArtisans');
                            } else {
                                Auth.logoutUser();
                                if (json) {
                                    if (json.user && json.user.etat_id == 2) {
                                        ionicToast.show(json.message, 'bottom', false, 5000);
                                        $scope.emailcode = json.user.email;
                                        $scope.validateSignup = true;
                                    } else {
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    }
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            Auth.logoutUser();
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });
                    }


                    $scope.login = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        login_user();
                    };

                    $scope.logout = function () {
                        //console.log("logout"); 
                        $ionicPopup.show({
                            title: $scope.labels.EtesVousSur,
                            template: $scope.labels.quitter,
                            buttons: [
                                {text: $scope.labels.Annuler}, {
                                    text: '<b>OK</b>',
                                    type: 'button-energized',
                                    onTap: function () {
                                        Auth.logoutUser();
                                        //console.log($rootScope.user);
                                        if (!$rootScope.user) {
                                            $state.go('auth.sAuthentifier');
                                        } else
                                        {
                                            $rootScope.user = Auth.getUser();
                                            //   $state.go('tabs.mesArtisans');
                                        }

                                    }
                                }
                            ]
                        });
                    };
                    $scope.validateCode = function () {

                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/activate.json',
                            data: {email: $scope.emailcode, code: $scope.user.code},
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.code = '';
                                Auth.setEmail($scope.emailcode);
                                $scope.emailcode = '';
                                ionicToast.show(json.message, 'bottom', false, 5000);
                                $scope.validateSignup = false;
                            } else {
                                if (json) {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });
                    };

                }, function (reponse) {
                    //console.log(reponse);
                });
            }])

        .controller('motDePasseOubliCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', 'filterFilter', '$state', 'Auth', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, filterFilter, $state, Auth) {
                $rootScope.auth = false;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;

                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;
                    $scope.resetPass = false;
                    $scope.user = {};
                    $scope.init_email = function () {
                        $scope.user.resetEmail = Auth.getEmail();
                    };
                    $scope.resetPassword = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/password.json',
                            data: {email: $scope.user.resetEmail},
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.resetPass = true;
                                ionicToast.show(json.message, 'bottom', true, 5000);
                            } else {
                                if (json) {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.changePassword = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/passchange.json',
                            data: {email: $scope.user.resetEmail, code: $scope.user.codePassword, password: $scope.user.passPassword},
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.resetPass = false;
                                ionicToast.show(json.message, 'bottom', true, 5000);
                                $scope.user.codePassword = '';
                                $scope.user.passPassword = '';
                                $scope.user.resetEmail = '';
                                $state.go('auth.sAuthentifier');
                            } else {
                                if (json) {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });
                    };
                });
            }])

        .controller('sInscrireCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', 'filterFilter', '$state', 'Auth', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, filterFilter, $state, Auth) {
                $rootScope.auth = true;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;

                $scope.userSu = {};
                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;

                    $scope.register = function () {

                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });

                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/add.json',
                            data: $scope.userSu,
                            typeData: "json",
                            xhrFields: {withCredentials: true},
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.code = '';
                                $scope.emailcode = json.user.email;
                                ionicToast.show(json.message, 'bottom', true, 5000);
                                $scope.userSu = {};
                                $scope.userSu.countrie_id = $scope.countries[0].id + "";
                                $scope.province_change();
                                $scope.validateSignup = true;
                            } else {
                                if (json) {
                                    if (json.modelError) {
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.modelError[0],
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    }
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });

                    };
                    /* $scope.ajouter = function (type){
                     console.log(type);
                     if(type=="artisan")
                     {
                     $state.go('ajoutartisan'); 
                     }
                     else if (type=="ami")
                     {
                     $state.go('ajoutami');
                     }
                     };*/


                    $scope.validateCode = function () {

                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'users/activate.json',
                            data: {email: $scope.emailcode, code: $scope.userSu.code},
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.code = '';
                                Auth.setEmail($scope.emailcode);
                                $scope.emailcode = '';
                                ionicToast.show(json.message, 'bottom', false, 5000);
                                $scope.validateSignup = false;
                                $scope.userSu = {};
                                $state.go('auth.sAuthentifier');
                            } else {
                                if (json) {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: $scope.labels.alert,
                                        template: $scope.labels.ProblemeDeConnexion,
                                        okType: "button-energized"
                                    });
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {
                            if (json) {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({
                                    title: $scope.labels.alert,
                                    template: $scope.labels.ProblemeDeConnexion,
                                    okType: "button-energized"
                                });
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.pays_int = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });

                        $scope.error = '';
                        $scope.success = '';
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'countries.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.countries = json.countries;
                                if ($scope.countries && $scope.countries.length != 0) {

                                    $scope.countrie_index = 0;
                                    $scope.userSu.countrie_id = $scope.countries[$scope.countrie_index].id + "";

                                    $scope.province_change();
                                }

                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.pays_int();

                    $scope.province_change = function (change) {

                        $scope.error = '';
                        $scope.success = '';


                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'localites.json?countrie_id=' + $scope.userSu.countrie_id,
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.localites = json.localites;
                                if ($scope.localites && $scope.localites.length != 0) {
                                    if (!change) {
                                        $scope.userSu.localite_id = "";
                                        $scope.userSu.province_id = '';
                                        $scope.userSu.localite = "";
                                    }
                                }

                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            $ionicLoading.hide();
                        });
                    };
                });


                $scope.clickedMethod = function (callback) {

                    $scope.userSu.province_id = callback.item.province_id;

                };

                $scope.callbackMethod = function (query, isInitializing) {
                    if (query.length > 3) {
                        return filterFilter($scope.localites, query);
                    } else {
                        return [];
                    }
                };

            }])
        .controller('menu', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Artisan', 'Contact', 'Phone', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Artisan, Contact, Phone) {

                $rootScope.auth = true;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;
                //$rootScope.type = "";
                $scope.error = '';
                $scope.success = '';
                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;


                    $scope.specialite_change = function (x) {
                        $scope.error = '';
                        $scope.success = '';
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                        $rootScope.spe = x;
                        $ionicLoading.hide();
                    }

                    $scope.activite_change = function (x) {
                        //console.log(x);
                        $scope.error = '';
                        $scope.success = '';
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                        $rootScope.act = x;
                        if($rootScope.type=="artisan")
                            url='specialites/count.json?activite_id=' + x;
                        else if($rootScope.type=="artisan_ami")
                            url='specialites/countamis.json?activite_id='+x;
                        else
                            console.log("erreur !");

                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + url,
                            typeData: "json",
                            withCredentials: true,
                        });
                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.specialites = json.specialites;
                                //$rootScope.spe=specialites[0].specialite_id;
                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                        
                        });

                        $ionicLoading.hide();
                    }

                    $scope.filtrer = function (type) {
                        $rootScope.act="";
                        $rootScope.spe="";
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                        if (type=="artisan")
                            url='activites/count.json?groupe_id=1';
                        else if (type=="artisan_ami")
                            url='activites/countamis.json?groupe_id=1';
                        else
                            console.log("erreur !");


                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + url,
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.activites = json.activites;
                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            
                        });
                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            
                        });

                        $scope.data = {}

                        // Custom popup

                        var myPopup = $ionicPopup.show({
                            template: '<form ng-model="activite"> <label class="item item-input item-select"> <div class = "input-label">      {{labels.activite}} </div> <select id="activite_id" name="activite_id" ng-model="activite_id" convert-to-number  ng-change="activite_change(activite_id);"  required><option value="" ng-selected=true>{{labels.Tous}}</option><option ng-repeat="activite in activites" value="{{activite.id}}">{{activite.title}}({{activite.count}})</option>                 </select></label><label class="item item-input item-select"><div class = "input-label">      {{labels.specialite}} :          </div>         <select id="specialite_id" name="specialite_id" ng-model="specialite_id" convert-to-number required ng-change="specialite_change(specialite_id);"><option value="">{{labels.Tous}}</option> <option ng-repeat="specialite in specialites" value="{{specialite.id}}">{{specialite.title}}({{specialite.count}})</option>  </select> </label></form>',
                            title: $scope.labels.filtrerPar,
                            //subTitle: 'donner votre choix :',
                            scope: $scope,
                            buttons: [
                                {text: $scope.labels.Annuler}, {
                                    text: '<b>OK</b>',
                                    type: 'button-energized',
                                    onTap: function () {
                                        //$rootScope.artisan_count=artisans.length;

                                    }
                                }
                            ]
                        });
                        $ionicLoading.hide();
                    }



                    $scope.ajouter = function (type) {

                        // console.log(type);

                        $scope.data = {}

                        // Custom popup
                        if (type == "ami")
                            var myPopup = $ionicPopup.show({
                                template: '<form name="myForm"><label><ion-radio ng-model="data.name" value="nouveau">   {{labels.RechercherAmi}}</ion-radio>  </label><br/>  <label> <ion-radio ng-model="data.name" value="contact">{{labels.DansMesContacts}}</ion-radio>  </label><br/>   </form>',
                                title: $scope.labels.VotreArtisan,
                                //subTitle: 'donner votre choix :',
                                scope: $scope,
                                buttons: [
                                    {text: $scope.labels.Annuler}, {
                                        text: '<b>OK</b>',
                                        type: 'button-energized',
                                        onTap: function (e) {

                                            if ($scope.data.name == "nouveau")
                                            {
                                                $state.go('ajoutami');
                                            } else if ($scope.data.name == "contact")
                                            {
                                                $state.go('mescontactsamis');
                                            }
                                        }
                                    }
                                ]
                            });
                        else
                        {

                            var myPopup = $ionicPopup.show({
                                template: '<form name="myForm"><label><ion-radio ng-model="data.name" value="nouveau">   {{labels.NouvelArtisan}}</ion-radio>  </label><br/>  <label> <ion-radio ng-model="data.name" value="contact">{{labels.DansMesContacts}}</ion-radio>  </label><br/>   </form>',
                                title: $scope.labels.VotreArtisan,
                                //subTitle: 'donner votre choix :',
                                scope: $scope,
                                buttons: [
                                    {text: $scope.labels.Annuler}, {
                                        text: '<b>OK</b>',
                                        type: 'button-energized',
                                        onTap: function (e) {

                                            if ((type == "artisan") && ($scope.data.name == "nouveau"))
                                            {
                                                Phone.setPhone('');
                                                $state.go('ajoutartisan');
                                            } else if ((type == "ami"))//&&($scope.data.name=="nouveau"))
                                            {
                                                $state.go('ajoutami');
                                            } else if ((type == "artisan") && ($scope.data.name == "contact"))
                                            {
                                                $state.go('mescontacts');
                                            }
                                        }
                                    }
                                ]
                            });
                        }
                    };
                });
            }])


        .controller('mesArtisansCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Artisan', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Artisan) {
                $scope.mes_artisans = {};
                $rootScope.act = "";
                $rootScope.spe = "";
                $rootScope.auth = false;
                $rootScope.add = false;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = false;
                $rootScope.type = "artisan";
                $rootScope.mesartisanstitle = $rootScope.labels.mes_artisans + "(0)";
                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;




                    $scope.get_artisans = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'artisans/user.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.artisans = json.artisans;
                                //console.log($scope.artisans);
                                $rootScope.mesartisanstitle = $rootScope.labels.mes_artisans + "(" + $scope.artisans.length + ")";
                                //$scope.application.artisans = json.artisans;

                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            $ionicLoading.hide();
                        });
                    };

                    /* $scope.ajouter = function (){
                     $state.go('ajoutartisan');
                     console.log("ajoutartisan");
                     if(type=="artisan")
                     {
                     $state.go('ajoutartisan'); 
                     }
                     else if (type=="ami")
                     {
                     $state.go('ajoutami');
                     }
                     };*/

                    $scope.afficherArtisan = function (artisan) {

                        Artisan.setArtisan(artisan);
                        $state.go('afficherartisan', {reload: true});
                        //$state.controller('')
                    };

                    $scope.modifierArtisan = function (artisan) {

                        Artisan.setArtisan(artisan);
                        $state.go('modifierartisan', {reload: true});
                        // console.log(artisan);
                        //$state.controller('')
                    };


                    $scope.get_artisans();


                    $scope.supprimer = function (artisan) {

                        $scope.updateSuccess = '';
                        $scope.updateError = '';
                        $ionicPopup.show({
                            title: $scope.labels.EtesVousSur,
                            template: $scope.labels.DeSupprimerArtisan + artisan.prenom + " " + artisan.nom + $scope.labels.DeVotreCarnetAdresse,
                            buttons: [
                                {text: $scope.labels.Annuler}, {
                                    text: '<b>OK</b>',
                                    type: 'button-energized',
                                    onTap: function () {
                                        var request = $http({
                                            method: "POST",
                                            url: $scope.url_rest + 'artisans/delete.json',
                                            data: artisan, //$scope.artisanUpdate,
                                            typeData: "json",
                                            xhrFields: {withCredentials: true},
                                        });
                                        request.success(function (json) {
                                            if (!json.success) {
                                                //console.log(json);
                                                $ionicPopup.alert({
                                                    title: "Erreur!",
                                                    teplate: json.message,
                                                    okType: "button-energized"
                                                });
                                            } else {
                                                $ionicPopup.alert({
                                                    title: $scope.labels.Succes,
                                                    template: $scope.labels.ArtisanSupprime,
                                                    okType: "button-energized"}
                                                );
                                                artisan = {};
                                                $scope.updateSuccess = json.message;
                                                //$rootScope.artisan_count--;
                                                $scope.get_artisans();
                                                $state.go($state.current, {reload: true, inherit: false});

                                                //$uibModalInstance.close($scope.artisanUpdate);
                                            }
                                        });

                                        request.error(function (json, status, headers, config) {
                                            //console.log(json);
                                            $ionicPopup.alert({
                                                title: "Erreur!",
                                                teplate: json.message,
                                                okType: "button-energized"
                                            });
                                        });

                                    }
                                    //}
                                    //}
                                }
                            ]
                        });



                    };
                });
            }])


        .controller('mesAmisCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Ami', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Ami) {
                $rootScope.auth = false;
                $rootScope.add = false;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;
                $rootScope.type = "ami";

                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;



                    $scope.get_amis = function () {
                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'amis/amis.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.amis = json.amis;
                                $rootScope.amis_count = $scope.amis.length;
                                //console.log($scope.amis);
                                //$scope.all.count = $scope.artisans.length;
                                //$scope.application.artisans = json.artisans;

                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.ajouter = function (type) {
                        // $state.go('ajoutami');
                        //console.log(type);
                        if (type == "artisan")
                        {
                            ajouter(type);
                            $state.go('ajoutartisan');
                        } else if (type == "ami")
                        {
                            $state.go('ajoutami');
                        }
                    };


                    $scope.afficherAmi = function (ami) {

                        Ami.setAmi(ami);
                        $state.go('afficherami', {reload: true});
                        //$state.controller('')
                    };


                    $scope.get_amis();



                    $scope.supprimer = function (ami) {

                        $scope.updateSuccess = '';
                        $scope.updateError = '';

                        $ionicPopup.show({
                            title: $scope.labels.EtesVousSur,
                            template: $scope.labels.DeSupprimerAmi + ami.useramis.title + "\n " + $scope.labels.DeVotreListeAmis,
                            buttons: [
                                {text: $scope.labels.Annuler}, {
                                    text: '<b>OK</b>',
                                    type: 'button-energized',
                                    onTap: function () {
                                        var request = $http({
                                            method: "POST",
                                            url: $scope.url_rest + 'amis/delete.json',
                                            data: {id: ami.id},
                                            typeData: "json",
                                            xhrFields: {withCredentials: true},
                                        });
                                        request.success(function (json) {
                                            if (!json.success) {
                                                //console.log(json);

                                                $ionicPopup.alert({
                                                    title: "Erreur!",
                                                    teplate: json.message,
                                                    okType: "button-energized"}
                                                );
                                            } else {
                                                //$uibModalInstance.close(json.ami);
                                                $ionicPopup.alert({
                                                    title: $scope.labels.Succes,
                                                    template: $scope.labels.AmiSupprime,
                                                    okType: "button-energized"}
                                                );
                                                ami = {};
                                                $scope.updateSuccess = json.message;
                                                $rootScope.ami_count--;
                                                $scope.get_amis();
                                                $state.go("amis.mesAmis", {reload: true, inherit: false});

                                            }
                                        });

                                        request.error(function (json, status, headers, config) {
                                            //console.log(json);
                                            //SweetAlert.swal("Erreur!", json.message, "error");   
                                            $ionicPopup.alert({
                                                title: "Erreur!",
                                                teplate: json.message,
                                                okType: "button-energized"
                                            });
                                        });



                                    }
                                }
                            ]
                        });


                    };

                });
            }])

        .controller('demandesAmisCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Ami', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Ami) {
                $rootScope.auth = false;
                $rootScope.add = false;
                $rootScope.udate = true;
                $rootScope.del = true;
                $rootScope.filtre = true;


                myConfig.getUrl().then(function (api_url) {
                    $scope.url_rest = api_url;

                    $scope.tab = 'tab1';
                    $scope.searchAmi = '';
                    $scope.searchActive = false;
                    $scope.searchUsers = [];
                    $scope.liste_amis = [];
                    $scope.liste_demandes = [];


                    $scope.afficherAmi = function (ami) {

                        Ami.setAmi(ami);
                        $state.go('afficherdemandeami', {reload: true});
                        //$state.controller('')
                    };

                    $scope.get_amis = function () {

                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'amis/amis.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.liste_amis = json.amis;
                                $scope.liste_demandes = json.demandes;
                                $rootScope.demandesAmis_count = $scope.liste_demandes.length;
                            } else {
                                if (json) {
                                    $scope.error = json.message;
                                } else {
                                    $scope.error = $scope.labels.ProblemeDeConnexion;
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $scope.error = json.message;
                            } else {
                                $scope.error = $scope.labels.ProblemeDeConnexion;
                            }
                            $ionicLoading.hide();
                        });
                    };
                    $scope.get_amis();


//ami=Ami.getAmi();
                    /*if(!ami.useramis){
                     ami.useramis = ami.user;
                     }
                     $scope.ami = angular.copy(ami);
                     */
                    $scope.supprimer = function (ami) {
                        //console.log(ami);
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'amis/delete.json',
                            data: {id: ami.id},
                            typeData: "json",
                            xhrFields: {withCredentials: true},
                        });
                        request.success(function (json) {
                            if (!json.success) {
                                $ionicPopup.alert({title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                $ionicPopup.alert({title: $scope.labels.Succes,
                                    template: $scope.labels.DemandeAmitieDe + ami.user.nom + " " + ami.user.prenom + $scope.labels.Supprime,
                                    okType: "button-energized"
                                });
                                $scope.get_amis();
                                $state.go("amis.demandesAmis");
                                //$uibModalInstance.close(json.ami);
                            }
                        });

                        request.error(function (json, status, headers, config) {
                            $ionicPopup.alert({title: $scope.labels.alert,
                                template: json.message,
                                okType: "button-energized"
                            });
                        });
                    };
                    $scope.ajouter = function (ami) {
                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'amis/update.json',
                            data: {id: ami.id},
                            typeData: "json",
                            xhrFields: {withCredentials: true},
                        });
                        request.success(function (json) {
                            if (!json.success) {
                                $ionicPopup.alert({title: $scope.labels.alert,
                                    template: json.message,
                                    okType: "button-energized"
                                });
                            } else {
                                //$uibModalInstance.close(json.ami);
                                $ionicPopup.alert({title: $scope.labels.Succes,
                                    template: $scope.labels.DemandeAmitieDe + ami.user.nom + " " + ami.user.prenom + $scope.labels.acceptee,
                                    okType: "button-energized"
                                });
                                $state.go("amis.mesAmis");
                            }
                        });

                        request.error(function (json, status, headers, config) {
                            $ionicPopup.alert({title: $scope.labels.alert,
                                template: json.message,
                                okType: "button-energized"
                            });
                        });
                    };




                });
            }])


        .controller('rechercheArtisanCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Artisan', 'Application', 'Artisan', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Artisan, Application, Artisan) {

                $rootScope.auth = false;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
            $rootScope.filtre = true;
                


                myConfig.getUrl().then(function (api_url) {


                    $rootScope.error = '';
                    $rootScope.success = '';

                    $scope.application = (Application.getApplication() ? Application.getApplication() : {});

                    $scope.telephones = ($scope.application.telephones ? $scope.application.telephones : []);
                    $scope.application.page = (($scope.application.page === false || $scope.application.page !== 0) ? $scope.application.page : 0);
                    $scope.search = {};
                    $scope.spinnerNext = false;
                    $scope.activites = ($scope.application.activites_rechercher ? $scope.application.activites_rechercher : []);
                    $scope.localites = ($scope.application.localites_rechercher ? $scope.application.localites_rechercher : []);
                    $scope.search.activite_id = ($scope.application.activite_id ? $scope.application.activite_id : '');
                    $scope.search.localite_id = ($scope.application.localite_id ? $scope.application.localite_id : '');
                    $scope.localite = ($scope.application.localite ? $scope.application.localite : '');

                    $scope.int_activites = function () {

                        $scope.error = '';
                        $scope.success = '';
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'activites.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.activites = json.activites;
                                $scope.application.activites_rechercher = $scope.activites;
                                Application.setApplication($scope.application);

                            } else {
                                if (json) {
                                    $scope.error = json.message;
                                } else {
                                    $scope.error = $scope.labels.ProblemeDeConnexion;
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $scope.error = json.message;
                            } else {
                                $scope.error = $scope.labels.ProblemeDeConnexion;
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.int_activites();

                    $scope.next = function () {
                        if ($scope.application.page !== false && !$scope.spinnerNext) {
                            $scope.spinnerNext = true;
                            $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                            var request = $http({
                                method: "GET",
                                url: $scope.url_rest + 'telephones.json?page=' + ($scope.application.page + 1) + '&activite_id=' + $scope.search.activite_id + '&localite_id=' + $scope.search.localite_id,
                                typeData: "json",
                                withCredentials: true,
                            });

                            request.success(function (json) {
                                if (json) {
                                    $scope.telephones = $scope.telephones.concat(json.telephones);
                                    $scope.application.telephones = $scope.telephones;
                                    if (json.params.nextPage) {
                                        $scope.application.page = json.params.page;
                                    } else {
                                        $scope.application.page = false;
                                    }

                                    Application.setApplication($scope.application);
                                } else {
                                    $scope.error = $scope.labels.ProblemeDeConnexion;
                                }
                                $scope.spinnerNext = false;
                                $ionicLoading.hide();
                            });


                            request.error(function (json, status, headers, config) {
                                if (json) {
                                    $scope.error = json.message;
                                } else {
                                    $scope.error = $scope.labels.ProblemeDeConnexion;
                                }
                                $scope.spinnerNext = false;
                                $ionicLoading.hide();
                            });
                        }
                    };

                    if ($scope.activites.length === 0) {
                        $scope.next();
                    }

                    if ($scope.telephones.length === 0) {
                        $scope.next();
                    }

                    $scope.submitSearch = function () {

                        $scope.application.activite_id = $scope.search.activite_id;
                        $scope.application.localite_id = $scope.search.localite_id;
                        $scope.application.localite = $scope.localite;
                        Application.setApplication($scope.application);
                        //console.log($scope.telephones);
                        $scope.telephones = [];
                        $scope.application.page = 0;
                        $scope.next();

                    };

                    $scope.get_localites = function () {

                        $scope.error = '';
                        $scope.success = '';
                        $scope.spinner_localites = true;

                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'localites.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.localites = json.localites;
                                $scope.application.localites_rechercher = $scope.localites;
                                Application.setApplication($scope.application);
                            } else {
                                if (json) {
                                    $scope.error = json.message;
                                } else {
                                    $scope.error = $scope.labels.ProblemeDeConnexion;
                                }
                            }
                            $scope.spinner_localites = false;
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $scope.error = json.message;
                            } else {
                                $scope.error = $scope.labels.ProblemeDeConnexion;
                            }
                            $scope.spinner_localites = false;
                        });
                    };
                    if ($scope.localites.length === 0) {
                        $scope.get_localites();
                    }
                    $scope.required_code_postal = function () {
                        if (typeof $scope.localite === "object") {
                            $scope.search.localite_id = $scope.localite.id;
                        } else {
                            $scope.search.localite_id = '';
                        }
                        return false;
                    };

                    $scope.get_localites();


                    $scope.clickedMethod = function (callback) {

                        $scope.application.province_id = callback.item.province_id;

                    };

                    $scope.callbackMethod = function (query, isInitializing) {
                        if (query.length > 3) {
                            return filterFilter($scope.localites, query);
                        } else {
                            return [];
                        }
                    };

                    $scope.afficherArtisan = function (artisan) {

                        Artisan.setArtisan(artisan);
                        $state.go('afficherartisanrech', {reload: true});
                        //$state.controller('')
                    };


                });
            }])

        .controller('lesArtisansDeMesAmisCtrl', ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', 'Artisan', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, Artisan) {

                $rootScope.auth = false;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = false;
                $rootScope.type="artisan_ami"
                $rootScope.lesArtisansDeMesAmisTitle = $rootScope.labels.artisans_mes_amis + "(0)";
                myConfig.getUrl().then(function (api_url) {

                    $scope.get_artisans_amis = function () {

                        $ionicLoading.show({
                            template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'
                        });
                        var request = $http({
                            method: "GET",
                            url: $scope.url_rest + 'artisans/amis.json',
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $scope.artisans = json.artisans;
                                $rootScope.lesArtisansDeMesAmisTitle = $rootScope.labels.artisans_mes_amis + "(" + $scope.artisans.length + ")";
                            } else {
                                if (json) {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                } else {
                                    $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                            } else {
                                $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                            }
                            $ionicLoading.hide();
                        });
                    };

                    $scope.get_artisans_amis();

                    $scope.afficherArtisan = function (artisan) {

                        Artisan.setArtisan(artisan);
                        $state.go('afficherartisanami', {reload: true});
                        //$state.controller('')
                    };

                    $scope.submitArtisan = function (artisan) {

                        $scope.error = '';
                        $scope.success = '';
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                        var request = $http({
                            method: "POST",
                            url: $scope.url_rest + 'telephones/ajouterartisan.json',
                            data: {id: (artisan.telephone_id ? artisan.telephone_id : artisan.id)},
                            typeData: "json",
                            withCredentials: true,
                        });

                        request.success(function (json) {
                            if (json && json.success) {
                                $ionicPopup.alert({
                                    title: "Success !",
                                    teplate: json.message,
                                    okType: "button-energized"}
                                );
                                $state.go("tabs.mesArtisans");
                                //$uibModalInstance.close();
                            } else {
                                if (json.existe) {
                                    $ionicPopup.alert({
                                        title: "Existe déja!",
                                        teplate: json.message,
                                        okType: "button-energized"}
                                    );

                                } else if (json) {
                                    $ionicPopup.alert({
                                        title: "Erreur!",
                                        teplate: json.message,
                                        okType: "button-energized"}
                                    );
                                } else {
                                    $ionicPopup.alert({
                                        title: "Erreur!",
                                        teplate: "Problème de connexion !",
                                        okType: "button-energized"}
                                    );
                                }
                            }
                            $ionicLoading.hide();
                        });

                        request.error(function (json, status, headers, config) {

                            if (json) {
                                $ionicPopup.alert({
                                    title: "Erreur!",
                                    teplate: json.message,
                                    okType: "button-energized"}
                                );
                            } else {
                                $ionicPopup.alert({
                                    title: "Erreur!",
                                    teplate: "Problème de connexion",
                                    okType: "button-energized"}
                                );
                            }
                            $ionicLoading.hide();
                        });
                    };


                });
            }])



        .controller('mesContactsCtrl', ['$scope', '$rootScope', '$cordovaContacts', '$ionicLoading', '$ionicPlatform', '$ionicPopup', '$state', 'Artisan', '$http', 'Contact', 'Phone', function ($scope, $rootScope, $cordovaContacts, $ionicLoading, $ionicPlatform, $ionicPopup, $state, Artisan, $http, Contact, Phone) {
                $rootScope.auth = false;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;
                // $rootScope.type="contact";   



                //console.log($rootScope.mesContacts);

                if ($rootScope.mesContacts == undefined) {
                    $scope.getAllContacts = function () {
                        $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});



                        var opts = {};
                        $cordovaContacts.find(opts).then(function (allContacts) {
                            //omitting parameter to .find() causes all contacts to be returned
                            $scope.contacts = allContacts;
                            //console.log($scope.contacts);
                            localStorage.setItem("contacts", JSON.stringify($scope.contacts));
                            $rootScope.mesContacts = JSON.parse(localStorage.getItem("contacts"));

                            $ionicLoading.hide();

                        });

                    }

                    //console.log($rootScope.mesContacts);


                }
                ;

                $scope.ajoutArtisan = function (contact, phone) {
                    Contact.setContact(contact);
                    Phone.setPhone(phone);
                    //$state.go('modifierartisan', {reload: true});
                    if ($rootScope.type == "artisan")
                        $state.go('ajoutartisan', {reload: true});
                    //else if ($rootScope.type=="ami")
                    //$state.go('ajoutami', {reload: true});


                    //   $state.go("amis.mesAmis" , {reload: true, inherit: false});

                }


            }])

        .controller('mesContactsAmisCtrl', ['$scope', '$rootScope', '$cordovaContacts', '$ionicLoading', '$ionicPlatform', '$ionicPopup', '$state', 'Artisan', '$http', 'Contact', 'Phone', 'myConfig', function ($scope, $rootScope, $cordovaContacts, $ionicLoading, $ionicPlatform, $ionicPopup, $state, Artisan, $http, Contact, Phone, myConfig) {
                $rootScope.auth = false;
                $rootScope.add = true;
                $rootScope.update = true;
                $rootScope.del = true;
                $rootScope.filtre = true;
                // $rootScope.type="contact";   



                //console.log($rootScope.mesContacts);


                $scope.getAllContacts = function () {
                    $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.recuperation_des_contacts + '...</p>'});


                    var opts = new ContactFindOptions();
                    opts.filter = "";
                    opts.multiple = true;
                    opts.desiredFields = [navigator.contacts.fieldType.emails, navigator.contacts.fieldType.phoneNumbers];

                    $cordovaContacts.find(opts).then(function (allContacts) {
                        //console.log(allContacts);
                        //$scope.contacts = allContacts;
                        $ionicLoading.hide();

                        myConfig.getUrl().then(function (api_url) {
                            $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.envoi_des_contacts + '...</p>'});
                            $scope.searchUsers = [];
                            var request = $http({
                                method: "POST",
                                url: $scope.url_rest + 'amis/contacts.json',
                                data: {contacts: allContacts},
                                typeData: "json",
                                withCredentials: true,
                            });

                            request.success(function (json) {
                                if (json && json.success) {
                                    $scope.searchUsers = json.amis;
                                } else {
                                    if (json) {
                                        $ionicPopup.alert({
                                            title: "Erreur!",
                                            teplate: json.message,
                                            okType: "button-energized"}
                                        );
                                    } else {
                                        $ionicPopup.alert({
                                            title: "Erreur!",
                                            teplate: "Problème de connexion !",
                                            okType: "button-energized"}
                                        );
                                    }
                                }
                                $ionicLoading.hide();
                            });

                            request.error(function (json, status, headers, config) {

                                if (json) {
                                    $ionicPopup.alert({
                                        title: "Erreur!",
                                        teplate: json.message,
                                        okType: "button-energized"}
                                    );
                                } else {
                                    $ionicPopup.alert({
                                        title: "Erreur!",
                                        teplate: "Problème de connexion",
                                        okType: "button-energized"}
                                    );
                                }
                                $ionicLoading.hide();
                            });
                        });

                    });

                }

                $scope.getAllContacts();

                $scope.add_ami = function (user, index) {

                    $ionicPopup.show({
                        title: $scope.labels.EtesVousSur,
                        template: $scope.labels.EnvoyerDemandeAmi + user.title + "\".",
                        buttons: [
                            {text: $scope.labels.Annuler}, {
                                text: '<b>OK</b>',
                                type: 'button-energized',
                                onTap: function () {
                                    var request = $http({
                                        method: "POST",
                                        url: $scope.url_rest + 'amis/add.json',
                                        data: user,
                                        typeData: "json",
                                        xhrFields: {withCredentials: true},
                                    });
                                    request.success(function (json) {
                                        if (!json.success) {
                                            //console.log(json);
                                            $ionicPopup.alert({
                                                title: "Erreur",
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            $scope.searchUsers.splice(index, 1);
                                            $ionicPopup.alert({
                                                title: $scope.labels.mes_amis,
                                                template: $scope.labels.DemandeEnovoyee,
                                                okType: "button-energized"
                                            });
                                        }
                                    });

                                    request.error(function (json, status, headers, config) {
                                        //console.log(json);
                                        $ionicPopup.alert({
                                            title: "Erreur",
                                            template: "Problème de connection",
                                            okType: "button-energized"
                                        });
                                    });

                                }
                            }
                        ]
                    });
                };


            }])


        .controller('afficherAmiCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Ami', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScope, Ami)

                    {

                        $rootScope.auth = false;
                        $rootScope.update = false;
                        $rootScope.del = false;
                        $rootScope.add = true;
                        $rootScope.type = "ami";
                        $rootScope.filtre = true;

                        myConfig.getUrl().then(function (api_url) {
                            $scope.amiUpdate = Ami.getAmi();
                            $scope.amiShow = Ami.getAmi();
                            //     console.log($scope.amiShow);

                            $scope.Supprimer = function () {
                                //console.log("suppr");
                                $scope.updateSuccess = '';
                                $scope.updateError = '';

                                $ionicPopup.show({
                                    title: $scope.labels.EtesVousSur,
                                    template: $scope.labels.DeSupprimerAmi + $scope.amiUpdate.useramis.title + "\n " + $scope.labels.DeVotreListeAmis,
                                    buttons: [
                                        {text: $scope.labels.Annuler}, {
                                            text: '<b>OK</b>',
                                            type: 'button-energized',
                                            onTap: function () {
                                                var request = $http({
                                                    method: "POST",
                                                    url: $scope.url_rest + 'amis/delete.json',
                                                    data: {id: $scope.amiUpdate.id},
                                                    typeData: "json",
                                                    xhrFields: {withCredentials: true},
                                                });
                                                request.success(function (json) {
                                                    if (!json.success) {
                                                        //console.log(json);

                                                        $ionicPopup.alert({
                                                            title: "Erreur",
                                                            teplate: json.message,
                                                            okType: "button-energized"}
                                                        );
                                                    } else {
                                                        //$uibModalInstance.close(json.ami);
                                                        $ionicPopup.alert({
                                                            title: $scope.labels.Succes,
                                                            template: $scope.labels.AmiSupprime,
                                                            okType: "button-energized"}
                                                        );
                                                        ami = {};
                                                        $scope.updateSuccess = json.message;
                                                        $rootScope.ami_count--;
                                                        //$scope.get_artisans();
                                                        $state.go("amis.mesAmis", {reload: true, inherit: false});

                                                    }
                                                });

                                                request.error(function (json, status, headers, config) {
                                                    //console.log(json);
                                                    //SweetAlert.swal("Erreur!", json.message, "error");   
                                                    $ionicPopup.alert({
                                                        title: "Erreur!",
                                                        teplate: json.message,
                                                        okType: "button-energized"
                                                    });
                                                });



                                            }
                                        }
                                    ]
                                });


                            };
                        });
                    }])



 
        .controller('afficherArtisanAmiCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan','Ami', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan,Ami)

                    {

                        $rootScope.auth = false;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.add = true;
                        $rootScope.type = "ami";
                        $rootScope.filtre = true;

                        myConfig.getUrl().then(function (api_url) {
                            $scope.artisanUpdate = Artisan.getArtisan();
                            $scope.artisanShow = Artisan.getArtisan();
                            //     console.log($scope.amiShow);

                 $scope.afficherAmi = function (ami) {

                        Ami.setAmi(ami);
                        $state.go('afficherami', {reload: true});
                        //$state.controller('')
                    };
                            $scope.submitArtisan = function () {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'telephones/ajouterartisan.json',
                                    data: {id: ($scope.artisanShow.telephone_id ? $scope.artisanShow.telephone_id : $scope.artisanShow.id)},
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $ionicPopup.alert({
                                            title: "Success !",
                                            teplate: json.message,
                                            okType: "button-energized"}
                                        );
                                        $state.go("tabs.mesArtisans");
                                        //$uibModalInstance.close();
                                    } else {
                                        if (json.existe) {
                                            $ionicPopup.alert({
                                                title: "Existe déja!",
                                                teplate: json.message,
                                                okType: "button-energized"}
                                            );

                                        } else if (json) {
                                            $ionicPopup.alert({
                                                title: "Erreur!",
                                                teplate: json.message,
                                                okType: "button-energized"}
                                            );
                                        } else {
                                            $ionicPopup.alert({
                                                title: "Erreur!",
                                                teplate: "Problème de connexion !",
                                                okType: "button-energized"}
                                            );
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({
                                            title: "Erreur!",
                                            teplate: json.message,
                                            okType: "button-energized"}
                                        );
                                    } else {
                                        $ionicPopup.alert({
                                            title: "Erreur!",
                                            teplate: "Problème de connexion",
                                            okType: "button-energized"}
                                        );
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.clickedMethod = function (callback) {

                                $scope.localites.province_id = callback.item.province_id;

                            };

                            $scope.callbackMethod = function (query, isInitializing) {
                                $scope.callbackMethod = function (query, isInitializing) {
                                    if (query.length > 3) {
                                        return filterFilter($scope.localites, query);
                                    } else {
                                        return [];
                                    }
                                };
                            };

                        
                        
                         $scope.liste_amis = [];
                            $scope.getAmis = function () {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'amis/listeamis.json?telephone_id=' + $scope.artisanShow.telephone_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.liste_amis = json.amis;
                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    
                                });
                                $ionicLoading.hide();
                            };

                            $scope.getAmis();
                    });
                    }])


        .controller('afficherDemandeAmiCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Ami', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Ami)

                    {

                        $rootScope.auth = false;
                        $rootScope.update = false;
                        $rootScope.del = false;
                        $rootScope.add = true;
                        $rootScope.type = "demandeAmi";
                        $rootScope.filtre = true;

                        myConfig.getUrl().then(function (api_url) {
                            $scope.amiUpdate = Ami.getAmi();
                            $scope.amiShow = Ami.getAmi();
                            //console.log($scope.amiUpdate);


                            $scope.supprimer = function () {
                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'amis/delete.json',
                                    data: {id: $scope.amiUpdate.id},
                                    typeData: "json",
                                    xhrFields: {withCredentials: true},
                                });
                                request.success(function (json) {
                                    if (!json.success) {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.Succes,
                                            template: $scope.labels.DemandeAmitieDe + $scope.amiUpdate.user.nom + " " + $scope.amiUpdate.user.prenom + $scope.labels.Supprime,
                                            okType: "button-energized"
                                        });
                                        //$scope.get_amis();
                                        $state.go("amis.demandesAmis");
                                        //$uibModalInstance.close(json.ami);
                                    }
                                });

                                request.error(function (json, status, headers, config) {
                                    $ionicPopup.alert({title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                });
                            };
                            $scope.ajouter = function () {
                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'amis/update.json',
                                    data: {id: $scope.amiUpdate.id},
                                    typeData: "json",
                                    xhrFields: {withCredentials: true},
                                });
                                request.success(function (json) {
                                    if (!json.success) {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        //$uibModalInstance.close(json.ami);
                                        $ionicPopup.alert({title: $scope.labels.Succes,
                                            template: $scope.labels.DemandeAmitieDe + $scope.amiUpdate.user.nom + " " + $scope.amiUpdate.user.prenom + $scope.labels.acceptee,
                                            okType: "button-energized"
                                        });
                                        $state.go("amis.mesAmis");
                                    }
                                });

                                request.error(function (json, status, headers, config) {
                                    $ionicPopup.alert({title: $scope.labels.alert,
                                        template: json.message,
                                        okType: "button-energized"
                                    });
                                });
                            };



                        });
                    }])


        .controller('afficherArtisanRechCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover)

                    {
                        $rootScope.auth = false;
                        $rootScope.add = true;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.filtre = true;


                        myConfig.getUrl().then(function (api_url) {

                            $scope.artisanShow = Artisan.getArtisan();


                        })

                    }])

        .controller('updateCompteCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover)

                    {

                        $rootScope.auth = false;
                        $rootScope.add = true;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.filtre = true;
                        $rootScope.type = "artisan";

                        myConfig.getUrl().then(function (api_url) {



                            $scope.userUp = angular.copy(Auth.getUser());
                            //console.log($scope.userUp);
                            $scope.userUp.countrie_id = $scope.userUp.countrie_id + "";
                            $scope.userUp.province_id = $scope.userUp.province_id + "";

                            $scope.updateSuccess = '';
                            $scope.updateError = '';
                            $scope.validateUpdate = false;
                            $scope.save = function () {

                                $scope.updateSuccess = '';
                                $scope.updateError = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'users/update.json',
                                    data: $scope.userUp,
                                    typeData: "json",
                                    xhrFields: {withCredentials: true},
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        json.user.codepostal = parseInt(json.user.codepostal);
                                        if (json.validate) {
                                            $scope.updateEmail = json.user.new_email;
                                            $scope.updateCode = '';
                                            $scope.validateUpdate = true;
                                            $scope.vSuccess = json.message;
                                            $scope.vError = '';
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            Auth.setUser(json.user);
                                            $rootScope.user = angular.copy(Auth.getUser());
                                            $scope.userUp = json.user;
                                            $scope.userUp.countrie_id = $scope.userUp.countrie_id + "";
                                            $scope.userUp.province_id = $scope.userUp.province_id + "";
                                            $scope.updateError = '';
                                            $scope.updateSuccess = json.message;
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        }
                                    } else {
                                        if (json) {
                                            if (json.modelError && json.modelError.length !== 0) {
                                                $scope.updateError = json.modelError[0];
                                                $ionicPopup.alert({title: $scope.labels.alert, template: json.modelError[0], okType: "button-energized"});
                                            } else {
                                                $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});

                                            }
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: "Problème de connexion", okType: "button-energized"});

                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {
                                    if (json) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});

                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: "Problème de connexion", okType: "button-energized"});

                                    }
                                    $ionicLoading.hide();
                                });

                            };

                            $scope.saveCode = function () {
                                $scope.vSuccess = '';
                                $scope.vError = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'users/updatecode.json',
                                    data: {email: $scope.updateEmail, code: $scope.updateCode},
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                //console.log($scope.updateCode);

                                request.success(function (json) {
                                    if (json && json.success) {
                                        Auth.setUser(json.user);
                                        $rootScope.user = angular.copy(Auth.getUser());
                                        $scope.updateCode = '';
                                        $scope.updateEmail = '';
                                        $scope.updateError = '';
                                        $scope.updateSuccess = json.message;
                                        $scope.validateUpdate = false;
                                    } else {
                                        if (json) {
                                            $scope.vError = json.message;
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });

                                        } else {
                                            $scope.vError = $scope.labels.ProblemeDeConnexion;
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: "Problème de connexion",
                                                okType: "button-energized"
                                            });

                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {
                                    if (json) {
                                        $scope.vError = json.message;
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });

                                    } else {
                                        $scope.vError = $scope.labels.ProblemeDeConnexion;
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: "Problème de connexion",
                                            okType: "button-energized"
                                        });

                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.pays_int = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'countries.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.countries = json.countries;

                                        if ($scope.countries && $scope.countries.length != 0) {
                                            if (!change) {
                                                $scope.countrie_index = 0;
                                                $scope.userUp.countrie_id = $scope.countries[$scope.countrie_index].id + "";
                                            }
                                            $scope.province_change(change);
                                        }

                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.pays_int(true);


                            $scope.clickedMethod = function (callback) {

                                $scope.userUp.province_id = callback.item.province_id;
                                $scope.userUp.localite_id = callback.item.id;
                            };

                            $scope.callbackMethod = function (query, isInitializing) {
                                $scope.callbackMethod = function (query, isInitializing) {
                                    if (query.length > 3) {
                                        return filterFilter($scope.localites, query);
                                    } else {
                                        return [];
                                    }
                                };
                            };

                            $scope.pays_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'provinces.json?countrie_id=' + $scope.userUp.countrie_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.provinces = json.provinces;
                                        if ($scope.provinces && $scope.provinces.length != 0) {
                                            if (!change)
                                                $scope.userUp.province_id = $scope.provinces[0].id + "";
                                            $scope.province_change(change);
                                        }

                                    } else {
                                        if (json) {
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: "Problème de connexion",
                                                okType: "button-energized"
                                            });

                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: "Problème de connexion",
                                            okType: "button-energized"
                                        });
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.province_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'localites.json?countrie_id=' + $scope.userUp.countrie_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.localites = json.localites;
                                        if ($scope.localites && $scope.localites.length != 0) {
                                            if (!change) {
                                                $scope.userUp.localite_id = "";
                                                $scope.userUp.province_id = '';
                                                $scope.userUp.localite = "";
                                            }
                                        }

                                    } else {
                                        if (json) {
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert,
                                                template: "Problème de connexion",
                                                okType: "button-energized"
                                            });
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert,
                                            template: "Problème de connexion",
                                            okType: "button-energized"
                                        });
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.required_code_postal = function () {
                                if (typeof $scope.userUp.localite === "object") {
                                    $scope.userUp.localite_id = $scope.userUp.localite.id;
                                    $scope.userUp.province_id = $scope.userUp.localite.province_id;
                                } else {
                                    $scope.userUp.localite_id = '';
                                    $scope.userUp.province_id = '';
                                }
                                return typeof $scope.userUp.localite !== "object";
                            };

                        })


                    }])

        .controller('modalUpdateArtisanCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover)

                    {


                        $rootScope.auth = false;
                        $rootScope.update = false;
                        $rootScope.del = false;
                        $rootScope.add = true;
                        $rootScope.type = "artisan";
                        $rootScope.filtre = true;


//  $scope.url_rest = myConfig.getUrl();
                        myConfig.getUrl().then(function (api_url) {

                            $scope.artisanUpdate = Artisan.getArtisan();

                            $scope.artisanShow = Artisan.getArtisan();


                            $scope.artisanUpdate.groupe_id = $scope.artisanUpdate.groupe_id + "";
                            $scope.artisanUpdate.activite_id = $scope.artisanUpdate.activite_id + "";
                            $scope.artisanUpdate.specialite_id = $scope.artisanUpdate.specialite_id + "";
                            $scope.artisanUpdate.relation_id = ($scope.artisanUpdate.relation_id ? $scope.artisanUpdate.relation_id + "" : "");
                            $scope.artisanUpdate.countrie_id = $scope.artisanUpdate.countrie_id + "";
                            $scope.artisanUpdate.province_id = $scope.artisanUpdate.province_id + "";
                            //$scope.artisanUpdate.localite_id = $scope.artisanUpdate.localite_id + "";

                            $scope.modifier = false;
                            $scope.updateSuccess = '';
                            $scope.updateError = '';
                            $ionicLoading.hide();

                            $scope.max = 10;
                            $scope.isReadonly = false;


                            $scope.hoveringOverTarif = function (value) {
                                $scope.overTarifStar = value;
                                $scope.percent = value;
                            };

                            $scope.hoveringOverPlanning = function (value) {
                                $scope.overPlanningStar = value;
                                $scope.percent = value;
                            };

                            $scope.hoveringOverQualite = function (value) {
                                $scope.overQualiteStar = value;
                                $scope.percent = value;
                            };


                            $scope.groupe_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'activites.json?groupe_id=' + $scope.artisanUpdate.groupe_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.activites = json.activites;

                                        if ($scope.activites && $scope.activites.length != 0) {
                                            $scope.activite_change(change);
                                        }

                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.artisanUpdate.groupe_id = 1;
                            $scope.groupe_change(true);

                            $scope.activite_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'specialites.json?activite_id=' + $scope.artisanUpdate.activite_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.specialites = json.specialites;
                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.relations_int = function () {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'relations.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.relations = json.relations;
                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.relations_int();


                            $scope.pays_int = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'countries.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.countries = json.countries;
                                        if ($scope.countries && $scope.countries.length != 0) {
                                            if (!change) {
                                                $scope.countrie_index = 0;
                                                $scope.artisanUpdate.countrie_id = $scope.countries[$scope.countrie_index].id + "";
                                            }
                                            $scope.province_change(change);
                                        }

                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.pays_int(true);


                            $scope.province_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'localites.json?countrie_id=' + $scope.artisanUpdate.countrie_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.localites = json.localites;
                                        if ($scope.localites && $scope.localites.length != 0) {
                                            if (!change) {
                                                $scope.artisanUpdate.localite_id = "";
                                                $scope.artisanUpdate.province_id = "";
                                                $scope.artisanUpdate.localite = "";
                                            }
                                        }

                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.required_code_postal = function () {
                                if (typeof $scope.artisanUpdate.localite === "object") {
                                    $scope.artisanUpdate.localite_id = $scope.artisanUpdate.localite.id;
                                    $scope.artisanUpdate.province_id = $scope.artisanUpdate.localite.province_id;
                                } else {
                                    $scope.artisanUpdate.localite_id = '';
                                    $scope.artisanUpdate.province_id = "";
                                }
                                return typeof $scope.artisanUpdate.localite !== "object";
                            };


                            $scope.submitArtisan = function () {

                                //console.log("ajoutArtisan");
                                $scope.updateSuccess = '';
                                $scope.updateError = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'artisans/edit.json',
                                    data: $scope.artisanUpdate,
                                    typeData: "json",
                                    xhrFields: {withCredentials: true},
                                });


                                request.success(function (json) {
                                    if (json && json.success) {


                                        json.artisan.codepostal = parseInt(json.artisan.codepostal);
                                        $scope.artisanUpdate = json.artisan;
                                        $scope.artisanUpdate.groupe_id = $scope.artisanUpdate.groupe_id + "";
                                        $scope.artisanUpdate.activite_id = $scope.artisanUpdate.activite_id + "";
                                        $scope.artisanUpdate.specialite_id = $scope.artisanUpdate.specialite_id + "";
                                        $scope.artisanUpdate.relation_id = $scope.artisanUpdate.relation_id + "";
                                        $scope.updateError = '';
                                        $scope.updateSuccess = json.message;
                                        //console.log(json.message);
                                        $state.go("tabs.mesArtisans", {reload: true, inherit: false});
                                        //$uibModalInstance.close($scope.artisanUpdate);

                                    } else {
                                        if (json && json.message) {


                                            if (json.modelError && json.modelError.length !== 0) {
                                                $scope.updateError = json.modelError[0];
                                                $ionicPopup.alert({
                                                    title: $scope.labels.alert,
                                                    template: json.modelError[0],
                                                    okType: "button-energized"
                                                });
                                            } else {
                                                $scope.updateError = json.message;
                                                $ionicPopup.alert({
                                                    title: $scope.labels.alert,
                                                    template: json.message,
                                                    okType: "button-energized"
                                                });
                                            }
                                        } else {

                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: $scope.labels.ProblemeDeConnexion,
                                                okType: "button-energized"
                                            });
                                        }
                                    }
                                    //console.log($scope.artisanUpdate);
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {


                                    if (json && json.message) {
                                        $scope.updateError = json.message;
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {
                                        $scope.updateError = $scope.labels.ProblemeDeConnexion;
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: $scope.labels.ProblemeDeConnexion,
                                            okType: "button-energized"
                                        });
                                    }

                                    $ionicLoading.hide();
                                });
                                //console.log($scope.artisanUpdate);
                            };


                            $scope.modifierArtisan = function (artisan) {

                                Artisan.setArtisan(artisan);
                                $state.go('modifierartisan', {reload: true});
                                // console.log(artisan);
                                //$state.controller('')
                            };


                            $scope.supprimer = function () {

                                $scope.updateSuccess = '';
                                $scope.updateError = '';
                                $ionicPopup.show({
                                    title: $scope.labels.EtesVousSur,
                                    template: $scope.labels.DeSupprimerArtisan + $scope.artisanUpdate.prenom + " " + $scope.artisanUpdate.nom + $scope.labels.DeVotreCarnetAdresse,
                                    buttons: [
                                        {text: $scope.labels.Annuler}, {
                                            text: '<b>OK</b>',
                                            type: 'button-energized',
                                            onTap: function () {
                                                var request = $http({
                                                    method: "POST",
                                                    url: $scope.url_rest + 'artisans/delete.json',
                                                    data: $scope.artisanUpdate,
                                                    typeData: "json",
                                                    xhrFields: {withCredentials: true},
                                                });
                                                request.success(function (json) {
                                                    if (!json.success) {
                                                        //console.log(json);
                                                        $ionicPopup.alert({
                                                            title: "Erreur",
                                                            teplate: json.message,
                                                            okType: "button-energized"
                                                        });
                                                    } else {
                                                        $ionicPopup.alert({
                                                            title: $scope.labels.Succes,
                                                            template: $scope.labels.ArtisanSupprime,
                                                            okType: "button-energized"}
                                                        );
                                                        artisan = {};
                                                        $scope.updateSuccess = json.message;
                                                        $rootScope.artisan_count--;
                                                        //$scope.get_artisans();
                                                        $state.go("tabs.mesArtisans", {reload: true, inherit: false});

                                                        //$uibModalInstance.close($scope.artisanUpdate);
                                                    }
                                                });

                                                request.error(function (json, status, headers, config) {
                                                    //console.log(json);
                                                    $ionicPopup.alert({
                                                        title: "Erreur!",
                                                        teplate: json.message,
                                                        okType: "button-energized"
                                                    });
                                                });

                                            }
                                            //}
                                            //}
                                        }
                                    ]
                                });



                            };

                            $scope.liste_amis = [];
                            $scope.getAmis = function () {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'amis/listeamis.json?telephone_id=' + $scope.artisanShow.telephone_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.liste_amis = json.amis;
                                    } else {
                                        if (json && json.message) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json && json.message) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.getAmis();

                            $scope.clickedMethod = function (callback) {
                                $scope.artisanUpdate.province_id = callback.item.province_id;
                                $scope.artisanUpdate.localite_id = callback.item.id;
                            };

                            $scope.callbackMethod = function (query, isInitializing) {
                                $scope.callbackMethod = function (query, isInitializing) {
                                    if (query.length > 3) {
                                        return filterFilter($scope.localites, query);
                                    } else {
                                        return [];
                                    }
                                };
                            };

                            $scope.modelToItemMethod = function (modelValue) {

                                // get the full model item from the model value and return it. You need to implement the `getModelItem` method by yourself 
                                // as this is just a sample. The method needs to retrieve the whole item (like the `items-method`) from just the model value.
                                //console.log(modelValue);
                                var modelItem = getModelItem(modelValue);
                                //console.log(modelItem);
                                return modelItem;
                            };

                        });
                    }])

        .controller('modalAddArtisanCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', 'Phone', 'Contact', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover, Phone, Contact)

                    {
                        $rootScope.auth = false;
                        $rootScope.add = true;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.filtre = true;

                        //$scope.url_rest = myConfig.getUrl();
                        //$scope.url_base_rest = myConfig.getBaseUrl();   
                        $scope.artisanAdd = {};
                        if (Phone.getPhone()) {
                            var phone_num = Phone.getPhone();
                            if (phone_num) {
                                $scope.artisanAdd.telephone = phone_num.replace(/ /g, "");
                            }
                        }

                        //console.log(Contact.getContact());

                        if (Contact.getContact())
                        {
                            $scope.artisanAdd.nom = Contact.getContact().name.familyName;
                            $scope.artisanAdd.prenom = Contact.getContact().name.givenName;
                        }
                        myConfig.getUrl().then(function (api_url) {



                            $scope.addSuccess = '';
                            $scope.addError = '';
                            $ionicLoading.hide();

                            $scope.artisanAdd.ratingtarif = 0;
                            $scope.max = 10;
                            $scope.isReadonly = false;

                            $scope.hoveringOverTarif = function (value) {
                                $scope.overTarifStar = value;
                                $scope.percent = value;
                            };

                            $scope.hoveringOverPlanning = function (value) {
                                $scope.overPlanningStar = value;
                                $scope.percent = value;
                            };

                            $scope.hoveringOverQualite = function (value) {
                                $scope.overQualiteStar = value;
                                $scope.percent = value;
                            };
                            var validated = false;

                            $scope.telephone_change = function (valid) {
                                if (valid) {
                                    validated = true;
                                    $scope.addError = '';
                                    $scope.addSuccess = '';
                                    $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                    var request = $http({
                                        method: "GET",
                                        url: $scope.url_rest + 'artisans/telephone.json?telephone=' + $scope.artisanAdd.telephone,
                                        typeData: "json",
                                        withCredentials: true,
                                    });

                                    request.success(function (json) {
                                        if (json && json.success) {
                                            if (json.telephone) {
                                                $scope.artisanAdd = json.telephone;
                                                $scope.artisanAdd.groupe_id = $scope.artisanAdd.groupe_id + "";
                                                $scope.groupe_change(true);
                                                $scope.artisanAdd.activite_id = $scope.artisanAdd.activite_id + "";
                                                $scope.artisanAdd.specialite_id = $scope.artisanAdd.specialite_id + "";

                                                $scope.artisanAdd.countrie_id = $scope.artisanAdd.countrie_id + "";
                                                $scope.province_change(true);
                                                $scope.artisanAdd.province_id = $scope.artisanAdd.province_id + "";
                                                $scope.artisanAdd.localite_id = $scope.artisanAdd.localite_id + "";
                                                //$scope.groupe_change();
                                            }
                                        } else {
                                            if (json) {
                                                if (json.message)
                                                {
                                                    $ionicPopup.alert({
                                                        title: $scope.labels.alert,
                                                        template: json.message,
                                                        okType: "button-energized"
                                                    });
                                                }
                                                ;
                                            } else {
                                                //$scope.addError = $scope.labels.ProblemeDeConnexion;
                                                $ionicPopup.alert({
                                                    title: $scope.labels.alert,
                                                    template: $scope.labels.ProblemeDeConnexion,
                                                    okType: "button-energized"
                                                });
                                            }
                                        }
                                        $ionicLoading.hide();
                                    });

                                    request.error(function (json, status, headers, config) {

                                        if (json) {
                                            //$scope.addError = json.message;
                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            // $scope.addError = $scope.labels.ProblemeDeConnexion;
                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: $scope.labels.ProblemeDeConnexion,
                                                okType: "button-energized"
                                            });
                                        }
                                        $ionicLoading.hide();
                                    });
                                } else {
                                    if (validated) {
                                        validated = false;
                                        $scope.artisanAdd = {};
                                        $scope.artisanAdd.groupe_id = 1 + "";
                                        $scope.groupe_change();
                                        $scope.artisanAdd.relation_id = $scope.relations[0].id + "";
                                        $scope.artisanAdd.countrie_id = $scope.countries[0].id + "";
                                        $scope.province_change();
                                    }
                                }
                            };

                            $scope.groupe_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'activites.json?groupe_id=' + $scope.artisanAdd.groupe_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.activites = json.activites;

                                        if ($scope.activites && $scope.activites.length != 0) {


                                            $scope.activite_change(change);
                                        }

                                    } else {
                                        if (json) {

                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {

                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: $scope.labels.ProblemeDeConnexion,
                                                okType: "button-energized"
                                            });
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {

                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {

                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: $scope.labels.ProblemeDeConnexion,
                                            okType: "button-energized"
                                        });
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.artisanAdd.groupe_id = 1;
                            $scope.groupe_change();

                            $scope.activite_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'specialites.json?activite_id=' + $scope.artisanAdd.activite_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {

                                        $scope.specialites = json.specialites;



                                    } else {
                                        if (json) {

                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {

                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: $scope.labels.ProblemeDeConnexion,
                                                okType: "button-energized"
                                            });
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {

                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {

                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: $scope.labels.ProblemeDeConnexion,
                                            okType: "button-energized"
                                        });
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.relations_int = function () {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'relations.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.relations = json.relations;
                                        if ($scope.relations && $scope.relations.length != 0) {

                                            $scope.relation_index = 0;
                                            $scope.artisanAdd.relation_id = $scope.relations[$scope.relation_index].id + "";
                                        }

                                    } else {
                                        if (json) {
                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            $ionicPopup.alert({
                                                title: $scope.labels.alert,
                                                template: $scope.labels.ProblemeDeConnexion,
                                                okType: "button-energized"
                                            });
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: json.message,
                                            okType: "button-energized"
                                        });
                                    } else {

                                        $ionicPopup.alert({
                                            title: $scope.labels.alert,
                                            template: $scope.labels.ProblemeDeConnexion,
                                            okType: "button-energized"
                                        });
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.relations_int();


                            $scope.pays_int = function () {
                                $ionicLoading.show({
                                    template: '<ion-spinner class="spinner-energized"></ion-spinner>//<p>' + $rootScope.labels.chargement + '...</p>'
                                });

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'countries.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.countries = json.countries;
                                        if ($scope.countries && $scope.countries.length != 0) {

                                            $scope.countrie_index = 0;
                                            $scope.artisanAdd.countrie_id = $scope.countries[$scope.countrie_index].id + "";

                                            $scope.province_change();
                                        }

                                    } else {
                                        if (json) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.pays_int();


                            $scope.province_change = function (change) {

                                $scope.error = '';
                                $scope.success = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});

                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'localites.json?countrie_id=' + $scope.artisanAdd.countrie_id,
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.localites = json.localites;


                                        if ($scope.localites && $scope.localites.length != 0) {
                                            if (!change) {
                                                $scope.artisanAdd.localite_id = "";
                                                $scope.artisanAdd.province_id = "";
                                                $scope.artisanAdd.localite = "";
                                            }
                                        }

                                    } else {
                                        if (json) {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                        } else {
                                            $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: json.message, okType: "button-energized"});
                                    } else {
                                        $ionicPopup.alert({title: $scope.labels.alert, template: $scope.labels.ProblemeDeConnexion, okType: "button-energized"});
                                    }
                                    $ionicLoading.hide();
                                });
                            };

                            $scope.required_code_postal = function () {
                                if (typeof $scope.artisanAdd.localite === "object") {
                                    $scope.artisanAdd.localite_id = $scope.artisanAdd.localite.id;
                                    $scope.artisanAdd.province_id = $scope.artisanAdd.localite.province_id;
                                } else {
                                    $scope.artisanAdd.localite_id = '';
                                    $scope.artisanAdd.province_id = "";
                                }
                                return typeof $scope.artisanAdd.localite !== "object";
                            };

                            $scope.submitArtisan = function () {

                                $scope.addSuccess = '';
                                $scope.addError = '';
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                                var request = $http({
                                    method: "POST",
                                    url: $scope.url_rest + 'artisans/add.json',
                                    data: $scope.artisanAdd,
                                    typeData: "json",
                                    xhrFields: {withCredentials: true},
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        json.artisan.codepostal = parseInt(json.artisan.codepostal);

                                        $scope.artisanAdd = {};

                                        $scope.addError = '';
                                        $scope.addSuccess = json.message;
                                        //$rootScope.artisan_count++;
                                        $state.go("tabs.mesArtisans");
                                        //$uibModalInstance.close($scope.artisanAdd);
                                    } else {
                                        if (json) {
                                            if (json.modelError && json.modelError.length !== 0) {
                                                $scope.addError = json.modelError[0];
                                            } else {
                                                $scope.addError = json.message;
                                            }
                                        } else {
                                            $scope.addError = $scope.labels.ProblemeDeConnexion;
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {
                                    if (json) {
                                        $scope.addError = json.message;
                                    } else {
                                        $scope.addError = $scope.labels.ProblemeDeConnexion;
                                    }
                                    $ionicLoading.hide();
                                });
                                $ionicLoading.hide();
                            };

                            $scope.text_groupe = false;
                            $scope.add_groupe = function () {
                                if ($scope.text_groupe) {
                                    $scope.artisanAdd.groupe = '';
                                    $scope.artisanAdd.activite = '';
                                    $scope.artisanAdd.specialite = '';
                                    $scope.text_groupe = false;
                                    $scope.text_activite = false;
                                    $scope.text_specialite = false;
                                } else {
                                    $scope.text_groupe = true;
                                    $scope.text_activite = true;
                                    $scope.text_specialite = true;
                                }
                            };

                            $scope.text_activite = false;

                            $scope.add_activite = function () {

                                if ($scope.text_activite) {
                                    $scope.artisanAdd.activite = '';
                                    $scope.artisanAdd.specialite = '';
                                    $scope.text_activite = false;
                                    $scope.text_specialite = false;
                                } else {
                                    $scope.text_activite = true;
                                    $scope.text_specialite = true;
                                }

                                if ($scope.text_groupe) {
                                    $scope.text_groupe = false;
                                    $scope.artisanAdd.groupe = '';
                                }


                            };

                            $scope.text_specialite = false;
                            $scope.add_specialite = function () {
                                if ($scope.text_specialite) {
                                    $scope.artisanAdd.specialite = '';
                                    $scope.text_specialite = false;
                                } else {
                                    $scope.text_specialite = true;
                                }

                                if ($scope.text_groupe) {
                                    $scope.text_groupe = false;
                                    $scope.artisanAdd.groupe = '';
                                }

                                if ($scope.text_activite) {
                                    $scope.text_activite = false;
                                    $scope.artisanAdd.activite = '';
                                }


                            };


                            $scope.Fermer = function () {
                                //$uibModalInstance.dismiss($scope.labels.Annuler);     
                            };






                        });

                        $scope.clickedMethod = function (callback) {

                            $scope.artisanAdd.province_id = callback.item.province_id;

                        };

                        $scope.callbackMethod = function (query, isInitializing) {
                            $scope.callbackMethod = function (query, isInitializing) {
                                if (query.length > 3) {
                                    return filterFilter($scope.localites, query);
                                } else {
                                    return [];
                                }
                            };
                        };
                    }])

        .controller('modalInviterAmiCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', '$cordovaContacts', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover, $cordovaContacts)
                    {
                        $rootScope.auth = false;
                        $rootScope.add = true;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.filtre = true;
                        // $scope.url_rest = myConfig.getUrl();
                        myConfig.getUrl().then(function (api_url) {
                            $scope.amiInviter = {};
                            $scope.Inviter = function (email) {
                                if (!email) {
                                    email = $scope.amiInviter.email;
                                }
                                $ionicPopup.show({
                                    title: $scope.labels.EtesVousSur,
                                    template: "D'inviter " + email + " à PistonIM",
                                    buttons: [
                                        {text: $scope.labels.Annuler}, {
                                            text: '<b>Ok</b>',
                                            type: 'button-energized',
                                            onTap: function () {
                                                var request = $http({
                                                    method: "POST",
                                                    url: $scope.url_rest + 'amis/inviter.json',
                                                    data: {email: email},
                                                    typeData: "json",
                                                    xhrFields: {withCredentials: true},
                                                });
                                                request.success(function (json) {
                                                    if (!json.success) {

                                                        if (json.existe) {
                                                            $ionicPopup.alert({
                                                                title: $scope.labels.existe,
                                                                template: json.message,
                                                                okType: "button-energized"
                                                            });
                                                            //$uibModalInstance.close();
                                                            $state.go('amis.mesAmis');
                                                        } else {
                                                            //console.log(json);
                                                            $ionicPopup.alert({
                                                                title: "Erreur",
                                                                template: json.message,
                                                                okType: "button-energized"
                                                            });
                                                        }

                                                    } else {
                                                        $ionicPopup.alert({
                                                            title: $scope.labels.Succes,
                                                            template: json.message,
                                                            okType: "button-energized"
                                                        });
                                                        $scope.amiInviter.email = '';
                                                        //$state.go('amis.mesAmis');
                                                        //$uibModalInstance.close();
                                                    }
                                                });

                                                request.error(function (json, status, headers, config) {
                                                    //console.log(json);
                                                    $ionicPopup.alert({title: "Erreur",
                                                        template: json.message,
                                                        okType: "button-energized"});
                                                });

                                            }
                                            //}
                                            //}
                                        }
                                    ]
                                });
                            };

                            $scope.getAllContacts = function () {
                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.recuperation_des_contacts + '...</p>'});


                                var opts = new ContactFindOptions();
                                opts.filter = "";
                                opts.multiple = true;
                                //opts.desiredFields = [navigator.contacts.fieldType.emails, navigator.contacts.fieldType.phoneNumbers];

                                $cordovaContacts.find(opts).then(function (allContacts) {

                                    var emails = [];

                                    angular.forEach(allContacts, function (Contact, key) {
                                        $scope.contact=Contact;
                                        angular.forEach(Contact.emails, function (email, key) {
                                            
                                            if ($.inArray(email.value, emails) === -1) {
                                                if (Contact.displayName != null)
                                                    emails.push({nom:Contact.displayName, mail:email.value});
                                                else if (Contact.name != null)
                                                    emails.push({nom:Contact.name.formatted, mail:email.value});
                                                else
                                                   emails.push({nom:'', mail:email.value}); 

                                            }
                                        });
                                    });
                                    //emails=allContacts;
                                    //console.log(emails);
                                    $scope.emails = emails;
                                    $ionicLoading.hide();

                                });

                            };

                            $scope.getAllContacts();

                        });
                    }])



        .controller('modalAddAmiCtrl',
                ['$scope', '$rootScope', '$ionicLoading', 'ionicToast', 'myConfig', '$ionicPopup', '$http', '$ionicModal', 'filterFilter', '$state', 'Auth', '$rootScope', 'Artisan', '$ionicPopover', function ($scope, $rootScope, $ionicLoading, ionicToast, myConfig, $ionicPopup, $http, $ionicModal, filterFilter, $state, Auth, $rootScop, Artisan, $ionicPopover)
                    {
                        $rootScope.auth = false;
                        $rootScope.add = true;
                        $rootScope.update = true;
                        $rootScope.del = true;
                        $rootScope.filtre = true;
                        // $scope.url_rest = myConfig.getUrl();
                        myConfig.getUrl().then(function (api_url) {
                            $scope.tab = 'tab1';
                            $scope.searchAmi = '';
                            $scope.searchActive = false;
                            $scope.searchUsers = [];
                            $scope.liste_amis = [];
                            $scope.liste_demandes = [];


                            $scope.get_amis = function () {

                                $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                                var request = $http({
                                    method: "GET",
                                    url: $scope.url_rest + 'amis/amis.json',
                                    typeData: "json",
                                    withCredentials: true,
                                });

                                request.success(function (json) {
                                    if (json && json.success) {
                                        $scope.liste_amis = json.amis;
                                        $scope.liste_demandes = json.demandes;
                                    } else {
                                        if (json) {
                                            $scope.error = json.message;
                                        } else {
                                            $scope.error = $scope.labels.ProblemeDeConnexion;
                                        }
                                    }
                                    $ionicLoading.hide();
                                });

                                request.error(function (json, status, headers, config) {

                                    if (json) {
                                        $scope.error = json.message;
                                    } else {
                                        $scope.error = $scope.labels.ProblemeDeConnexion;
                                    }
                                    $ionicLoading.hide();
                                });
                            };
                            $scope.get_amis();

                            $scope.search_chnage = function (valide, searchAmi) {
                                $scope.searchActive = valide;
                                if (valide) {
                                    $ionicLoading.show({template: '<ion-spinner class="spinner-energized"></ion-spinner><p>' + $rootScope.labels.chargement + '...</p>'});
                                    var request = $http({
                                        method: "GET",
                                        url: $scope.url_rest + 'amis/search.json?search=' + searchAmi, //$scope.searchAmi,
                                        typeData: "json",
                                        withCredentials: true,
                                    });

                                    request.success(function (json) {
                                        if (json && json.success) {
                                            $scope.searchUsers = json.amis;

                                        } else {
                                            if (json) {

                                                $ionicPopup.alert({
                                                    title: "Erreur !",
                                                    template: json.message,
                                                    okType: "button-energized"
                                                });
                                            } else {

                                                $ionicPopup.alert({
                                                    title: "Erreur !",
                                                    template: "Problème de connection",
                                                    okType: "button-energized"
                                                });
                                            }
                                        }
                                        $ionicLoading.hide();
                                    });

                                    request.error(function (json, status, headers, config) {

                                        if (json) {
                                            $ionicPopup.alert({
                                                title: "Erreur !",
                                                template: json.message,
                                                okType: "button-energized"
                                            });
                                        } else {
                                            $ionicPopup.alert({
                                                title: "Erreur !",
                                                template: "Problème de connection",
                                                okType: "button-energized"
                                            });
                                        }
                                        $ionicLoading.hide();
                                    });
                                } else {
                                    $ionicLoading.hide();
                                }
                            };

                            $scope.add_ami = function (user, index) {

                                $ionicPopup.show({
                                    title: $scope.labels.EtesVousSur,
                                    template: $scope.labels.EnvoyerDemandeAmi + user.title + "\".",
                                    buttons: [
                                        {text: $scope.labels.Annuler}, {
                                            text: '<b>OK</b>',
                                            type: 'button-energized',
                                            onTap: function () {
                                                var request = $http({
                                                    method: "POST",
                                                    url: $scope.url_rest + 'amis/add.json',
                                                    data: user,
                                                    typeData: "json",
                                                    xhrFields: {withCredentials: true},
                                                });
                                                request.success(function (json) {
                                                    if (!json.success) {
                                                        //console.log(json);
                                                        $ionicPopup.alert({
                                                            title: "Erreur",
                                                            template: json.message,
                                                            okType: "button-energized"
                                                        });
                                                    } else {
                                                        $scope.searchUsers.splice(index, 1);
                                                        $scope.get_amis();
                                                        $ionicPopup.alert({
                                                            title: $scope.labels.mes_amis,
                                                            template: $scope.labels.DemandeEnovoyee,
                                                            okType: "button-energized"
                                                        });
                                                    }
                                                });

                                                request.error(function (json, status, headers, config) {
                                                    //console.log(json);
                                                    $ionicPopup.alert({
                                                        title: "Erreur",
                                                        template: "Problème de connection",
                                                        okType: "button-energized"
                                                    });
                                                });

                                            }
                                        }
                                    ]
                                });
                            };



                            $scope.afficher_ami = function (ami) {
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'partials/modalAfficherAmi.html',
                                    controller: 'modalAfficherAmiCtrl',
                                    size: 'md',
                                    resolve: {
                                        ami: function () {
                                            return angular.copy(ami);
                                        },
                                    }
                                });

                                modalInstance.result.then(function (ami) {
                                    $scope.get_amis();
                                });
                            };

                            $scope.tab1 = 'tab1';

                            $scope.send_invitation = function () {
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'partials/modalInviterAmi.html',
                                    controller: 'modalInviterAmiCtrl',
                                    size: 'md',
                                    resolve: {
                                        /*ami: function () {
                                         return angular.copy(ami);
                                         },*/
                                    }
                                });

                                modalInstance.result.then(function (ami) {
                                    //$scope.get_amis();
                                });
                            };
                        });
                    }])
        ;



    
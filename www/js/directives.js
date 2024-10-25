angular.module('app.directives', [])
.directive('equalsTo', [function () {
   /*
   * <input type="password" ng-model="password" />
   * <input type="password" ng-model="confirmPassword" equals-to="password" />
   */
   return {
   restrict: 'A', // S'utilise uniquement en tant qu'attribut
   scope: true,
   require: 'ngModel',
   link: function (scope, element, attrs, control) {
   var check = function () {
        //Valeur du champs courant 
        var v1 = scope.$eval(attrs.ngModel); // attrs.ngModel = "ConfirmPassword"
        //valeur du champ à comparer
        var v2 = scope.$eval(attrs.equalsTo); // attrs.equalsTo = "Password"
        return v1 == v2;
   };
   scope.$watch(check, function (isValid) {
   // Défini si le champ est valide
   control.$setValidity("equalsTo", isValid);
   });
   }
   };
}]);


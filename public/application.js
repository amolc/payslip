// Invoke 'strict' JavaScript mode
'use strict';

// Set the main application name
var ApplicationModuleName = 'DemoApp';


// Create the main application
var SampleApplicationModule = angular.module('DemoApp', ['ui.router', 'angular-storage', 'ngMessages', 'ngMaterial', 'ngMaterialDatePicker']);

SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider', 'storeProvider', function($urlRouterProvider, $stateProvider, storeProvider) {
    storeProvider.setStore('sessionStorage');
    //$urlRouterProvider.otherwise('/signin');
    $stateProvider
        .state('signin', {
            url: '/signin',
            templateUrl: 'templates/signin.html'
        })

    .state('welcomepage', {
        url: '/welcomepage',
        templateUrl: 'templates/welcomepage.html'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html'
    })
    .state('payslip', {
          url: '/payslip/:emp_id',
          templateUrl: 'templates/payslip.html'
      })

    /*$stateProvider
    .state('add_todos', {
      url: '/add_todos/:todo_id',
      templateUrl: 'templates/add_todos.html'
    })

    $stateProvider
    .state('listtodos', {
      url: '/listtodos',
      templateUrl: 'templates/list_todos.html'
    })*/
}]);


angular.module('DemoApp').controller('MainController', [
    '$scope',
    '$http',
    '$stateParams',
    '$location',
    '$rootScope',
    '$state',
    '$timeout',
    'store',
    function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store) {

        $scope.init = function() {

            $scope.userSession = store.get('userSession') || {};
        }

        /*
        @function userlogin
        @type post
        @author Sameer Vedpathak
        @initialDate
        @lastDate
        **/

        $scope.userlogin = function(user, valid) {
            if (valid) {
                $http.post(baseUrl + 'login', user).success(function(res, req) {
                    if (res.status == true) {
                        var userSession = {
                            'login': true,
                            'userid': res.record[0].id,
                            'user_email': res.record[0].user_email,
                            'user_name': res.record[0].user_name
                        };
                        store.set('userSession', userSession);
                        $scope.init();
                        $state.go('welcomepage');
                    } else if (res.status === false) {
                        console.log("login failed");
                        $scope.loginfailuremsg = 'Please Enter Valid Email Address and Password';
                        $scope.showloginfailuremsg = true;

                        // Simulate 2 seconds loading delay
                        $timeout(function() {
                            // Loadind done here - Show message for 3 more seconds.
                            $timeout(function() {
                                $scope.showloginfailuremsg = false;
                            }, 3000);
                            document.getElementById("loginform").reset();
                        }, 2000);
                    }
                }).error(function() {
                    console.log("Connection Problem.");
                });
            }
        };
        /**
          @function usersignout
          @author Sameer Vedpathak
          @initialDate
          @lastDate
        */
        $scope.usersignout = function() {
            store.remove('userSession');
            $location.path('signin');
            $scope.init();
        };



        $scope.settings = function() {
            $http.get(baseUrl + 'setting').success(function(res, req) {
                console.log('settings', res.settings[0]);
                console.log('Employees ', res.employees);
                $scope.settings = res.settings[0];
                $scope.employees = res.employees;
            }).error(function(error) {
                console.log("error getting settings", error);
            })
        };
        $scope.settings();

        $scope.navigate = function(current_employee) {
          console.log('current employee',current_employee);
          $location.path('/payslip/' + current_employee.emp_id);
        };


        $scope.signup = function(userinfo, valid) {
            console.log("userinfo:", userinfo);
            if (valid) {
                $http.post(baseUrl + 'signup', userinfo).success(function(res, req) {
                    console.log("res:", res);
                    if (res.status == true) {
                        $scope.signupmsg = 'User Created Successfully';
                        $scope.showsignmsg = true;

                        $timeout(function() {
                            $timeout(function() {
                                $scope.showsignmsg = false;
                            }, 3000);
                            document.getElementById("signupform").reset();
                            $location.path('signin');
                        }, 2000);

                    } else {
                        console.log("error");
                    }

                }).error(function() {
                    console.log("problem In signup");
                });
            }

        };

    }
]);

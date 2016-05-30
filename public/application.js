// Invoke 'strict' JavaScript mode
//'use strict';

// Set the main application name
var ApplicationModuleName = 'DemoApp';


// Create the main application
var SampleApplicationModule = angular.module('DemoApp', ['ui.router', 'angular-storage', 'ngMessages', 'ngMaterial', 'ngMaterialDatePicker']);

SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider', 'storeProvider', function($urlRouterProvider, $stateProvider, storeProvider) {
    storeProvider.setStore('sessionStorage');
    $urlRouterProvider.otherwise('/welcomepage');
    $stateProvider
        .state('signin', {
            url: '/signin',
            templateUrl: 'templates/signin.html'
        })

    .state('welcomepage', {
            url: '/welcomepage',
            templateUrl: 'templates/welcomepage.html'
        })
        .state('pay', {
            url: '/pay/:emp_id',
            templateUrl: 'templates/pay.html'
        })

    .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html'
        })
        .state('payslip', {
            url: '/payslip/:emp_id',
            templateUrl: 'templates/payslip.html'
        });

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
        };
        if ($stateParams.emp_id) {
            console.log('$stateParams', $stateParams);
            $scope.navigate($stateParams);
        }

        /*
        @function userlogin
        @type post
        @author Sameer Vedpathak
        @initialDate
        @lastDate
        **/
        $scope.random_number = Math.floor((Math.random() * 99999999999) + 1);
        $scope.printthis = function() {
            html2canvas(document.getElementById('printthis'), {
                onrendered: function(canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download($scope.random_number+"_salary.pdf");
                }
            });
        };

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

        //$scope.custom = true;
        $scope.current_date = new Date();
        $scope.settings = function() {
            $http.get(baseUrl + 'setting').success(function(res, req) {
                //console.log('settings', res.settings[0]);
                //console.log('Employees ', res.employees);
                $scope.settings = res.settings[0];
                $scope.employees = res.employees;
            }).error(function(error) {
                console.log("error getting settings", error);
            });
        };

        $scope.settings();

        $scope.salary = {
            "salary_record_totalsalary": 0,
            "salary_record_basic": 0,
            "salary_record_hr": 0,
            "salary_record_conv": 0,
            "salary_record_medical": 0,
            "salary_record_personal": 0,
            "salary_record_phone": 0,
            "salary_record_pf": 0,
            "salary_record_edu": 0,
            "salary_record_incometax": 0,
            "salary_record_esi": 0,
            "salary_record_month": 0
        };

        $scope.navigate = function(emp_id) {
            $http.post(baseUrl + 'getemployee', emp_id).success(function(res, req) {
                //    console.log('current employee',res);
                $scope.current_employee = res.employees[0];
            }).error(function() {
                console.log("problem In signup");
            });
        };


        $scope.calculateSalary = function(salaryForm) {
            if (salaryForm.$valid) {
                $scope.new_salary = {
                    "salary_record_basic": $scope.settings.setting_basic * $scope.salary.salary_total,
                    "salary_record_hr": $scope.settings.salary_hr * $scope.salary.salary_total,
                    "salary_record_conv": $scope.settings.salary_conv * $scope.salary.salary_total,
                    "salary_record_medical": $scope.settings.salary_medical * $scope.salary.salary_total,
                    "salary_record_personal": $scope.settings.salary_personal * $scope.salary.salary_total,
                    "salary_record_esi": $scope.settings.salary_esi * $scope.salary.salary_total,
                    "salary_record_phone": $scope.settings.salary_phone * $scope.salary.salary_total,
                    "salary_record_pf": $scope.settings.salary_pf * $scope.salary.salary_total,
                    "salary_record_edu": $scope.settings.salary_edu * $scope.salary.salary_total,
                    "salary_record_incometax": $scope.settings.salary_incometax * $scope.salary.salary_total,
                    "salary_record_pt": $scope.settings.salary_pt * $scope.salary.salary_total
                };

                $scope.deduction = $scope.new_salary.salary_record_pf + $scope.new_salary.salary_record_edu + $scope.new_salary.salary_record_incometax + $scope.new_salary.salary_record_pt;
                $scope.cash_in_hand = $scope.new_salary.salary_record_pf + $scope.new_salary.salary_record_edu +
                    $scope.new_salary.salary_record_incometax + $scope.new_salary.salary_record_pt +
                    $scope.new_salary.salary_record_basic + $scope.new_salary.salary_record_hr +
                    $scope.new_salary.salary_record_conv + $scope.new_salary.salary_record_medical +
                    $scope.new_salary.salary_record_personal + $scope.new_salary.salary_record_esi +
                    $scope.new_salary.salary_record_phone;
                // console.log('Cash in Hand', $scope.cash_in_hand);
                // console.log('Calculated Salary', $scope.new_salary);
                // console.log('total deducation', $scope.deduction);
                // console.log('CTC/PM', $scope.salary.salary_total - $scope.deduction);

                $scope.salaryInfo = [];
                $scope.salaryInfo.push({
                    empInfo: $scope.current_employee,
                    new_salary: $scope.new_salary,
                    deduction: $scope.deduction,
                    cash_in_hand: $scope.cash_in_hand,
                    ctc: $scope.salary.salary_total - $scope.deduction,
                    salary_total: $scope.salary.salary_total
                });
                // $http.post(baseUrl + 'savepayslip', $scope.salaryInfo).success(function(res, req) {
                //     console.log('response salary api', res);
                // }).error(function(error) {
                //     console.log("problem In creating payslip", error);
                // });
                //  $scope.printthis();
                //document.getElementById("printthis").reset();
            }
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

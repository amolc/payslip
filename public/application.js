// Invoke 'strict' JavaScript mode
//'use strict';
// Set the main application name
var ApplicationModuleName = 'DemoApp';

// Create the main application
var SampleApplicationModule = angular.module('DemoApp', ['ui.router', 'angular-storage', 'ngMessages', 'ngMaterial', 'ngMaterialDatePicker', 'ui.bootstrap']);

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
        })
        .state('employeepayslip', {
            url: '/employeepayslip/:emp_payslip',
            templateUrl: 'templates/employeepayslip.html'
        });
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
    '$filter',
    function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store, $filter) {

        $scope.init = function() {
            $scope.userSession = store.get('userSession') || {};
        };
        //  $scope.custom = true;

        if ($stateParams.emp_id) {
            // console.log('$stateParams', $stateParams);
            $scope.navigate($stateParams);
        }

        if ($stateParams.emp_payslip) {

            console.log('emp_payslip', $stateParams);
            var emp = {
                emp_id: $stateParams.emp_payslip
            };
            console.log('emp', emp);
            $scope.employeePayslip($stateParams);
            $scope.navigate(emp);
        }
        $scope.today = function() {
            $scope.dt = new Date();

            //$scope.dt = $filter('date')($scope.dt,"MMM");
        };
        $scope.today();
        $scope.employee = {
            emp_doj: new Date()
        };
        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }

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
                    pdfMake.createPdf(docDefinition).download($scope.random_number + "_salary.pdf");
                }
            });
        };

        $scope.current_date = new Date();
        $scope.date = new Date();

        $scope.addupdateEmployee = function(employeeForm) {
            if (employeeForm.$valid) {
                console.log('New Employee', $scope.employee);
                $http.post(baseUrl + 'createmployee', $scope.employee).success(function(res, req) {
                    // $scope.employeeForm.$setPristine();
                    console.log('current_employee', res);
                    $scope.employeeMsg = "Employee Added";
                    $scope.showemployeeMsg = true;
                    $scope.hidecustom = false;
                    $timeout(function() {
                        $timeout(function() {
                            $scope.showemployeeMsg = false;

                        }, 3000);
                    }, 2000);
                    document.getElementById("employeeForm").reset();
                    $scope.hidecustom = true;
                    // $scope.settings();
                }).error(function() {
                    console.log("problem In signup");
                });
            } else {
                console.log('invalid form');
            }
        };

        $scope.settings = function() {
            $http.get(baseUrl + 'setting').success(function(res, req) {
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
                console.log('current_employee', res.employees);
                $scope.current_employee = res.employees[0];
            }).error(function() {
                console.log("problem In signup");
            });
        };

        $scope.calculateSalary = function(salaryForm) {
            console.log('is form valid', salaryForm.$valid);
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

                $scope.salaryInfo = [];
                $scope.salaryInfo.push({
                    empInfo: $scope.current_employee,
                    new_salary: $scope.new_salary,
                    deduction: $scope.deduction,
                    cash_in_hand: $scope.cash_in_hand,
                    ctc: $scope.salary.salary_total - $scope.deduction,
                    salary_total: $scope.salary.salary_total,
                    month: $scope.dt
                });
            }
        };

        $scope.saveCalculatedSalary = function() {
            $http.post(baseUrl + 'savepayslip', $scope.salaryInfo).success(function(res, req) {
                console.log('response salary api', res);
                if (res.status == true) {
                    $scope.created = true
                } else {
                    $scope.created = false
                }
            }).error(function(error) {
                console.log("problem In creating payslip", error);
            });
        };

        $scope.employeePayslip = function(emp) {
            console.log('employee param', emp);
            $scope.current_emp = emp;
            // console.log('current employee', $scope.current_employee);
            $http.post(baseUrl + 'employeepayslip', emp).success(function(res, req) {
                console.log('response salary api', res);
                $scope.empPayslip = res.payslips;
            }).error(function(error) {
                console.log("problem In creating payslip", error);
            });
        };









        // $scope.userlogin = function(user, valid) {
        //     if (valid) {
        //         $http.post(baseUrl + 'login', user).success(function(res, req) {
        //             if (res.status == true) {
        //                 var userSession = {
        //                     'login': true,
        //                     'userid': res.record[0].id,
        //                     'user_email': res.record[0].user_email,
        //                     'user_name': res.record[0].user_name
        //                 };
        //                 store.set('userSession', userSession);
        //                 $scope.init();
        //                 $state.go('welcomepage');
        //             } else if (res.status === false) {
        //                 console.log("login failed");
        //                 $scope.loginfailuremsg = 'Please Enter Valid Email Address and Password';
        //                 $scope.showloginfailuremsg = true;
        //
        //                 // Simulate 2 seconds loading delay
        //                 $timeout(function() {
        //                     // Loadind done here - Show message for 3 more seconds.
        //                     $timeout(function() {
        //                         $scope.showloginfailuremsg = false;
        //                     }, 3000);
        //                     document.getElementById("loginform").reset();
        //                 }, 2000);
        //             }
        //         }).error(function() {
        //             console.log("Connection Problem.");
        //         });
        //     }
        // };
        // /**
        //   @function usersignout
        //   @author Sameer Vedpathak
        //   @initialDate
        //   @lastDate
        // */
        // $scope.usersignout = function() {
        //     store.remove('userSession');
        //     $location.path('signin');
        //     $scope.init();
        // };


        // $scope.signup = function(userinfo, valid) {
        //     console.log("userinfo:", userinfo);
        //     if (valid) {
        //         $http.post(baseUrl + 'signup', userinfo).success(function(res, req) {
        //             console.log("res:", res);
        //             if (res.status == true) {
        //                 $scope.signupmsg = 'User Created Successfully';
        //                 $scope.showsignmsg = true;
        //
        //                 $timeout(function() {
        //                     $timeout(function() {
        //                         $scope.showsignmsg = false;
        //                     }, 3000);
        //                     document.getElementById("signupform").reset();
        //                     $location.path('signin');
        //                 }, 2000);
        //
        //             } else {
        //                 console.log("error");
        //             }
        //
        //         }).error(function() {
        //             console.log("problem In signup");
        //         });
        //     }
        //
        // };

    }
]);

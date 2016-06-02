// Invoke 'strict' JavaScript mode
//'use strict';
// Set the main application name
var ApplicationModuleName = 'DemoApp';

// Create the main application
var SampleApplicationModule = angular.module('DemoApp', ['ui.router', 'angular-storage', 'ngMessages', 'ngMaterial', 'ngMaterialDatePicker', 'ui.bootstrap']);

SampleApplicationModule.config(['$urlRouterProvider', '$stateProvider', 'storeProvider', function($urlRouterProvider, $stateProvider, storeProvider) {
        //storeProvider.setStore('sessionStorage',{s:dd});

        $urlRouterProvider.otherwise('/signin');
        $stateProvider
            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/signin.html'
            })

        .state('welcomepage', {
                url: '/welcomepage',
                templateUrl: 'templates/welcomepage.html',
                authRequired: true
            })
            .state('pay', {
                url: '/pay/:emp_id',
                authRequired: true,
                templateUrl: 'templates/pay.html'
            })

        .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html'
            })
            .state('payslip', {
                url: '/payslip/:emp_id',
                authRequired: true,
                templateUrl: 'templates/payslip.html'
            })
            .state('employeepayslip', {
                url: '/employeepayslip/:emp_payslip',
                authRequired: true,
                templateUrl: 'templates/employeepayslip.html'
            });
    }])
    .run(function($rootScope, AuthService, $state, $location) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            if (toState.authRequired && !AuthService.isAuthenticated) {
                $state.go("signin");
                event.preventDefault();
            } else {
                if (toState.url == '/signin' && AuthService.isAuthenticated) {
                    $location.path("welcomepage");
                }
            }
        });
    });


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
    '$sce',
    'AuthService',
    function($scope, $http, $stateParams, $location, $rootScope, $state, $timeout, store, $filter, $sce, AuthService) {
        //console.log('AuthService', AuthService);
        $scope.init = function() {
            $scope.userSession = store.get('userSession') || {};
        };
        //  $scope.custom = true;

        if ($stateParams.emp_id) {
            // console.log('$stateParams', $stateParams);
            $scope.navigate($stateParams);
        }

        if ($stateParams.emp_payslip) {

            //console.log('emp_payslip', $stateParams);
            var emp = {
                emp_id: $stateParams.emp_payslip
            };
            //console.log('emp', emp);
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

        $scope.cust1 = true;
        $scope.toggleCustom = function() {
            $scope.cust1 = $scope.cust1 === false ? true : false;
        };


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

        $scope.printpdf = function(record) {
            console.log('record', record);
            $scope.new_salary = record;
            $scope.notes = record.notes;
            $scope.selectedcurrency = record.selectedcurrency;
            $scope.cash_in_hand = record.salary_record_cash_in_hand;
            $scope.deduction = record.salary_record_deduction;
        };



        $scope.current_date = new Date();
        $scope.date = new Date();

        $scope.settings = function() {
            $http.get(baseUrl + 'setting').success(function(res, req) {
                $scope.settings = res.settings[0];
                $scope.employees = res.employees;
            }).error(function(error) {
                console.log("error getting settings", error);
            });
        };

        $scope.settings();

        $scope.addupdateEmployee = function(employeeForm) {
            if (employeeForm.$valid) {
                $http.post(baseUrl + 'createmployee', $scope.employee).success(function(res, req) {
                    $scope.employeeMsg = "Employee Added";
                    $scope.showemployeeMsg = true;
                    $scope.employees.push({
                        'emp_name': $scope.employee.emp_name,
                        'emp_designation': $scope.employee.emp_designation,
                        'emp_department': $scope.employee.emp_department,
                        'emp_doj': $scope.employee.emp_doj,
                        'emp_id': res.emp_id
                    });

                    $timeout(function() {
                        $timeout(function() {
                            $scope.showemployeeMsg = false;
                        }, 3000);
                    }, 2000);

                    document.getElementById("employeeForm").reset();
                    // $scope.settings();
                }).error(function() {
                    console.log("problem In signup");
                });
            } else {
                console.log('invalid form');
            }
        };



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
            "salary_record_month": 0,
            'salary_record_gross': 0
        };

        $scope.navigate = function(emp_id) {
            $http.post(baseUrl + 'getemployee', emp_id).success(function(res, req) {
                //  console.log('current_employee', res.employees);
                $scope.current_employee = res.employees[0];
            }).error(function() {
                console.log("problem In signup");
            });
        };
        $scope.notes = '';
        $scope.calculateSalary = function(salaryForm) {
            //    console.log('is form valid', salaryForm.$valid);
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

                $scope.new_salary.salary_record_gross = $scope.new_salary.salary_record_basic + $scope.new_salary.salary_record_hr +
                    $scope.new_salary.salary_record_conv + $scope.new_salary.salary_record_medical +
                    $scope.new_salary.salary_record_personal + $scope.new_salary.salary_record_phone;


                $scope.deduction = $scope.new_salary.salary_record_pf + $scope.new_salary.salary_record_edu + $scope.new_salary.salary_record_incometax + $scope.new_salary.salary_record_pt;

                $scope.cash_in_hand = $scope.new_salary.salary_record_gross - $scope.deduction;
                console.log('cash in hand', $scope.cash_in_hand);

                $scope.salaryInfo = [];

                $scope.salaryInfo.push({
                    empInfo: $scope.current_employee,
                    new_salary: $scope.new_salary,
                    deduction: $scope.deduction,
                    cash_in_hand: $scope.cash_in_hand,
                    ctc: $scope.salary.salary_total - $scope.deduction,
                    salary_total: $scope.salary.salary_total,
                    month: $scope.dt,
                    notes: $scope.notes,
                    selectedcurrency: $scope.selectedcurrency
                });
            }
        };

        $scope.printDiv = function(divName) {
            var printContents = document.getElementById('printthis').innerHTML;
            var popupWin = window.open('', '_blank', 'width=500,height=500');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" style="*{transition:none!important}"/></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }

        $scope.deleteemployee = function(emp, index) {
            if (confirm('Are you sure you want to delete this?')) {
                console.log(emp);
                $http.post(baseUrl + 'deleteemployee', emp).success(function(res, req) {
                    console.log('deleteemployee', res);
                    if (res.status == true) {
                        $scope.employees.splice(index, 1);
                    } else {
                        $scope.created = false
                    }
                }).error(function(error) {
                    console.log("problem In creating payslip", error);
                });
            }
        };

        $scope.deleteemployeepayslip = function(emp, index) {
            console.log(emp.salary_info_id);
            if (confirm('Are you sure you want to delete this?')) {
                console.log(emp);
                $http.post(baseUrl + 'deleteemployeepayslip', emp).success(function(res, req) {
                    console.log('deleteemployeepayslip', res);
                    if (res.status == true) {
                        $scope.empPayslip.splice(index, 1);
                    } else {
                        $scope.created = false
                    }
                }).error(function(error) {
                    console.log("problem In creating payslip", error);
                });
            }
        };


        $scope.currencies = [{
            'name': 'Rupee',
            'symbol': 'INR'
        }, {
            'name': 'Singapore Dollar',
            'symbol': 'SGD'
        }];
        $scope.selectedcurrency = $scope.currencies[0].symbol;
        // $scope.curr = $sce.trustAsHtml($scope.currencies[0].symbol);

        $scope.saveCalculatedSalary = function() {
            $http.post(baseUrl + 'savepayslip', $scope.salaryInfo).success(function(res, req) {
                //    console.log('response salary api', res);
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
            //    console.log('employee param', emp);
            $scope.current_emp = emp;
            // console.log('current employee', $scope.current_employee);
            $http.post(baseUrl + 'employeepayslip', emp).success(function(res, req) {
                //    console.log('response salary api', res);
                $scope.empPayslip = res.payslips;
            }).error(function(error) {
                console.log("problem In creating payslip", error);
            });
        };

        $scope.user = {
            username: '',
            password: ''
        };

        $scope.userlogin = function(user, valid) {
            //        console.log('user', $scope.user);
            if ($scope.user.username == 'admin' && $scope.user.password == 'admin') {
                var userSession = {
                    'login': true,
                    'userid': 1,
                    'user_name': user.username
                };
                store.set('userSession', userSession);
                AuthService.isAuthenticated = true;
                $scope.init();
                $state.go('welcomepage');
            } else {

            }
        };

        // /**
        //   @function usersignout
        //   @author Sameer Vedpathak
        //   @initialDate
        //   @lastDate
        // */
        $scope.usersignout = function() {
            store.remove('userSession');
            $location.path('signin');
            $scope.init();
        };


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

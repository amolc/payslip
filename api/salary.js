var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var settingCRUD = CRUD(connection, 'salary_settings');
var employeeCRUD = CRUD(connection, 'emp_details');
var salaryCRUD = CRUD(connection, 'salary_records');

exports.settings = function(req, res) {
    //console.log('settings api');
    settingCRUD.load({}, function(err, settings) {
        if (!err) {

            employeeCRUD.load({}, function(error, employees) {
                if (!error) {
                    res.jsonp({
                        status: true,
                        settings: settings,
                        employees: employees
                    });
                } else {
                    console.log('error reading settings');
                    res.jsonp({
                        status: false
                    });
                }
            });
        } else {
            console.log('error reading settings');
            res.jsonp({
                status: false
            });
        }
    });
};


exports.getemployee = function(req, res) {
  //  console.log('getemployee', req.body);
    employeeCRUD.load({
        emp_id: req.body.emp_id
    }, function(error, employees) {
        if (!error) {
            res.jsonp({
                status: true,
                employees: employees
            });
        } else {
            console.log('error reading settings');
            res.jsonp({
                status: false
            });
        }
    });
};

exports.employeepayslip = function(req, res) {
  //  console.log('employeepayslip', req.body);
    salaryCRUD.load({
        salary_record_empid: req.body.emp_payslip
    }, function(error, payslips) {
        if (!error) {
            res.jsonp({
                status: true,
                payslips: payslips
            });
        } else {
            console.log('error reading payslip of employee', error);
            res.jsonp({
                status: false
            });
        }
    });
};

exports.deleteemployee = function(req, res) {
    // employeeCRUD
    // salaryCRUD
  //  console.log('deleteemployee', req.body.emp_id);
    employeeCRUD.destroy({
        emp_id: req.body.emp_id
    }, function(error, payslips) {
        if (!error) {
            salaryCRUD.destroy({
                salary_record_empid: req.body.emp_id
            }, function(err, result) {
                res.jsonp({
                    status: true,
                    payslips: payslips
                });
            });
        } else {
            console.log('error reading payslip of employee', error);
            res.jsonp({
                status: false
            });
        }
    });
};

exports.deleteemployeepayslip = function(req, res) {
    // employeeCRUD
    // salaryCRUD
  //  console.log('deleteemployee', req.body.emp_id);
    salaryCRUD.destroy({
        salary_info_id: req.body.salary_info_id
    }, function(error, payslips) {
        if (!error) {
            res.jsonp({
                status: true,
                payslips: payslips
            });
        } else {
            res.jsonp({
                status: false
            });
        }

    });
};



exports.createmployee = function(req, res) {
  //  console.log('create employee', req.body);
    var employee = req.body;
    employeeCRUD.create({
        emp_name: employee.emp_name,
        emp_doj: employee.emp_doj,
        emp_department: employee.emp_department,
        emp_designation: employee.emp_designation
    }, function(error, employees) {
        if (!error) {
            console.log('employees', employees);
            res.jsonp({
                status: true,
                emp_id: employees.insertId
            });
        } else {
            console.log('error creating employee', error);
            res.jsonp({
                status: false
            });
        }
    });
};

exports.savepayslip = function(req, res) {
    //  console.log('savepayslip', req.body[0].new_salary);
    var empInfo = req.body[0].empInfo,
        new_salary = req.body[0].new_salary,
        deduction = req.body[0].deduction,
        cash_in_hand = req.body[0].cash_in_hand,
        ctc = req.body[0].ctc
        //res.jsonp('pad');
    salaryCRUD.create({
        'salary_record_empid': empInfo.emp_id,
        'salary_record_empname': empInfo.emp_name,
        'salary_record_basic': new_salary.salary_record_basic,
        'salary_record_hr': new_salary.salary_record_hr,
        'salary_record_conv': new_salary.salary_record_conv,
        'salary_record_medical': new_salary.salary_record_medical,
        'salary_record_personal': new_salary.salary_record_personal,
        'salary_record_phone': new_salary.salary_record_phone,
        'salary_record_pf': new_salary.salary_record_pf,
        'salary_record_edu': new_salary.salary_record_edu,
        'salary_record_incometax': new_salary.salary_record_incometax,
        'salary_record_esi': new_salary.salary_record_esi,
        'salary_record_gross': new_salary.salary_record_gross,
        'salary_record_month': req.body[0].month,
        'created_on': 'NULL',
        'modified_on': 'NULL',
        'notes': req.body[0].notes,
        'selectedcurrency': req.body[0].selectedcurrency,
        'salary_record_totalsalary': req.body[0].salary_total,
        'salary_record_pt': new_salary.salary_record_pt,
        'salary_record_deduction': deduction,
        'salary_record_ctc': ctc,
        'salary_record_cash_in_hand': cash_in_hand
    }, function(error, record) {
        if (!error) {
            res.jsonp({
                status: true,
                salary: record
            });
        } else {
            console.log('error saving payslip');
            res.jsonp({
                status: false
            });
        }
    });

};

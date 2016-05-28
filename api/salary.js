var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var settingCRUD = CRUD(connection, 'salary_settings');
var employeeCRUD = CRUD(connection, 'emp_details');

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
    // console.log('getemployee');
     employeeCRUD.load({emp_id : req.body.emp_id}, function(error, employees) {
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

/*var express = require('express');
var mysql = require('mysql');
var CRUD = require('mysql-crud');
var env = require('./environment');
var connection = env.Dbconnection;
var SendNotification = CRUD(connection,'todos');
var deviceCrud  = CRUD(connection,'device_information');
var async = require("async");


exports.sendnotification = function(req,res){
            var gcm = require('node-gcm');
            var sender = new gcm.Sender('AIzaSyAJ9kNU7h4VSK2oiqrD5EatNVvzBD6zsxw');
            var message = new gcm.Message();

            message.addData('title', 'New Message');
            message.addData('sound', 'notification');

            message.collapseKey = 'testing';
            message.delayWhileIdle = true;
            message.timeToLive = 3000;

            var userid = req.body.user_id;
            var registrationIds = [];
            var remidermessages = [];
            var remindertimes = [];
          var query1 = "SELECT todo_id,todo_data,user_id,reminder_date,reminder_time,deviceid,platform,device_token FROM device_information JOIN todos ON device_information.userid=todos.user_id";
          connection.query(query1, function( error , result ){
              for (var i = 0; i < result.length; i++) {
                if (result[i].reminder_date.yyyymmdd() == currentdate.yyyymmdd() && result[i].reminder_time == finaltime) {
                    remidermessages = result[i].todo_data;
                    registrationIds = result[i].device_token;
                    remindertimes = result[i].reminder_time;
                    message.addData('message', remidermessages);

                    sender.send(message, registrationIds, function(err,result1) {
                        console.log("the result is");
                        console.log(result1);
                        console.log( err );
                    });
                    console.log("remidermessages:",remidermessages);
                    console.log("registrationIds:",registrationIds);
                    console.log("remindertimes:",remindertimes);

                  };

              };
                    console.log("*******************************");
                res.jsonp(result);
          });
};*/

/**** javascript function for getting date******/

/* Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy +"-"+ (mm[1]?mm:"0"+mm[0])+"-"+(dd[1]?dd:"0"+dd[0]);
  };

currentdate = new Date();
currentdate.yyyymmdd();*/

/********************* END ***************************

/******** javascript function for getting Current System time with am/pm *********************/

 /* var currentdt = new Date();
  var hrs = currentdt.getHours();
  var min = currentdt.getMinutes();
  var AMPM = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; // the hour '0' should be '12'
  minutes = min < 10 ? '0'+min : min;
  var finaltime = hrs + ':' + min + ' ' + AMPM;
  console.log("Currenttime:",finaltime);*/

/********   End of code for current time *********************************************/


/********************* Cron Code **********************/

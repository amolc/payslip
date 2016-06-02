#!/usr/bin/env node

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();


var app = express();

/**
 * Module dependencies.
 */

var debug = require('debug')('templates:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '9999');

/**
 * Create HTTP server.
 */

var server = http.createServer(app);



/*uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));*/

//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'mobile')));


/*catch 404 and forward to error handler*/
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/


/**
 * development error handler
 * will print stacktrace
 */

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * production error handler
 * no stacktraces leaked to user
 */

/*app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});*/

app.use('/', express.static(__dirname + '/public'));
app.use('/api', express.static(__dirname + '/api'));
app.use('/mobile', express.static(__dirname + '/mobile/www'));

var userlogin = require('./api/userlogin.js');
var todos = require('./api/todos.js');
var device_register = require('./api/device_register.js');
var sendpushnotification = require('./api/sendpushnotification.js');
var salary = require('./api/salary.js');
//var savepayslip = require('./api/salary.js');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//app.use('/api/setting', salary);
app.get('/api/setting', salary.settings);
app.post('/api/getemployee', salary.getemployee);
app.post('/api/savepayslip', salary.savepayslip);
app.post('/api/employeepayslip', salary.employeepayslip);
app.post('/api/createmployee', salary.createmployee);
app.post('/api/deleteemployee', salary.deleteemployee);
app.post('/api/deleteemployeepayslip', salary.deleteemployeepayslip);



// app.post('/api/login', userlogin.login);
// app.post('/api/addtodos',todos.addtodos);
// app.post('/api/gettodos',todos.gettodos);
// app.post('/api/gettododetails',todos.gettododetails);
// app.post('/api/updatetodos',todos.updatetodos);
// app.post('/api/deletetodo',todos.deletetodo);
// app.post('/api/deviceregister',device_register.deviceregister);
// app.post('/api/signup',userlogin.signup);
/*app.get('/api/sendnotification',sendpushnotification.sendnotification);*/

module.exports = app;

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('listening', port);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

//for database connection
var mysql = require('mysql');
var http = require('http');

var enviroment = {
	Dbconnection : mysql.createPool({
			database : 'salary',
		    user : 'ftdev',
			password : '10gXWOqeaf',
		    host :'apps.fountaintechies.com',
	}),

	/** Function For Time stamp**/
	timestamp: function() {
      var UTCtimestamp = new Date();
      return UTCtimestamp.getTime();
    }
}
module.exports = enviroment;

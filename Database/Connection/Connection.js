var config = require('../Config/Config')
var Connection = require('tedious').Connection;  
var connection = new Connection(config)
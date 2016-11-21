/**
 * SQL
 * Barry Dempsey 2015
 * @type {exports|module.exports}
 */

var server = require('./server');
    requestHandler = require('./requestHandler');

var handle = {};
handle['/add'] = requestHandler.addToDatabase;
handle['/'] = requestHandler.getContents;
handle['/availability'] = requestHandler.getRooms;
handle['/delete'] = requestHandler.deleteFromDatabase;

console.log(handle);

server.start(handle);
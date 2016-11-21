var sql = require('mysql');
    results = new Array();
    async = require('async');
    querystring = require('querystring');
    fs = require('fs');
    booking = require('./Booking');
    password = 'password';


function add(response, request) {
    var requestBody = '';
    var postParameters;
    request.on('data', function(data){
        requestBody += data;
    });
    request.on('end', function(){
        postParameters = querystring.parse(requestBody);
        addToDatabase(postParameters.content, function(){
            response.writeHead(302, {"Location" : "/"});
            response.end();
        })
    });
}

function addToDatabase(response, request, query) {
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        password : password,
        database : 'hotel'
    });

    var requestBody = "";
    var postParameters;
    request.on('data', function(data){
        requestBody += data;
    });
    request.on('end', function(){
        postParameters = querystring.parse(requestBody);
        query = postParameters.content;

        var splitQuery = query.split(" ");
        var name = splitQuery[0];
        var lastName = splitQuery[1];
        var roomType = splitQuery[2];

        connection.query('INSERT INTO guests (customer_name, customer_lastname, room_type) VALUES ("' + name + '", "' + lastName + '", "' + roomType + '")', function(err, result){
            if(err)
                console.dir('Problem inserting data into the table' + err);
            else if (result) {
                console.log('result->' + result.toString());
                connection.query('UPDATE rooms SET room_occupied=1 WHERE room_type="' + roomType + '"');
                response.writeHead(302, {"Location" : "/"});
                response.end();
                //connection.close();
            }
        });
    });
}

function getContentsFromDatabase(response, request, filter) {
    var q = querystring.parse(url.parse(request.url).query).q;
    console.log(q);
    /**
     * connect to SQL on localhost
     */
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        port : 3306,
        password : password,
        database : 'hotel'
    }, function(err){
        console.log('we have an error' + err);
    });
    var resultString = "";

    /**
     * SQL query to select all rows from table
     */
    var query;
    if(q) {
        query = connection.query('SELECT * FROM guests WHERE customer_lastname LIKE"' + q + '%"');
    }else {
        query = connection.query('SELECT * FROM guests');
    }

    query.on('error', function(err){
        console.log('error' + err);
    });

    /**
     * event emitter on query to read in
     * all results in non-block
     */
    query.on('result', function(result){
        resultString += 'Booking id: ' + result.id + result.customer_lastname.substring(0, 4).toUpperCase();
        resultString += ' \nGuest name: ' + result.customer_name;
        resultString += ' Guest lastname: ' + result.customer_lastname;
        resultString += ' Address: ' + result.customer_address;
        resultString += ' \nRoom-type: ' + result.room_type;
        resultString += ' \nCheckin-in: ' + result.check_in;
        resultString += '\n\n';
    });

    /**
     * reached the end of rows from query
     * so close the connection and update the
     * html page content with rows
     */
    query.on('end', function(){
        connection.end();
        /**
         * read in the current html file from the drive
         * and replace the content with rows from query
         */
        fs.readFile('./dbcontent.html', 'utf-8', function(err, html){
            if(err) throw err;
            var pageContent = html;
            response.writeHead(200, {"Content-Type" : "text/html"});
            response.write(pageContent.replace('DBCONTENT', resultString));
            response.end();
        });
    });
}

function getRooms(response, request, filter) {
    var q = querystring.parse(url.parse(request.url).query).q;
    console.log(q);
    /**
     * connect to SQL on localhost
     */
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        port : 3306,
        password : password,
        database : 'hotel'
    }, function(err){
        console.log('we have an error' + err);
    });
    var resultString = "";

    /**
     * SQL query to select all rows from table
     */
    var query;
    if(q) {
        query = connection.query('SELECT * FROM rooms WHERE room_type LIKE"' + q + '%" AND room_occupied=0');
        console.log('SELECT * FROM rooms WHERE type LIKE"' + q + '%"');
    }else {
        query = connection.query('SELECT * FROM rooms WHERE room_occupied=0');
    }

    query.on('error', function(err){
        console.log('error' + err);
    });

    /**
     * event emitter on query to read in
     * all results in non-block
     */
    query.on('result', function(result){
        resultString += 'Booking id: ' + result.room;
        resultString += '\nRoom type: ' + result.room_type;
        resultString += ' Sleeps: ' + result.room_sleeps;
        resultString += ' Cost p/Night: ' + result.room_cost;
        resultString += ' Occupied: ' + result.room_occupied;
        resultString += '\n\n';
    });

    /**
     * reached the end of rows from query
     * so close the connection and update the
     * html page content with rows
     */
    query.on('end', function(){
        connection.end();
        /**
         * read in the current html file from the drive
         * and replace the content with rows from query
         */
        fs.readFile('./dbcontent.html', 'utf-8', function(err, html){
            if(err) throw err;
            var pageContent = html;
            response.writeHead(200, {"Content-Type" : "text/html"});
            response.write(pageContent.replace('DBCONTENT', resultString));
            response.end();
        });
    });
}

function deleteFromDatabase(response, request, filter) {
    var q = querystring.parse(url.parse(request.url).query).q;
    console.log(q);
    /**
     * connect to SQL on localhost
     */
    var connection = sql.createConnection({
        host : 'localhost',
        user : 'root',
        port : 3306,
        password : password,
        database : 'hotel'
    }, function(err){
        console.log('we have an error' + err);
    });
    var resultString = "";

    /**
     * SQL query to select all rows from table
     */
    var query = connection.query('DELETE FROM guests WHERE customer_lastname = "' + q + '"');
    console.log('DELETE FROM bookings WHERE customer_lastname = "' + q + '"');

    query.on('error', function(err){
        console.log('error' + err);
    });

    /**
     * event emitter on query to read in
     * all results in non-block
     */
    query.on('result', function(result){

    });

    /**
     * reached the end of rows from query
     * so close the connection and update the
     * html page content with rows
     */
    query.on('end', function(){
        connection.end();
        /**
         * read in the current html file from the drive
         * and replace the content with rows from query
         */
        fs.readFile('./dbcontent.html', 'utf-8', function(err, html){
            if(err) throw err;
            var pageContent = html;
            response.writeHead(200, {"Content-Type" : "text/html"});
            response.write(pageContent.replace('DBCONTENT', resultString));
            response.end();
        });
    });
}

exports.add = add;
exports.getContents = getContentsFromDatabase;
exports.addToDatabase = addToDatabase;
exports.getRooms = getRooms;
exports.deleteFromDatabase = deleteFromDatabase;
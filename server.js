var http = require('http');
    url = require('url');
    router = require('./router');

function start(handle) {
    http.createServer(function(request, response){
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        console.dir(query);
        console.dir(pathname);

        router.route(handle, pathname, query, response, request);

    }).listen(8080);
}
console.log('server started on port 8080');
exports.start = start;
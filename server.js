var http = require('http');
    url = require('url');
    router = require('./router');
    port = 8888;

function start(handle) {
    http.createServer(function(request, response){
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        console.dir(query);
        console.dir(pathname);

        router.route(handle, pathname, query, response, request);

    }).listen(port);
}
console.log('server started on port' + port);
exports.start = start;


function route(handle, pathname, query, response, request)  {
    console.log(handle);
    if(typeof handle[pathname] === 'function') {
        handle[pathname](response, request, query);
    }else {
        response.writeHead(404, {"Content-Type" : "text/plain"});
        response.write("404 not found");
        response.end();
    }
}

exports.route = route;
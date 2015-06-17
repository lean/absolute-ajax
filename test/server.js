var Hapi = require('hapi');
var Path = require('path');
var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});



server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      var html = "<html>"
                    +"<head>"
                      +"<title>Mocha Tests</title>"
                      +"<link rel='stylesheet' href='public/mocha.css' />"
                    +"</head>"
                    +"<body>"
                      +"<div id='mocha'></div>"

                      +"<script src='//cdnjs.cloudflare.com/ajax/libs/json2/20130526/json2.min.js'></script>"
                      +"<script src='public/absolute-ajax.js'></script>"
                      +"<script src='public/expect.js'></script>"
                      +"<script src='public/mocha.js'></script>"
                      +"<script>mocha.setup('bdd')</script>"
                      +"<script src='public/test.js'></script>"
                      +"<script>"
                      +"  mocha.checkLeaks();"
                      +"  mocha.run();"
                      +"</script>"
                    +"</body>"
                    +"</html>";
       reply(html).takeover();
    }
});


server.route({
    method: 'GET',
    path: '/json',
    handler:
         function (request, reply) {
          reply({"asd" : 123});
        }
});

server.route({
    method: 'GET',
    path: '/public/{filename}',
    handler:
         function (request, reply) {
          reply.file('./public/' + request.params.filename);
        }
});

server.route({
    method: 'POST',
    path: '/post',
    handler:
         function (request, reply) {
          reply(200);
        }
});

// Start the server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

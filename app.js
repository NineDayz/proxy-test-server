var http = require('http'),
  connect = require('connect'),
  harmon = require('harmon'),
  httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var app = connect();

var proxy = httpProxy.createProxyServer({});

var selects = [];
var simpleselect = {};

simpleselect.query = 'a';
simpleselect.func = function (node) {
  var href =  node.getAttribute('href') || '';
  console.log(href.replace('www.toyotanation.com','localhost:5050'));
  node.setAttribute('href',href.replace('http://www.toyotanation.com','https://toyotanation-ninedayz.c9users.io'));
}

selects.push(simpleselect);

app.use(harmon([], selects));

app.use(function (req, res) {
  proxy.web(req, res, {
    target: 'http://www.toyotanation.com',
    changeOrigin: true
  });});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('host', 'www.toyotanation.com');
});

var server = http.createServer(app);

console.log(process.env.PORT);
server.listen(process.env.PORT);
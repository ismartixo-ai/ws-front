const http = require("http");
const httpProxy = require("http-proxy");

const TARGET = "http://62.60.229.26:8080";
const PATH = "/n8fhK2pLmQ";

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  ws: true,
  changeOrigin: true
});

const server = http.createServer((req, res) => {
  if (req.url.startsWith(PATH)) {
    proxy.web(req, res);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  }
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith(PATH)) {
    proxy.ws(req, socket, head);
  } else {
    socket.destroy();
  }
});

const port = process.env.PORT || 10000;
server.listen(port, "0.0.0.0");

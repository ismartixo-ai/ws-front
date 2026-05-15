const http = require("http");
const httpProxy = require("http-proxy");

const TARGET = "http://62.60.229.26:8080";
const PATH = "/n8fhK2pLmQ";

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  ws: true,
  changeOrigin: false,
  secure: false,
  timeout: 120000,
  proxyTimeout: 120000
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err.message);
  if (res && !res.headersSent) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Proxy error");
  }
});

const server = http.createServer((req, res) => {
  if (req.url.startsWith(PATH)) {
    proxy.web(req, res, { target: TARGET });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  }
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith(PATH)) {
    proxy.ws(req, socket, head, { target: TARGET });
  } else {
    socket.destroy();
  }
});

const port = process.env.PORT || 10000;
server.listen(port, "0.0.0.0", () => {
  console.log("Proxy running on port", port);
});

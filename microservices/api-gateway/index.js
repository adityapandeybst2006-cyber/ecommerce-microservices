const http = require('http');
const fs = require('fs');
const path = require('path');
const routes = [['/api/auth',4001],['/api/products',4002],['/api/cart',4003],['/api/orders',4004],['/api/payments',4005]];
const frontend = path.resolve(__dirname, '../../frontend');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css'};
function proxy(req,res,port,target) {
  const out = http.request({hostname:'localhost',port,path:target,method:req.method,headers:req.headers}, incoming => { res.writeHead(incoming.statusCode,{...incoming.headers,'access-control-allow-origin':'*'}); incoming.pipe(res); });
  out.on('error',()=>{res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Requested service is unavailable'}));}); req.pipe(out);
}
http.createServer((req,res) => {
  const url = new URL(req.url,'http://localhost');
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PATCH,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'});return res.end();}
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({service:'api-gateway',status:'healthy'}));}
  const route=routes.find(([prefix])=>url.pathname.startsWith(prefix));
  if(route)return proxy(req,res,route[1],url.pathname.replace('/api','')+url.search);
  const requested=url.pathname==='/'?'/index.html':url.pathname;
  const file=path.normalize(path.join(frontend,requested));
  if(!file.startsWith(frontend)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
}).listen(4000,()=>console.log('api-gateway running on http://localhost:4000'));

const { spawn } = require('child_process');
const path = require('path');

const services = [
  ['auth-service', 'microservices/auth-service/index.js'],
  ['product-service', 'microservices/product-service/index.js'],
  ['cart-service', 'microservices/cart-service/index.js'],
  ['order-service', 'microservices/order-service/index.js'],
  ['payment-service', 'microservices/payment-service/index.js'],
  ['api-gateway', 'microservices/api-gateway/index.js']
];

console.log('\nStarting Viora ecommerce microservices...');
console.log('Website: http://localhost:4000\n');

const children = services.map(([name, file]) => {
  const child = spawn(process.execPath, [path.join(__dirname, file)], { stdio: 'inherit' });
  child.on('exit', code => console.log(`${name} stopped (${code ?? 'unknown'}).`));
  return child;
});

function stopAll() {
  children.forEach(child => child.kill());
  process.exit();
}
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);

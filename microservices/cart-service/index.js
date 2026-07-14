const { service, send, readBody } = require('../shared/http');
const carts = new Map();
const cartFor = id => carts.get(id) || [];

service('cart-service', 4003, async (req, res) => {
  const match = req.url.match(/^\/cart\/([^/?]+)(?:\/(\d+))?/);
  if (!match) return send(res, 404, { error: 'Route not found' });
  const [, userId, productId] = match;
  const cart = cartFor(userId);
  if (req.method === 'GET') return send(res, 200, cart);
  if (req.method === 'POST') {
    const item = await readBody(req);
    if (!item.id || !item.name || !item.price) return send(res, 422, { error: 'Product details are required' });
    const existing = cart.find(p => p.id === item.id);
    existing ? existing.qty += 1 : cart.push({ ...item, qty: 1 });
    carts.set(userId, cart); return send(res, 201, cart);
  }
  const product = cart.find(p => p.id === Number(productId));
  if (req.method === 'PATCH' && product) { product.qty = Math.max(1, Number((await readBody(req)).qty) || 1); return send(res, 200, cart); }
  if (req.method === 'DELETE' && product) { carts.set(userId, cart.filter(p => p.id !== product.id)); return send(res, 200, carts.get(userId)); }
  send(res, 404, { error: 'Cart item not found' });
});

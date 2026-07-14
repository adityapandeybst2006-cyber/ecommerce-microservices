const { service, send, readBody } = require('../shared/http');
const orders = [];

service('order-service', 4004, async (req, res) => {
  if (req.method === 'POST' && req.url === '/orders') {
    const { userId, items } = await readBody(req);
    if (!userId || !Array.isArray(items) || !items.length) return send(res, 422, { error: 'User and order items are required' });
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = { id: `ord_${Date.now()}`, userId, items, total, status: 'created', createdAt: new Date().toISOString() };
    orders.push(order);
    return send(res, 201, order);
  }
  const userId = req.url.match(/^\/orders\/user\/([^/?]+)/)?.[1];
  if (req.method === 'GET' && userId) return send(res, 200, orders.filter(order => order.userId === userId));
  send(res, 404, { error: 'Route not found' });
});

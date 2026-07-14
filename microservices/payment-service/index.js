const { service, send, readBody } = require('../shared/http');
service('payment-service', 4005, async (req, res) => {
  if (req.method === 'POST' && req.url === '/payments/charge') {
    const { amount, orderId } = await readBody(req);
    if (!amount || !orderId) return send(res, 422, { error: 'Amount and order ID are required' });
    return send(res, 201, { id: `pay_${Date.now()}`, orderId, amount, currency: 'INR', status: 'paid' });
  }
  send(res, 404, { error: 'Route not found' });
});

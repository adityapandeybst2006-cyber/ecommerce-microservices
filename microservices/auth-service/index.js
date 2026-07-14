const { service, send, readBody } = require('../shared/http');
const users = [];

service('auth-service', 4001, async (req, res) => {
  if (req.method === 'POST' && req.url === '/auth/register') {
    const { name, email, password } = await readBody(req);
    if (!name || !email || !password) return send(res, 422, { error: 'Name, email and password are required' });
    if (users.some(user => user.email === email)) return send(res, 409, { error: 'Email already registered' });
    const user = { id: Date.now(), name, email };
    users.push({ ...user, password });
    return send(res, 201, { user, token: `demo-token-${user.id}` });
  }
  if (req.method === 'POST' && req.url === '/auth/login') {
    const { email, password } = await readBody(req);
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) return send(res, 401, { error: 'Invalid email or password' });
    return send(res, 200, { user: { id: user.id, name: user.name, email: user.email }, token: `demo-token-${user.id}` });
  }
  send(res, 404, { error: 'Route not found' });
});

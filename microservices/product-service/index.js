const { service, send } = require('../shared/http');

const products = [
  { id: 1, name: 'Cotton Printed Kurti', category: 'Apparel', price: 1299, tag: 'New', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85' },
  { id: 2, name: 'Handwoven Jute Tote', category: 'Accessories', price: 799, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85' },
  { id: 3, name: 'Scented Soy Candle', category: 'Home', price: 499, tag: 'New', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Classic Cotton Shirt', category: 'Apparel', price: 1499, tag: '', image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=85' },
  { id: 5, name: 'Ceramic Coffee Mug Set', category: 'Home', price: 899, tag: 'Limited', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Printed Silk Scarf', category: 'Accessories', price: 699, tag: '', image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Relaxed Fit Trousers', category: 'Apparel', price: 1599, tag: '', image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=700&q=85' },
  { id: 8, name: 'Amber Glass Flower Vase', category: 'Home', price: 649, tag: 'New', image: 'https://images.unsplash.com/photo-1612196808214-b7e1d3b66eae?auto=format&fit=crop&w=700&q=85' }
];

service('product-service', 4002, (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/products') {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search')?.toLowerCase();
    let result = category ? products.filter(p => p.category === category) : products;
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search));
    return send(res, 200, result);
  }
  const id = url.pathname.match(/^\/products\/(\d+)$/)?.[1];
  if (req.method === 'GET' && id) {
    const product = products.find(p => p.id === Number(id));
    return product ? send(res, 200, product) : send(res, 404, { error: 'Product not found' });
  }
  send(res, 404, { error: 'Route not found' });
});

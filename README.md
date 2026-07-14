# Shopping Bazar Ecommerce Microservices

Run `npm start`, then visit **http://localhost:4000**. You can also double-click `frontend/open-website.bat`.

## Project structure

```text
frontend/                    Website files (HTML, CSS, JavaScript)
microservices/
  api-gateway/               Single entry point and frontend server (4000)
  auth-service/              Register and login API (4001)
  product-service/           Product catalogue API (4002)
  cart-service/              Shopping cart API (4003)
  order-service/             Order API (4004)
  payment-service/           Demo payment API (4005)
  shared/                    Reusable HTTP helpers
```

Data is in memory for local development.

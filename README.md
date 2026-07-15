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
kubernetes/                  Kubernetes manifests (Deployments, Services, MongoDB)
backend/                     Optional MongoDB + Express backend (controllers, models, routes)
Dockerfile                   Container image definition
docker-compose.yml           Local multi-service orchestration
```

Data is in memory for local development.

## Running Locally (No Docker)

```bash
git clone https://github.com/adityapandeybst2006-cyber/ecommerce-microservices.git
cd ecommerce-microservices
node start-services.js
```

Visit `http://localhost:4000`, or double-click `frontend/open-website.bat` on Windows.

## Running with Docker (Local)

```bash
docker-compose up --build
```

Visit `http://localhost:4000`. Stop with:

```bash
docker-compose down
```

## Running with Kubernetes

### Prerequisites
- `kubectl` installed
- A running cluster (Minikube, Kind, GKE, EKS, etc.)
- Docker image built and pushed to a registry

### 1. Build & push the image

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/ecommerce-microservices:latest .
docker push YOUR_DOCKERHUB_USERNAME/ecommerce-microservices:latest
```

Update `kubernetes/backend-deployment.yaml` — replace the placeholder image name with the one above.

### 2. Start a local cluster (if using Minikube)

```bash
minikube start
```

### 3. Deploy MongoDB

```bash
kubectl apply -f kubernetes/mongodb-deployment.yaml
kubectl apply -f kubernetes/mongodb-service.yaml
```

### 4. Deploy the application

```bash
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
```

### 5. Verify

```bash
kubectl get pods
kubectl get deployments
kubectl get services
```

### 6. Access the app

Minikube:

```bash
minikube service ecommerce-service
```

Cloud provider (GKE/EKS):

```bash
kubectl get service ecommerce-service
```

Then open `http://EXTERNAL-IP`.

### Useful debug commands

```bash
kubectl logs <pod-name>
kubectl describe pod <pod-name>
kubectl exec -it <pod-name> -- /bin/sh
kubectl delete -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl scale deployment ecommerce-microservices --replicas=5
```

## Environment Variables

| Variable    | Description                | Example                                 |
|-------------|-----------------------------|-------------------------------------------|
| `MONGO_URI` | MongoDB connection string  | `mongodb://mongodb:27017/shoppingbazar` |
| `PORT`      | Port for api-gateway       | `4000`                                    |

## Deploying on Render (alternative to Kubernetes)

- **Build Command:** `echo "No build required"`
- **Start Command:** `node start-services.js`
- **Environment:** Node
- **Root Directory:** leave blank

## Known Limitations

- In-memory microservices (`start-services.js`) don't persist data on restart.
- The MongoDB-backed backend (`backend/`) needs `MONGO_URI` pointed at a real database.
- Free-tier Render deployments spin down after inactivity (cold start ~20–30s).
- Demo/learning project — not production-hardened (no rate limiting, no HTTPS config, no secrets manager).

## Note on Deployed (non-localhost) Environments

In `frontend/app.js`, `frontend/auth.js`, and `frontend/checkout.js`, use:

```js
const API = window.location.origin;
```

instead of a hardcoded `http://localhost:4000` — otherwise API calls will fail with CORS/NetworkError once deployed.
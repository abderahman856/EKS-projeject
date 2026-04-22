# DEV-Only Microservices E-Commerce (Localhost)

A local development microservices e-commerce system with:
- React + TailwindCSS frontend
- Node.js + Express backend services
- PostgreSQL for Auth and Order services
- External product API via DummyJSON

## Architecture

- Auth Service: `http://localhost:3001`
- Product Service: `http://localhost:3002`
- Cart Service: `http://localhost:3003`
- Order Service: `http://localhost:3004`
- Payment Service: `http://localhost:3005`
- Notification Service: `http://localhost:3006`
- Frontend (Vite): `http://localhost:5173`

## 1) Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL running locally

## 2) Database Setup

Run:

```bash
psql -U postgres -f database/schema.sql
```

If your Postgres username/password differs, update each service `.env` file after copying from `.env.example`.

## 3) Install Dependencies

Run in each directory:

```bash
cd services/auth && npm install
cd ../product && npm install
cd ../cart && npm install
cd ../order && npm install
cd ../payment && npm install
cd ../notification && npm install
cd ../../frontend && npm install
```

## 4) Environment Files

For each service, create `.env` from `.env.example`:

- `services/auth/.env`
- `services/product/.env`
- `services/cart/.env`
- `services/order/.env`
- `services/payment/.env`
- `services/notification/.env`

Use the same `JWT_SECRET` value in `auth`, `cart`, and `order`.

## 5) Run Services

### Option A: one-command scripts (recommended)

```bash
./start-all.sh
```

Stop all app services:

```bash
./stop-all.sh
```

### Option B: run manually in 7 terminals

```bash
cd services/auth && npm run dev
cd services/product && npm run dev
cd services/cart && npm run dev
cd services/order && npm run dev
cd services/payment && npm run dev
cd services/notification && npm run dev
cd frontend && npm run dev
```

## 6) User Flow

1. Open frontend at `http://localhost:5173`
2. Sign up and login
3. Browse products and add items to cart
4. Open checkout and place order
5. Payment is simulated in payment service
6. Notification message is logged in notification service console
7. View order history in Orders page

## API Documentation

See `docs/API.md` for all endpoints and payloads.

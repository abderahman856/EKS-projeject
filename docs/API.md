# API Documentation

## Auth Service (`:3001`)

### POST `/signup`
Request:
```json
{ "email": "user@example.com", "password": "123456", "role": "user" }
```
Response:
```json
{ "id": 1, "email": "user@example.com", "role": "user" }
```

### POST `/login`
Request:
```json
{ "email": "user@example.com", "password": "123456" }
```
Response:
```json
{
  "token": "jwt-token",
  "user": { "id": 1, "email": "user@example.com", "role": "user" }
}
```

### GET `/me`
Headers: `Authorization: Bearer <token>`

---

## Product Service (`:3002`)

### GET `/products?search=phone`
Response:
```json
{ "products": [ ... ] }
```

### GET `/products/:id`
Response: product object from DummyJSON

---

## Cart Service (`:3003`)

All cart user endpoints support either:
- `Authorization: Bearer <token>`
- or internal `x-user-id` header (service-to-service)

### POST `/cart/add`
```json
{
  "productId": 1,
  "title": "iPhone",
  "price": 999,
  "thumbnail": "https://...",
  "quantity": 1
}
```

### POST `/cart/update`
```json
{ "productId": 1, "quantity": 2 }
```

### GET `/cart`
Response:
```json
{ "items": [ ... ] }
```

### DELETE `/cart/remove`
```json
{ "productId": 1 }
```

### DELETE `/cart/clear`
Headers: `x-user-id: 1`

---

## Order Service (`:3004`)

Requires `Authorization: Bearer <token>`

### POST `/orders`
Creates order from cart, calls payment service, stores in DB, clears cart, and notifies.

Response:
```json
{
  "order": {
    "id": 10,
    "user_id": 1,
    "total_amount": 1500,
    "status": "PAID",
    "transaction_id": "uuid",
    "created_at": "..."
  },
  "items": [ ... ]
}
```

### GET `/orders`
Response:
```json
{ "orders": [ ... ] }
```

---

## Payment Service (`:3005`)

### POST `/pay`
Request:
```json
{ "amount": 100 }
```

Response (success):
```json
{
  "status": "SUCCESS",
  "transaction_id": "random-id"
}
```

Response (failed):
```json
{
  "status": "FAILED",
  "transaction_id": null
}
```

---

## Notification Service (`:3006`)

### POST `/notify`
Request:
```json
{
  "to": "user@example.com",
  "subject": "Order Created",
  "message": "Your order #10 is PAID"
}
```
Response:
```json
{ "status": "SENT" }
```
Notification is simulated with console logging only.

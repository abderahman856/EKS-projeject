

Request:
```json
{ "email": "user@example.com", "password": "123456", "role": "user" }
```
Response:
```json
{ "id": 1, "email": "user@example.com", "role": "user" }
```

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

Headers: `Authorization: Bearer <token>`

---


Response:
```json
{ "products": [ ... ] }
```

Response: product object from DummyJSON

---


All cart user endpoints support either:
- `Authorization: Bearer <token>`
- or internal `x-user-id` header (service-to-service)

```json
{
  "productId": 1,
  "title": "iPhone",
  "price": 999,
  "thumbnail": "https://...",
  "quantity": 1
}
```

```json
{ "productId": 1, "quantity": 2 }
```

Response:
```json
{ "items": [ ... ] }
```

```json
{ "productId": 1 }
```

Headers: `x-user-id: 1`

---


Requires `Authorization: Bearer <token>`

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

Response:
```json
{ "orders": [ ... ] }
```

---


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


---

## Architecture Overview

```
[ Module Angular App ]
      ↓ calls
[ Module .NET API ] (issues user context request)
      ↓ calls with X-Auth-Key
[ CReg .NET API ] (issues JWT)
      ↓ returns JWT
[ Module Angular App ]
      ↓ postMessage(token, userId, orgId)
[ CReg Angular App ]
      ↓
[ CReg .NET API ] (validates JWT for API calls)
```

---


## Security Aspoects

| Component     | Responsibility                                 |
|---------------|------------------------------------------------|
| **CReg API** | Issues and validates JWTs                      |
| **Module API**| Authenticates with CReg API using `X-Auth-Key` |
| **JWT**       | Includes `userId`, `orgId` as claims           |
| **CReg App** | Uses token in `Authorization: Bearer` header   |
| **Module App**| Sends token to CReg via `postMessage`         |

---

## Setup Instructions

### 1. CReg API (.NET)
- Configure `appsettings.json`:
```json
"TokenSettings": {
  "Issuer": "CReg-api",
  "Audience": "CReg-app",
  "SecretKey": "super-secret-signing-key",
  "AuthKey": "4fa2e9d1-bc02-45b6-a5d1-99f3c7bb3c11"
}
```
- Endpoint to issue JWT: `POST /api/token/issue` with header `X-Auth-Key`.

### 2. Module API (.NET)
- Calls CReg API to get token with user context.
- Returns `{ token }` to Module Angular App.

### 3. Module Angular App
- Calls Module API to get token.
- Sends `{ token, userId, orgId }` via `postMessage` to iframe.

###  4. CReg Angular App
- Waits for message from Module.
- Stores token in memory or sessionStorage.
- Uses Angular HTTP interceptor to attach token.

---

## API Summary

### CReg API
- `POST /api/token/issue` → issues token (requires `X-Auth-Key`)
- `GET /api/user/details` → returns user info (JWT required)

### Module API
- `POST /api/relaytoken/get-CReg-token` → fetches token from CReg

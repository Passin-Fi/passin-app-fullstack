Database design for orders (MongoDB)

Collections

-   orders
    -   reference_id: string (unique) — idempotency key for each order
    -   id_pool: string — pool id from request
    -   request: object — original payload sent by client (subset of CreateOrderPaymentInput + id_pool)
    -   payment: object — normalized response from external payment API
    -   status: string — enforced enum (pending, completed_pay, failed_pay, creating_wallet, create_wallet_fail, sending_token_to_smartwallet, send_token_to_smartwallet_fail, completed)
    -   created_at: date — when order created externally
    -   updated_at: date — last update timestamp

Environment variables

-   MONGODB_URI=mongodb://user:pass@host:27017/yourdb?authSource=admin
-   MONGODB_DB_NAME=yourdb

Indexes (recommended)

-   Unique index on reference_id to ensure idempotency:
    -   orders.createIndex({ reference_id: 1 }, { unique: true })
-   Optional: orders.createIndex({ status: 1, created_at: -1 }) for querying dashboards.
-   Unique partial index on external payment id (if present):
    -   orders.createIndex({ 'payment.id': 1 }, { unique: true, partialFilterExpression: { 'payment.id': { $exists: true, $type: 'string' } } })
-   Compound index to list orders by pool and time:
    -   orders.createIndex({ id_pool: 1, created_at: -1 })

API routes wiring

-   POST /api/orders
    -   Proxies to external payment API (onecheckout) via postCreateOrderPayment
    -   Persists/Upserts order into orders collection using reference_id as key
    -   Returns the external API response
-   GET /api/orders?reference_id=...
    -   Fetches a single order by reference_id from MongoDB

Notes

-   Do not run destructive prisma/migrations here — we are using MongoDB driver directly.
-   Ensure MongoDB has persistent storage (volume/managed service). App rebuild/redeploy will not affect stored data.

-   using mongodb to be database of this backend side
-   when user create order, store the order in db:

    -   payment_id (from external payment gateway): unique required
    -   payment_token (from external payment gateway): required
    -   smart_wallet_address (null or string): if null here, means after payment completed, backend need create smart wallet coresponding to passkeys in order response
    -   passkey_credential_id: string (from passkey)
    -   passkey_public_key: string (from passkey)
    -   pool_id: string (from order line)
    -   token_symbol: string (from order line)
    -   amount_token: number (from order line)
    -   min_amount_token_receive: number (from order line)
    -   price_tolerance_percent: number (from order line)
    -   status (pending, completed_pay, failed_pay, creating_wallet, create_wallet_fail , sending_token_to_smartwallet, send_token_to_smartwallet_fail , completed): string
    -   fiat_currency: string
    -   price_fiat: number
    -   created at
    -   updated at

-   when payment gateway call webhook to notify payment completed:
    -   find the order by payment_id
    -   if order not found, return error
    -   if order found, check the payment status by calling payment gateway api
        -   if payment not completed, return nothing or await call next time interval 30s
        -   if payment completed, update order status to completed_pay
        -   then create smart wallet by calling smart wallet api, get back smart wallet address
            -   if create smart wallet fail, update order status to create_wallet_fail, return error
            -   if create smart wallet success, update order status to sending_token_to_smartwallet, update smart_wallet_address in order
            -   then send token to smart wallet by calling token transfer api
                -   if send token to smart wallet fail, update order status to send_token_to_smartwallet_fail, return error
                -   if send token to smart wallet success, update order status to completed
                -   return success
    -
    -   may be run check task in background to check orders in status create_wallet_fail or send_token_to_smartwallet_fail to retry create smart wallet or send token to smart wallet again
    -   when user call get order api, it just return order info with status

---

How to run Mongo locally (Docker)

1. Start MongoDB service:

    - In project root, run Docker Compose to start the `mongo` service.
    - The container exposes port 27017 and creates database `ezsol` with a user `ezsol_app`.

2. Configure backend env:

    - Copy `.env.example` to `.env.local` and adjust if needed.
    - MONGODB_URI should look like:
        - `mongodb://ezsol_app:ezsol_app_password@localhost:27017/ezsol?authSource=ezsol`
    - MONGODB_DB_NAME: `ezsol`

3. Connect from the app:
    - The backend reads env variables `MONGODB_URI` and `MONGODB_DB_NAME` (see `backend/_lib/mongodb.ts`).
    - When the app starts, it will connect and the `orders` collection validator and indexes will be ensured on first use.

Security note: The credentials in docker-compose are for local development only. Change them for any shared/staging/prod environment and restrict network exposure.

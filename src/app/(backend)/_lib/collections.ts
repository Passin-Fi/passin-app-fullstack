import clientPromise from './mongodb';
import type { Collection, Db } from 'mongodb';
import { PaymentStatus } from 'backend/_types/order';
import type { OrderDoc } from 'backend/_types/order';

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || 'ezsol';
    return client.db(dbName);
}

export async function getOrdersCollection(): Promise<Collection<OrderDoc>> {
    const db = await getDb();
    const collName = 'orders';

    // Ensure collection exists with JSON Schema validator
    const validator = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['reference_id', 'id_pool', 'request', 'payment', 'status', 'created_at', 'updated_at'],
            properties: {
                reference_id: { bsonType: 'string', description: 'unique idempotency reference' },
                id_pool: { bsonType: 'string' },
                request: { bsonType: 'object' },
                payment: { bsonType: ['object'] },
                status: { bsonType: 'string', enum: Object.values(PaymentStatus) },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' },
            },
            additionalProperties: true,
        },
    } as const;

    const collections = await db.listCollections({ name: collName }).toArray();
    if (collections.length === 0) {
        await db.createCollection(collName, { validator });
    } else {
        // Try to update validator (no-op if permissions disallow)
        try {
            await db.command({ collMod: collName, validator });
        } catch {}
    }

    const coll = db.collection<OrderDoc>(collName);
    // Ensure indexes
    await coll.createIndex({ reference_id: 1 }, { unique: true, name: 'uniq_reference_id' });
    await coll.createIndex({ status: 1, created_at: -1 }, { name: 'status_created_at' });
    // Unique (partial) index on external payment id when present
    await coll.createIndex(
        { 'payment.id': 1 },
        {
            unique: true,
            name: 'uniq_payment_id',
            partialFilterExpression: { 'payment.id': { $exists: true, $type: 'string' } },
        }
    );
    // Compound index to query orders by pool and time
    await coll.createIndex({ id_pool: 1, created_at: -1 }, { name: 'pool_created_at' });
    return coll;
}

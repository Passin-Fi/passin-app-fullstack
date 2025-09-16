import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

if (!uri) {
    // We don't throw here to keep build flexible; runtime will error if used without URI.
    // console.warn('MONGODB_URI is not set. Database operations will fail.');
}

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        const client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise!;
} else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
}

export default clientPromise;

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

if (!uri) {
    const msg = 'MONGODB_URI is not set. Database operations will fail.';
    if (process.env.NODE_ENV === 'production') {
        // Fail fast in production to avoid silent retries / confusing ECONNREFUSED to localhost.
        throw new Error(msg);
    } else {
        console.warn(msg);
    }
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
    console.log('MongoDB client connected in development mode');
} else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
    console.log('MongoDB client connected in production mode');
}

export default clientPromise;

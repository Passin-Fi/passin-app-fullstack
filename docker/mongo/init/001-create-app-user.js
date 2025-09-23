// This script runs on container first start (when the DB is empty)
// It creates the application database and a dedicated user with readWrite role.
// Env variables provided by docker-compose: MONGO_INITDB_DATABASE, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD

const dbName = process.env.MONGO_INITDB_DATABASE || 'ezsol';
const appUser = process.env.MONGO_APP_USER || 'ezsol_app';
const appPass = process.env.MONGO_APP_PASSWORD || 'change_me_password';

// Create application database and user
const appDb = db.getSiblingDB(dbName);

// Create user if not exists
try {
  appDb.createUser({
    user: appUser,
    pwd: appPass,
    roles: [
      { role: 'readWrite', db: dbName },
      { role: 'dbAdmin', db: dbName },
      { role: 'dbOwner', db: dbName }, // Needed for some mongoose operations
    ],
  });
  print(`Created app user "${appUser}" for db "${dbName}"`);
} catch (e) {
  print(`User creation skipped or failed: ${e}`);
}

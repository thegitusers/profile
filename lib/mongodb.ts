import dns from "dns";
import { MongoClient, type Db } from "mongodb";

// This network's local DNS resolver intermittently fails to resolve
// mongodb.net hostnames (both SRV and plain A record lookups). Route DNS
// through public resolvers instead so lookups don't randomly fail.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesReady: Promise<void> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const promise = new MongoClient(uri as string).connect();
  // Don't leave a rejected promise cached — let the next call retry
  // instead of every future request failing forever.
  promise.catch(() => {
    if (global._mongoClientPromise === promise) {
      global._mongoClientPromise = undefined;
    }
  });
  return promise;
}

async function ensureIndexes(db: Db) {
  await Promise.all([
    db.collection("companies").createIndex({ email: 1 }, { unique: true }),
    db.collection("tickets").createIndex({ companyId: 1, updatedAt: -1 }),
    db.collection("tickets").createIndex({ status: 1, updatedAt: -1 }),
  ]);
}

export async function getDb(): Promise<Db> {
  // Reuse one pooled connection for the life of the server process instead
  // of opening a fresh one on every request.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise();
  }
  const client = await global._mongoClientPromise;
  const db = client.db();

  if (!global._mongoIndexesReady) {
    global._mongoIndexesReady = ensureIndexes(db).catch((err) => {
      console.error("Failed to create indexes:", err);
    });
  }

  return db;
}

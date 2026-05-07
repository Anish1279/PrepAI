import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const globalForDb = globalThis;

function createDatabaseClient() {
  const databaseUrl =
    process.env.DATABASE_URL ??
    process.env.DRIZZLE_DB_URL;

  if (!databaseUrl) {
    throw new Error('Missing database connection string.');
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

function getDatabaseClient() {
  if (!globalForDb.prepAiDb) {
    globalForDb.prepAiDb = createDatabaseClient();
  }

  return globalForDb.prepAiDb;
}

export const db = new Proxy(
  {},
  {
    get(_target, property) {
      const client = getDatabaseClient();
      const value = client[property];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);

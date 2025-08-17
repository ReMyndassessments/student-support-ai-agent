import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const subscriptionDB = new SQLDatabase("subscriptions", {
  migrations: "./migrations",
});

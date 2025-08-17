import { SQLDatabase } from 'encore.dev/storage/sqldb';

export const resourceDB = new SQLDatabase("resources", {
  migrations: "./migrations",
});

import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

const entitiesPath = path.join(__dirname, '../entity/*.{ts,js}');
const migrationPath = path.join(__dirname, '/migrations/*.{ts,js}');
console.log('Entities Path:', entitiesPath);
console.log('Migrations Path:', migrationPath);


export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: parseInt(DB_PORT || "3306"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  ssl: false,
  synchronize: false, // Prevents accidental schema sync in production
  logging: NODE_ENV === "dev",
  entities: [entitiesPath], // Dynamically includes entity files
  migrations: [migrationPath],
  subscribers: [],
  migrationsTableName: 'migrations',
  name: 'default'
});

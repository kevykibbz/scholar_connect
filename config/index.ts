import mysql, { Pool, PoolConnection, QueryOptions } from "mysql2";

export type DbConfig = {
  host: string;
  user: string;
  password: string;
  port?:number;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
};

// Define types for query results
export type QueryResult = {
  affectedRows: number;
  insertId: number;
  warningStatus: number;
  [key: string]: any;
};


// MySQL connection pool
export const dbConfig: DbConfig = {
  host:process.env.NODE_ENV === "production" ? process.env.LIVE_DB_HOST as string :process.env.DB_HOST as string,
  user:process.env.NODE_ENV === "production" ? process.env.LIVE_DB_USER as string: process.env.DB_USER as string,
  password:process.env.NODE_ENV === "production" ? process.env.LIVE_DB_PASS as string : process.env.DB_PASS as string,
  database:process.env.NODE_ENV === "production" ? process.env.LIVE_DB_NAME as string : process.env.DB_NAME as string,
  port: process.env.NODE_ENV === "production"
  ? Number(process.env.LIVE_DB_PORT) || 3306 
  : 3306,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a MySQL connection pool
const pool: Pool = mysql.createPool(dbConfig);

// The query function with generic type T for result
export const query = <T = any>(sql: string, params?: any[]): Promise<T> =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as T); // Type cast the result to type T
      }
    });
  });

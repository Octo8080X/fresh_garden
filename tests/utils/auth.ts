import { lucia } from "npm:lucia";
import { web } from "npm:lucia/middleware";
import { mysql2 } from "npm:@lucia-auth/adapter-mysql";
import mysql from "npm:mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password_root",
  port: 3306,
  database: "test",
});

//await connection.query(`DROP TABLE user_session`);
//await connection.query(`DROP TABLE user_key`);
//await connection.query(`DROP TABLE user`);

await connection.query(`CREATE TABLE user (
  id VARCHAR(15) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);`);
await connection.query(`CREATE TABLE user_key (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  hashed_password VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user(id)
);
`);
await connection.query(`CREATE TABLE user_session (
  id VARCHAR(127) NOT NULL PRIMARY KEY,
  user_id VARCHAR(15) NOT NULL,
  active_expires BIGINT UNSIGNED NOT NULL,
  idle_expires BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
);`);

await connection.destroy();

export const connectionPool = mysql.createPool({
  database: "test",
  host: "localhost",
  user: "root",
  password: "password_root",
  port: 3306,
});

export const auth = lucia({
  adapter: mysql2(connectionPool, {
    user: "user",
    key: "user_key",
    session: "user_session",
  }),
  env: "DEV", // "PROD" for production
  middleware: web(),
  sessionCookie: {
    expires: false,
  },
});

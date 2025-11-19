import { type User } from "../type/User";
import { randomUUID } from "crypto";

// MySQL pool (initialized only if MYSQL_ENABLED)
let pool: any = null;


async function initMySQL() {
  try {
    // dynamic import so project doesn't crash if mysql2 isn't installed
    const mysql = await import("mysql2/promise");
    const host = process.env.DB_HOST || "localhost";
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASS || "";
    const database = process.env.DB_NAME || "fishora";

    // Add refresh_tokens table
    const createRefreshTokenTableSql = `CREATE TABLE IF NOT EXISTS refresh_tokens (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            token VARCHAR(512) NOT NULL,
            expires DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            revoked BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

    console.log("MySQL Configuration:");
    console.log(`- Host: ${host}`);
    console.log(`- Port: ${port}`);
    console.log(`- User: ${user}`);
    console.log(`- Database: ${database}`);
    console.log("Connecting to MySQL...");

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
    });

    // Test the connection
    const [result] = await pool.query("SELECT 1");
    if (result) {
      console.log("✓ MySQL connection test successful");
    }

    // Ensure users table exists (simple schema)
    const createTableSql = `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(32) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            joined DATETIME NOT NULL,
            status ENUM('created','verified') DEFAULT 'created'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

    await pool.query(createTableSql);
    console.log("✓ Users table is ready");

    // Ensure refresh_tokens table exists (depends on users table foreign key)
    await pool.query(createRefreshTokenTableSql);
    console.log("✓ Refresh tokens table is ready");
  } catch (error) {
    console.error("MySQL Connection Error:", error);
    throw error;
  }
}

// Initialize MySQL pool at module load
setTimeout(async () => {
  // Give time for environment variables to load
  console.log("MySQL Enabled:", process.env.MYSQL_ENABLED);
  if (process.env.MYSQL_ENABLED !== "true") {
    console.log(
      "MySQL is not enabled. Set MYSQL_ENABLED=true in .env to use MySQL"
    );
    pool = null;
  } else {
    try {
      console.log("Initializing MySQL connection...");
      await initMySQL();
    } catch (err) {
      console.error("Failed to initialize MySQL:", err);
      pool = null;
    }
  }
}, 1000); // wait 1 second for env vars to load

export async function AddUser(user: User): Promise<void> {

  try {
    const sql =
      "INSERT INTO users (id, name, email, phone, password, joined, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const params = [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.password,
      user.joined,
      user.status,
    ];
    await pool.query(sql, params);
    return;
  } catch (err) {
    console.error("AddUser error:", err);
    throw err;
  }
}

export async function FindUserByPhone(
  phone: string
): Promise<User | undefined> {

  try {
    console.log("Searching for phone number:", phone);
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, password, joined, status FROM users WHERE phone = ? LIMIT 1",
      [phone]
    );
    console.log("Database response:", rows);
    const userDetails: any = Array.isArray(rows) && rows.length ? rows[0] : undefined;
    console.log("Found user:", userDetails ? "yes" : "no");
    if (!userDetails) return undefined;
    return {
      id: String(userDetails.id),
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
      password: userDetails.password,
      joined:
        userDetails.joined instanceof Date
          ? userDetails.joined.toISOString()
          : String(userDetails.joined),
      status: userDetails.status as "created" | "verified",
    };
  } catch (err) {
    console.error("FindUserByPhone error:", err);
    throw err;
  }
}

export async function GetAllUsers(): Promise<User[]> {

  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, phone, password, joined, status FROM users"
    );
    return (rows as any[]).map((r) => ({
      id: String(r.id),
      name: r.name,
      email: r.email,
      phone: r.phone,
      password: r.password,
      joined:
        r.joined instanceof Date ? r.joined.toISOString() : String(r.joined),
      status: r.status as "created" | "verified",
    }));
  } catch (err) {
    console.error("GetAllUsers error:", err);
    throw err;
  }
}

export async function saveRefreshToken(
  userId: string,
  token: string,
  expiresIn: number
): Promise<void> {

  try {
    const id = randomUUID();
    const expires = new Date(Date.now() + expiresIn * 1000);
    await pool.query(
      "INSERT INTO refresh_tokens (id, user_id, token, expires) VALUES (?, ?, ?, ?)",
      [id, userId, token, expires]
    );
  } catch (err) {
    console.error("saveRefreshToken error:", err);
    throw err;
  }
}

export async function GetRefreshToken(token: string): Promise<any> {
 
  try {
    const [rows] = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = ? AND revoked = FALSE AND expires > NOW() LIMIT 1",
      [token]
    );
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  } catch (err) {
    console.error("GetRefreshToken error:", err);
    throw err;
  }
}

export async function RevokeRefreshToken(token: string): Promise<void> {

  try {
    await pool.query(
      "UPDATE refresh_tokens SET revoked = TRUE WHERE token = ?",
      [token]
    );
    return;
  } catch (err) {
    console.error("RevokeRefreshToken error:", err);
    throw err;
  }
}

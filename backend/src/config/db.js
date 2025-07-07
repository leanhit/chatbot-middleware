require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const tblUsers = 'tblUsers'; // Tên bảng người dùng
const tblConfig = 'tblConfig'; // Tên bảng cấu hình

// ⚙️ Tạo bảng nếu chưa có
const initDB = async () => {
  try {
    // Bảng users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tblUsers} (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bảng tblUsers đã sẵn sàng');

    // Bảng config (liên kết với users qua user_id)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS  ${tblConfig}  (
        id SERIAL PRIMARY KEY,
        botpress_bot_id VARCHAR(100) NOT NULL,
        page_id VARCHAR(100) NOT NULL UNIQUE,
        verify_token TEXT NOT NULL,
        app_secret TEXT NOT NULL,
        page_access_token TEXT NOT NULL,
        fanpage_url TEXT,
        bot_url TEXT,
        bot_name VARCHAR(255),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bảng tblConfig đã sẵn sàng');

  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo bảng:', err);
  }
};


initDB();

module.exports = { pool, tblUsers, tblConfig };

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
const tblChatwootConfig = 'tblChatwootConfig'; // Bảng cấu hình Chatwoot

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
        app_secret TEXT NOT NULL,
        botpress_bot_id VARCHAR(100) NOT NULL,
        bot_name VARCHAR(255),
        bot_url TEXT,
        page_id VARCHAR(100) NOT NULL UNIQUE,
        fanpage_url TEXT,
        page_access_token TEXT NOT NULL,
        url_callback TEXT,
        verify_token TEXT NOT NULL,
        user_id INTEGER REFERENCES ${tblUsers}(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bảng tblConfig đã sẵn sàng');

    // ⚙️ Tạo bảng Chatwoot config
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tblChatwootConfig} (
        id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL,
        inbox_id INTEGER NOT NULL UNIQUE,
        botpress_bot_id VARCHAR(100) NOT NULL,
        api_access_token TEXT NOT NULL,
        api_base_url TEXT NOT NULL, -- ví dụ: https://your-chatwoot.com
        tag_if_empty TEXT,
        user_id INTEGER REFERENCES ${tblUsers}(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Bảng tblChatwootConfig đã sẵn sàng');

  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo bảng:', err);
  }
};

initDB();

module.exports = { pool, tblUsers, tblConfig };

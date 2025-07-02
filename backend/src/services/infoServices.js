const pool = require('@/config/db');

const TABLE_NAME = 'facebook_integrations';

const infoServices = {
  // ✅ Thêm bản ghi mới
  add: async ({
    botpress_bot_id,
    page_id,
    verify_token,
    app_secret,
    page_access_token,
    fanpage_url,
    bot_url,
    bot_name,
  }) => {
    const query = `
      INSERT INTO ${TABLE_NAME} 
        (botpress_bot_id, page_id, verify_token, app_secret, page_access_token, fanpage_url, bot_url, bot_name)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      botpress_bot_id,
      page_id,
      verify_token,
      app_secret,
      page_access_token,
      fanpage_url,
      bot_url,
      bot_name,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ✅ Cập nhật thông tin theo ID
  edit: async (id, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) throw new Error("Không có trường nào để cập nhật");

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `
      UPDATE ${TABLE_NAME}
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
  },

  // ✅ Xem tất cả bản ghi
  viewAll: async () => {
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} ORDER BY id DESC`);
    return result.rows;
  },

  // ✅ Xem bản ghi theo ID
  viewById: async (id) => {
    const result = await pool.query(`SELECT * FROM ${TABLE_NAME} WHERE id = $1`, [id]);
    return result.rows[0];
  },

  // ✅ Xoá bản ghi theo ID
  delete: async (id) => {
    await pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = $1`, [id]);
  },
};

module.exports = infoServices;

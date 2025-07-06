const pool = require('@/config/db');

const TABLE_NAME = 'config';

const configServices = {
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
  viewAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const offset = (page - 1) * size;

      const result = await pool.query(`
            SELECT * FROM ${TABLE_NAME}
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `, [size, offset]);

      // Optional: tổng số bản ghi
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${TABLE_NAME}`);
      const total = parseInt(countResult.rows[0].count);

      res.status(200).json({
        content: result.rows,
        page,
        size,
        totalPages: Math.ceil(total / size),
        totalItems: total
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
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

module.exports = configServices;

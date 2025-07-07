// File: src/services/configServices.js
const { pool, tblConfig } = require('@/config/db');

const configServices = {
  // ✅ Thêm bản ghi mới
  add: async ({
    app_secret,
    botpress_bot_id,
    bot_name,
    bot_url,
    page_id,
    fanpage_url,
    page_access_token,
    url_callback,
    verify_token
  }, userId) => {
    const query = `
    INSERT INTO ${tblConfig} 
      (app_secret, botpress_bot_id, bot_name, bot_url, page_id, fanpage_url, page_access_token, url_callback, verify_token, user_id)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

    const values = [
      app_secret,
      botpress_bot_id,
      bot_name,
      bot_url,
      page_id,
      fanpage_url,
      page_access_token,
      url_callback,
      verify_token,
      userId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },


  // ✅ Cập nhật thông tin theo ID, có kiểm tra quyền sở hữu (user_id)
  edit: async (id, data, userId) => {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) throw new Error("Không có trường nào để cập nhật");

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `
      UPDATE ${tblConfig}
      SET ${setClause}
      WHERE id = $${keys.length + 1} AND user_id = $${keys.length + 2}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, id, userId]);

    if (result.rowCount === 0) throw new Error("Không tìm thấy bản ghi hoặc không có quyền chỉnh sửa");

    return result.rows[0];
  },

  // ✅ Xem tất cả bản ghi theo user
  viewAll: async (userId, req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const offset = (page - 1) * size;

      const result = await pool.query(`
        SELECT * FROM ${tblConfig}
        WHERE user_id = $1
        ORDER BY id DESC
        LIMIT $2 OFFSET $3
      `, [userId, size, offset]);

      const countResult = await pool.query(`
        SELECT COUNT(*) FROM ${tblConfig}
        WHERE user_id = $1
      `, [userId]);

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

  // ✅ Xem bản ghi theo ID và kiểm tra user sở hữu
  viewById: async (id, userId) => {
    const result = await pool.query(
      `SELECT * FROM ${tblConfig} WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  // ✅ Xoá bản ghi theo ID và kiểm tra user sở hữu
  delete: async (id, userId) => {
    const result = await pool.query(
      `DELETE FROM ${tblConfig} WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (result.rowCount === 0) {
      throw new Error("Không tìm thấy bản ghi hoặc không có quyền xoá");
    }
  },

  // -------------lấy thông tin cấu hình của bot theo user-----------------
  getPageConfig: async (pageId) => {
    const query = `
      SELECT botpress_bot_id, verify_token, app_secret, page_access_token, page_id
      FROM ${tblConfig}
      WHERE page_id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [pageId]);
    return result.rows[0] || null;
  }
};

module.exports = configServices;

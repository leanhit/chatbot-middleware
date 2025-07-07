//file configController 
const configServices = require('@/services/configServices');
const { pool, tblConfig } = require('@/config/db');
module.exports = {
  add: async (req, res) => {
    try {
      const userId = req.user.id;
      const { pageId } = req.body;


      const query = `SELECT * FROM ${tblConfig} WHERE page_id = $1 LIMIT 1`;
      const result = await pool.query(query, [pageId]);

      if (result.rows[0]) {  // Nếu không có => undefined
        return res.status(400).json({ error: "Page đã tồn tại trong hệ thống." });
      }

      const data = await configServices.add(req.body, userId);
      res.status(201).json({ message: "Thêm thành công", data });
    } catch (error) {
      console.error("❌ Lỗi khi thêm:", error);
      res.status(500).json({ error: "Lỗi server khi thêm dữ liệu" });
    }
  },

  view: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await configServices.viewAll(userId, req, res);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server khi lấy danh sách" });
    }
  },

  viewByID: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const data = await configServices.viewById(id, userId);
      if (!data) return res.status(404).json({ error: "Không tìm thấy bản ghi" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
    }
  },

  edit: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const data = await configServices.edit(id, req.body, userId);
      if (!data) return res.status(404).json({ error: "Không tìm thấy hoặc không có quyền" });
      res.json({ message: "Cập nhật thành công", data });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi cập nhật" });
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const success = await configServices.delete(id, userId);
      if (!success) return res.status(404).json({ error: "Không tìm thấy hoặc không có quyền xoá" });
      res.json({ message: "Xoá thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xoá" });
    }
  },
};

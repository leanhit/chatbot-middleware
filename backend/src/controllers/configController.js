const configServices = require('@/services/configServices');

module.exports = {
  add: async (req, res) => {
    try {
      const data = await configServices.add(req.body);
      res.status(201).json({ message: "Thêm thành công", data });
    } catch (error) {
      console.error("❌ Lỗi khi thêm:", error);
      res.status(500).json({ error: "Lỗi server khi thêm dữ liệu" });
    }
  },

  view: async (req, res) => {
    try {      
      const data = await configServices.viewAll(req, res);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server khi lấy danh sách" });
    }
  },

  viewByID: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await configServices.viewById(id);
      if (!data) return res.status(404).json({ error: "Không tìm thấy bản ghi" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await configServices.edit(id, req.body);
      res.json({ message: "Cập nhật thành công", data });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi cập nhật" });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      await configServices.delete(id);
      res.json({ message: "Xoá thành công" });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi xoá" });
    }
  },
};

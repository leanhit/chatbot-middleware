const { login, register } = require('@/services/authServices');

module.exports = {
  // ✅ Hàm đăng nhập thực tế
  login: async (req, res) => {
    login(req, res);
  },

  // ✅ Hàm đăng ký
  register: (req, res) => {
    console.log("Đăng ký người dùng:", req.body);
    register(req, res);
  }
};

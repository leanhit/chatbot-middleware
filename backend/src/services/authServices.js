const pool = require('@/config/db');
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "secret";


const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu thông tin đăng ký" });
  }

  try {
    // 1. Kiểm tra email đã tồn tại chưa
    const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
    const checkResult = await pool.query(checkEmailQuery, [email]);

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ message: "Email đã được sử dụng" });
    }

    // 2. Nếu chưa tồn tại, tiến hành tạo user mới
    const insertQuery = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email
    `;
    const insertResult = await pool.query(insertQuery, [email, password]);

    res.status(201).json({
      message: "Đăng ký thành công",
      user: insertResult.rows[0]
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Tìm user theo email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Tài khoản không tồn tại" });
    }

    const user = result.rows[0];

    // 🧠 So sánh mật khẩu (chưa mã hóa)
    if (user.password !== password) {
      return res.status(401).json({ error: "Sai mật khẩu" });
    }

    // ✅ Tạo JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

module.exports = { login, register };

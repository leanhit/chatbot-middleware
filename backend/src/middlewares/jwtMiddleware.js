const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // ⚠️ Nên dùng biến môi trường .env

function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token không được cung cấp hoặc sai định dạng" });
  }

  const token = authHeader.split(" ")[1]; // format: "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (!decoded.id) {
      return res.status(403).json({ message: "Token không chứa thông tin người dùng hợp lệ" });
    }

    req.user = { id: decoded.id }; // chỉ lưu user.id
    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

module.exports = jwtMiddleware;

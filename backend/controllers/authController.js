const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Thiếu thông tin" });

    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ msg: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "12h" });

    res.status(201).json({ msg: "Đăng ký thành công", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Sai email hoặc mật khẩu" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ msg: "Đăng nhập thành công", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.getProfile = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ msg: "Chưa đăng nhập" });
    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });
    res.json(user);
  } catch (e) {
    res.status(401).json({ msg: "Token không hợp lệ" });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ msg: "Chưa đăng nhập" });
    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("schedules");
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });
    res.json(user.schedules || []);
  } catch (e) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.updateSchedules = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ msg: "Chưa đăng nhập" });
    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { schedules } = req.body;
    await User.findByIdAndUpdate(decoded.id, { schedules });
    res.json({ msg: "Cập nhật lịch thành công" });
  } catch (e) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ msg: "Chưa đăng nhập" });
    const token = auth.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, age, height, weight, bodyType, bmiHistory, schedules } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    if (bodyType !== undefined) updateData.bodyType = bodyType;
    if (bmiHistory !== undefined) updateData.bmiHistory = bmiHistory;
    if (schedules !== undefined) updateData.schedules = schedules;

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ msg: "Không tìm thấy user" });

    res.json({ msg: "Cập nhật hồ sơ thành công", user });
  } catch (e) {
    res.status(500).json({ msg: "Lỗi server" });
  }
};

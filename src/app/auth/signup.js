"use client";
import { useState } from "react";
import api from "../../services/api";

export default function Signup({ onSuccess, onSwitch }) {
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.target);
  const name = data.get("name");
  const email = data.get("email");
  const password = data.get("password");
  const confirm = data.get("confirm");
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }
    if (!agree) {
      setError("Bạn phải đồng ý Điều khoản & Chính sách");
      setLoading(false);
      return;
    }
    try {
      // Đảm bảo gọi đúng endpoint, không có dấu // hoặc sai baseURL
      const res = await api.post("/auth/register", { name, email, password });
      const { token } = res.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      // Sau khi đăng ký thành công, chuyển sang onboarding
      window.location.href = "/onboarding";
    } catch (err) {
      setError(err?.response?.data?.msg || err?.response?.data?.message || "Đăng ký thất bại");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Họ tên" required className="w-full border rounded px-3 py-2" />
      <input type="email" name="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
      <input type="password" name="password" placeholder="Mật khẩu (≥ 6 ký tự)" minLength={6} required className="w-full border rounded px-3 py-2" />
      <input type="password" name="confirm" placeholder="Xác nhận mật khẩu" minLength={6} required className="w-full border rounded px-3 py-2" />
      <label className="flex items-center space-x-2 text-sm">
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
        <span>Tôi đồng ý với <span className="text-green-600 underline cursor-pointer">Điều khoản & Chính sách</span></span>
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400" disabled={!agree || loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>
      <p className="mt-4 text-sm text-center">
        Đã có tài khoản?{' '}
        <span className="text-green-600 cursor-pointer" onClick={onSwitch}>Đăng nhập</span>
      </p>
    </form>
  );
}

"use client";
import { useState } from "react";
import api from "../../services/api";

export default function Login({ onSuccess, onSwitch }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.target);
    const email = data.get("email");
    const password = data.get("password");
    try {
      // Gọi đúng endpoint backend
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.msg || err?.response?.data?.message || "Đăng nhập thất bại");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="email" name="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
      <input type="password" name="password" placeholder="Mật khẩu" required className="w-full border rounded px-3 py-2" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <p className="mt-4 text-sm text-center">
        Chưa có tài khoản?{' '}
        <span className="text-green-600 cursor-pointer" onClick={onSwitch}>Đăng ký ngay</span>
      </p>
    </form>
  );
}

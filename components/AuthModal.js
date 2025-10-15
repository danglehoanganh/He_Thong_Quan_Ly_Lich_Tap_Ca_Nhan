"use client";
import { useState } from "react";
import api from "../services/api";
await api.post("/auth/signup", { name, email, password });

function AuthModal({ formType, setFormType, onClose }) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const confirm = data.get("confirm");

    try {
      if (formType === "signup") {
        if (password.length < 6) {
          setError("Mật khẩu phải ≥ 6 ký tự");
          return;
        }
        if (password !== confirm) {
          setError("Xác nhận mật khẩu không khớp");
          return;
        }

        await api.post("/auth/signup", { name, email, password });
        alert("🎉 Đăng ký thành công! Hãy đăng nhập.");
        setFormType("login");
      } else {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", res.data.token); // nếu BE trả token
        alert("✅ Đăng nhập thành công!");
        onClose();
        window.location.href = "/profile"; // chuyển sang trang profile
      }
    } catch (err) {
      setError(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {formType === "login" ? "Đăng nhập" : "Đăng ký"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formType === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              required
              className="w-full border rounded px-3 py-2"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
            className="w-full border rounded px-3 py-2"
          />
          {formType === "signup" && (
            <input
              type="password"
              name="confirm"
              placeholder="Xác nhận mật khẩu"
              required
              className="w-full border rounded px-3 py-2"
            />
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {formType === "login" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          {formType === "login" ? (
            <>
              Chưa có tài khoản?{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => setFormType("signup")}
              >
                Đăng ký ngay
              </span>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => setFormType("login")}
              >
                Đăng nhập
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [bodyType, setBodyType] = useState("");
  const [avatar, setAvatar] = useState("https://randomuser.me/api/portraits/men/12.jpg");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const computeBmi = (w, h) => {
    if (!w || !h) return null;
    const bmi = w / ((h / 100) * (h / 100));
    return Math.round(bmi * 10) / 10;
  };

  const bmi = computeBmi(weight, height);

  const handleAvatarClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          setAvatar(base64);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!name.trim() || !email.trim()) {
      setError("Vui lòng nhập tên và email.");
      return;
    }
    if (!agree) {
      setError("Bạn phải đồng ý để tiếp tục.");
      return;
    }

    setSubmitting(true);

    const profile = {
      name: name.trim(),
      email: email.trim(),
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      bodyType: bodyType || "Không rõ",
      avatar: avatar,
      bmiHistory: [{ date: new Date().toISOString().slice(0, 10), value: bmi }],
    };

    try {
      const token = localStorage.getItem("token");
      if (token) {
        // If logged in, update DB
        await api.put("/user/profile", profile);
      } else {
        // Save to localStorage for offline/non-authenticated users
        if (typeof window !== "undefined") {
          localStorage.setItem("onboardUser", JSON.stringify(profile));
        }
      }

      // small delay to show submitting state
      setTimeout(() => {
        setSubmitting(false);
        router.push("/");
      }, 600);
    } catch (err) {
      setSubmitting(false);
      setError("Không thể lưu dữ liệu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Styled header / hero for onboarding */}
      <div className="bg-gradient-to-r from-green-600 to-teal-400 text-white rounded-lg p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">Bắt đầu</div>
              <div className="text-sm opacity-90">Bước 1 • Tạo hồ sơ của bạn</div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-3">Hoàn tất hồ sơ của bạn</h1>
            <p className="mt-2 text-white/90 max-w-xl">
              Nhập một vài thông tin cơ bản để chúng tôi đề xuất kế hoạch tập luyện, dinh dưỡng và theo dõi tiến độ phù hợp với bạn.
            </p>
            <div className="mt-4 w-40 bg-white/30 rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-white rounded-full w-1/3" />
            </div>
          </div>
          <div className="hidden md:block">
            <img src="/globe.svg" alt="illustration" className="w-20 h-20 opacity-95" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Họ và tên</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium">Tuổi</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min={10}
                max={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Chiều cao (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min={50}
                max={250}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cân nặng (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min={20}
                max={500}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Loại cơ thể (tùy chọn)</label>
            <input
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Ví dụ: Ectomorph, Meso, Endo hoặc 'Khỏe mạnh'"
            />
          </div>

          <div className="flex items-start space-x-2">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <label htmlFor="agree" className="text-sm">
              Tôi đồng ý chia sẻ dữ liệu này để hoàn thành hồ sơ và sử dụng dịch vụ.
            </label>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Hoàn tất và đồng ý"}
            </button>
          </div>
        </form>

        <div className="p-4 border rounded-md bg-gray-50">
          <h2 className="text-lg font-medium mb-2">Xem trước hồ sơ</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-300"
              onClick={handleAvatarClick}
            />
            <div>
              <div className="font-semibold">{name || "Chưa có tên"}</div>
              <div className="text-sm text-gray-600">{email || "Chưa có email"}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Đổi avatar
          </button>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Tuổi: <strong>{age}</strong></div>
            <div>Loại cơ thể: <strong>{bodyType || 'Chưa xác định'}</strong></div>
            <div>Chiều cao: <strong>{height} cm</strong></div>
            <div>Cân nặng: <strong>{weight} kg</strong></div>
            <div>BMI hiện tại: <strong>{bmi ?? '—'}</strong></div>
            <div>Phân loại BMI: <strong>{bmi ? (bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì') : '—'}</strong></div>
          </div>

          <div className="mt-4 text-xs text-gray-600">
            Dữ liệu sẽ được lưu vào cơ sở dữ liệu nếu đã đăng nhập, hoặc localStorage nếu chưa. Sau khi hoàn tất bạn sẽ được chuyển tới trang hồ sơ.
          </div>
        </div>
      </div>
    </div>
  );
}

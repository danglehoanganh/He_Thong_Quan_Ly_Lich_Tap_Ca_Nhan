"use client";
import { useState } from "react";
import api from "./services/api";


function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 md:w-1/2 p-6 rounded shadow relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
       </button>
        <h3 className="text-xl font-bold mb-4">Điều khoản & Chính sách</h3>
        <div className="h-64 overflow-y-scroll text-sm text-gray-700 space-y-2">
          <p>1. Người dùng cam kết cung cấp thông tin chính xác, trung thực khi đăng ký và sử dụng dịch vụ.</p>
          <p>2. Dữ liệu sức khỏe được lưu trữ nhằm mục đích cá nhân hóa trải nghiệm và không chia sẻ cho bên thứ ba khi chưa được phép.</p>
          <p>3. Người dùng đồng ý tuân thủ các quy định sử dụng dịch vụ và chịu trách nhiệm về thông tin đã nhập.</p>
          <p>4. Hệ thống có quyền cập nhật, thay đổi hoặc bổ sung Điều khoản mà không cần thông báo trước.</p>
          <p>5. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc người dùng chấp nhận các điều khoản mới nhất.</p>
          <p>6. Người dùng cần duy trì bảo mật tài khoản, không chia sẻ mật khẩu cho bên thứ ba.</p>
          <p>7. Các tính năng và dữ liệu trong ứng dụng chỉ được sử dụng cho mục đích cá nhân, không được phép khai thác thương mại nếu không có sự cho phép bằng văn bản.</p>
          <p className="font-semibold text-red-600">
            8. Mọi hành vi gian lận, giả mạo dữ liệu hoặc xâm nhập trái phép vào hệ thống sẽ bị khóa tài khoản vĩnh viễn.
          </p>
          <p className="font-semibold text-red-600">
            9. Người dùng vi phạm pháp luật trong quá trình sử dụng dịch vụ sẽ phải chịu trách nhiệm trước cơ quan chức năng.
          </p>
          <p className="font-semibold text-red-600">
            10. Hệ thống có quyền thu hồi quyền truy cập và xóa toàn bộ dữ liệu của người dùng nếu phát hiện hành vi vi phạm nghiêm trọng.
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ formType, setFormType, onClose }) {
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = new FormData(e.target);
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const confirm = data.get("confirm");

    if (formType === "signup") {
      if (password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      if (password !== confirm) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }
      if (!agree) {
        setError("Bạn phải đồng ý Điều khoản & Chính sách");
        return;
      }
      try {
        // Gọi API đăng ký (chuẩn endpoint backend)
        const res = await api.post("/auth/register", { name, email, password });
        const { token } = res.data;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        alert("Đăng ký thành công");
        // Sau khi đăng ký thành công, chuyển sang onboarding
        window.location.href = "/onboarding";
      } catch (err) {
        setError(err?.response?.data?.msg || err?.response?.data?.message || "Đăng ký thất bại");
      }
      return;
    }

    // Đăng nhập
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        window.location.href = "/profile";
      }
    } catch (err) {
      setError(err?.response?.data?.msg || err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        {formType === "login" ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Đăng nhập
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              Chưa có tài khoản?{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => setFormType("signup")}
              >
                Đăng ký ngay
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Đăng ký</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Họ tên"
                required
                className="w-full border rounded px-3 py-2"
              />
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
                placeholder="Mật khẩu (≥ 6 ký tự)"
                minLength={6}
                required
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                name="confirm"
                placeholder="Xác nhận mật khẩu"
                minLength={6}
                required
                className="w-full border rounded px-3 py-2"
              />

              {/* Checkbox đồng ý */}
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>
                  Tôi đồng ý với{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-green-600 underline"
                  >
                    Điều khoản & Chính sách
                  </button>
                </span>
              </label>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                disabled={!agree}
              >
                Đăng ký
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              Đã có tài khoản?{" "}
              <span
                className="text-green-600 cursor-pointer"
                onClick={() => setFormType("login")}
              >
                Đăng nhập
              </span>
            </p>
          </>
        )}
      </div>

      {/* Modal điều khoản */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}


export default function WelcomePage() {
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState("login");
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const openModal = (type) => {
    setFormType(type);
    setShowModal(true);
  };

  // Nội dung từng mục menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "home":
        return (
          <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-br from-white via-green-50 to-emerald-50">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">Cá nhân hoá</span>
                <span className="text-sm text-emerald-700">Bắt đầu hôm nay</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-emerald-800 leading-tight">
                Cá nhân hoá lịch tập cho bạn
              </h1>
              <p className="text-gray-600 mb-6">
                Theo dõi BMI, xây dựng kế hoạch tập luyện thông minh, quản lý tiến
                trình và meal plan phù hợp với thể trạng của bạn.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openModal("signup")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg text-lg shadow hover:from-emerald-700 hover:to-green-600"
                >
                  Bắt đầu ngay
                </button>
                <button
                  onClick={() => setSelectedMenu("news")}
                  className="px-5 py-3 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50"
                >
                  Tìm hiểu thêm
                </button>
              </div>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <li>✓ Kế hoạch tập luyện cá nhân</li>
                <li>✓ Theo dõi tiến độ & BMI</li>
                <li>✓ Gợi ý dinh dưỡng phù hợp</li>
                <li>✓ Nhắc lịch & quản lý thời gian</li>
              </ul>
            </div>
            <div className="mt-8 md:mt-0 md:ml-12 flex-shrink-0">
              <div className="bg-white rounded-2xl p-2 shadow-xl ring-1 ring-emerald-100">
                <img
                  src="https://thichgym.com/wp-content/uploads/2022/03/gymer-la-gi.jpg"
                  alt="Fitness Illustration"
                  className="w-80 h-56 object-cover rounded-xl"
                />
              </div>
            </div>
          </section>
        );
      case "time":
        return (
          <section className="p-8 bg-gray-50 min-h-[300px]">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Quản lý thời gian</h2>
            <p className="mb-2 font-semibold">Chọn một chủ đề bên dưới:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <button className="text-green-700 hover:underline" onClick={() => setSelectedMenu("time1")}>Cách sắp xếp thời gian thể dục khoa học</button>
              </li>
              <li>
                <button className="text-green-700 hover:underline" onClick={() => setSelectedMenu("time2")}>Đọc lời khuyên của các chuyên gia</button>
              </li>
            </ul>
          </section>
        );
      case "time1":
        return (
          <section className="p-8 bg-gray-50 min-h-[300px]">
            <h2 className="text-xl font-bold text-green-600 mb-4">Cách sắp xếp thời gian thể dục khoa học</h2>
            <p>
              Để sắp xếp thời gian tập luyện hiệu quả, hãy xác định mục tiêu rõ ràng, lên lịch tập cố định trong tuần, ưu tiên các bài tập phù hợp với thể trạng và đảm bảo thời gian nghỉ ngơi hợp lý. Hãy bắt đầu từ những buổi tập ngắn, tăng dần cường độ và thời lượng để cơ thể thích nghi.
            </p>
            <button className="mt-4 text-green-700 hover:underline" onClick={() => setSelectedMenu("time")}>← Quay lại Quản lý thời gian</button>
          </section>
        );
      case "time2":
        return (
          <section className="p-8 bg-gray-50 min-h-[300px]">
            <h2 className="text-xl font-bold text-green-600 mb-4">Lời khuyên của các chuyên gia</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Luôn khởi động kỹ trước khi tập luyện để tránh chấn thương.</li>
              <li>Kết hợp tập luyện và chế độ dinh dưỡng hợp lý.</li>
              <li>Ngủ đủ giấc để cơ thể phục hồi tốt nhất.</li>
              <li>Kiên trì và duy trì thói quen tập luyện đều đặn.</li>
            </ul>
            <button className="mt-4 text-green-700 hover:underline" onClick={() => setSelectedMenu("time")}>← Quay lại Quản lý thời gian</button>
          </section>
        );
      case "news":
        return (
          <section className="p-8 bg-gray-50 min-h-[300px]">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Bản tin</h2>
            <p className="mb-4">Cập nhật các tin tức, sự kiện và mẹo sức khỏe mới nhất tại đây!</p>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>
                <button className="text-green-700 hover:underline" onClick={() => setSelectedMenu("healthTips")}>Đọc mẹo sức khỏe</button>
              </li>
            </ul>
            <p className="mb-2 font-semibold">Một số bài báo sức khỏe cộng đồng:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  WHO: Physical activity (Tổ chức Y tế Thế giới)
                </a>
              </li>
              <li>
                <a href="https://www.cdc.gov/physicalactivity/basics/index.htm" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  CDC: Physical Activity Basics (Trung tâm Kiểm soát và Phòng ngừa Dịch bệnh Hoa Kỳ)
                </a>
              </li>
              <li>
                <a href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01234-0/fulltext" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  The Lancet: Global health and physical activity
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4241367/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  NCBI: Public Health and Physical Activity
                </a>
              </li>
              <li>
                <a href="https://www.bmj.com/content/375/bmj.n2715" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  BMJ: Physical activity for health
                </a>
              </li>
              <li>
                <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  WHO: Obesity and overweight (Béo phì và thừa cân)
                </a>
              </li>
              <li>
                <a href="https://www.cdc.gov/chronicdisease/resources/publications/aag/obesity.htm" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  CDC: Adult Obesity Facts
                </a>
              </li>
              <li>
                <a href="https://www.nejm.org/doi/full/10.1056/NEJMra1807873" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  NEJM: The Global Syndemic of Obesity, Undernutrition, and Climate Change
                </a>
              </li>
              <li>
                <a href="https://www.thelancet.com/series/obesity-2015" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  The Lancet: Obesity Series
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1447057/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                  NCBI: Community Health and Preventive Medicine
                </a>
              </li>
            </ul>
          </section>
        );
      case "healthTips":
        return (
          <section className="p-8 bg-gray-50 min-h-[300px]">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Mẹo sức khỏe</h2>
            <ul className="list-decimal ml-6 space-y-3">
              <li>
                Uống đủ nước mỗi ngày để duy trì sự trao đổi chất và sức khỏe tổng thể.
                <a href="https://www.cdc.gov/healthyweight/healthy_eating/water-and-healthier-drinks.html" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 hover:underline">(CDC: Water & Healthier Drinks)</a>
              </li>
              <li>
                Ăn nhiều rau xanh, trái cây và thực phẩm giàu chất xơ để hỗ trợ tiêu hóa.
                <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 hover:underline">(WHO: Healthy Diet)</a>
              </li>
              <li>
                Tập thể dục đều đặn giúp tăng cường sức khỏe tim mạch và giảm stress.
                <a href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/why-is-physical-activity-so-important-for-health-and-wellbeing" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 hover:underline">(AHA: Physical Activity & Health)</a>
              </li>
              <li>
                Ngủ đủ giấc giúp phục hồi năng lượng và tăng cường hệ miễn dịch.
                <a href="https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 hover:underline">(Sleep Foundation: Why Do We Need Sleep?)</a>
              </li>
              <li>
                Hạn chế đồ uống có cồn và tránh hút thuốc lá để bảo vệ sức khỏe lâu dài.
                <a href="https://www.cdc.gov/alcohol/fact-sheets/alcohol-use.htm" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 hover:underline">(CDC: Alcohol Use)</a>
              </li>
            </ul>
            <button className="mt-6 text-green-700 hover:underline" onClick={() => setSelectedMenu("news")}>← Quay lại Bản tin</button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold">FW</div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-emerald-800">Fitness</div>
              <div className="text-xs text-gray-500">Fitness & Nutrition</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button className={`py-2 px-2 text-sm font-medium ${selectedMenu === 'home' ? 'text-emerald-700 border-b-2 border-emerald-400' : 'text-gray-700'}`} onClick={() => setSelectedMenu('home')}>Trang chủ</button>
            <button className={`py-2 px-2 text-sm font-medium ${selectedMenu.startsWith('time') ? 'text-emerald-700 border-b-2 border-emerald-400' : 'text-gray-700'}`} onClick={() => setSelectedMenu('time')}>Quản lý thời gian</button>
            <button className={`py-2 px-2 text-sm font-medium ${selectedMenu === 'news' ? 'text-emerald-700 border-b-2 border-emerald-400' : 'text-gray-700'}`} onClick={() => setSelectedMenu('news')}>Bản tin</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="hidden md:inline px-4 py-2 border rounded text-emerald-700 hover:bg-emerald-50"
              onClick={() => openModal('login')}
            >
              Đăng nhập
            </button>
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              onClick={() => openModal('signup')}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      {/* Menu Bar */}
      <nav className="bg-white shadow flex items-center px-8 border-b relative z-10">
        <ul className="flex space-x-8 text-lg font-medium select-none">
          <li>
            <button
              className={`py-4 px-2 hover:text-green-600 ${selectedMenu === "home" ? "text-green-600 border-b-2 border-green-600" : "text-gray-700"}`}
              onClick={() => setSelectedMenu("home")}
            >
              Trang chủ
            </button>
          </li>
          <li
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={`py-4 px-2 hover:text-green-600 flex items-center gap-1 ${selectedMenu.startsWith("time") ? "text-green-600 border-b-2 border-green-600" : "text-gray-700"}`}
              onClick={() => setSelectedMenu("time")}
            >
              Quản lý thời gian
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full bg-white border rounded shadow w-64 mt-1">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => { setSelectedMenu("time1"); setDropdownOpen(false); }}
                >
                  Cách sắp xếp thời gian thể dục khoa học
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                  onClick={() => { setSelectedMenu("time2"); setDropdownOpen(false); }}
                >
                  Đọc lời khuyên của các chuyên gia
                </button>
              </div>
            )}
          </li>
          <li>
            <button
              className={`py-4 px-2 hover:text-green-600 ${selectedMenu === "news" ? "text-green-600 border-b-2 border-green-600" : "text-gray-700"}`}
              onClick={() => setSelectedMenu("news")}
            >
              Bản tin
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content (changes by menu) */}
      {renderContent()}

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 px-8 py-6 text-center mt-auto">
        <p>Liên hệ: support@fitnessapp.com | Hotline: 0123 456 789</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-white">
            Facebook
          </a>
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            YouTube
          </a>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          © 2025 FitnessApp. All rights reserved.
        </p>
      </footer>

      {/* Modal */}
      {showModal && (
        <AuthModal
          formType={formType}
          setFormType={setFormType}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

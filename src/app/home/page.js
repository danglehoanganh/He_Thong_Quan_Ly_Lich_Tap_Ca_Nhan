"use client";
export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 py-16 bg-gray-50">
      <div className="max-w-lg">
        <h1 className="text-4xl font-bold mb-4 text-green-600">
          Cá nhân hoá lịch tập & dinh dưỡng cho bạn
        </h1>
        <p className="text-gray-600 mb-6">
          Theo dõi BMI, xây dựng kế hoạch tập luyện thông minh, quản lý tiến trình và meal plan phù hợp với thể trạng của bạn.
        </p>
        <a href="#" className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 inline-block">
          Bắt đầu ngay
        </a>
      </div>
      <div className="mt-8 md:mt-0 md:ml-12">
        <img
          src="https://thichgym.com/wp-content/uploads/2022/03/gymer-la-gi.jpg"
          alt="Fitness Illustration"
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}

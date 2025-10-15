"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);


const randomAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

// ====== Modal Form ======
function ScheduleForm({ date, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("Trung bình");
  const [exercisesCount, setExercisesCount] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      date,
      title,
      goal,
      startTime,
      endTime,
      note,
      priority,
      completed: false,
      exercisesCount: parseInt(exercisesCount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-green-600">
          Mời bạn ghi thông tin lịch
        </h2>

        <div>
          <label className="block text-sm">Tiêu đề buổi tập</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm">Mục tiêu</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            placeholder="Ví dụ: Giảm cân, Tăng cơ..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm">Giờ bắt đầu</label>
            <input
              type="time"
              className="border rounded px-3 py-2 w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm">Giờ kết thúc</label>
            <input
              type="time"
              className="border rounded px-3 py-2 w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm">Ghi chú</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">Mức độ ưu tiên</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Thấp</option>
            <option>Trung bình</option>
            <option>Cao</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Số bài tập</label>
          <input
            type="number"
            className="border rounded px-3 py-2 w-full"
            value={exercisesCount}
            onChange={(e) => setExercisesCount(e.target.value)}
            min={1}
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

// ====== ProfilePage ======
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [profileData, setProfileData] = useState(null); // onboarding/profile store
  const [bmiData, setBmiData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState([]);

  const [showRepForm, setShowRepForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [repCount, setRepCount] = useState("");
  const [exerciseResults, setExerciseResults] = useState([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedTutorialExercise, setSelectedTutorialExercise] = useState("");
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  // Danh sách bài tập cần đếm reps
  const repExercises = [
    "Tập tạ", "Hít đất", "Kéo xà", "Nhảy dây", "Squat", "-", "-", "-", "-"
  ];

  // Hình ảnh tutorial cho các bài tập
  const tutorialImages = {
    "Tập tạ tăng cơ (Bench Press, Squat)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS67gkUaRaJtOoyh6Nl1bgvzYKzKM6YaCNk7w&s",
    "Ăn uống bổ sung calo": "https://www.livofy.com/health/wp-content/uploads/2023/09/How-to-gain-10-kg-weight-in-2-months.png",
    "Tập sức mạnh với trọng lượng nặng": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0q8UyEytnBWSjfRtCMHO8eM5zxs0QxYFirg&s",
    "Bài tập compound như Deadlift": "https://cdn.shopify.com/s/files/1/1633/7705/files/compound_lifts_480x480.png?v=1623988542",
    "Nghỉ ngơi đầy đủ để phục hồi": "https://cdn.shopify.com/s/files/1/0594/1913/2096/files/Active_Recovery_Guide__How_to_Make_the_Most_of_Your_Rest_Days.png?v=1736537185",
    "Cardio nhẹ nhàng (đi bộ, chạy chậm)": "https://workoutlabs.com/fit/pin/imgcache/5675eb1a1eea70b70b11368d01199d9a394c4832nw-c-generic-v2.png",
    "Yoga hoặc Pilates": "https://i.pinimg.com/736x/a8/08/1c/a8081c59633b8ba495999424e89b919d.jpg",
    "Tập sức mạnh cân bằng": "https://cdn4.volusion.store/ykwet-jksjn/v/vspfiles/photos/EC30DSP-15.jpg?v-cache=1659742446",
    "Bài tập HIIT ngắn": "https://darebee.com/images/workouts/quick-hiit-workout.jpg",
    "Duy trì lối sống năng động": "https://www.ahajournals.org/cms/10.1161/CIR.0000000000001018/asset/a83a022c-e879-4d09-9f21-cd29c5d02b84/assets/graphic/cir.0000000000001018.fig01.jpg",
    "Cardio cường độ cao (chạy, đạp xe)": "https://cyclingcoachai.com/wp-content/uploads/2024/03/Cycling-Interval-Training-2x20-1-1024x683.png",
    "HIIT để đốt mỡ": "https://via.placeholder.com/400x300?text=HIIT+Fat+Burn+Tutorial",
    "Bài tập giảm cân như Burpees": "https://via.placeholder.com/400x300?text=Burpees+Tutorial",
    "Chế độ ăn kiêng cân bằng": "https://via.placeholder.com/400x300?text=Balanced+Diet+Tutorial",
    "Tập aerobic hàng ngày": "https://via.placeholder.com/400x300?text=Daily+Aerobic+Tutorial"
  };

  // Tính BMI và xác định nhóm bài tập
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const getExerciseGroup = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return 1; // Thiếu cân
    if (bmi < 25) return 2; // Bình thường
    return 3; // Thừa cân
  };

  const exerciseGroups = {
    1: {
      name: "Nhóm bài tập cho người thiếu cân (BMI < 18.5)",
      exercises: [
        "Tập tạ tăng cơ (Bench Press, Squat)",
        "Ăn uống bổ sung calo",
        "Tập sức mạnh với trọng lượng nặng",
        "Bài tập compound như Deadlift",
        "Nghỉ ngơi đầy đủ để phục hồi"
      ]
    },
    2: {
      name: "Nhóm bài tập cho người bình thường (18.5 ≤ BMI < 25)",
      exercises: [
        "Cardio nhẹ nhàng (đi bộ, chạy chậm)",
        "Yoga hoặc Pilates",
        "Tập sức mạnh cân bằng",
        "Bài tập HIIT ngắn",
        "Duy trì lối sống năng động"
      ]
    },
    3: {
      name: "Nhóm bài tập cho người thừa cân (BMI ≥ 25)",
      exercises: [
        "Cardio cường độ cao (chạy, đạp xe)",
        "HIIT để đốt mỡ",
        "Bài tập giảm cân như Burpees",
        "Chế độ ăn kiêng cân bằng",
        "Tập aerobic hàng ngày"
      ]
    }
  };

  const saveSchedules = async (newSchedules) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await api.put("/user/schedules", { schedules: newSchedules });
      } catch (err) {
        console.error("Error saving schedules:", err);
      }
    } else {
      localStorage.setItem("schedules", JSON.stringify(newSchedules));
    }
    setSchedules(newSchedules);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");

  if (token) {
      const fetchProfileAndSchedules = async () => {
        try {
          const profileRes = await api.get("/user/profile");
          const userData = profileRes.data;
          setUser(userData);
          setProfileData(userData);
          setAvatar(
            userData.avatar ||
              randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
          );
          setBmiData(userData.bmiHistory || []);

          // Check if user has completed onboarding (has age, height, weight)
          if (!userData.age || !userData.height || !userData.weight) {
            router.push("/onboarding");
            return;
          }

          const schedulesRes = await api.get("/user/schedules");
          setSchedules(schedulesRes.data);
        } catch (err) {
          console.error("Error fetching data:", err);
          // If fetch fails, redirect to onboarding if logged in
              router.push("/onboarding");
        }
      };
      fetchProfileAndSchedules();
    } else {
      // If onboarding data exists in localStorage, use it to populate profile
      const onboardJson = localStorage.getItem("onboardUser");
      if (onboardJson) {
        try {
          const onboard = JSON.parse(onboardJson);
          setProfileData(onboard);
          setAvatar(
            onboard.avatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
          );
          setBmiData(onboard.bmiHistory || []);
        } catch (err) {
          // ignore parse errors and continue to attempt API fetch below
        }
      }

      // Load schedules from localStorage
      const storedSchedules = localStorage.getItem("schedules");
      if (storedSchedules) {
        try {
          const parsed = JSON.parse(storedSchedules).map(s => ({ ...s, savedToProgress: s.savedToProgress ?? false, exercisesCount: s.exercisesCount ?? 1 }));
          setSchedules(parsed);
        } catch (err) {
          console.error("Error parsing schedules:", err);
        }
      }
    }

    // No mock profile injected; rely on API or localStorage data.
  }, []);

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
          // Update localStorage if onboardUser exists
          const onboardJson = localStorage.getItem("onboardUser");
          if (onboardJson) {
            try {
              const onboard = JSON.parse(onboardJson);
              onboard.avatar = base64;
              localStorage.setItem("onboardUser", JSON.stringify(onboard));
            } catch (err) {
              // ignore
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Calculate BMI category counts for pie chart
  const bmiCategories = bmiData.reduce(
    (acc, item) => {
      const bmi = parseFloat(item.value);
      if (bmi < 18.5) acc.underweight++;
      else if (bmi < 25) acc.normal++;
      else acc.overweight++;
      return acc;
    },
    { underweight: 0, normal: 0, overweight: 0 }
  );

  const pieChartData = {
    labels: ["Thiếu cân (<18.5)", "Bình thường (18.5-24.9)", "Thừa cân (≥25)"],
    datasets: [
      {
        data: [bmiCategories.underweight, bmiCategories.normal, bmiCategories.overweight],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        hoverBackgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <div className="text-2xl font-bold text-green-600">FitnessApp</div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="bg-green-100 px-4 py-2 rounded text-green-700 font-semibold">
                Xin chào, {user.name}
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-semibold transition duration-200 ease-in-out hover:bg-red-700 hover:scale-105 shadow hover:shadow-lg"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : null}
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-col md:flex-row gap-8 px-8 py-8">
        {/* User info */}
        <section className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 flex flex-col items-center">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-200 mb-4 cursor-pointer"
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-400 cursor-pointer"
              onClick={handleAvatarClick}
            >
              No Avatar
            </div>
          )}

          {(profileData || user) && (
            <>
              <button
                className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAvatarClick}
              >
                Đổi avatar
              </button>
              <div className="w-full text-center text-gray-700 space-y-1 mt-2">
                <div className="font-bold text-lg">{(profileData && profileData.name) || (user && user.name)}</div>
                <div className="text-sm">
                  Tuổi: <span className="font-semibold">{(profileData && profileData.age) || (user && user.age) || '-'}</span>
                </div>
                <div className="text-sm">
                  Chiều cao: {" "}
                  <span className="font-semibold">
                    {(profileData && profileData.height) ? profileData.height + " cm" : (user && user.height ? user.height + " cm" : "-")}
                  </span>{" "}
                  | Cân nặng: {" "}
                  <span className="font-semibold">{(profileData && profileData.weight) ? profileData.weight + " kg" : (user && user.weight ? user.weight + " kg" : "-")}</span>
                </div>
                <div className="text-sm">
                  Thể trạng: {" "}
                  <span className="font-semibold">{(profileData && profileData.bodyType) || (user && user.bodyType) || '-'}</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* BMI & Schedule + Bảng bài tập */}
        <section className="w-full md:w-2/3 bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-bold text-green-600 mb-4">Thống kê BMI</h2>
          <div className="bg-gray-100 rounded p-4 mb-6">
            {bmiData.length > 0 ? (
              <Pie data={pieChartData} />
            ) : (
              <div className="text-gray-400">Chưa có dữ liệu BMI</div>
            )}
          </div>

          {/* Bảng lựa chọn bài tập ngẫu nhiên */}
          <h2 className="text-xl font-bold text-green-600 mb-4">Lựa chọn bài tập ngẫu nhiên </h2><p>Dành cho ngẫu hứng cho user</p>
          <div className="overflow-x-auto mb-6">
            <table className="table-auto w-full border rounded-lg shadow">
              <tbody>
                {[0, 1, 2].map(row => (
                  <tr key={row}>
                    {[0, 1, 2].map(col => {
                      const idx = row * 3 + col;
                      const item = repExercises[idx] || "-";
                      return (
                        <td
                          key={col}
                          className={`border px-4 py-2 text-center ${item !== "-" ? "cursor-pointer hover:bg-green-100" : "text-gray-400"}`}
                          onClick={() => {
                            if (item !== "-") {
                              setSelectedExercise(item);
                              setShowRepForm(true);
                              setRepCount("");
                              setShowChallenge(false);
                            }
                          }}
                        >
                          {item}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => {
                const random = repExercises[Math.floor(Math.random() * repExercises.length)];
                setSelectedExercise(random);
                setShowRepForm(true);
                setRepCount("");
                setShowChallenge(false);
              }}
            >
              Chọn bài tập ngẫu nhiên
            </button>
          </div>

          {/* Onboarding nhập số rep */}
          {showRepForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <form
                className="bg-white p-6 rounded-lg shadow w-96 space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  setExerciseResults([...exerciseResults, { name: selectedExercise, rep: repCount }]);
                  setShowRepForm(false);
                  setShowChallenge(true);
                }}
              >
                <h2 className="text-xl font-bold text-green-600 mb-2">{selectedExercise}</h2>
                <label className="block text-sm mb-2">Số rep bạn muốn thực hiện</label>
                <input
                  type="number"
                  className="border rounded px-3 py-2 w-full mb-2"
                  value={repCount}
                  min={1}
                  onChange={e => setRepCount(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Lưu
                </button>
              </form>
            </div>
          )}
          {showChallenge && (
            <div className="text-center text-lg text-green-700 font-bold mb-4">Hãy thử thách bản thân nhé, cùng tập nào!</div>
          )}

          {/* Các bài tập ngẫu hứng đã có */}
          <h2 className="text-xl font-bold text-green-600 mb-2">Các bài tập ngẫu hứng mà bạn đã có</h2>
          <div className="mb-6">
            {exerciseResults.length === 0 ? (
              <div className="text-gray-400">Chưa có bài tập nào</div>
            ) : (
              <table className="table-auto w-full border rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Bài tập</th>
                    <th className="border px-4 py-2">Số rep</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseResults.map((ex, idx) => (
                    <tr key={idx}>
                      <td className="border px-4 py-2 text-center">{ex.name}</td>
                      <td className="border px-4 py-2 text-center">{ex.rep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Gợi ý bài tập dựa trên BMI */}
          <h2 className="text-xl font-bold text-green-600 mb-4">Gợi ý bài tập</h2>
          {profileData && profileData.height && profileData.weight ? (
            (() => {
              const bmi = calculateBMI(profileData.height, profileData.weight);
              const group = getExerciseGroup(bmi);
              const groupData = exerciseGroups[group];
              return (
                <div className="bg-gray-100 rounded p-4 mb-6">
                  <div className="text-lg font-semibold text-green-700 mb-2">
                    BMI của bạn: {bmi}
                  </div>
                  <div className="text-md font-semibold text-gray-800 mb-4">
                    {groupData.name}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {groupData.exercises.map((exercise, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <span>{exercise}</span>
                        <button
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          onClick={() => {
                            setSelectedTutorialExercise(exercise);
                            setShowTutorialModal(true);
                          }}
                        >
                          Tutorial
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()
          ) : (
            <div className="bg-gray-100 rounded p-4 mb-6 text-gray-400">
              Cần có thông tin chiều cao và cân nặng để gợi ý bài tập.
            </div>
          )}

          <h2 className="text-xl font-bold text-green-600 mb-2">
            Đặt lịch tập luyện
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="border rounded px-3 py-2 w-60"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={!selectedDate}
              onClick={() => setShowForm(true)}
            >
              Xong
            </button>
          </div>

          {/* Danh sách lịch đã lưu */}
          <div className="mt-4 space-y-2">
            {schedules.map((sch, idx) => (
              <div
                key={idx}
                className="p-3 border rounded bg-gray-50 text-sm shadow"
              >
                <div className="font-bold text-green-700">
                  {sch.date} - {sch.title}
                </div>
                <div>Mục tiêu: {sch.goal}</div>
                <div>
                  Thời gian: {sch.startTime} - {sch.endTime}
                </div>
                <div>Ưu tiên: {sch.priority}</div>
                <div>Số bài tập: {sch.exercisesCount}</div>
                {sch.note && <div>Ghi chú: {sch.note}</div>}
                {/* Nút hành động */}
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      const newSchedules = schedules.filter((_, i) => i !== idx);
                      saveSchedules(newSchedules);
                    }}
                  >
                    Xóa
                  </button>
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => {
                      const newSchedules = [...schedules];
                      newSchedules[idx].savedToProgress = true;
                      saveSchedules(newSchedules);
                    }}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push("/progress")}
          >
            Xem tiến độ
          </button>
        </section>
      </main>



      {showForm && (
        <ScheduleForm
          date={selectedDate}
          onClose={() => setShowForm(false)}
    onSave={(newSch) => saveSchedules([...schedules, { ...newSch, savedToProgress: false }])}
        />
      )}

      {/* Tutorial Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-96 max-w-md">
            <h2 className="text-xl font-bold text-green-600 mb-4">{selectedTutorialExercise}</h2>
            <img
              src={tutorialImages[selectedTutorialExercise] || "https://via.placeholder.com/400x300?text=No+Tutorial+Available"}
              alt={`${selectedTutorialExercise} tutorial`}
              className="w-full h-auto rounded mb-4"
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              onClick={() => setShowTutorialModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




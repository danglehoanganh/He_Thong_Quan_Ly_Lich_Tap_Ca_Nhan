"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../services/api";

export default function ProgressPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});
  const [elapsedTimes, setElapsedTimes] = useState({});

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
      const fetchSchedules = async () => {
        try {
          const res = await api.get("/user/schedules");
          setSchedules(res.data.filter(s => s.savedToProgress));
          setUser({}); // dummy to indicate logged in
        } catch (err) {
          console.error("Error fetching schedules:", err);
        }
      };
      fetchSchedules();
    } else {
      const stored = localStorage.getItem("schedules");
      if (stored) {
        try {
      const parsed = JSON.parse(stored).map(s => ({ ...s, savedToProgress: s.savedToProgress ?? false, exercisesCount: s.exercisesCount ?? 1, countedInTotal: s.countedInTotal ?? true }));
          setSchedules(parsed.filter(s => s.savedToProgress));
        } catch (err) {
          console.error("Error parsing schedules:", err);
        }
      }
    }

        // If there are no schedules, inject demo schedules for a quick demo view.
        setTimeout(() => {
          try {
            const stored = localStorage.getItem("schedules");
            if (!stored) {
              const demoSchedules = [
                {
                  title: "Buổi tập sáng - Demo",
                  date: new Date().toISOString().slice(0, 10),
                  startTime: "06:00",
                  endTime: "07:00",
                  goal: "Khởi động",
                  priority: "Trung bình",
                  exercisesCount: 4,
                  note: "Demo: Cardio + Stretch",
                  completed: false,
                  savedToProgress: true,
                },
                {
                  title: "Tập sức mạnh - Demo",
                  date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
                  startTime: "18:00",
                  endTime: "19:15",
                  goal: "Tăng cơ",
                  priority: "Cao",
                  exercisesCount: 6,
                  note: "Demo: Tạ + Compound",
                  completed: true,
                  savedToProgress: true,
                },
                {
                  title: "Yoga thư giãn - Demo",
                  date: new Date(Date.now() + 1 * 86400000).toISOString().slice(0, 10),
                  startTime: "07:30",
                  endTime: "08:00",
                  goal: "Phục hồi",
                  priority: "Thấp",
                  exercisesCount: 2,
                  note: "Demo: Yoga nhẹ",
                  completed: false,
                  savedToProgress: true,
                }
              ];
              localStorage.setItem("schedules", JSON.stringify(demoSchedules));
              setSchedules(demoSchedules);
            }
          } catch (e) {
            // ignore storage errors
          }
        }, 100);
  }, []);

  const pending = schedules.filter(s => !s.completed);
  const completed = schedules.filter(s => s.completed);
  const total = schedules.length;
  const completedCount = completed.length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Calculate total training time in minutes from schedule start/end times
  const getMinutesBetween = (start, end) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(":").map((v) => parseInt(v, 10));
    const [eh, em] = end.split(":").map((v) => parseInt(v, 10));
    if (Number.isNaN(sh) || Number.isNaN(sm) || Number.isNaN(eh) || Number.isNaN(em)) return 0;
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    // handle overnight schedules where end is past midnight
    if (endMin < startMin) endMin += 24 * 60;
    return Math.max(0, endMin - startMin);
  };

  const totalMinutes = schedules.reduce((acc, s) => acc + getMinutesBetween(s.startTime, s.endTime), 0);

  // Total minutes of schedules that are marked as completed
  // Only count completed schedules that were completed within the scheduled time
  const completedMinutes = schedules.reduce((acc, s) => {
    if (s.completed && s.countedInTotal) {
      return acc + getMinutesBetween(s.startTime, s.endTime);
    }
    return acc;
  }, 0);

  // Formatting helpers
  const formatMinutesToHoursMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) return `${h} giờ${m > 0 ? ` ${m} phút` : ''}`;
    return `${m} phút`;
  };

  const formatMinutesToHoursDecimal = (mins) => {
    const hours = mins / 60;
    return `${Math.round(hours * 10) / 10} giờ`;
  };

  // Timer functions
  const startTimer = (scheduleIdx) => {
    const schedule = schedules[scheduleIdx];
    const startTime = new Date().getTime();
    setActiveTimers(prev => ({ ...prev, [scheduleIdx]: startTime }));
    setElapsedTimes(prev => ({ ...prev, [scheduleIdx]: 0 }));
  };

  const stopTimer = (scheduleIdx) => {
    setActiveTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[scheduleIdx];
      return newTimers;
    });
    setElapsedTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[scheduleIdx];
      return newTimes;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes(prev => {
        const newTimes = { ...prev };
        Object.keys(activeTimers).forEach(idx => {
          const startTime = activeTimers[idx];
          const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
          newTimes[idx] = elapsed;
        });
        return newTimes;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimers]);

  const toggleCompleted = (idx) => {
    const newSchedules = [...schedules];
    const wasCompleted = newSchedules[idx].completed;
    newSchedules[idx].completed = !wasCompleted;

    // Check if timer reached scheduled time
    const scheduledMinutes = getMinutesBetween(newSchedules[idx].startTime, newSchedules[idx].endTime);
    const elapsedSeconds = elapsedTimes[idx] || 0;
    const elapsedMinutes = elapsedSeconds / 60;

    if (!wasCompleted && elapsedMinutes >= scheduledMinutes) {
      // If completing after timer reached scheduled time, count in total
      newSchedules[idx].countedInTotal = true;
    } else if (!wasCompleted) {
      // If completing before timer reached scheduled time, don't count in total
      newSchedules[idx].countedInTotal = false;
    }

    saveSchedules(newSchedules);
    // Stop timer if running
    if (activeTimers[idx]) {
      stopTimer(idx);
    }
  };

  // Auto-complete after scheduled time + 10 seconds grace period
  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(activeTimers).forEach(idx => {
        const schedule = schedules[idx];
        if (!schedule) return;
        const scheduledMinutes = getMinutesBetween(schedule.startTime, schedule.endTime);
        const elapsedSeconds = elapsedTimes[idx] || 0;
        const elapsedMinutes = elapsedSeconds / 60;

        // If timer has reached scheduled time + 10 seconds and not completed, auto-complete and don't count
        if (elapsedMinutes >= scheduledMinutes + 10 / 60 && !schedule.completed) {
          const newSchedules = [...schedules];
          newSchedules[idx].completed = true;
          newSchedules[idx].countedInTotal = false; // Exceeded time, don't count
          saveSchedules(newSchedules);
          stopTimer(idx);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimers, elapsedTimes, schedules]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <div className="text-2xl font-bold text-green-600">FitnessApp - Tiến độ</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Quay lại Hồ sơ
          </button>
        </div>
      </header>

      <main className="px-8 py-8">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Tiến độ Tập luyện</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{total}</div>
            <div className="text-gray-600">Tổng lịch tập</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-700">{formatMinutesToHoursMinutes(totalMinutes)}</div>
            <div className="text-gray-600">Tổng thời gian</div>
            <div className="text-sm text-gray-500 mt-2">Đã hoàn thành: {formatMinutesToHoursMinutes(completedMinutes)}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-gray-600">Đã hoàn thành</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">{pending.length}</div>
            <div className="text-gray-600">Đang chờ</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
            <div className="text-gray-600">Tỷ lệ hoàn thành</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-green-600 mb-4">Tiến độ Tổng thể</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">{completionRate}% hoàn thành</div>
          {/* No inline badges here; badges are in the separate card below */}
        </div>



        {/* Pending Schedules */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-orange-600 mb-4">Lịch Tập Đang Chờ ({pending.length})</h2>
          {pending.length === 0 ? (
            <div className="text-gray-400">Không có lịch tập nào đang chờ.</div>
          ) : (
            <div className="space-y-4">
              {pending.map((sch, idx) => {
                const scheduleIdx = schedules.indexOf(sch);
                const isTimerActive = activeTimers[scheduleIdx];
                return (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                    <div>
                      <div className="font-bold text-gray-800">{sch.title}</div>
                      <div className="text-sm text-gray-600">Ngày: {sch.date} | Thời gian: {sch.startTime} - {sch.endTime}</div>
                      <div className="text-sm text-gray-600">Mục tiêu: {sch.goal} | Ưu tiên: {sch.priority} | Số bài tập: {sch.exercisesCount}</div>
                      {sch.note && <div className="text-sm text-gray-600">Ghi chú: {sch.note}</div>}
                      {isTimerActive && (
                        <div className="text-sm text-red-600 font-semibold mt-2">
                          Timer: {formatTime(elapsedTimes[scheduleIdx] || 0)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isTimerActive ? (
                        <button
                          onClick={() => startTimer(scheduleIdx)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Bắt đầu
                        </button>
                      ) : (
                        <button
                          onClick={() => stopTimer(scheduleIdx)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Dừng
                        </button>
                      )}
                      <button
                        onClick={() => toggleCompleted(scheduleIdx)}
                        className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ${!isTimerActive || (isTimerActive && elapsedTimes[scheduleIdx] < getMinutesBetween(sch.startTime, sch.endTime) * 60) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isTimerActive || (isTimerActive && elapsedTimes[scheduleIdx] < getMinutesBetween(sch.startTime, sch.endTime) * 60)}
                      >
                        Đánh dấu hoàn thành
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Schedules */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-green-600 mb-4">Lịch Tập Đã Hoàn Thành ({completed.length})</h2>
          {completed.length === 0 ? (
            <div className="text-gray-400">Chưa có lịch tập nào hoàn thành.</div>
          ) : (
            <div className="space-y-4">
              {completed.map((sch, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div>
                    <div className="font-bold text-gray-800">{sch.title}</div>
                    <div className="text-sm text-gray-600">Ngày: {sch.date} | Thời gian: {sch.startTime} - {sch.endTime}</div>
                    <div className="text-sm text-gray-600">Mục tiêu: {sch.goal} | Ưu tiên: {sch.priority} | Số bài tập: {sch.exercisesCount}</div>
                    {sch.note && <div className="text-sm text-gray-600">Ghi chú: {sch.note}</div>}
                  </div>
                  <span className="text-green-600 font-bold">✅ Hoàn thành</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: 'Xin chào! Tôi là chatbot trợ lý fitness. Bạn cần giúp gì về tập luyện hoặc sức khỏe?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get user context from localStorage or API
  const getUserContext = () => {
    const onboardJson = localStorage.getItem("onboardUser");
    if (onboardJson) {
      try {
        const onboard = JSON.parse(onboardJson);
        return `Tên: ${onboard.name}, Tuổi: ${onboard.age}, Chiều cao: ${onboard.height}cm, Cân nặng: ${onboard.weight}kg, Thể trạng: ${onboard.bodyType}`;
      } catch (err) {
        return 'Không có thông tin cụ thể';
      }
    }
    return 'Không có thông tin cụ thể';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = { text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const context = getUserContext();
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, context }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { text: data.response, sender: 'bot' };
        setMessages([...newMessages, botMessage]);
      } else {
        const botMessage = { text: 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.', sender: 'bot' };
        setMessages([...newMessages, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage = { text: 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', sender: 'bot' };
      setMessages([...newMessages, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4 flex flex-col h-96 fixed left-4 top-24 z-10">
      <h3 className="text-lg font-bold text-green-600 mb-2">Chatbot Trợ Lý</h3>
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
              msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600 transition"
          onClick={handleSend}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

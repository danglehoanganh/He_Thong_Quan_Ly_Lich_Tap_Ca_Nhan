const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      // Fallback responses for common queries
      const fallbackResponses = {
        'bmi': 'BMI (Body Mass Index) là chỉ số đánh giá cân nặng của bạn dựa trên chiều cao. Công thức tính: cân nặng (kg) / (chiều cao (m))^2. Các mức: <18.5 thiếu cân, 18.5-24.9 bình thường, ≥25 thừa cân.',
        'bài tập': 'Dựa trên BMI của bạn, tôi có thể gợi ý bài tập phù hợp. Hãy cho tôi biết BMI hoặc thông tin cá nhân để tư vấn chính xác hơn.',
        'lịch tập': 'Bạn có thể đặt lịch tập luyện trong trang Profile. Chọn ngày, nhập thông tin buổi tập và lưu lại.',
        'dinh dưỡng': 'Ăn uống cân bằng với rau củ, protein nạc, tinh bột phức tạp. Uống đủ nước và hạn chế đồ ngọt.',
        'default': 'Tôi là chatbot trợ lý fitness. Bạn cần giúp gì về tập luyện, sức khỏe hay dinh dưỡng?'
      };

      const lowerMessage = message.toLowerCase();
      let response = fallbackResponses.default;

      if (lowerMessage.includes('bmi')) response = fallbackResponses.bmi;
      else if (lowerMessage.includes('bài tập') || lowerMessage.includes('tập')) response = fallbackResponses['bài tập'];
      else if (lowerMessage.includes('lịch') || lowerMessage.includes('đặt lịch')) response = fallbackResponses['lịch tập'];
      else if (lowerMessage.includes('ăn') || lowerMessage.includes('dinh dưỡng')) response = fallbackResponses['dinh dưỡng'];

      return res.json({ response });
    }

    const systemPrompt = `
Bạn là chatbot trợ lý fitness chuyên nghiệp cho ứng dụng FitnessApp. Nhiệm vụ của bạn là hỗ trợ người dùng về các vấn đề liên quan đến tập luyện, sức khỏe, dinh dưỡng và lối sống lành mạnh.

Thông tin về ứng dụng:
- Ứng dụng giúp người dùng theo dõi BMI, đặt lịch tập luyện, gợi ý bài tập dựa trên BMI.
- Các tính năng chính: Đăng ký/đăng nhập, onboarding (nhập thông tin cá nhân), trang profile (xem thống kê BMI, gợi ý bài tập, đặt lịch), trang progress (theo dõi tiến độ).

Hướng dẫn trả lời:
- Luôn trả lời bằng tiếng Việt.
- Giữ giọng điệu thân thiện, khuyến khích và chuyên nghiệp.
- Nếu người dùng hỏi về BMI: Giải thích BMI là gì, cách tính, và các mức độ (thiếu cân <18.5, bình thường 18.5-24.9, thừa cân ≥25).
- Nếu hỏi về bài tập: Gợi ý bài tập phù hợp dựa trên BMI nếu có thông tin, hoặc hỏi thêm thông tin.
- Nếu hỏi về lịch tập: Hướng dẫn cách đặt lịch trong ứng dụng.
- Nếu hỏi về dinh dưỡng: Đưa ra lời khuyên chung về ăn uống lành mạnh.
- Nếu câu hỏi không liên quan đến fitness: Lịch sự chuyển hướng về chủ đề fitness hoặc trả lời ngắn gọn.
- Giữ câu trả lời ngắn gọn, dưới 200 từ.

Thông tin người dùng (nếu có): ${context || 'Không có thông tin cụ thể'}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error with OpenAI:', error);
    // Fallback response on error
    res.json({ response: 'Xin lỗi, có lỗi xảy ra. Bạn có thể hỏi về BMI, bài tập, lịch tập hoặc dinh dưỡng để được hỗ trợ.' });
  }
};

module.exports = { chatWithAI };

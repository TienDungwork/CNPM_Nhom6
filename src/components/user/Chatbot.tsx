import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Bot, Send, User } from 'lucide-react';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'bot',
    text: 'Xin chào! Tôi là trợ lý AI của HealthyColors. Tôi có thể giúp bạn về dinh dưỡng, tập luyện, và lối sống lành mạnh. Bạn muốn hỏi gì?',
    timestamp: '10:00 AM',
  },
];

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: 'bot',
        text: getBotResponse(inputText),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('calo') || input.includes('calorie')) {
      return 'Để tính toán lượng calo phù hợp, bạn có thể sử dụng công cụ Calorie Calculator trong mục Nutrition. Nó sẽ giúp bạn xác định nhu cầu năng lượng dựa trên tuổi, cân nặng, chiều cao và mức độ vận động.';
    } else if (input.includes('tập') || input.includes('exercise') || input.includes('workout')) {
      return 'Tôi khuyên bạn nên tập luyện ít nhất 30 phút mỗi ngày. Hãy xem các bài tập trong mục Exercise Plans để tìm chương trình phù hợp với trình độ của bạn!';
    } else if (input.includes('ngủ') || input.includes('sleep')) {
      return 'Giấc ngủ rất quan trọng! Người trưởng thành nên ngủ 7-9 giờ mỗi đêm. Hãy sử dụng Sleep Tracker để theo dõi chất lượng giấc ngủ của bạn.';
    } else if (input.includes('nước') || input.includes('water')) {
      return 'Uống đủ nước rất quan trọng cho sức khỏe! Bạn nên uống ít nhất 8-10 cốc nước mỗi ngày. Sử dụng Water Reminder để theo dõi lượng nước đã uống nhé.';
    } else if (input.includes('ăn') || input.includes('meal') || input.includes('food')) {
      return 'Hãy xem mục Meal Suggestions để có những gợi ý bữa ăn lành mạnh và cân bằng dinh dưỡng. Tôi có nhiều công thức phù hợp với mục tiêu của bạn!';
    } else {
      return 'Cảm ơn câu hỏi của bạn! Tôi có thể tư vấn về dinh dưỡng, tập luyện, giấc ngủ, và lối sống lành mạnh. Bạn muốn biết thêm về chủ đề nào?';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>AI Assistant</h1>
        <p className="text-gray-600">Get personalized health and nutrition advice</p>
      </div>

      <Card className="rounded-xl border-0 shadow-md overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 gradient-primary text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>HealthyColors AI</p>
              <p style={{ fontSize: '0.875rem' }} className="opacity-90">Online</p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' ? 'bg-[#00C78C]' : 'bg-gray-300'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-md p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#00C78C] text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}>
                    <p>{message.text}</p>
                  </div>
                  <span className="text-gray-400 mt-1" style={{ fontSize: '0.75rem' }}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 rounded-full"
              />
              <Button
                onClick={handleSend}
                className="gradient-primary text-white border-0 rounded-full w-12 h-12 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-xl border-0 shadow-md">
        <h3 className="mb-4" style={{ fontWeight: 600 }}>Quick Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setInputText('Làm sao để tính calo cần thiết?')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p className="text-gray-900" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Làm sao để tính calo cần thiết?</p>
          </button>
          <button
            onClick={() => setInputText('Nên tập luyện thế nào để giảm cân?')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p className="text-gray-900" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nên tập luyện thế nào để giảm cân?</p>
          </button>
          <button
            onClick={() => setInputText('Uống bao nhiêu nước mỗi ngày?')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p className="text-gray-900" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Uống bao nhiêu nước mỗi ngày?</p>
          </button>
          <button
            onClick={() => setInputText('Gợi ý thực đơn lành mạnh')}
            className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <p className="text-gray-900" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Gợi ý thực đơn lành mạnh</p>
          </button>
        </div>
      </Card>
    </div>
  );
}

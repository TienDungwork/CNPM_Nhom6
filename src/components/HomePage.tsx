import { ArrowRight, Apple, Dumbbell, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HomePage() {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Dynamic navigation based on auth state
  const handleGetStarted = () => {
    if (role === 'user') {
      navigate('/user/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleFeatureClick = (path: string) => {
    if (role === 'user') {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] mt-16 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MDA5Mzg3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Healthy salad bowl"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00C78C] to-[#00E6A0] opacity-80" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="text-white mb-6" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.2 }}>
              The secret to excellent health
            </h1>
            <p className="text-white mb-8 opacity-90" style={{ fontSize: '1.125rem' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <button 
              onClick={handleGetStarted}
              className="bg-white text-[#00C78C] px-8 py-4 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-3 shadow-lg"
            >
              <span style={{ fontWeight: 600 }}>
                {role === 'user' ? 'Go to Dashboard' : 'Get Started'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose HealthyColors */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>Why choose HealthyColors?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Hệ thống quản lý sức khỏe toàn diện, giúp bạn đạt được mục tiêu sống khỏe mạnh một cách dễ dàng và bền vững.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Smart Nutrition */}
            <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-white text-center">
              <div className="text-6xl mb-6">🍎</div>
              <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>Smart Nutrition</h3>
              <p className="text-gray-600">
                Cá nhân hóa thực đơn theo mục tiêu sức khỏe của bạn với AI thông minh và khoa học dinh dưỡng hiện đại.
              </p>
            </Card>

            {/* AI Fitness */}
            <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-white text-center">
              <div className="text-6xl mb-6">🏋️</div>
              <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>AI Fitness</h3>
              <p className="text-gray-600">
                Tập luyện theo gợi ý thông minh từ AI, phù hợp với thể trạng và mục tiêu cá nhân của bạn.
              </p>
            </Card>

            {/* Mindful Wellness */}
            <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-white text-center">
              <div className="text-6xl mb-6">🌙</div>
              <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>Mindful Wellness</h3>
              <p className="text-gray-600">
                Theo dõi giấc ngủ, uống nước, và nhắc nhở hàng ngày để xây dựng thói quen sống lành mạnh.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Eat Smart */}
          <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Apple className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>Eat Smart</h3>
            <p className="text-gray-600 mb-6">
              Tính toán nhu cầu calo hàng ngày và nhận gợi ý thực đơn phù hợp với mục tiêu sức khỏe của bạn.
            </p>
            <button 
              onClick={() => handleFeatureClick('/user/nutrition/calorie-calculator')}
              className="text-[#00C78C] hover:text-[#00E6A0] flex items-center gap-2"
            >
              <span style={{ fontWeight: 600 }}>Khám phá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>

          {/* Move Better */}
          <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>Move Better</h3>
            <p className="text-gray-600 mb-6">
              Bài tập thể dục được cá nhân hóa theo thể trạng và mục tiêu của bạn. Duy trì vóc dáng và sức khỏe tốt nhất.
            </p>
            <button 
              onClick={() => handleFeatureClick('/user/fitness/exercise-plans')}
              className="text-[#00C78C] hover:text-[#00E6A0] flex items-center gap-2"
            >
              <span style={{ fontWeight: 600 }}>Khám phá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>

          {/* Rest Well */}
          <Card className="p-8 rounded-xl shadow-md hover:shadow-xl transition-all border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-4" style={{ fontWeight: 600, fontSize: '1.5rem' }}>Rest Well</h3>
            <p className="text-gray-600 mb-6">
              Theo dõi giấc ngủ, nhắc nhở uống nước và ghi chú hoạt động hàng ngày để xây dựng lối sống lành mạnh.
            </p>
            <button 
              onClick={() => handleFeatureClick('/user/wellness/sleep-tracker')}
              className="text-[#00C78C] hover:text-[#00E6A0] flex items-center gap-2"
            >
              <span style={{ fontWeight: 600 }}>Khám phá</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-[#00C78C]/10 to-[#00E6A0]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Hàng ngàn người dùng đã cải thiện sức khỏe với HealthyColors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 rounded-xl border-0 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p style={{ fontWeight: 600 }}>Sarah Johnson</p>
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">
                "HealthyColors đã giúp tôi giảm 10kg trong 3 tháng! Thực đơn cá nhân hóa rất phù hợp và dễ thực hiện."
              </p>
            </Card>

            <Card className="p-6 rounded-xl border-0 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p style={{ fontWeight: 600 }}>Michael Chen</p>
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">
                "Tính năng theo dõi giấc ngủ và nhắc nhở uống nước rất hữu ích. Tôi cảm thấy khỏe mạnh hơn rất nhiều!"
              </p>
            </Card>

            <Card className="p-6 rounded-xl border-0 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p style={{ fontWeight: 600 }}>Emily Davis</p>
                  <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600">
                "AI Fitness Coach tuyệt vời! Các bài tập phù hợp với trình độ của tôi và cho kết quả thật sự."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
          alt="Healthy lifestyle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00C78C]/90 to-[#00E6A0]/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6" style={{ fontSize: '3rem', fontWeight: 700 }}>
            Start your healthy journey today!
          </h2>
          <p className="text-white mb-8 opacity-90 max-w-2xl mx-auto" style={{ fontSize: '1.25rem' }}>
            Tham gia cộng đồng HealthyColors để bắt đầu hành trình chăm sóc sức khỏe của bạn ngay hôm nay.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button variant="outline" className="bg-white text-[#00C78C] px-8 py-6 rounded-xl hover:bg-gray-100 transition-all" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Sign Up Free
              </Button>
            </Link>
            <Link to="/user/dashboard">
              <Button variant="outline" className="bg-white text-[#00C78C] px-8 py-6 rounded-xl hover:bg-gray-100 transition-all" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

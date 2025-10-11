import { ArrowRight, Apple, Dumbbell, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Card } from './ui/card';
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

      <Footer />
    </div>
  );
}

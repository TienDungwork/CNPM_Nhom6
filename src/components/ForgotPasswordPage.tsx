import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Leaf, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email không hợp lệ. Vui lòng nhập lại địa chỉ email.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    toast.success('Đã gửi liên kết đặt lại mật khẩu!');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MDA5Mzg3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Healthy salad"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C78C] to-[#00E6A0] opacity-80" />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        {/* Logo - Link to Home */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900" style={{ fontWeight: 600 }}>HealthyColors</span>
        </Link>

        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 600 }}>Check your email</h1>
              <p className="text-gray-600 mb-8">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.
              </p>
              <p className="text-gray-600 mb-8" style={{ fontSize: '0.875rem' }}>
                Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam hoặc thử lại.
              </p>
              <Link to="/login">
                <Button className="w-full gradient-primary text-white border-0 rounded-lg py-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Forgot password?</h1>
                <p className="text-gray-600">Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`mt-2 rounded-lg ${error ? 'border-red-500' : ''}`}
                    required
                  />
                  {error && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <span style={{ fontSize: '0.875rem' }}>⚠️ {error}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-primary text-white border-0 rounded-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login" className="text-[#00C78C] hover:text-[#00E6A0] flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span style={{ fontWeight: 600 }}>Back to Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

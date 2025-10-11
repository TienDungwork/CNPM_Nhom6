import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addUser, users } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', confirmPassword: '' });
    
    // Validation
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Vui lòng nhập email.' }));
      return;
    }
    
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Email không hợp lệ. Vui lòng nhập lại địa chỉ email.' }));
      return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      setErrors(prev => ({ ...prev, email: 'Email này đã được sử dụng.' }));
      toast.error('Email already exists!');
      return;
    }
    
    if (!password || password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Mật khẩu phải có ít nhất 6 ký tự.' }));
      return;
    }
    
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp.' }));
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Add user to backend
    const userName = email.split('@')[0];
    addUser({
      name: userName,
      email,
      role: 'user',
      isActive: true,
    });
    
    // Mock registration
    login('user', userName);
    toast.success('Account created successfully!');
    navigate('/user/dashboard');
    
    setIsLoading(false);
  };

  const handleSocialSignUp = (provider: string) => {
    login('user', `${provider} User`);
    navigate('/user/dashboard');
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
          <div className="mb-8">
            <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>Create an account</h1>
            <p className="text-gray-600">Start your journey to a healthier lifestyle.</p>
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
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`mt-2 rounded-lg ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <span style={{ fontSize: '0.875rem' }}>⚠️ {errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`mt-2 rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <span style={{ fontSize: '0.875rem' }}>⚠️ {errors.password}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className={`mt-2 rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <span style={{ fontSize: '0.875rem' }}>⚠️ {errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white border-0 rounded-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500" style={{ fontSize: '0.875rem' }}>Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg py-6"
                onClick={() => handleSocialSignUp('Google')}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg py-6"
                onClick={() => handleSocialSignUp('Apple')}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00C78C] hover:text-[#00E6A0]" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

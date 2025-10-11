import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Apple,
  Dumbbell,
  Moon,
  Droplets,
  BookOpen,
  Bot,
  MessageSquare,
  Calculator,
  UtensilsCrossed,
  Home,
  Leaf,
  Calendar,
} from 'lucide-react';

export function UserDashboard() {
  const { userName, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/user/dashboard',
    },
    {
      title: 'Daily Planner',
      icon: Calendar,
      href: '/user/planner',
    },
    {
      title: 'Nutrition',
      icon: Apple,
      items: [
        { title: 'Calorie Calculator', href: '/user/nutrition/calorie-calculator', icon: Calculator },
        { title: 'Meal Suggestions', href: '/user/nutrition/meal-suggestions', icon: UtensilsCrossed },
      ],
    },
    {
      title: 'Fitness',
      icon: Dumbbell,
      items: [
        { title: 'Exercise Plans', href: '/user/fitness/exercise-plans', icon: Dumbbell },
      ],
    },
    {
      title: 'Wellness',
      icon: Moon,
      items: [
        { title: 'Sleep Tracker', href: '/user/wellness/sleep-tracker', icon: Moon },
        { title: 'Water Reminder', href: '/user/wellness/water-reminder', icon: Droplets },
        { title: 'Activity Log', href: '/user/wellness/activity-log', icon: BookOpen },
      ],
    },
    {
      title: 'Assistant',
      icon: Bot,
      items: [
        { title: 'AI Chatbot', href: '/user/assistant/chatbot', icon: Bot },
      ],
    },
    {
      title: 'Feedback',
      icon: MessageSquare,
      href: '/user/feedback',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900" style={{ fontWeight: 600 }}>HealthyColors</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? 'bg-[#00C78C] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-900">
                    <item.icon className="w-5 h-5" />
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                  </div>
                  {item.items && (
                    <div className="ml-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                            location.pathname === subItem.href
                              ? 'bg-[#00C78C] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span style={{ fontSize: '0.875rem' }}>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Dashboard</h2>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3">
                <span className="text-gray-700">{userName}</span>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#00C78C] text-white">
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

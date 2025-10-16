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
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Home,
  Leaf,
  Apple,
  Dumbbell,
} from 'lucide-react';

export function AdminDashboard() {
  const { userName, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin/dashboard',
    },
    {
      title: 'User Management',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Content Management',
      icon: FileText,
      href: '/admin/content',
    },
    {
      title: 'Meal Management',
      icon: Apple,
      href: '/admin/meal-management',
    },
    {
      title: 'Exercise Management',
      icon: Dumbbell,
      href: '/admin/exercise-management',
    },
    {
      title: 'Feedback Review',
      icon: MessageSquare,
      href: '/admin/feedback',
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      href: '/admin/statistics',
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
            <div>
              <span className="text-gray-900 block" style={{ fontWeight: 600 }}>HealthyColors</span>
              <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
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
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Admin Dashboard</h2>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3">
                <span className="text-gray-700">{userName}</span>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-600 text-white">
                    {userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

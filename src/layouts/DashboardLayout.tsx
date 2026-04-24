import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, CheckSquare, BookOpen,
  Timer, Users, BarChart2, Settings, Bell, Menu, X, LogOut, ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/planner', icon: Calendar, label: 'Smart Planner' },
  { to: '/dashboard/tasks', icon: CheckSquare, label: 'Task Manager' },
  { to: '/dashboard/tools', icon: BookOpen, label: 'Study Tools' },
  { to: '/dashboard/focus', icon: Timer, label: 'Focus Mode' },
  { to: '/dashboard/rooms', icon: Users, label: 'Study Rooms' },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

function SidebarNav({ onClose }: { onClose?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { profile, logout } = useUser();

  const name = profile?.name ?? 'Student';
  const initials = profile?.initials ?? 'S';
  const photoURL = profile?.photoURL ?? '';
  const firstName = name.split(' ')[0];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 bg-background border-r border-border fixed top-0 left-0 h-full z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen size={16} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">StudySync</span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>

        {/* User footer */}
        <div className="border-t border-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full rounded-lg px-2 py-2 hover:bg-muted transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={photoURL} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{name}</p>
                  <p className="text-xs text-muted-foreground">Student</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut size={14} className="mr-2" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-background flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 h-16 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <BookOpen size={16} className="text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">StudySync</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <SidebarNav onClose={() => setSidebarOpen(false)} />
            </div>
            <div className="border-t border-border p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-destructive w-full px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-16 bg-background border-b border-border flex items-center px-4 md:px-6 gap-4">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px]">
              3
            </Badge>
          </Button>

          {/* Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={photoURL} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {firstName}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut size={14} className="mr-2" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

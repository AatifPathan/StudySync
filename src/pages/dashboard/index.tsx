import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Calendar, CheckSquare, BookOpen, Timer, Users, Flame,
  TrendingUp, Clock, AlertCircle, ArrowRight, Target, Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

const QUICK_LAUNCH = [
  { label: 'Smart Planner', icon: Calendar, to: '/dashboard/planner', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: 'Focus Timer', icon: Timer, to: '/dashboard/focus', color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
  { label: 'Study Notes', icon: BookOpen, to: '/dashboard/tools', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { label: 'Study Room', icon: Users, to: '/dashboard/rooms', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
];

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getDateLabel = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export default function DashboardHome() {
  const { profile } = useUser();
  const firstName = profile?.name?.split(' ')[0] ?? 'Student';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {getDateLabel()} · Welcome to your dashboard.
        </p>
      </motion.div>

      {/* Quick Launch */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_LAUNCH.map(({ label, icon: Icon, to, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <Link to={to}>
              <div className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 cursor-pointer transition-all ${color} border border-transparent hover:shadow-sm`}>
                <Icon size={24} />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Tasks — empty state */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckSquare size={17} className="text-primary" /> Today's Tasks
              </CardTitle>
              <Link to="/dashboard/tasks">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
                  View all <ArrowRight size={13} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <CheckSquare size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No tasks yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Add your first task to start tracking your progress for today.
                </p>
                <Link to="/dashboard/tasks">
                  <Button size="sm" className="gap-1.5 mt-1">
                    <Plus size={14} /> Add a task
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Study Streak — empty state */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Flame size={17} className="text-orange-500" /> Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl font-bold text-foreground">0</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">days in a row</p>
                    <p className="text-xs text-muted-foreground">Start studying to build your streak!</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {WEEK_LABELS.map((label, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full h-7 rounded-md bg-muted" />
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats — empty state */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp size={17} className="text-primary" /> This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Study Hours', value: '0 hrs', icon: Clock, color: 'text-blue-600' },
                  { label: 'Tasks Completed', value: '0 / 0', icon: CheckSquare, color: 'text-emerald-600' },
                  { label: 'Focus Sessions', value: '0 sessions', icon: Target, color: 'text-violet-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className={color} />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Upcoming Deadlines — empty state */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle size={17} className="text-primary" /> Upcoming Deadlines
            </CardTitle>
            <Link to="/dashboard/planner">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
                Open Planner <ArrowRight size={13} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Calendar size={22} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No upcoming deadlines</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Plan your sessions and add deadlines in the Smart Planner to see them here.
              </p>
              <Link to="/dashboard/planner">
                <Button size="sm" variant="outline" className="gap-1.5 mt-1">
                  <Plus size={14} /> Open Planner
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

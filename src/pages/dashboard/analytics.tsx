import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart2, Clock, CheckSquare, Zap, TrendingUp,
  Flame, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ── Mock data ──────────────────────────────────────────────────────────
const WEEKLY_HOURS = [
  { day: 'Mon', hours: 3.5 }, { day: 'Tue', hours: 2.0 }, { day: 'Wed', hours: 4.5 },
  { day: 'Thu', hours: 1.5 }, { day: 'Fri', hours: 3.0 }, { day: 'Sat', hours: 5.0 }, { day: 'Sun', hours: 2.5 },
];
const MAX_HOURS = 6;

const HOURLY_PRODUCTIVITY = [
  { hour: '6am', score: 20 }, { hour: '7am', score: 35 }, { hour: '8am', score: 60 },
  { hour: '9am', score: 85 }, { hour: '10am', score: 90 }, { hour: '11am', score: 75 },
  { hour: '12pm', score: 40 }, { hour: '1pm', score: 30 }, { hour: '2pm', score: 55 },
  { hour: '3pm', score: 70 }, { hour: '4pm', score: 65 }, { hour: '5pm', score: 50 },
  { hour: '6pm', score: 45 }, { hour: '7pm', score: 60 }, { hour: '8pm', score: 55 },
  { hour: '9pm', score: 35 }, { hour: '10pm', score: 20 },
];

const SUBJECT_DISTRIBUTION = [
  { subject: 'Mathematics', hours: 12.5, color: '#4f46e5', pct: 35 },
  { subject: 'Chemistry', hours: 8.0, color: '#7c3aed', pct: 22 },
  { subject: 'Art History', hours: 6.5, color: '#8b5cf6', pct: 18 },
  { subject: 'English', hours: 5.0, color: '#a78bfa', pct: 14 },
  { subject: 'Physics', hours: 4.0, color: '#c4b5fd', pct: 11 },
];

const TASK_COMPLETION = [
  { week: 'Mar W1', done: 18, total: 22 },
  { week: 'Mar W2', done: 20, total: 24 },
  { week: 'Mar W3', done: 15, total: 20 },
  { week: 'Mar W4', done: 23, total: 26 },
  { week: 'Apr W1', done: 19, total: 22 },
  { week: 'This week', done: 14, total: 18 },
];

// April 2026 streak calendar
const APRIL_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const studied = [1,2,3,5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,26,27,28].includes(d);
  const today = d === 8;
  const future = d > 8;
  return { d, studied, today, future };
});
const APRIL_START_DOW = 2; // April 1 = Wednesday (0=Sun)

const STATS = [
  { label: 'Total Study Hours', value: '36h 30m', sub: 'This month', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Tasks Completed', value: '109 / 132', sub: '82% completion rate', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Focus Sessions', value: '48', sub: '20h focused time', icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Current Streak', value: '6 days', sub: 'Best: 14 days', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
];

// ── Pie chart (SVG) ────────────────────────────────────────────────────
function PieChart() {
  let cumulative = 0;
  const r = 80;
  const cx = 100;
  const cy = 100;
  const slices = SUBJECT_DISTRIBUTION.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    return { ...s, start, end: cumulative };
  });

  function polarToXY(pct: number, radius: number) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  function arcPath(startPct: number, endPct: number) {
    const s = polarToXY(startPct, r);
    const e = polarToXY(endPct, r);
    const large = endPct - startPct > 50 ? 1 : 0;
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg width="200" height="200" viewBox="0 0 200 200" className="shrink-0">
        {slices.map(s => (
          <path key={s.subject} d={arcPath(s.start, s.end)} fill={s.color}
            className="hover:opacity-80 transition-opacity cursor-pointer" />
        ))}
        <circle cx={cx} cy={cy} r={40} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="500">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="14" fill="#111827" fontWeight="700">36h</text>
      </svg>
      <div className="flex flex-col gap-2 w-full">
        {SUBJECT_DISTRIBUTION.map(s => (
          <div key={s.subject} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-foreground flex-1">{s.subject}</span>
            <span className="text-sm font-semibold text-foreground">{s.hours}h</span>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar chart ──────────────────────────────────────────────────────────
function WeeklyBars() {
  const today = new Date().getDay(); // 0=Sun
  const dayMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  return (
    <div className="flex items-end gap-2 h-40 pt-4">
      {WEEKLY_HOURS.map(({ day, hours }) => {
        const isToday = dayMap[day] === today;
        const heightPct = (hours / MAX_HOURS) * 100;
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">{hours}h</span>
            <div className="w-full relative flex items-end" style={{ height: '96px' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' as const }}
                className={`w-full rounded-t-md ${isToday ? 'bg-primary' : 'bg-primary/30'}`}
              />
            </div>
            <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Productivity heatmap ───────────────────────────────────────────────
function ProductivityChart() {
  const max = Math.max(...HOURLY_PRODUCTIVITY.map(h => h.score));
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-28">
        {HOURLY_PRODUCTIVITY.map(({ hour, score }) => {
          const h = (score / max) * 100;
          const isPeak = score >= 80;
          return (
            <div key={hour} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' as const }}
                className={`w-full rounded-t-sm ${isPeak ? 'bg-violet-500' : 'bg-violet-200'}`}
                style={{ minHeight: '4px' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1">
        {HOURLY_PRODUCTIVITY.map(({ hour }) => (
          <div key={hour} className="flex-1 text-center">
            <span className="text-[9px] text-muted-foreground">{hour.replace('am', '').replace('pm', '')}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-500" /><span className="text-xs text-muted-foreground">Peak hours</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-200" /><span className="text-xs text-muted-foreground">Low activity</span></div>
        <span className="text-xs text-muted-foreground ml-auto">Most productive: <strong className="text-foreground">9–11 AM</strong></span>
      </div>
    </div>
  );
}

// ── Task completion bars ───────────────────────────────────────────────
function TaskCompletionChart() {
  return (
    <div className="space-y-3">
      {TASK_COMPLETION.map(({ week, done, total }) => {
        const pct = Math.round((done / total) * 100);
        return (
          <div key={week} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">{week}</span>
              <span className="text-foreground font-semibold">{done}/{total} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' as const }}
                className={`h-full rounded-full ${pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-primary' : 'bg-amber-500'}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Streak calendar ────────────────────────────────────────────────────
function StreakCalendar() {
  const [month, setMonth] = useState(0); // 0 = April
  const MONTH_NAMES = ['April 2026', 'March 2026'];
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMonth(m => Math.min(m + 1, 1))}>
          <ChevronLeft size={14} />
        </Button>
        <span className="text-sm font-semibold text-foreground">{MONTH_NAMES[month]}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMonth(m => Math.max(m - 1, 0))}>
          <ChevronRight size={14} />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DOW.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
        ))}
        {/* Empty cells for April start (Wed = index 3) */}
        {Array.from({ length: APRIL_START_DOW }).map((_, i) => <div key={`e${i}`} />)}
        {APRIL_DAYS.map(({ d, studied, today, future }) => (
          <div
            key={d}
            className={`aspect-square flex items-center justify-center rounded-md text-xs font-medium transition-colors
              ${today ? 'ring-2 ring-primary ring-offset-1' : ''}
              ${future ? 'text-muted-foreground/40' : studied ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'}
            `}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-xs text-muted-foreground">Studied</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-muted/50 border border-border" /><span className="text-xs text-muted-foreground">No study</span></div>
        <span className="text-xs text-muted-foreground ml-auto">21 days studied in April</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track your study habits and progress</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart2 size={16} className="text-primary" /> Weekly Study Hours
            </CardTitle>
            <p className="text-xs text-muted-foreground">Total this week: <strong className="text-foreground">22h</strong></p>
          </CardHeader>
          <CardContent><WeeklyBars /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckSquare size={16} className="text-emerald-600" /> Task Completion Rate
            </CardTitle>
            <p className="text-xs text-muted-foreground">Last 6 weeks</p>
          </CardHeader>
          <CardContent><TaskCompletionChart /></CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap size={16} className="text-violet-600" /> Most Productive Time of Day
            </CardTitle>
            <p className="text-xs text-muted-foreground">Based on focus session activity</p>
          </CardHeader>
          <CardContent><ProductivityChart /></CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Subject Time Distribution
            </CardTitle>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardHeader>
          <CardContent><PieChart /></CardContent>
        </Card>
      </div>

      {/* Streak calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Flame size={16} className="text-orange-500" /> Study Streak Calendar
          </CardTitle>
          <p className="text-xs text-muted-foreground">Current streak: <strong className="text-foreground">6 days</strong> · Best: 14 days</p>
        </CardHeader>
        <CardContent><StreakCalendar /></CardContent>
      </Card>
    </div>
  );
}

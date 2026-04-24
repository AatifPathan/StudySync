import { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SUBJECTS = [
  { name: 'Mathematics', color: 'bg-blue-500', light: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Chemistry', color: 'bg-emerald-500', light: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Art History', color: 'bg-violet-500', light: 'bg-violet-100 text-violet-700 border-violet-200' },
  { name: 'English', color: 'bg-amber-500', light: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Physics', color: 'bg-red-500', light: 'bg-red-100 text-red-700 border-red-200' },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am–8pm
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Session = {
  id: number; day: number; startHour: number; duration: number;
  title: string; subject: string; type: 'study' | 'exam' | 'break'; missed?: boolean;
};

const INITIAL_SESSIONS: Session[] = [];

function getSubjectStyle(name: string) {
  return SUBJECTS.find(s => s.name === name) ?? SUBJECTS[0];
}

export default function PlannerPage() {
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newSession, setNewSession] = useState({ title: '', subject: 'Mathematics', day: '0', startHour: '9', duration: '1', type: 'study' });

  const missedCount = sessions.filter(s => s.missed).length;

  const addSession = () => {
    setSessions(prev => [...prev, {
      id: Date.now(), day: +newSession.day, startHour: +newSession.startHour,
      duration: +newSession.duration, title: newSession.title,
      subject: newSession.subject, type: newSession.type as 'study' | 'exam',
    }]);
    setShowAdd(false);
    setNewSession({ title: '', subject: 'Mathematics', day: '0', startHour: '9', duration: '1', type: 'study' });
  };

  const removeSession = (id: number) => setSessions(prev => prev.filter(s => s.id !== id));

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart Planner</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Plan and manage your weekly study schedule</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus size={16} /> Add Session
        </Button>
      </div>

      {/* Missed tasks alert */}
      {missedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3"
        >
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm font-medium">
            You have <strong>{missedCount} missed session{missedCount > 1 ? 's' : ''}</strong> this week. Consider rescheduling them to stay on track.
          </p>
        </motion.div>
      )}

      {/* Subject legend */}
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map(s => (
          <div key={s.name} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
            <span className="text-xs text-muted-foreground">{s.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="text-xs text-muted-foreground">Exam</span>
        </div>
      </div>

      {/* Week nav */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Week of April {8 + weekOffset * 7}, 2026
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft size={15} />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setWeekOffset(0)}>Today</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="p-2 text-xs text-muted-foreground text-center border-r border-border">Time</div>
              {DAYS.map((d, i) => (
                <div key={d} className={`p-2 text-center border-r border-border last:border-r-0 ${i === 2 ? 'bg-primary/5' : ''}`}>
                  <p className="text-xs font-semibold text-foreground">{d}</p>
                  <p className="text-xs text-muted-foreground">Apr {8 + i + weekOffset * 7}</p>
                </div>
              ))}
            </div>

            {/* Time grid */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/50 min-h-[52px]">
                <div className="p-2 text-xs text-muted-foreground text-right pr-3 border-r border-border pt-1.5">
                  {hour}:00
                </div>
                {DAYS.map((_, dayIdx) => {
                  const daySessions = sessions.filter(s => s.day === dayIdx && s.startHour === hour);
                  return (
                    <div key={dayIdx} className={`border-r border-border/50 last:border-r-0 p-0.5 ${dayIdx === 2 ? 'bg-primary/5' : ''}`}>
                      {daySessions.map(session => {
                        const style = getSubjectStyle(session.subject);
                        const isExam = session.type === 'exam';
                        return (
                          <div
                            key={session.id}
                            className={`relative rounded-md px-1.5 py-1 text-xs font-medium border group cursor-pointer
                              ${isExam ? 'bg-red-100 text-red-800 border-red-300' : session.missed ? 'bg-gray-100 text-gray-500 border-gray-300 opacity-60' : `${style.light}`}
                            `}
                            style={{ minHeight: `${session.duration * 48}px` }}
                          >
                            <p className="truncate leading-tight">{session.title}</p>
                            <p className="text-[10px] opacity-70">{session.duration}h</p>
                            <button
                              onClick={() => removeSession(session.id)}
                              className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Session Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Study Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Session Title</Label>
              <Input placeholder="e.g. Calculus Review" value={newSession.title} onChange={e => setNewSession(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select value={newSession.subject} onValueChange={v => setNewSession(p => ({ ...p, subject: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SUBJECTS.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={newSession.type} onValueChange={v => setNewSession(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Study Session</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Day</Label>
                <Select value={newSession.day} onValueChange={v => setNewSession(p => ({ ...p, day: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{FULL_DAYS.map((d, i) => <SelectItem key={d} value={String(i)}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Start Time</Label>
                <Select value={newSession.startHour} onValueChange={v => setNewSession(p => ({ ...p, startHour: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{HOURS.map(h => <SelectItem key={h} value={String(h)}>{h}:00</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duration (hrs)</Label>
                <Select value={newSession.duration} onValueChange={v => setNewSession(p => ({ ...p, duration: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{[1,2,3,4].map(h => <SelectItem key={h} value={String(h)}>{h}h</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={addSession} disabled={!newSession.title}>Add Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

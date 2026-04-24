import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Filter, Calendar, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'pending' | 'done';

type Task = {
  id: number; title: string; subject: string;
  priority: Priority; deadline: string; status: Status;
};

const SUBJECTS = ['Mathematics', 'Chemistry', 'Art History', 'English', 'Physics', 'General'];

const INITIAL_TASKS: Task[] = [];

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const PRIORITY_DOT: Record<Priority, string> = {
  High: 'bg-red-500', Medium: 'bg-amber-500', Low: 'bg-green-500',
};

function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: 'Overdue', cls: 'text-red-600' };
  if (diff === 0) return { label: 'Due today', cls: 'text-red-600' };
  if (diff === 1) return { label: 'Due tomorrow', cls: 'text-amber-600' };
  return { label: `${diff}d left`, cls: 'text-muted-foreground' };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filterSubject, setFilterSubject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subject: 'General', priority: 'Medium' as Priority, deadline: '' });

  const toggle = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t));

  const remove = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if (!newTask.title) return;
    setTasks(prev => [...prev, { id: Date.now(), ...newTask, status: 'pending' }]);
    setNewTask({ title: '', subject: 'General', priority: 'Medium', deadline: '' });
    setShowAdd(false);
  };

  const filtered = tasks.filter(t => {
    if (filterSubject !== 'All' && t.subject !== filterSubject) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority) return false;
    return true;
  });

  const pending = filtered.filter(t => t.status === 'pending');
  const done = filtered.filter(t => t.status === 'done');
  const totalDone = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{totalDone} of {tasks.length} tasks completed</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus size={16} /> Add Task
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: 'text-amber-600' },
          { label: 'Completed', value: totalDone, color: 'text-emerald-600' },
          { label: 'High Priority', value: tasks.filter(t => t.priority === 'High' && t.status === 'pending').length, color: 'text-red-600' },
        ].map(s => (
          <Card key={s.label} className="text-center py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={15} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium mr-1">Filter:</span>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subjects</SelectItem>
                {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            {(filterSubject !== 'All' || filterStatus !== 'All' || filterPriority !== 'All') && (
              <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground"
                onClick={() => { setFilterSubject('All'); setFilterStatus('All'); setFilterPriority('All'); }}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      {pending.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pending · {pending.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence>
              {pending.map(task => {
                const due = daysUntil(task.deadline);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors group"
                  >
                    <button onClick={() => toggle(task.id)} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                      <Circle size={20} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{task.subject}</span>
                        {task.deadline && (
                          <span className={`text-xs font-medium flex items-center gap-1 ${due.cls}`}>
                            <Calendar size={11} />{due.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${PRIORITY_STYLES[task.priority]}`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {done.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Completed · {done.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {done.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 group">
                <button onClick={() => toggle(task.id)} className="shrink-0 text-primary">
                  <CheckCircle2 size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground line-through">{task.title}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{task.subject}</p>
                </div>
                <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Flag size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">{tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}</p>
          <p className="text-sm mt-1">
            {tasks.length === 0
              ? 'Click "Add Task" to create your first task.'
              : 'Try adjusting your filters or add a new task.'}
          </p>
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Task Title</Label>
              <Input placeholder="What do you need to do?" value={newTask.title}
                onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select value={newTask.subject} onValueChange={v => setNewTask(p => ({ ...p, subject: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v as Priority }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">🔴 High</SelectItem>
                    <SelectItem value="Medium">🟡 Medium</SelectItem>
                    <SelectItem value="Low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input type="date" value={newTask.deadline}
                onChange={e => setNewTask(p => ({ ...p, deadline: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={addTask} disabled={!newTask.title}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

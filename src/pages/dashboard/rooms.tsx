import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Plus, LogIn, Lock, Globe, Mic, MicOff, Video, VideoOff,
  Send, Pencil, FileText, X, Circle, MessageSquare, Eraser
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

type Room = { id: number; name: string; subject: string; participants: number; max: number; isPrivate: boolean; host: string; active: boolean };

const INIT_ROOMS: Room[] = [
  { id: 1, name: 'Calculus Study Group', subject: 'Mathematics', participants: 4, max: 6, isPrivate: false, host: 'Alex J.', active: true },
  { id: 2, name: 'Chemistry Exam Prep', subject: 'Chemistry', participants: 2, max: 4, isPrivate: false, host: 'Sarah K.', active: true },
  { id: 3, name: 'Art History Discussion', subject: 'Art History', participants: 3, max: 5, isPrivate: true, host: 'Mike R.', active: true },
  { id: 4, name: 'Physics Problem Solving', subject: 'Physics', participants: 1, max: 4, isPrivate: false, host: 'Emma L.', active: false },
];

const PARTICIPANTS = [
  { name: 'Alex Johnson', initials: 'AJ', role: 'You', color: 'bg-primary/10 text-primary' },
  { name: 'Sarah Kim', initials: 'SK', role: 'Host', color: 'bg-violet-100 text-violet-700' },
  { name: 'Mike Roberts', initials: 'MR', role: 'Member', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Emma Liu', initials: 'EL', role: 'Member', color: 'bg-amber-100 text-amber-700' },
];

const INIT_MESSAGES = [
  { id: 1, sender: 'Sarah Kim', initials: 'SK', text: 'Hey everyone! Let\'s start with derivatives today.', time: '3:01 PM', isMe: false },
  { id: 2, sender: 'Mike Roberts', initials: 'MR', text: 'Sounds good! I\'m struggling with the chain rule.', time: '3:02 PM', isMe: false },
  { id: 3, sender: 'You', initials: 'AJ', text: 'I can explain it! Let me write it on the whiteboard.', time: '3:03 PM', isMe: true },
  { id: 4, sender: 'Emma Liu', initials: 'EL', text: 'Perfect, I need help with that too!', time: '3:04 PM', isMe: false },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-emerald-100 text-emerald-700',
  'Art History': 'bg-violet-100 text-violet-700',
  Physics: 'bg-red-100 text-red-700',
  English: 'bg-amber-100 text-amber-700',
};

// ── Room Interior ──
function RoomInterior({ room, onLeave }: { room: Room; onLeave: () => void }) {
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [msgInput, setMsgInput] = useState('');
  const [sharedNotes, setSharedNotes] = useState('# Calculus Study Session\n\n## Chain Rule\nd/dx[f(g(x))] = f\'(g(x)) · g\'(x)\n\n## Examples\n1. d/dx[sin(x²)] = cos(x²) · 2x\n2. d/dx[(3x+1)⁴] = 4(3x+1)³ · 3\n\n## Practice Problems\n- Find d/dx[(x²+1)³]\n- Find d/dx[√(2x+5)]');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [drawColor, setDrawColor] = useState('#4f46e5');
  const [whiteboardText, setWhiteboardText] = useState('Chain Rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)\n\nExample: d/dx[sin(x²)] = cos(x²) · 2x = 2x·cos(x²)');

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: 'You', initials: 'AJ', text: msgInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true }]);
    setMsgInput('');
  };

  return (
    <div className="space-y-4">
      {/* Room header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{room.name}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className={`text-xs ${SUBJECT_COLORS[room.subject] ?? ''}`}>{room.subject}</Badge>
            <span className="text-xs text-muted-foreground">{PARTICIPANTS.length} participants</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={micOn ? 'outline' : 'destructive'} size="icon" className="h-9 w-9" onClick={() => setMicOn(m => !m)}>
            {micOn ? <Mic size={16} /> : <MicOff size={16} />}
          </Button>
          <Button variant={camOn ? 'outline' : 'destructive'} size="icon" className="h-9 w-9" onClick={() => setCamOn(c => !c)}>
            {camOn ? <Video size={16} /> : <VideoOff size={16} />}
          </Button>
          <Button variant="destructive" size="sm" onClick={onLeave} className="gap-1">
            <X size={14} /> Leave Room
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main area */}
        <div className="lg:col-span-3 space-y-4">
          <Tabs defaultValue="whiteboard">
            <TabsList>
              <TabsTrigger value="whiteboard" className="gap-2"><Pencil size={14} /> Whiteboard</TabsTrigger>
              <TabsTrigger value="notes" className="gap-2"><FileText size={14} /> Shared Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="whiteboard">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Collaborative Whiteboard</CardTitle>
                  <div className="flex items-center gap-2">
                    {['#4f46e5', '#7c3aed', '#10b981', '#ef4444', '#f59e0b', '#000000'].map(c => (
                      <button key={c} onClick={() => setDrawColor(c)}
                        className={`w-5 h-5 rounded-full border-2 transition-transform ${drawColor === c ? 'scale-125 border-foreground' : 'border-transparent'}`}
                        style={{ background: c }} />
                    ))}
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs ml-2" onClick={() => setWhiteboardText('')}>
                      <Eraser size={12} /> Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border-2 border-dashed border-border rounded-xl min-h-[320px] p-4 relative">
                    <Textarea
                      value={whiteboardText}
                      onChange={e => setWhiteboardText(e.target.value)}
                      className="w-full h-72 resize-none border-0 focus-visible:ring-0 bg-transparent text-base font-mono"
                      style={{ color: drawColor }}
                      placeholder="Start writing on the whiteboard... (collaborative text mode)"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      {PARTICIPANTS.map(p => (
                        <Avatar key={p.name} className="w-6 h-6 border-2 border-white">
                          <AvatarFallback className={`text-[9px] font-bold ${p.color}`}>{p.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Shared Notes</CardTitle>
                  <Badge variant="outline" className="text-xs text-emerald-700 bg-emerald-50 border-emerald-200">
                    <Circle size={6} className="fill-emerald-500 mr-1" /> Live sync
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={sharedNotes}
                    onChange={e => setSharedNotes(e.target.value)}
                    className="w-full h-72 resize-none font-mono text-sm"
                    placeholder="Shared notes — everyone can edit..."
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Participants */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users size={14} /> Participants ({PARTICIPANTS.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {PARTICIPANTS.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className={`text-xs font-semibold ${p.color}`}>{p.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.role}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="flex flex-col" style={{ height: '320px' }}>
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare size={14} /> Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 pb-2">
              {messages.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.isMe ? 'flex-row-reverse' : ''}`}>
                  {!m.isMe && (
                    <Avatar className="w-6 h-6 shrink-0 mt-0.5">
                      <AvatarFallback className="text-[9px] font-bold bg-muted">{m.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] ${m.isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    {!m.isMe && <p className="text-[10px] text-muted-foreground">{m.sender}</p>}
                    <div className={`px-2.5 py-1.5 rounded-xl text-xs ${m.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.text}
                    </div>
                    <p className="text-[9px] text-muted-foreground">{m.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="px-4 pb-3 shrink-0 flex gap-2">
              <Input
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="h-8 text-xs"
              />
              <Button size="icon" className="h-8 w-8 shrink-0" onClick={sendMessage}>
                <Send size={13} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Room Listing ──
export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(INIT_ROOMS);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', subject: 'Mathematics', isPrivate: false, max: '4' });
  const [joinCode, setJoinCode] = useState('');

  const createRoom = () => {
    if (!newRoom.name) return;
    const r: Room = { id: Date.now(), name: newRoom.name, subject: newRoom.subject, participants: 1, max: +newRoom.max, isPrivate: newRoom.isPrivate, host: 'You', active: true };
    setRooms(p => [r, ...p]);
    setActiveRoom(r);
    setShowCreate(false);
    setNewRoom({ name: '', subject: 'Mathematics', isPrivate: false, max: '4' });
  };

  if (activeRoom) return (
    <div className="max-w-6xl mx-auto">
      <RoomInterior room={activeRoom} onLeave={() => setActiveRoom(null)} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Virtual Study Rooms</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Study together, stay motivated</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoin(true)} className="gap-2"><LogIn size={16} /> Join Room</Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2"><Plus size={16} /> Create Room</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Rooms', value: rooms.filter(r => r.active).length, color: 'text-emerald-600' },
          { label: 'Students Online', value: rooms.reduce((a, r) => a + r.participants, 0), color: 'text-primary' },
          { label: 'Your Sessions', value: 8, color: 'text-violet-600' },
        ].map(s => (
          <Card key={s.label} className="text-center py-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Room list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map(room => (
          <motion.div key={room.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`hover:shadow-md transition-shadow ${!room.active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">{room.name}</CardTitle>
                      {room.isPrivate ? <Lock size={13} className="text-muted-foreground shrink-0" /> : <Globe size={13} className="text-muted-foreground shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${SUBJECT_COLORS[room.subject] ?? ''}`}>{room.subject}</Badge>
                      <span className="text-xs text-muted-foreground">Host: {room.host}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${room.active ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    <Circle size={6} className={room.active ? 'fill-emerald-500' : 'fill-muted-foreground'} />
                    {room.active ? 'Live' : 'Ended'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    {Array.from({ length: Math.min(room.participants, 4) }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center">
                        <span className="text-[8px] font-bold text-primary">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{room.participants}/{room.max}</span>
                </div>
                <Button size="sm" disabled={!room.active || room.participants >= room.max}
                  onClick={() => setActiveRoom(room)} className="gap-1 text-xs">
                  <LogIn size={13} /> Join
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Room Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Study Room</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Room Name</Label>
              <Input placeholder="e.g. Calculus Study Group" value={newRoom.name} onChange={e => setNewRoom(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Subject</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={newRoom.subject} onChange={e => setNewRoom(p => ({ ...p, subject: e.target.value }))}>
                  {['Mathematics', 'Chemistry', 'Art History', 'English', 'Physics'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Max Participants</Label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm" value={newRoom.max} onChange={e => setNewRoom(p => ({ ...p, max: e.target.value }))}>
                  {[2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} people</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Private Room</p>
                <p className="text-xs text-muted-foreground">Require a code to join</p>
              </div>
              <Switch checked={newRoom.isPrivate} onCheckedChange={v => setNewRoom(p => ({ ...p, isPrivate: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={createRoom} disabled={!newRoom.name}>Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Room Dialog */}
      <Dialog open={showJoin} onOpenChange={setShowJoin}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Join a Room</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label>Room Code</Label>
              <Input placeholder="Enter room code..." value={joinCode} onChange={e => setJoinCode(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoin(false)}>Cancel</Button>
            <Button onClick={() => setShowJoin(false)} disabled={!joinCode}>Join Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

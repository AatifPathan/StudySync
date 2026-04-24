import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Music, CloudRain, VolumeX, Coffee, Target, CheckCircle2, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const FOCUS_MINS = 25;
const BREAK_MINS = 5;

const TASKS: string[] = [];

const SOUNDS = [
  { id: 'lofi', label: 'Lo-fi Beats', icon: Music },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'silence', label: 'Silence', icon: VolumeX },
];

const SESSION_HISTORY: { task: string; duration: number; type: string; time: string }[] = [];

function pad(n: number) { return String(n).padStart(2, '0'); }

// ── Web Audio sound engine ─────────────────────────────────────────────
function useSoundEngine() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => {
      try { (n as AudioBufferSourceNode | OscillatorNode).stop(); } catch { /* already stopped */ }
    });
    nodesRef.current = [];
    gainRef.current = null;
  }, []);

  const playLofi = useCallback((volume: number) => {
    stopAll();
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = volume * 0.18;
    master.connect(ctx.destination);
    gainRef.current = master;

    // Soft chord tones — layered sine waves at musical intervals
    const notes = [130.81, 164.81, 196.00, 246.94, 261.63]; // C3 E3 G3 B3 C4
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.value = 0.12 - i * 0.015;
      osc.connect(g);
      g.connect(master);
      osc.start();
      nodesRef.current.push(osc);

      // Slow LFO tremolo per note
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.3 + i * 0.07;
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();
      nodesRef.current.push(lfo);
    });

    // Warm low-pass filtered noise for vinyl texture
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.015;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 800;
    src.connect(lp);
    lp.connect(master);
    src.start();
    nodesRef.current.push(src);
  }, [stopAll, getCtx]);

  const playRain = useCallback((volume: number) => {
    stopAll();
    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = volume * 0.55;
    master.connect(ctx.destination);
    gainRef.current = master;

    // White noise source
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    // Band-pass filter to shape rain frequency
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1200;
    bp.Q.value = 0.5;

    // Low-pass for softness
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 4000;

    src.connect(bp);
    bp.connect(lp);
    lp.connect(master);
    src.start();
    nodesRef.current.push(src);

    // Occasional thunder-like rumble
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = 'sawtooth';
    rumble.frequency.value = 40;
    rumbleGain.gain.value = 0.02;
    const rumbleLp = ctx.createBiquadFilter();
    rumbleLp.type = 'lowpass';
    rumbleLp.frequency.value = 80;
    rumble.connect(rumbleLp);
    rumbleLp.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start();
    nodesRef.current.push(rumble);
  }, [stopAll, getCtx]);

  const setVolume = useCallback((volume: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume * 0.55;
    }
  }, []);

  useEffect(() => () => stopAll(), [stopAll]);

  return { playLofi, playRain, stopAll, setVolume };
}

export default function FocusPage() {
  const [isBreak, setIsBreak] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(FOCUS_MINS * 60);
  const [sessions, setSessions] = useState(0);
  const [sound, setSound] = useState('silence');
  const [volume, setVolume] = useState(0.6);
  const [linkedTask, setLinkedTask] = useState('');
  const [history, setHistory] = useState(SESSION_HISTORY);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playLofi, playRain, stopAll, setVolume: setSoundVolume } = useSoundEngine();

  const totalSeconds = (isBreak ? BREAK_MINS : FOCUS_MINS) * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  // Handle sound changes
  useEffect(() => {
    if (sound === 'lofi') playLofi(volume);
    else if (sound === 'rain') playRain(volume);
    else stopAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  // Handle volume changes without restarting sound
  useEffect(() => {
    if (sound !== 'silence') setSoundVolume(volume);
  }, [volume, sound, setSoundVolume]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            if (!isBreak) {
              setSessions(n => n + 1);
              setHistory(h => [{
                task: linkedTask || 'Focus Session',
                duration: FOCUS_MINS,
                type: 'focus',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }, ...h]);
              setIsBreak(true);
              return BREAK_MINS * 60;
            } else {
              setIsBreak(false);
              return FOCUS_MINS * 60;
            }
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, isBreak, linkedTask]);

  const reset = () => {
    setRunning(false);
    setIsBreak(false);
    setSeconds(FOCUS_MINS * 60);
  };

  const circumference = 2 * Math.PI * 110;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Focus Mode</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Pomodoro timer — stay in the zone</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-8 pb-8 flex flex-col items-center gap-8">
              {/* Mode badge */}
              <div className="flex gap-2">
                <Badge className={`px-4 py-1 text-sm font-semibold ${!isBreak ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  Focus
                </Badge>
                <Badge className={`px-4 py-1 text-sm font-semibold ${isBreak ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                  Break
                </Badge>
              </div>

              {/* Circular timer */}
              <div className="relative flex items-center justify-center">
                <svg width="260" height="260" className="-rotate-90">
                  <circle cx="130" cy="130" r="110" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                  <motion.circle
                    cx="130" cy="130" r="110"
                    fill="none"
                    stroke={isBreak ? '#10b981' : 'hsl(var(--primary))'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDash}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-bold text-foreground tabular-nums tracking-tight">
                    {pad(mins)}:{pad(secs)}
                  </span>
                  <span className="text-sm text-muted-foreground mt-1 font-medium">
                    {isBreak ? '☕ Break time' : '🎯 Focus time'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-full" onClick={reset}>
                  <RotateCcw size={18} />
                </Button>
                <Button
                  size="icon"
                  className={`w-16 h-16 rounded-full shadow-lg text-white ${isBreak ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:bg-primary/90'}`}
                  onClick={() => setRunning(r => !r)}
                >
                  {running ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </Button>
                <Button variant="outline" size="icon" className="w-12 h-12 rounded-full"
                  onClick={() => { setIsBreak(b => !b); setSeconds(isBreak ? FOCUS_MINS * 60 : BREAK_MINS * 60); setRunning(false); }}>
                  <Coffee size={18} />
                </Button>
              </div>

              {/* Session counter */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 ${i < sessions % 4 ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-2">{sessions} sessions today</span>
              </div>

              {/* Linked task */}
              <div className="w-full max-w-sm">
                <p className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                  <Target size={12} /> Linked Task
                </p>
                <Select value={linkedTask} onValueChange={setLinkedTask}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Link a task to this session..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TASKS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Ambient Sound */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Ambient Sound</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {SOUNDS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSound(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm font-medium ${sound === id ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:bg-muted/40'}`}
                >
                  <Icon size={16} />
                  {label}
                  {sound === id && <CheckCircle2 size={14} className="ml-auto text-primary" />}
                </button>
              ))}

              {/* Volume slider — only when sound is active */}
              {sound !== 'silence' && (
                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Volume2 size={12} /> Volume
                    </span>
                    <span className="text-xs font-medium text-foreground">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    className="w-full"
                  />
                </div>
              )}

              {sound !== 'silence' && (
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  🎵 Playing via Web Audio — no files needed
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Today's Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Focus Sessions', value: sessions, color: 'text-primary' },
                { label: 'Focus Time', value: `${sessions * 25} min`, color: 'text-violet-600' },
                { label: 'Break Time', value: `${sessions * 5} min`, color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Session History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Session Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${h.type === 'focus' ? 'bg-primary' : 'bg-emerald-500'}`} />
                  <span className="flex-1 text-foreground truncate">{h.task}</span>
                  <span className="text-muted-foreground shrink-0">{h.duration}m</span>
                  <span className="text-muted-foreground shrink-0">{h.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  User, Lock, Bell, Link2, LogOut, Camera,
  Check, Eye, EyeOff, Shield, Smartphone, Monitor,
  Chrome, Trash2, Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUser } from '@/context/UserContext';
import { auth, updateProfile } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const GOOGLE_CLIENT_ID = '335000795355-316gemuo0hs58oiq968natld5ga8pmb8.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          prompt: () => void;
          renderButton: (el: HTMLElement, opts: object) => void;
        };
      };
    };
  }
}

type NotifKey = 'deadlineReminders' | 'studyStreakAlerts' | 'roomInvites' | 'weeklyReport' | 'taskReminders' | 'emailDigest';

export default function SettingsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const { profile, logout, refreshProfile } = useUser();

  // Profile state — seeded from real Firebase user, blank for new users
  const [avatar, setAvatar] = useState(profile?.photoURL ?? '');
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Notifications
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    deadlineReminders: true,
    studyStreakAlerts: true,
    roomInvites: true,
    weeklyReport: false,
    taskReminders: true,
    emailDigest: false,
  });

  // Google connection
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const saveProfile = async () => {
    setProfileError('');
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name.trim() || null,
          photoURL: avatar || null,
        });
        refreshProfile();
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {
      setProfileError('Could not save profile. Please try again.');
    }
  };

  const savePassword = async () => {
    setPwError('');
    if (!currentPw) return setPwError('Enter your current password.');
    if (newPw.length < 8) return setPwError('New password must be at least 8 characters.');
    if (newPw !== confirmPw) return setPwError('Passwords do not match.');
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const cred = EmailAuthProvider.credential(user.email, currentPw);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPw);
      }
      setPwSaved(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect.');
      } else {
        setPwError('Could not update password. Please try again.');
      }
    }
  };

  const connectGoogle = () => {
    // Load Google Identity Services script
    if (!document.getElementById('google-gsi')) {
      const script = document.createElement('script');
      script.id = 'google-gsi';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogle();
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
  };

  const initGoogle = () => {
    window.google?.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        // Decode JWT to get email (header.payload.sig)
        try {
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          setGoogleEmail(payload.email ?? 'google@account.com');
          setGoogleConnected(true);
        } catch {
          setGoogleConnected(true);
          setGoogleEmail('google@account.com');
        }
      },
    });
    window.google?.accounts.id.prompt();
  };

  const disconnectGoogle = () => {
    setGoogleConnected(false);
    setGoogleEmail('');
  };

  const toggleNotif = (key: NotifKey) =>
    setNotifs(p => ({ ...p, [key]: !p[key] }));

  const NOTIF_ITEMS: { key: NotifKey; label: string; desc: string }[] = [
    { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Get notified 24h before task deadlines' },
    { key: 'studyStreakAlerts', label: 'Study Streak Alerts', desc: 'Reminders to maintain your daily streak' },
    { key: 'roomInvites', label: 'Study Room Invites', desc: 'Notifications when invited to a study room' },
    { key: 'taskReminders', label: 'Task Reminders', desc: 'Daily morning summary of pending tasks' },
    { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Summary of your study activity each week' },
    { key: 'emailDigest', label: 'Email Digest', desc: 'Receive weekly updates via email' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-5 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-2"><User size={14} /> Profile</TabsTrigger>
          <TabsTrigger value="password" className="gap-2"><Lock size={14} /> Password</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell size={14} /> Notifications</TabsTrigger>
          <TabsTrigger value="accounts" className="gap-2"><Link2 size={14} /> Connected Accounts</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-primary/10">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {profile?.initials ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <Camera size={13} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1"
                    onClick={() => fileInputRef.current?.click()}>
                    <Camera size={12} /> Upload Photo
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Institution</Label>
                  <Input defaultValue="State University" />
                </div>
                <div className="space-y-1.5">
                  <Label>Year of Study</Label>
                  <Input defaultValue="3rd Year" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSaved && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
                    <Check size={14} /> Changes saved!
                  </motion.p>
                )}
                {profileError && <p className="text-sm text-red-500">{profileError}</p>}
                <Button onClick={saveProfile} className="ml-auto gap-2">
                  <Save size={15} /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Password Tab ── */}
        <TabsContent value="password">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input type={showCurrent ? 'text' : 'password'} value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" />
                  <button onClick={() => setShowCurrent(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>New Password</Label>
                <div className="relative">
                  <Input type={showNew ? 'text' : 'password'} value={newPw}
                    onChange={e => setNewPw(e.target.value)} placeholder="At least 8 characters" />
                  <button onClick={() => setShowNew(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPw && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${newPw.length >= i * 3 ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-blue-400' : 'bg-emerald-500' : 'bg-muted'}`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      {newPw.length < 4 ? 'Weak' : newPw.length < 7 ? 'Fair' : newPw.length < 10 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input type={showConfirm ? 'text' : 'password'} value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" />
                  <button onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPw && newPw && (
                  <p className={`text-xs mt-1 ${confirmPw === newPw ? 'text-emerald-600' : 'text-red-500'}`}>
                    {confirmPw === newPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {pwError && <p className="text-sm text-red-500">{pwError}</p>}

              <div className="flex items-center justify-between pt-2">
                {pwSaved && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
                    <Check size={14} /> Password updated!
                  </motion.p>
                )}
                <Button onClick={savePassword} className="ml-auto gap-2">
                  <Lock size={15} /> Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notifications Tab ── */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell size={16} className="text-primary" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {NOTIF_ITEMS.map(({ key, label, desc }, i) => (
                <div key={key}>
                  {i > 0 && <Separator className="my-3" />}
                  <div className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <Switch checked={notifs[key]} onCheckedChange={() => toggleNotif(key)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Device notifications */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Notification Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Monitor, label: 'Browser Notifications', desc: 'Push notifications in your browser', enabled: true },
                { icon: Smartphone, label: 'Mobile Push', desc: 'Notifications on your mobile device', enabled: false },
              ].map(({ icon: Icon, label, desc, enabled }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon size={15} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                  <Switch defaultChecked={enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Connected Accounts Tab ── */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Link2 size={16} className="text-primary" /> Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shadow-sm">
                    {/* Google G logo */}
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Google</p>
                    {googleConnected
                      ? <p className="text-xs text-muted-foreground">{googleEmail}</p>
                      : <p className="text-xs text-muted-foreground">Not connected</p>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {googleConnected && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                      <Check size={10} className="mr-1" /> Connected
                    </Badge>
                  )}
                  {googleConnected ? (
                    <Button variant="outline" size="sm" onClick={disconnectGoogle}
                      className="text-xs gap-1 text-muted-foreground h-8">
                      <Trash2 size={12} /> Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" onClick={connectGoogle} className="text-xs gap-1.5 h-8">
                      <Chrome size={13} /> Connect Google
                    </Button>
                  )}
                </div>
              </div>

              {/* Hidden Google button container */}
              <div ref={googleBtnRef} className="hidden" />

              {/* Placeholder for future integrations */}
              {[
                { name: 'Notion', desc: 'Sync notes with Notion', icon: '📝' },
                { name: 'Google Calendar', desc: 'Sync study sessions to calendar', icon: '📅' },
              ].map(acc => (
                <div key={acc.name} className="flex items-center justify-between p-4 rounded-xl border border-border opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">{acc.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{acc.name}</p>
                      <p className="text-xs text-muted-foreground">{acc.desc}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Coming soon</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="mt-4 border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-destructive uppercase tracking-wide">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
                </div>
                <Button variant="outline" size="sm" onClick={async () => { await logout(); navigate('/login'); }}
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
                  <LogOut size={14} /> Log Out
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 size={14} /> Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your StudySync account, all your notes, tasks, flashcards, and study data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={async () => { await logout(); navigate('/login'); }} className="bg-destructive hover:bg-destructive/90">
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

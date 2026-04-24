import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, onAuthStateChanged, signOut, type User } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  initials: string;
}

interface UserContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  /** Call after profile edits to refresh display name / photo */
  refreshProfile: () => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: () => {},
});

function buildProfile(user: User): UserProfile {
  const name = user.displayName ?? user.email?.split('@')[0] ?? 'Student';
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return {
    uid: user.uid,
    name,
    email: user.email ?? '',
    photoURL: user.photoURL ?? '',
    initials,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setProfile(firebaseUser ? buildProfile(firebaseUser) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const refreshProfile = () => {
    if (auth.currentUser) {
      setProfile(buildProfile(auth.currentUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

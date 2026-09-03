import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { supabase, AdminProfile } from './supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  profile: AdminProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileLoadedRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (uid: string) => {
    if (profileLoadedRef.current === uid) return;
    profileLoadedRef.current = uid;
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as AdminProfile);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session first — this is the critical step that prevents
    // the race condition where onAuthStateChange fires before getSession resolves
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession?.user) {
        loadProfile(initialSession.user.id).then(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Only listen for *changes* after the initial session is loaded.
    // We ignore the initial 'INITIAL_SESSION' event because we already handled it above.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      if (event === 'INITIAL_SESSION') return; // already handled by getSession

      setSession(newSession);

      if (event === 'SIGNED_OUT') {
        profileLoadedRef.current = null;
        setProfile(null);
        setLoading(false);
        return;
      }

      if (newSession?.user) {
        if (profileLoadedRef.current !== newSession.user.id) {
          profileLoadedRef.current = null;
          (async () => {
            await loadProfile(newSession.user.id);
            if (mounted) setLoading(false);
          })();
        } else {
          setLoading(false);
        }
      } else {
        profileLoadedRef.current = null;
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    profileLoadedRef.current = null;
    setProfile(null);
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (session?.user) {
      profileLoadedRef.current = null;
      await loadProfile(session.user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

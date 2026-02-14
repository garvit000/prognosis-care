import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, firebaseConfigError, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      const localSession = localStorage.getItem('pc_auth_user');
      if (localSession) {
        try {
          setCurrentUser(JSON.parse(localSession));
        } catch {
          localStorage.removeItem('pc_auth_user');
        }
      }
      setAuthLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      const mockUser = { uid: `mock-${Date.now()}`, email };
      localStorage.setItem('pc_auth_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return { user: mockUser };
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    if (!isFirebaseConfigured || !auth) {
      const mockUser = { uid: `mock-${Date.now()}`, email };
      localStorage.setItem('pc_auth_user', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return { user: mockUser };
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem('pc_auth_user');
      setCurrentUser(null);
      return;
    }
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      currentUser,
      authLoading,
      isFirebaseConfigured,
      firebaseConfigError,
      signup,
      login,
      logout,
    }),
    [currentUser, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

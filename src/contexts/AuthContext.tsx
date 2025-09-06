import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import type { AppUser, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userData: AppUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    const timer = setTimeout(() => {
      if (currentUser) {
        console.log('Session expired due to inactivity');
        logout();
      }
    }, 3600000);

    setInactivityTimer(timer);
  };

  useEffect(() => {
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const tokenResult = await getIdTokenResult(user);
          const tokenExpiration = new Date(tokenResult.expirationTime);
          
          if (tokenExpiration < new Date()) {
            await logout();
            return;
          }

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUser;
            setUserData(userData);
          } else {
            const fallbackUser: AppUser = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Pengguna',
              email: user.email || '',
              role: 'SISWA',
              isActive: true
            };
            setUserData(fallbackUser);
          }

          resetInactivityTimer();

        } catch (error) {
          console.error('Error fetching user data:', error);
          await logout();
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const determineUserRole = (email: string | null): UserRole => {
    if (!email) return 'SISWA';
    
    if (email.includes('admin')) return 'ADMIN';
    if (email.includes('petugas')) return 'PETUGAS';
    return 'SISWA';
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Format email tidak valid.';
      case 'auth/user-disabled':
        return 'Akun pengguna telah dinonaktifkan.';
      case 'auth/user-not-found':
        return 'Tidak ada pengguna dengan email tersebut.';
      case 'auth/wrong-password':
        return 'Password salah.';
      case 'auth/too-many-requests':
        return 'Terlalu banyak percobaan login gagal. Silakan coba lagi nanti.';
      default:
        return 'Gagal login. Silakan coba lagi.';
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
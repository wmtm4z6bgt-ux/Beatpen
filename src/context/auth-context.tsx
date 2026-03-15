'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { onIdTokenChanged } from 'firebase/auth';

export interface Achievement {
  id: string;
  text: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  role: 'student' | 'company';
  bio?: string;
  major?: string;
  achievements?: Achievement[];
  resumeUrl?: string;
  // Company specific fields
  companyName?: string;
  bin?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onIdTokenChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserProfile);
        } else {
          setUserData(null);
        }
        setLoading(false);
      }, () => {
        setLoading(false);
      });
      return () => unsubscribeSnapshot();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <div className="w-full h-screen flex items-center justify-center"><Skeleton className="h-20 w-20 rounded-full" /></div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

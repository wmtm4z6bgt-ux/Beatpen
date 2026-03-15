'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from '@/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    if (!user.emailVerified) {
      router.push('/auth/verify-email');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user || !user.emailVerified) {
    return (
      <div className="container py-8 max-w-5xl">
        <div className="space-y-8">
            <div className="w-full h-48 md:h-64 relative">
                <Skeleton className="w-full h-full" />
                <Skeleton className="absolute -bottom-12 left-8 h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background" />
            </div>
            <div className="pt-16 px-8 space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
            </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

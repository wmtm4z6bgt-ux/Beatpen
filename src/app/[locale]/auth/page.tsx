'use client';

import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function AuthPageContent() {
    const t = useTranslations('Auth');
    const searchParams = useSearchParams();
    
    // Default to login on the server, then update on the client in useEffect.
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        // This runs only on the client, after hydration, preventing a mismatch.
        if (searchParams.get('tab') === 'register') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [searchParams]);

    return (
        <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-muted rounded-lg">
                <Button
                    onClick={() => setIsLogin(true)}
                    className={cn(
                        'text-muted-foreground transition-all',
                        isLogin && 'bg-background text-foreground shadow-sm'
                    )}
                    variant="ghost"
                >
                    {t('login')}
                </Button>
                <Button
                    onClick={() => setIsLogin(false)}
                    className={cn(
                        'text-muted-foreground transition-all',
                        !isLogin && 'bg-background text-foreground shadow-sm'
                    )}
                    variant="ghost"
                >
                    {t('register')}
                </Button>
            </div>
            <div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
}

function AuthSkeleton() {
    return (
        <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-64" />
        </div>
    );
}

export default function AuthPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<AuthSkeleton />}>
                <AuthPageContent />
            </Suspense>
        </AuthLayout>
    );
}

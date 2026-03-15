'use client';

import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

function AuthTabs() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'login';

    const onTabChange = (value: string) => {
        router.replace(`${pathname}?tab=${value}`);
    };

    return (
        <div className="w-full max-w-md">
            <Tabs value={tab} onValueChange={onTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">{t('login')}</TabsTrigger>
                    <TabsTrigger value="register">{t('register')}</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                    <RegisterForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AuthSkeleton() {
    return (
        <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg mb-4">
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
            </div>
            <Card>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        </div>
    );
}


export default function AuthPage() {
    return (
        <AuthLayout>
            <Suspense fallback={<AuthSkeleton />}>
                <AuthTabs />
            </Suspense>
        </AuthLayout>
    );
}

'use client';

import { Suspense } from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';

function AuthTabs() {
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Активная вкладка всегда определяется из URL
  const activeTab = searchParams.get('tab') === 'login' ? 'login' : 'register';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-md">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
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

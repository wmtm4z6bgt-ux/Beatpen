'use client';

import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthContent() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'login';
    const t = useTranslations('Auth');

    return (
        <AuthLayout>
            <Tabs defaultValue={defaultTab} className="w-full max-w-md">
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
        </AuthLayout>
    )
}


export default function AuthPage() {
    return (
        <Suspense fallback={<AuthLayout><div>Loading...</div></AuthLayout>}>
            <AuthContent />
        </Suspense>
    )
}

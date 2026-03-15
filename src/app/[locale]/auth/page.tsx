'use client';

import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { Suspense } from 'react';

function AuthContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('Auth');

    // On the server, searchParams is empty, so this will default to 'login'.
    // On the client, it will correctly read the URL parameter.
    // This avoids hydration errors when the component is wrapped in Suspense.
    const activeTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

    const handleTabChange = (value: string) => {
        // Update the URL without adding to browser history, which is better for UX.
        router.replace(`${pathname}?tab=${value}`);
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
        </AuthLayout>
    );
}

export default function AuthPage() {
    return (
        // The Suspense boundary is crucial for components that use `useSearchParams`.
        <Suspense fallback={<AuthLayout><div>Loading...</div></AuthLayout>}>
            <AuthContent />
        </Suspense>
    );
}

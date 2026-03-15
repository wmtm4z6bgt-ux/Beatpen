'use client';

import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { useState, useEffect } from 'react';

// Using a single component avoids issues with Suspense and simplifies state management.
export default function AuthPage() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('Auth');

    // Default to 'login', which is consistent on server and client initial render.
    const [activeTab, setActiveTab] = useState('login');

    // This effect runs *only* on the client, after the initial render.
    // This avoids any server-client mismatch (hydration error).
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'register') {
            setActiveTab('register');
        }
    }, []); // Empty array ensures this runs only once on mount.

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Update the URL without adding to browser history for a cleaner UX.
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

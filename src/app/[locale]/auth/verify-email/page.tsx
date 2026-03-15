'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter, Link } from '@/navigation';
import AuthLayout from '@/components/auth/auth-layout';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const t = useTranslations('Auth');

    useEffect(() => {
        if (!loading && user?.emailVerified) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const interval = setInterval(() => {
            user?.reload();
        }, 3000);
        return () => clearInterval(interval);
    }, [user]);

    const handleResendVerification = async () => {
        if (user) {
            try {
                await sendEmailVerification(user);
                toast({
                    title: 'Письмо отправлено',
                    description: 'Проверьте свою почту для подтверждения аккаунта.',
                });
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось отправить письмо. Попробуйте снова.',
                });
            }
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/auth');
    };

    if (loading) {
        return <AuthLayout><div>Loading...</div></AuthLayout>;
    }

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('verifyEmailTitle')}</CardTitle>
                    <CardDescription>
                        {t('verifyEmailPrompt', {email: user?.email})}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {t('verifyEmailSpam')}
                    </p>
                    <Button onClick={handleResendVerification} className="w-full" disabled={loading}>
                        {t('resendButton')}
                    </Button>
                    <div className="flex items-center justify-between">
                        <Button variant="link" asChild className="p-0">
                           <Link href="/auth">
                             {t('backToLogin')}
                           </Link>
                        </Button>
                        <Button variant="link" onClick={handleSignOut} className="p-0">
                            {t('signOut')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}

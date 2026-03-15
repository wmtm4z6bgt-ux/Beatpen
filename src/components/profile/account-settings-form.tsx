'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useTranslations } from 'next-intl';

export default function AccountSettingsForm() {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const t = useTranslations('Settings');

  const handlePasswordReset = async () => {
    if (user?.email) {
        try {
            await sendPasswordResetEmail(auth, user.email);
            toast({
                title: 'Письмо для сброса пароля отправлено',
                description: 'Проверьте свою почту.',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Не удалось отправить письмо для сброса пароля.',
            });
        }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('accountSettingsTitle')}</CardTitle>
        <CardDescription>{t('accountSettingsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input id="email" type="email" value={userData?.email || ''} disabled />
            <p className="text-sm text-muted-foreground">{t('emailDescription')}</p>
        </div>
        <div className="space-y-2">
            <Label>{t('changePasswordLabel')}</Label>
            <Button variant="outline" onClick={handlePasswordReset}>{t('sendPasswordReset')}</Button>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between items-center">
        <div>
            <h3 className="font-semibold text-destructive">{t('deleteAccountTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('deleteAccountDescription')}</p>
        </div>
        <Button variant="destructive">{t('deleteAccountButton')}</Button>
      </CardFooter>
    </Card>
  );
}

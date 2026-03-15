'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getFirebaseError } from '@/lib/firebase-errors-ru';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  email: z.string().email({ message: 'Некорректный email.' }),
  password: z.string().min(6, { message: 'Пароль должен содержать не менее 6 символов.' }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations('Auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка входа',
        description: getFirebaseError(error.code),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('welcomeBack')}</CardTitle>
        <CardDescription>{t('loginPrompt')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('loggingIn') : t('loginButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

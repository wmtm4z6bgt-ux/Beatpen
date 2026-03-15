'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getFirebaseError } from '@/lib/firebase-errors-ru';
import { useTranslations } from 'next-intl';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { UserProfile } from '@/context/auth-context';

const formSchema = z.object({
  role: z.enum(['student', 'company']),
  username: z.string().optional(),
  companyName: z.string().optional(),
  bin: z.string().optional(),
  email: z.string().email({ message: 'Некорректный email.' }),
  password: z.string().min(6, { message: 'Пароль должен содержать не менее 6 символов.' }),
}).superRefine((data, ctx) => {
    if (data.role === 'student') {
        if (!data.username || data.username.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['username'],
                message: 'Имя пользователя должно содержать не менее 3 символов.',
            });
        }
    }
    if (data.role === 'company') {
        if (!data.companyName || data.companyName.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['companyName'],
                message: 'Название компании должно содержать не менее 2 символов.',
            });
        }
        if (!data.bin || !/^\d{12}$/.test(data.bin)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['bin'],
                message: 'БИН должен состоять из 12 цифр.',
            });
        }
    }
});


export default function RegisterForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('Auth');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'student',
      username: '',
      companyName: '',
      bin: '',
      email: '',
      password: '',
    },
  });

  const role = form.watch('role');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      let userDoc: Omit<UserProfile, 'uid' | 'email'>;

      if (values.role === 'student') {
        userDoc = {
            role: 'student',
            username: values.username!,
            bio: '',
        }
      } else { // company
        userDoc = {
            role: 'company',
            username: values.companyName!,
            companyName: values.companyName!,
            bin: values.bin!,
            verificationStatus: 'pending',
        }
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: values.email,
        ...userDoc
      });
      
      await sendEmailVerification(user);

      toast({
        title: 'Аккаунт создан',
        description: "Проверьте свою почту для подтверждения аккаунта.",
      });
      router.push('/auth/verify-email');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: getFirebaseError(error.code),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('createAccount')}</CardTitle>
        <CardDescription>{t('startJourney')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('iAmA')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('student')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="company" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('company')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === 'student' ? (
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('usernameLabel')}</FormLabel>
                    <FormControl>
                        <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ) : (
                <>
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('companyNameLabel')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Company LLC" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('binLabel')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="123456789012" {...field} />
                                </FormControl>
                                <FormDescription>{t('binHint')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{role === 'student' ? t('emailLabel') : t('workEmailLabel')}</FormLabel>
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
              {loading ? t('creatingAccount') : t('registerButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

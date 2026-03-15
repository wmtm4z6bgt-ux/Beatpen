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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth, UserProfile } from '@/context/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateProfileBioSuggestions } from '@/ai/flows/generate-profile-bio-suggestions';
import { Wand2, Loader2, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20),
  bio: z.string().max(160, { message: 'Bio cannot be more than 160 characters.' }).optional(),
});

export default function EditProfileForm() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const t = useTranslations('Settings');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
        username: userData?.username || '',
        bio: userData?.bio || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, {
        username: values.username,
        bio: values.bio,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    setSuggestions([]);
    try {
      const bioValue = form.getValues('bio');
      const result = await generateProfileBioSuggestions({ currentBio: bioValue, tone: "professional" });
      setSuggestions(result.suggestions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate suggestions',
        description: 'Please try again later.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    form.setValue('bio', suggestion);
    setSuggestions([]);
  }

  if (!userData) {
    return <Card>
        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-24" />
        </CardContent>
    </Card>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('editProfileTitle')}</CardTitle>
        <CardDescription>{t('editProfileDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('bioLabel')}</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={handleGenerateSuggestions} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      {t('suggestWithAI')}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea placeholder={t('bioPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {(isGenerating || suggestions.length > 0) && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t('aiSuggestions')}</p>
                {isGenerating && <Skeleton className="w-full h-20" />}
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 text-sm cursor-pointer hover:bg-secondary transition-colors" onClick={() => applySuggestion(suggestion)}>
                        <p className="flex-1">{suggestion}</p>
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(suggestion); toast({title: "Copied!"})}}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
              </div>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveChanges')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

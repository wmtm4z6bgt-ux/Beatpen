'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';
import { useTranslations } from 'next-intl';
import { PlusCircle, Trash2, Wand2, Loader2, Copy } from 'lucide-react';
import { generateAchievementSuggestions } from '@/ai/flows/generate-achievement-suggestions';


const majors = [
    "Computer Science", "Software Engineering", "Data Science", "Marketing", "Business Administration", "Graphic Design", "Finance", "Mechanical Engineering"
];

const achievementSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(10, "Achievement must be at least 10 characters.").max(300, "Cannot be more than 300 characters."),
});

const formSchema = z.object({
  major: z.string().optional(),
  achievements: z.array(achievementSchema).optional(),
  resume: z.any().optional(),
});

export default function ProfessionalProfileForm() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const t = useTranslations('Settings');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
        major: userData?.major || '',
        achievements: userData?.achievements || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userData) return;
    setLoading(true);

    // Note: File upload logic is complex and typically requires a backend/storage service.
    // This example focuses on updating text-based fields in Firestore.
    // The resume field will be ignored for now.
    
    try {
      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, {
        major: values.major,
        achievements: values.achievements,
      });
      toast({
        title: 'Profile Updated',
        description: 'Your professional information has been saved.',
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

  const handleGenerateSuggestions = async (index: number) => {
    setGeneratingIndex(index);
    setSuggestions([]);
    try {
      const achievementValue = form.getValues(`achievements.${index}.text`);
      const result = await generateAchievementSuggestions({
        currentAchievement: achievementValue,
        major: userData?.major,
        bio: userData?.bio,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate suggestions',
        description: 'Please try again later.',
      });
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (generatingIndex !== null) {
      form.setValue(`achievements.${generatingIndex}.text`, suggestion, { shouldValidate: true });
    }
    setSuggestions([]);
    setGeneratingIndex(null);
  };

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
        <CardTitle>{t('professionalTitle')}</CardTitle>
        <CardDescription>{t('professionalDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('majorLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('majorPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {majors.map(major => (
                        <SelectItem key={major} value={major}>{major}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>{t('achievementsLabel')}</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-2">
                    <FormField
                        control={form.control}
                        name={`achievements.${index}.text`}
                        render={({ field: innerField }) => (
                            <FormItem>
                                <div className="flex items-start gap-2">
                                    <FormControl>
                                        <Textarea placeholder="Describe an achievement or experience..." {...innerField} />
                                    </FormControl>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateSuggestions(index)}
                            disabled={generatingIndex === index}
                        >
                            {generatingIndex === index && suggestions.length === 0 ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                            {t('suggestWithAI')}
                        </Button>
                    </div>
                     {generatingIndex === index && (
                        <div className="space-y-2">
                            {suggestions.length === 0 ? <Skeleton className="w-full h-20" /> : <p className="text-sm font-medium text-muted-foreground">{t('aiSuggestions')}</p>}
                            {suggestions.map((suggestion, sIndex) => (
                                <div key={sIndex} className="flex items-center gap-2 p-3 rounded-md border bg-secondary/50 text-sm cursor-pointer hover:bg-secondary transition-colors" onClick={() => applySuggestion(suggestion)}>
                                    <p className="flex-1">{suggestion}</p>
                                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(suggestion); toast({title: "Copied!"})}}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ id: `new_${Date.now()}`, text: "" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('addAchievement')}
                </Button>
              </div>
            </div>
            
             <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('resumeLabel')}</FormLabel>
                        <FormControl>
                            <Input type="file" accept=".pdf,.doc,.docx" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">{t('resumeDescription')}</p>
                        <FormMessage />
                    </FormItem>
                )}
                />

            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveChanges')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

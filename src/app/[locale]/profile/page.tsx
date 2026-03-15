'use client';
import PrivateRoute from '@/components/private-route';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { Settings, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import ApplicationCard from '@/components/profile/beat-card';
import AchievementCard from '@/components/profile/achievement-card';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobs, Job } from '@/lib/jobs-data';

type Application = {
  id: string;
  title: string;
  company: string;
  status: string;
  imageUrl: string;
  imageHint: string;
};

export default function ProfilePage() {
    const { user, userData } = useAuth();
    const bannerImage = PlaceHolderImages.find(img => img.id === 'profile-banner');
    const t = useTranslations('Profile');
    const [applications, setApplications] = useState<Application[]>([]);
    
    const getInitials = (name?: string | null) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const apps: Application[] = await Promise.all(snapshot.docs.map(async (appDoc) => {
                const appData = appDoc.data();
                const job = jobs.find(j => j.id === appData.jobId);
                
                if (!job) return null;

                return {
                    id: appDoc.id,
                    title: job.title,
                    company: job.company,
                    status: appData.status,
                    imageUrl: job.imageUrl,
                    imageHint: job.imageHint,
                };
            }));
            
            setApplications(apps.filter(app => app !== null) as Application[]);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <PrivateRoute>
            <main className="container max-w-7xl mx-auto py-8">
                <div className="w-full">
                    <div className="relative h-48 md:h-64 rounded-t-lg overflow-hidden">
                        {bannerImage && (
                            <Image
                                src={bannerImage.imageUrl}
                                alt={bannerImage.description}
                                fill
                                style={{ objectFit: 'cover' }}
                                data-ai-hint={bannerImage.imageHint}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                    <div className="relative px-8 flex items-end -mt-12 md:-mt-16">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background bg-secondary">
                             <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userData?.username}`} alt={userData?.username ?? ''} />
                            <AvatarFallback className="text-4xl">{getInitials(userData?.username)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-auto">
                            <Button asChild variant="outline">
                                <Link href="/profile/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    {t('editProfile')}
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="px-8 py-6 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold">{userData?.username}</h1>
                            <p className="text-muted-foreground">{userData?.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">{t('major')}</h3>
                            <p className="text-lg">{userData?.major || <span className="text-muted-foreground italic">{t('noMajor')}</span>}</p>
                        </div>
                        <p className="text-lg">
                            {userData?.bio || <span className="text-muted-foreground italic">{t('noBio')}</span>}
                        </p>
                    </div>

                     <div className="border-t px-8 py-6">
                        <h2 className="text-2xl font-semibold mb-4">{t('achievements')}</h2>
                        {userData?.achievements && userData.achievements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userData.achievements.map(ach => (
                                    <AchievementCard key={ach.id} achievement={ach} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">{t('noAchievements')}</p>
                        )}
                    </div>

                    <div className="border-t px-8 py-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{t('myApplications')}</h2>
                            <Button asChild>
                                <Link href="/jobs">
                                    <Search className="mr-2 h-4 w-4" /> {t('browseJobs')}
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {applications.map(app => (
                               <ApplicationCard key={app.id} application={app} />
                           ))}
                        </div>
                    </div>

                </div>
            </main>
        </PrivateRoute>
    );
}

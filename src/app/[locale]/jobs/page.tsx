'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { jobs, Job } from '@/lib/jobs-data';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import PrivateRoute from '@/components/private-route';
import { useTranslations } from 'next-intl';

export default function JobsPage() {
    const [jobStack, setJobStack] = useState<Job[]>(jobs);
    const { user } = useAuth();
    const { toast } = useToast();
    const t = useTranslations('Jobs');

    const handleApply = async (jobId: string) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'applications'), {
                userId: user.uid,
                jobId: jobId,
                status: 'Submitted',
                appliedAt: serverTimestamp(),
            });
            toast({ title: t('appliedSuccess') });
            removeJobFromStack(jobId);
        } catch (error) {
            console.error("Error applying for job: ", error);
            toast({ variant: 'destructive', title: "Failed to apply" });
        }
    };

    const removeJobFromStack = (jobId: string) => {
        setJobStack((prev) => prev.filter((job) => job.id !== jobId));
    };

    const currentJob = jobStack[jobStack.length - 1];

    return (
        <PrivateRoute>
            <main className="container max-w-2xl mx-auto py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
                <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
                <div className="relative w-full h-[500px] flex items-center justify-center">
                    <AnimatePresence>
                        {jobStack.length > 0 ? (
                           jobStack.map((job, index) => (
                             index === jobStack.length - 1 && (
                                <motion.div
                                    key={job.id}
                                    drag="x"
                                    dragConstraints={{ left: -200, right: 200 }}
                                    onDragEnd={(event, info) => {
                                        if (info.offset.x > 100) {
                                            handleApply(job.id);
                                        } else if (info.offset.x < -100) {
                                            removeJobFromStack(job.id);
                                        }
                                    }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ x: jobStack[jobStack.length - 1].id === job.id ? (Math.random() > 0.5 ? 200 : -200) : 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute w-full max-w-sm h-full cursor-grab active:cursor-grabbing"
                                >
                                    <Card className="w-full h-full overflow-hidden shadow-2xl shadow-primary/10">
                                        <div className="relative h-2/3">
                                            <Image src={job.imageUrl} alt={job.company} layout="fill" objectFit="cover" data-ai-hint={job.imageHint}/>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                            <div className="absolute bottom-0 p-6 text-white">
                                                <h2 className="text-2xl font-bold">{job.title}</h2>
                                                <p className="text-lg">{job.company}</p>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground text-sm">{job.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                             )
                           ))
                        ) : (
                            <p>{t('noMoreJobs')}</p>
                        )}
                    </AnimatePresence>
                </div>
                 {currentJob && (
                    <div className="flex gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-16 w-16 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => removeJobFromStack(currentJob.id)}
                        >
                            <X className="h-8 w-8" />
                        </Button>
                        <Button
                            size="icon"
                            className="h-16 w-16 rounded-full bg-green-500/80 text-white hover:bg-green-500"
                            onClick={() => handleApply(currentJob.id)}
                        >
                            <Check className="h-8 w-8" />
                        </Button>
                    </div>
                 )}
            </main>
        </PrivateRoute>
    );
}

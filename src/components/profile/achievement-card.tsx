'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Achievement } from '@/context/auth-context';

type AchievementCardProps = {
    achievement: Achievement;
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-sm">{achievement.text}</p>
            </CardContent>
        </Card>
    );
}

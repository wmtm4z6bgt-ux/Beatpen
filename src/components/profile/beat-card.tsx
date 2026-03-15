'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, FileText, Trash2 } from 'lucide-react';

type Application = {
    id: string;
    title: string;
    company: string;
    status: string;
    imageUrl: string;
    imageHint: string;
};

type ApplicationCardProps = {
    application: Application;
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
    const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status.toLowerCase()) {
            case 'offer':
                return 'default';
            case 'interviewing':
                return 'default';
            case 'submitted':
                return 'secondary';
             case 'in review':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <Card className="overflow-hidden group">
            <CardContent className="p-0">
                <div className="relative aspect-square">
                    <Image src={application.imageUrl} alt={application.title} fill className="object-cover" data-ai-hint={application.imageHint} />
                     <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="p-4 space-y-3 relative -mt-16 z-10">
                     <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-lg text-white">{application.title}</h3>
                            <p className="text-sm text-white/80">{application.company}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Job</DropdownMenuItem>
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />View Application</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Withdraw</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="pt-8">
                      <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

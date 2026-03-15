import { PlaceHolderImages } from './placeholder-images';

export type Job = {
    id: string;
    title: string;
    company: string;
    description: string;
    imageUrl: string;
    imageHint: string;
};

export const jobs: Job[] = [
    {
        id: 'job-1',
        title: 'Frontend Developer Intern',
        company: 'Innovate Inc.',
        description: 'Passionate about creating beautiful and functional user interfaces. Experience with React and Next.js is a plus.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-1')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-1')?.imageHint ?? '',
    },
    {
        id: 'job-2',
        title: 'Product Designer',
        company: 'Creative Solutions',
        description: 'Looking for a product designer to work on our mobile app. You will be responsible for the entire design process.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-2')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-2')?.imageHint ?? '',
    },
    {
        id: 'job-3',
        title: 'Backend Engineer',
        company: 'Growth Co.',
        description: 'We are looking for a backend engineer to join our team. You will be working with Node.js, and PostgreSQL.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-3')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-3')?.imageHint ?? '',
    },
    {
        id: 'job-4',
        title: 'Data Scientist Intern',
        company: 'Future Forward',
        description: 'Join our data science team and work on exciting projects. Experience with Python and scikit-learn is required.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-4')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-4')?.imageHint ?? '',
    },
    {
        id: 'job-5',
        title: 'Data Analyst',
        company: 'Data Insights',
        description: 'Analyze large datasets to provide actionable insights for our clients. Strong SQL and Excel skills are a must.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-5')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-5')?.imageHint ?? '',
    },
    {
        id: 'job-6',
        title: 'Graphic Designer',
        company: 'Artful Agency',
        description: 'Create compelling visual assets for our marketing campaigns. Proficiency in Adobe Creative Suite is essential.',
        imageUrl: PlaceHolderImages.find(img => img.id === 'company-6')?.imageUrl ?? '',
        imageHint: PlaceHolderImages.find(img => img.id === 'company-6')?.imageHint ?? '',
    },
];

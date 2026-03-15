import PrivateRoute from '@/components/private-route';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProfileForm from '@/components/profile/edit-profile-form';
import AccountSettingsForm from '@/components/profile/account-settings-form';
import { useTranslations } from 'next-intl';
import ProfessionalProfileForm from '@/components/profile/professional-profile-form';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  return (
    <PrivateRoute>
      <main className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
        <Tabs defaultValue="edit-profile" orientation="vertical" className="flex flex-col md:flex-row gap-8">
          <TabsList className="flex-col h-auto items-stretch bg-transparent p-0 w-full md:w-48 shrink-0">
            <TabsTrigger value="edit-profile" className="justify-start data-[state=active]:border-primary border-l-2 border-transparent">{t('editProfile')}</TabsTrigger>
            <TabsTrigger value="professional" className="justify-start data-[state=active]:border-primary border-l-2 border-transparent">{t('professional')}</TabsTrigger>
            <TabsTrigger value="account" className="justify-start data-[state=active]:border-primary border-l-2 border-transparent">{t('account')}</TabsTrigger>
          </TabsList>
          <div className="flex-1">
            <TabsContent value="edit-profile" className="mt-0">
              <EditProfileForm />
            </TabsContent>
            <TabsContent value="professional" className="mt-0">
              <ProfessionalProfileForm />
            </TabsContent>
            <TabsContent value="account" className="mt-0">
                <AccountSettingsForm />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </PrivateRoute>
  );
}

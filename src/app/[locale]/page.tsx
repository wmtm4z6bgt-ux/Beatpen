'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {Link} from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing');

  return (
    <main className="bg-black text-white w-full overflow-x-hidden">
      {/* Add a wrapper for padding top to account for absolute header */}
      <div className="pt-20">

        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('heroTitle')}
              </h1>
              <p className="max-w-[600px] text-gray-400 md:text-xl">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
              <Link
  href="/auth?tab=register"
  className="inline-block bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg px-8 py-3 font-semibold text-center"
>
  {t('getStarted')}
</Link>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-full max-w-sm bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-[0_0_3rem_rgba(167,139,250,0.15)]">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center shadow-lg">
                  <p className="text-white/90 text-sm mx-auto tracking-wider">{t('searchInput')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative flex items-center justify-center">
                <div className="w-full max-w-md bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <div className="bg-violet-500/10 rounded-lg px-4 py-2 text-center">
                        <span className="font-semibold text-violet-300">{t('skillsCardLabel')}</span>
                    </div>
                    <div className="mt-6 h-48 flex items-end justify-center gap-2">
                        <div className="w-8 h-[40%] bg-violet-900 rounded-t-md"></div>
                        <div className="w-8 h-[60%] bg-violet-800 rounded-t-md"></div>
                        <div className="w-8 h-[80%] bg-violet-700 rounded-t-md"></div>
                        <div className="w-8 h-[50%] bg-violet-600 rounded-t-md"></div>
                        <div className="w-8 h-[70%] bg-violet-500 rounded-t-md"></div>
                    </div>
                </div>
             </div>
            <div className="flex flex-col items-start space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">{t('skillsTitle')}</h2>
              <p className="max-w-[600px] text-gray-400 md:text-lg">
                {t('skillsText')}
              </p>
            </div>
          </div>
        </section>

        {/* CTA & Footer Section */}
        <footer className="container mx-auto px-6 md:px-8 py-24 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold">{t('ctaTitle')}</h2>
                    <p className="mt-4 max-w-lg text-gray-400 md:text-lg">{t('ctaText')}</p>
                </div>
                <div className="text-lg text-right font-medium text-gray-500 space-y-2">
                    <p>{t('ctaFeature1')}</p>
                    <p>{t('ctaFeature2')}</p>
                    <p>{t('ctaFeature3')}</p>
                </div>
            </div>
            <div className="border-t border-zinc-800 mt-24 pt-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold">{t('footerTeam')}</h4>
                        <p className="text-gray-400 text-sm">{t('footerEmail')}</p>
                    </div>
                    <div className="flex flex-col md:items-end gap-4">
                        <p className="font-semibold">{t('footerContact')}</p>
                        <div className="flex w-full max-w-sm gap-2">
                            <Input type="email" placeholder={t('footerEmailPlaceholder')} className="bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-violet-500" />
                            <Button className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg px-6 font-semibold">{t('footerSend')}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

      </div>
    </main>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {Link} from '@/navigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Landing');

  const handleAssessmentClick = () => {
    const chatButton = document.getElementById('ai-chat-toggle-button');
    if (chatButton) {
      chatButton.click();
    }
  };

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

<Link
  href="#"
  className="inline-block border border-white/50 text-white hover:bg-white/10 hover:text-white rounded-lg px-8 py-3 font-semibold text-center"
>
  {t('learnMore')}
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

        {/* Features Section */}
        <section className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
            <p className="font-semibold text-violet-400 tracking-widest">{t('featureTag')}</p>
            <h2 className="text-3xl md:text-5xl font-bold">{t('featureTitle')}</h2>
            <p className="max-w-2xl text-gray-400 md:text-lg">
              {t('featureText')}
            </p>
            <Button onClick={handleAssessmentClick} className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg px-8 font-semibold">
              {t('tryAIAssessment')}
            </Button>
            <div className="relative w-full max-w-md h-64 mt-12">
              <div className="absolute top-8 left-0 w-[80%] bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800 transform -rotate-6">
                <h3 className="font-semibold">{t('demoCardTitle')}</h3>
                <p className="text-gray-400 text-sm mt-1">{t('demoCardText')}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-[85%] bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-2xl shadow-violet-500/10 transform rotate-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{t('evalCardTitle')}</h3>
                  <span className="text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full px-2 py-0.5">ai</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('evalCardProgress')}</span>
                    <span className="font-semibold text-violet-400">94%</span>
                  </div>
                  <Progress value={94} className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-purple-500" />
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-400">{t('evalCardStatus')}</span>
                  <span className="font-semibold text-violet-400">{t('evalCardStatusReady')}</span>
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

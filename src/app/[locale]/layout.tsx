import type { Metadata } from 'next';
import '../globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import {NextIntlClientProvider, useMessages} from 'next-intl';
import AIChat from '@/components/ai-chat';

export const metadata: Metadata = {
  title: 'BEATPEN - Feel the beat. Lead the line.',
  description: 'Find a job without stressing. Download your portfolio, and start working now.',
};

export default function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = useMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-black">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
            <AIChat />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

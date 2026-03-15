'use client';

import { Link, useRouter } from '@/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './language-switcher';

export default function Header() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations('Header');

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <div className="mr-auto flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-white">BEATPEN</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {loading ? (
             <div className="h-10 w-28 animate-pulse rounded-lg bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${userData?.username}`} alt={userData?.username ?? ''} />
                    <AvatarFallback>{getInitials(userData?.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center space-x-2">
              <Button asChild className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg px-6 font-semibold">
                <Link href="/auth?tab=register">{t('getStarted')}</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'ru', 'kk'] as const;
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales});
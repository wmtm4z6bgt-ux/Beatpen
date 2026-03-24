import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'kk'],
  defaultLocale: 'ru',
});

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

export default function middleware(request: NextRequest) {
  // Пропускаем статические файлы Next.js
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/api') // если есть API
  ) {
    return;
  }
  return createMiddleware(routing)(request);
}
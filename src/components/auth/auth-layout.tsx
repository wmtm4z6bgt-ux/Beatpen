import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4 overflow-hidden">
      
      {/* СЛОЙ 1: Декоративный фон (теперь он не перехватывает клики) */}
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      {/* СЛОЙ 2: Основной контент (Форма) */}
      <main className="relative z-10 w-full max-w-[400px]">
        {children}
      </main>

      {/* СЛОЙ 3: ИИ-Гид (вынесен за пределы карточки) */}
      {/* Размести его здесь, чтобы он был доступен и во 'Входе', и в 'Регистрации' */}
      <div className="fixed bottom-6 right-6 z-[100]">
         {/* <BeatPenGuide /> */}
         {/* Если он у тебя вставляется в page.tsx, то удали его оттуда и вставь сюда */}
      </div>
      
    </div>
  );
}

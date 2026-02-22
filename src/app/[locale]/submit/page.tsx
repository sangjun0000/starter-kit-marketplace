import { Construction } from 'lucide-react';

interface SubmitPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { locale } = await params;

  const t = locale === 'ko'
    ? {
        title: 'Kit 제출',
        coming: '준비 중입니다',
        desc: '커뮤니티 Kit 제출 기능이 곧 출시됩니다.',
      }
    : {
        title: 'Submit a Kit',
        coming: 'Coming Soon',
        desc: 'Community kit submission will be available soon.',
      };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">{t.title}</h1>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Construction className="h-12 w-12 text-slate-400" aria-hidden="true" />
        <p className="font-semibold text-slate-700">{t.coming}</p>
        <p className="text-sm text-slate-400">{t.desc}</p>
      </div>
    </div>
  );
}

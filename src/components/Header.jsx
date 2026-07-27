import { Home } from 'lucide-react';

export default function Header({ onNavigate }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#FAFAF8]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => onNavigate?.('landing')}
          className="flex items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white">
            <Home size={20} strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-gray-900">주거금융 건강검진</span>
            <span className="block text-xs text-gray-400">by KB국민은행</span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <a href="#features" className="hover:text-gray-900">서비스 소개</a>
          <a href="#support" className="hover:text-gray-900">지원제도</a>
          <a href="#faq" className="hover:text-gray-900">FAQ</a>
        </nav>

        <button
          type="button"
          onClick={() => onNavigate?.('form')}
          className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-amber-500"
        >
          진단 시작하기
        </button>
      </div>
    </header>
  );
}

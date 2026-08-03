import logoMark from '../assets/logo-mark.svg';

export default function Header({ onNavigate }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#FAFAF8]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => onNavigate?.('landing')}
          className="flex items-center gap-3 text-left"
        >
          <img src={logoMark} alt="Kapable" className="h-7 w-auto" />
          <span className="block text-xs text-gray-400"></span>
        </button>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          <a href="#features" className="hover:text-gray-900"></a>
          <a href="#support" className="hover:text-gray-900"></a>
          <a href="#faq" className="hover:text-gray-900"></a>
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

import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#FAFAF8]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-white">
                <Home size={18} strokeWidth={2.5} />
              </span>
              <span className="text-[15px] font-bold text-gray-900">주거금융 건강검진</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              청년 사회초년생을 위한 AI 기반 주거·금융 의사결정 서비스입니다. 재정 상황과 미래
              목표를 함께 고려해 합리적인 선택을 도와드립니다.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>진단 받기</li>
              <li>지원제도</li>
              <li>자산 시뮬레이션</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900">문의</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>FAQ</li>
              <li>1:1 문의</li>
              <li>KB국민은행</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gray-100 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <span>© 2026 KB국민은행. All rights reserved.</span>
          <div className="flex gap-4">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

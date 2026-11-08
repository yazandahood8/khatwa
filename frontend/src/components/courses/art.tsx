/**
 * رسومات SVG مجسّمة خفيفة لصفحة الدروس — لا ملفات صور ولا تبعيات.
 * كل المعرّفات (gradient ids) مسبوقة بـ "kh-" لتفادي التعارض.
 */

export function CapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="kh-cap-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4B4F8F" />
          <stop offset="1" stopColor="#1E2150" />
        </linearGradient>
        <linearGradient id="kh-cap-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F3270" />
          <stop offset="1" stopColor="#14163C" />
        </linearGradient>
      </defs>
      <path d="M13 23v8c0 3.5 5.2 6.5 11 6.5s11-3 11-6.5v-8l-11 5.5z" fill="url(#kh-cap-b)" />
      <path d="M24 8 45 18 24 28 3 18z" fill="url(#kh-cap-a)" />
      <path d="M24 8 45 18 24 20 3 18z" fill="#fff" opacity=".18" />
      <path d="M40 19.5v11" stroke="#F5B73A" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="40" cy="32.5" r="2.4" fill="#F5B73A" />
    </svg>
  );
}

export function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="kh-book-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6D4BE0" />
        </linearGradient>
      </defs>
      <path d="M4 12c7-3 14-2 20 2v26c-6-4-13-5-20-2z" fill="url(#kh-book-a)" />
      <path d="M44 12c-7-3-14-2-20 2v26c6-4 13-5 20-2z" fill="#8B6CF0" />
      <path d="M24 14v26" stroke="#fff" strokeWidth="1.2" opacity=".6" />
      <path d="M8 17c4-1 8-.5 12 1.5M8 23c4-1 8-.5 12 1.5M28 18.5c4-2 8-2.5 12-1.5M28 24.5c4-2 8-2.5 12-1.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

/** مسطرة مثلثة — أيقونة الرياضيات. */
export function RulerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="kh-ruler-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7FB4FF" />
          <stop offset="1" stopColor="#2B6FE0" />
        </linearGradient>
        <linearGradient id="kh-ruler-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD766" />
          <stop offset="1" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <path d="M12 6 22 6 22 44 56 44 56 56 12 56z" fill="url(#kh-ruler-a)" />
      <path d="M27 18v18h18z" fill="#E8F1FE" opacity=".85" />
      <path d="M26 56 56 56 56 28z" fill="url(#kh-ruler-b)" />
      <path d="M34 50h16V38z" fill="#fff" opacity=".35" />
      <path d="M12 12h6M12 20h4M12 28h6M12 36h4M12 44h6" stroke="#fff" strokeWidth="1.4" opacity=".8" />
    </svg>
  );
}

export function CalcArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden>
      <defs>
        <linearGradient id="kh-calc-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#45A0FF" />
          <stop offset="1" stopColor="#1B5FD1" />
        </linearGradient>
        <linearGradient id="kh-calc-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFDC7A" />
          <stop offset="1" stopColor="#F5A623" />
        </linearGradient>
      </defs>
      <path d="M2 38c14-6 22-14 30-22 8 14 6 30 4 46-14 0-26-6-34-24z" fill="#BFEFE6" opacity=".7" />
      <g transform="rotate(-8 56 36)">
        <rect x="26" y="8" width="52" height="56" rx="8" fill="url(#kh-calc-a)" />
        <rect x="32" y="14" width="40" height="13" rx="3" fill="#D9ECFF" />
        {[0, 1, 2].flatMap((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}${c}`} x={33 + c * 13} y={32 + r * 10} width="9" height="7" rx="2" fill="#fff" opacity=".92" />
          )),
        )}
      </g>
      <path d="M84 62 106 62 106 28z" fill="url(#kh-calc-b)" />
      <path d="M92 58h10V42z" fill="#fff" opacity=".4" />
    </svg>
  );
}

/** رسم الترويسة: قبعة تخرّج + كتب + كوب أقلام + طائرة ورقية + نجوم. */
export function HeaderArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 170" className={className} aria-hidden>
      <defs>
        <linearGradient id="kh-h-wave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C9D5FF" />
          <stop offset="1" stopColor="#A9B8F5" />
        </linearGradient>
        <linearGradient id="kh-h-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4B4F8F" />
          <stop offset="1" stopColor="#1B1E4C" />
        </linearGradient>
        <linearGradient id="kh-h-b1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5B7BE8" />
          <stop offset="1" stopColor="#3556C9" />
        </linearGradient>
        <linearGradient id="kh-h-b2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F6A340" />
          <stop offset="1" stopColor="#E0841B" />
        </linearGradient>
      </defs>
      <path d="M0 170V90c60-40 140-30 200 0s120 40 180 10v70z" fill="url(#kh-h-wave)" opacity=".55" />
      {/* books */}
      <rect x="40" y="128" width="190" height="26" rx="5" fill="url(#kh-h-b2)" />
      <rect x="44" y="132" width="182" height="8" rx="3" fill="#FFF3DD" />
      <rect x="56" y="102" width="168" height="26" rx="5" fill="url(#kh-h-b1)" />
      <rect x="60" y="106" width="160" height="8" rx="3" fill="#E8EEFF" />
      <rect x="70" y="80" width="150" height="22" rx="5" fill="#F7F4EC" />
      <rect x="70" y="80" width="150" height="6" rx="3" fill="#fff" />
      {/* cap */}
      <path d="M100 58v22c0 8 20 14 45 14s45-6 45-14V58z" fill="#14163C" />
      <path d="M145 18 232 52 145 86 58 52z" fill="url(#kh-h-cap)" />
      <path d="M145 18 232 52 145 60 58 52z" fill="#fff" opacity=".15" />
      <path d="M216 55v32" stroke="#F5B73A" strokeWidth="3" strokeLinecap="round" />
      <path d="M210 87h12l-2 14h-8z" fill="#F5B73A" />
      {/* pencil cup */}
      <rect x="258" y="96" width="46" height="58" rx="10" fill="#fff" />
      <rect x="258" y="96" width="46" height="12" rx="6" fill="#EEF1FF" />
      <g strokeLinecap="round" strokeWidth="7">
        <path d="M268 100 262 52" stroke="#3B74E8" />
        <path d="M278 100 278 44" stroke="#F5A623" />
        <path d="M288 100 296 50" stroke="#E5484D" />
        <path d="M296 100 308 62" stroke="#7C4DDB" />
      </g>
      <path d="M259 52 262 41 265 52zM275 44 278 33 281 44zM293 50 297 39 300 50z" fill="#F3D9B1" />
      {/* plane + stars */}
      <path d="M320 40 366 22 346 62 338 48z" fill="#8E7CF0" />
      <path d="M320 40 338 48 346 62 330 52z" fill="#6A58D6" />
      <path d="M262 34c-22 12-18 30-38 24" stroke="#8E9CF0" strokeWidth="1.6" strokeDasharray="3 4" fill="none" strokeLinecap="round" />
      <path d="M282 12l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill="#F5B73A" />
      <path d="M18 34l2.4 5.6 5.6.8-4 4 1 5.6-5-2.8-5 2.8 1-5.6-4-4 5.6-.8z" fill="none" stroke="#F58BA3" strokeWidth="1.6" />
    </svg>
  );
}

/** شرارات صغيرة بجانب بطاقة الفصل المفتوح. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 36" className={className} aria-hidden>
      <path d="M26 6 14 11M24 18 10 18M26 30 14 25" stroke="#8B5CF6" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

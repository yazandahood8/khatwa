import { cn } from '@/lib/utils';

/**
 * شخصيات كرتونية أصلية — original cartoon student avatars (boys and girls),
 * drawn as simple inline SVG. Decorative only.
 */
export type KidVariant = 'boy-dark' | 'girl-ponytail' | 'boy-glasses' | 'girl-hijab' | 'boy-cap';

const INK = '#1c2340';

function Face({ blush = '#ff9db5' }: { blush?: string }) {
  return (
    <>
      <circle cx="42" cy="46" r="2.8" fill={INK} />
      <circle cx="58" cy="46" r="2.8" fill={INK} />
      <circle cx="43" cy="45" r="0.9" fill="#fff" />
      <circle cx="59" cy="45" r="0.9" fill="#fff" />
      <circle cx="36.5" cy="53" r="4" fill={blush} opacity="0.45" />
      <circle cx="63.5" cy="53" r="4" fill={blush} opacity="0.45" />
      <path d="M43.5 54 Q50 61 56.5 54" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  );
}

function Body({ shirt, skin }: { shirt: string; skin: string }) {
  return (
    <>
      <path d="M12 100 C12 77 29 69 50 69 C71 69 88 77 88 100 Z" fill={shirt} />
      <rect x="44" y="58" width="12" height="15" rx="5" fill={skin} />
      <path d="M44 69 Q50 76 56 69" fill={skin} />
    </>
  );
}

export function KidAvatar({ variant, className }: { variant: KidVariant; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn('block', className)}>
      {variant === 'boy-dark' && (
        <>
          <Body shirt="#2b7fe8" skin="#e9b48a" />
          <circle cx="28" cy="46" r="4.5" fill="#e9b48a" />
          <circle cx="72" cy="46" r="4.5" fill="#e9b48a" />
          <circle cx="50" cy="44" r="22" fill="#e9b48a" />
          <path d="M27 44 C24 22 40 17 52 18 C67 18 77 28 73 44 C70 36 62 31 50 31 C38 31 31 36 27 44Z" fill="#3b2a24" />
          <Face />
        </>
      )}
      {variant === 'girl-ponytail' && (
        <>
          <Body shirt="#ff7aa8" skin="#f2c4a0" />
          <circle cx="78" cy="32" r="10" fill="#8a3b1c" />
          <circle cx="72" cy="28" r="3.5" fill="#bedd3f" />
          <circle cx="28" cy="46" r="4.5" fill="#f2c4a0" />
          <circle cx="72" cy="46" r="4.5" fill="#f2c4a0" />
          <circle cx="50" cy="44" r="22" fill="#f2c4a0" />
          <path d="M27 46 C22 20 42 15 53 17 C68 18 78 28 73 46 C71 36 64 29 50 29 C38 29 30 36 27 46Z" fill="#8a3b1c" />
          <Face />
        </>
      )}
      {variant === 'boy-glasses' && (
        <>
          <Body shirt="#bedd3f" skin="#c98e63" />
          <circle cx="28" cy="46" r="4.5" fill="#c98e63" />
          <circle cx="72" cy="46" r="4.5" fill="#c98e63" />
          <circle cx="50" cy="44" r="22" fill="#c98e63" />
          <g fill="#2a1d18">
            <circle cx="33" cy="27" r="9" />
            <circle cx="45" cy="21" r="10" />
            <circle cx="58" cy="21" r="10" />
            <circle cx="69" cy="28" r="9" />
          </g>
          <Face />
          <g stroke={INK} strokeWidth="2" fill="none">
            <circle cx="42" cy="46" r="7" />
            <circle cx="58" cy="46" r="7" />
            <path d="M49 46 H51" />
          </g>
        </>
      )}
      {variant === 'girl-hijab' && (
        <>
          <path d="M12 100 C12 77 29 69 50 69 C71 69 88 77 88 100 Z" fill="#7c83ff" />
          <path d="M20 100 C22 82 34 72 50 72 C66 72 78 82 80 100 Z" fill="#9aa0ff" />
          <path d="M24 48 C20 20 38 11 50 11 C64 11 80 20 76 48 C77 66 70 76 62 80 L38 80 C30 76 23 66 24 48Z" fill="#7c83ff" />
          <ellipse cx="50" cy="47" rx="17" ry="19" fill="#e9b48a" />
          <Face />
        </>
      )}
      {variant === 'boy-cap' && (
        <>
          <Body shirt="#fab912" skin="#f2c4a0" />
          <circle cx="28" cy="46" r="4.5" fill="#f2c4a0" />
          <circle cx="72" cy="46" r="4.5" fill="#f2c4a0" />
          <circle cx="50" cy="44" r="22" fill="#f2c4a0" />
          <path d="M27 38 C27 14 73 14 73 38 Z" fill="#2b7fe8" />
          <path d="M58 36 L90 41 C90 47 64 46 58 42 Z" fill="#1e5fb8" />
          <circle cx="50" cy="19" r="3" fill="#bedd3f" />
          <Face />
        </>
      )}
    </svg>
  );
}

/**
 * تشغيل كود C# فعلياً (مترجم حقيقي) عبر Wandbox — مجاني، بدون مفتاح، من المتصفح مباشرة.
 * Piston العام صار whitelist-only (15/2/2026)، فنستعمل Wandbox (mono 6.12) كبديل.
 * مخصّص لـ C# فقط الآن.
 */

const ENDPOINT = 'https://wandbox.org/api/compile.json';
const COMPILER = 'mono-6.12.0.199';

export interface RunResult {
  ok: boolean; // نجح البناء والتشغيل بلا خطأ
  output: string; // الناتج (stdout/stderr أو رسالة الترجمة عند الفشل)
  note?: string; // ملاحظة ودّية (مثلاً: تجمّع بلا استدعاء يطبع)
}

const USINGS =
  'using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\n\n';

// هل الكود برنامج كامل (فيه class/namespace/Main)؟
const HAS_SHELL = /\b(class|namespace)\s+\w/;
const HAS_MAIN = /\bstatic\s+[\w<>[\],\s]*\bMain\s*\(/;
// توقيع دالة على المستوى الأعلى: نوع + اسم + (…) + { أو =>  (مسائل "اكتب دالة")
const METHOD_DEF =
  /(^|\n)\s*(public\s+|private\s+|protected\s+|internal\s+)?(static\s+)?[\w<>[\],]+\s+[A-Za-z_]\w*\s*\([^;{]*\)\s*(\{|=>)/;

type Shape = 'program' | 'methods' | 'statements';

function classify(src: string): Shape {
  if (HAS_SHELL.test(src) || HAS_MAIN.test(src)) return 'program';
  if (METHOD_DEF.test(src)) return 'methods';
  return 'statements';
}

/** يغلّف كود الطالب ببرنامج C# صالح للترجمة حسب شكله. */
function wrap(src: string, shape: Shape): string {
  const head = /^\s*using\s/m.test(src) ? '' : USINGS;
  if (shape === 'program') return head + src;
  if (shape === 'methods') {
    // الدوال على مستوى الكلاس + Main فارغة (تتجمّع؛ الناتج فارغ ما لم يستدعِها Main)
    return `${USINGS}class Program\n{\n${src}\n    static void Main() { }\n}\n`;
  }
  // أسطر مباشرة → داخل Main
  const body = src
    .split('\n')
    .map((l) => '        ' + l)
    .join('\n');
  return `${USINGS}class Program\n{\n    static void Main()\n    {\n${body}\n    }\n}\n`;
}

interface WandboxResponse {
  status?: string;
  compiler_error?: string;
  program_output?: string;
  program_error?: string;
}

/** يشغّل كود C# ويعيد الناتج. يرمي Error عند فشل الشبكة. */
export async function runCSharp(src: string): Promise<RunResult> {
  const shape = classify(src);
  const code = wrap(src, shape);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compiler: COMPILER, code }),
  });
  if (!res.ok) throw new Error(`wandbox ${res.status}`);

  const data = (await res.json()) as WandboxResponse;

  // خطأ ترجمة (compile error)
  const compileErr = (data.compiler_error ?? '').trim();
  if (compileErr) {
    return { ok: false, output: cleanupErr(compileErr) };
  }

  const out = (data.program_output ?? '') + (data.program_error ?? '');
  const ok = data.status === '0';

  if (shape === 'methods' && !out.trim() && ok) {
    return {
      ok: true,
      output: '',
      note: 'تجمّعت الدالة بنجاح ✅ — لكن ما في استدعاء يطبع ناتجاً. جرّب استدعاءها لتشوف النتيجة.',
    };
  }

  return { ok, output: out };
}

// يشيل مسار الملف الداخلي (prog.cs) من رسائل الأخطاء ليصير أوضح للطالب
function cleanupErr(msg: string): string {
  return msg.replace(/(^|\n)prog\.cs\(/g, '$1سطر (').replace(/prog\.cs/g, 'الكود');
}

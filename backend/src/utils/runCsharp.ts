/**
 * تشغيل كود C# فعلياً عبر Wandbox (mono 6.12) — مجاني بلا مفتاح.
 * يُستعمل لتصحيح مسائل البرمجة بمقارنة ناتج الطالب بناتج الحل المرجعي.
 * Piston العام صار whitelist-only (15/2/2026)، فنعتمد Wandbox.
 */

const ENDPOINT = 'https://wandbox.org/api/compile.json';
const COMPILER = 'mono-6.12.0.199';

export interface RunResult {
  ok: boolean; // تجمّع وتشغّل بلا خطأ
  output: string; // stdout/stderr أو رسالة الترجمة عند الفشل
  note?: string;
}

const USINGS =
  'using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\n\n';

const HAS_SHELL = /\b(class|namespace)\s+\w/;
const HAS_MAIN = /\bstatic\s+[\w<>[\],\s]*\bMain\s*\(/;
const METHOD_DEF =
  /(^|\n)\s*(public\s+|private\s+|protected\s+|internal\s+)?(static\s+)?[\w<>[\],]+\s+[A-Za-z_]\w*\s*\([^;{]*\)\s*(\{|=>)/;

type Shape = 'program' | 'methods' | 'statements';

function classify(src: string): Shape {
  if (HAS_SHELL.test(src) || HAS_MAIN.test(src)) return 'program';
  if (METHOD_DEF.test(src)) return 'methods';
  return 'statements';
}

function wrap(src: string, shape: Shape): string {
  const head = /^\s*using\s/m.test(src) ? '' : USINGS;
  if (shape === 'program') return head + src;
  if (shape === 'methods') {
    return `${USINGS}class Program\n{\n${src}\n    static void Main() { }\n}\n`;
  }
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

/** يشغّل كود C# ويعيد الناتج. يرمي عند فشل الشبكة. */
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

  const compileErr = (data.compiler_error ?? '').trim();
  if (compileErr) return { ok: false, output: cleanupErr(compileErr) };

  const output = (data.program_output ?? '') + (data.program_error ?? '');
  const ok = data.status === '0';

  if (shape === 'methods' && !output.trim() && ok) {
    return {
      ok: true,
      output: '',
      note: 'تجمّعت الدالة بنجاح ✅ — لكن ما في استدعاء يطبع ناتجاً.',
    };
  }
  return { ok, output };
}

/** يوحّد الناتج للمقارنة: يشيل \r، يقصّ الفراغات آخر كل سطر والأسطر الفارغة الأخيرة. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

function cleanupErr(msg: string): string {
  return msg.replace(/(^|\n)prog\.cs\(/g, '$1سطر (').replace(/prog\.cs/g, 'الكود');
}

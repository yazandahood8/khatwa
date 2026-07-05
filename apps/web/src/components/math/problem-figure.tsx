'use client';

import type { FigureSpec, TransversalPos } from '@khatwa/shared';

/**
 * يرسم مخطط سؤال هندسي كـ SVG تعريفي (بلا صور مرفوعة) — draws a geometry figure from a FigureSpec.
 * مخطط تخطيطي للتوضيح: المواقع والنِّسب ثابتة للقراءة، لا مرسومة بمقياس دقيق.
 * الألوان من الثيم: الشكل بـ currentColor (text-foreground)، والمطلوب/المبرَز بـ text-primary.
 */
export function ProblemFigure({ spec }: { spec: FigureSpec }) {
  return (
    <div className="mt-4 flex justify-center">
      <svg
        viewBox="0 0 240 160"
        role="img"
        aria-label="مخطط توضيحي للسؤال"
        className="h-auto w-full max-w-[280px] text-foreground"
      >
        <Figure spec={spec} />
      </svg>
    </div>
  );
}

/* ---------------- geometry helpers ---------------- */

const rad = (d: number) => (d * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + r * Math.cos(rad(deg)),
  cy - r * Math.sin(rad(deg)), // y مقلوب: للأسفل موجب على الشاشة
];

/** قوس زاوية كخطّ متعدّد النقاط (نتفادى أعلام قوس SVG). */
function arcPoints(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const step = 4;
  const dir = a1 >= a0 ? 1 : -1;
  const pts: string[] = [];
  for (let a = a0; dir > 0 ? a <= a1 : a >= a1; a += dir * step)
    pts.push(polar(cx, cy, r, a).join(','));
  pts.push(polar(cx, cy, r, a1).join(','));
  return pts.join(' ');
}

const STROKE = 1.6;

function Ray({ cx, cy, r, deg }: { cx: number; cy: number; r: number; deg: number }) {
  const [x, y] = polar(cx, cy, r, deg);
  return <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeWidth={STROKE} />;
}

function Arc({
  cx,
  cy,
  r,
  a0,
  a1,
  accent,
}: {
  cx: number;
  cy: number;
  r: number;
  a0: number;
  a1: number;
  accent?: boolean;
}) {
  return (
    <polyline
      points={arcPoints(cx, cy, r, a0, a1)}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      className={accent ? 'text-primary' : undefined}
    />
  );
}

function Label({ x, y, text, accent }: { x: number; y: number; text: string; accent?: boolean }) {
  if (!text) return null;
  return (
    <text
      x={x}
      y={y}
      fontSize={13}
      fontWeight={600}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="currentColor"
      className={accent ? 'text-primary' : undefined}
    >
      {text}
    </text>
  );
}

/** نصّ الزاوية "مطلوب" عندما يكون علامة استفهام أو فارغاً. */
const isTarget = (s: string) => s === '؟' || s === '?' || s.trim() === '';

/* ---------------- per-type renderers ---------------- */

function Figure({ spec }: { spec: FigureSpec }) {
  switch (spec.type) {
    case 'anglePair':
      return <AnglePair kind={spec.kind} labels={spec.labels} />;
    case 'anglesOnLine':
      return <AnglesOnLine labels={spec.labels} />;
    case 'verticalAngles':
      return <VerticalAngles labels={spec.labels} />;
    case 'anglesAroundPoint':
      return <AnglesAroundPoint labels={spec.labels} />;
    case 'parallelTransversal':
      return <ParallelTransversal a={spec.a} b={spec.b} />;
    case 'triangleAngles':
      return (
        <TriangleAngles
          angles={spec.angles}
          rightAngleAt={spec.rightAngleAt}
          isoscelesApex={spec.isoscelesApex}
          exterior={spec.exterior}
        />
      );
    case 'triangleSides':
      return <TriangleSides sides={spec.sides} />;
    default:
      return null;
  }
}

function AnglePair({ kind, labels }: { kind: 'complement' | 'supplement'; labels: [string, string] }) {
  const cx = 120;
  const cy = 120;
  const R = 92;
  const total = kind === 'complement' ? 90 : 180;
  const start = 0; // الضلع الأيمن أفقي
  const end = total; // للأعلى (90) أو المستقيم (180)
  const split = kind === 'complement' ? 52 : 68; // الضلع الأوسط (تخطيطي)
  const aR = 34; // نصف قطر أقواس الزوايا
  const lR = 54; // نصف قطر النصوص

  const [mx, my] = polar(cx, cy, R, split);
  const bis0 = (start + split) / 2;
  const bis1 = (split + end) / 2;
  const [l0x, l0y] = polar(cx, cy, lR, bis0);
  const [l1x, l1y] = polar(cx, cy, lR, bis1);

  return (
    <>
      <Ray cx={cx} cy={cy} r={R} deg={start} />
      <Ray cx={cx} cy={cy} r={R} deg={end} />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="currentColor" strokeWidth={STROKE} />
      <Arc cx={cx} cy={cy} r={aR} a0={start} a1={split} accent={isTarget(labels[0])} />
      <Arc cx={cx} cy={cy} r={aR + 6} a0={split} a1={end} accent={isTarget(labels[1])} />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
      <Label x={l0x} y={l0y} text={labels[0]} accent={isTarget(labels[0])} />
      <Label x={l1x} y={l1y} text={labels[1]} accent={isTarget(labels[1])} />
    </>
  );
}

function AnglesOnLine({ labels }: { labels: string[] }) {
  const cx = 120;
  const cy = 120;
  const R = 92;
  const n = labels.length;
  // n زوايا متجاورة على مستقيم (0°..180°) بأقسام متساوية تخطيطياً.
  const bounds = Array.from({ length: n + 1 }, (_, i) => (180 * i) / n);
  const aR = 32;
  const lR = 56;
  return (
    <>
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="currentColor" strokeWidth={STROKE} />
      {bounds.slice(1, n).map((b, i) => (
        <Ray key={i} cx={cx} cy={cy} r={R} deg={b} />
      ))}
      {labels.map((lab, i) => {
        const a0 = bounds[i];
        const a1 = bounds[i + 1];
        const [lx, ly] = polar(cx, cy, lR, (a0 + a1) / 2);
        return (
          <g key={i}>
            <Arc cx={cx} cy={cy} r={aR + (i % 2) * 6} a0={a0} a1={a1} accent={isTarget(lab)} />
            <Label x={lx} y={ly} text={lab} accent={isTarget(lab)} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
    </>
  );
}

function VerticalAngles({ labels }: { labels: [string, string] }) {
  const cx = 120;
  const cy = 80;
  const R = 88;
  const tilt = 34; // ميل المستقيم الثاني
  const aR = 30;
  const lR = 50;
  const bis0 = tilt / 2; // القطاع بين 0 و tilt (يمين)
  const bis1 = 180 + tilt / 2; // مقابله بالرأس
  const [l0x, l0y] = polar(cx, cy, lR, bis0);
  const [l1x, l1y] = polar(cx, cy, lR, bis1);
  const line = (deg: number) => {
    const [x1, y1] = polar(cx, cy, R, deg);
    const [x2, y2] = polar(cx, cy, R, deg + 180);
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={STROKE} />;
  };
  return (
    <>
      {line(0)}
      {line(tilt)}
      <Arc cx={cx} cy={cy} r={aR} a0={0} a1={tilt} accent />
      <Arc cx={cx} cy={cy} r={aR} a0={180} a1={180 + tilt} accent />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
      <Label x={l0x} y={l0y} text={labels[0]} accent />
      <Label x={l1x} y={l1y} text={labels[1]} accent />
    </>
  );
}

function AnglesAroundPoint({ labels }: { labels: string[] }) {
  const cx = 120;
  const cy = 80;
  const R = 74;
  const n = labels.length;
  const bounds = Array.from({ length: n + 1 }, (_, i) => (360 * i) / n);
  const lR = 44;
  return (
    <>
      {bounds.slice(0, n).map((b, i) => (
        <Ray key={i} cx={cx} cy={cy} r={R} deg={b} />
      ))}
      {labels.map((lab, i) => {
        const mid = (bounds[i] + bounds[i + 1]) / 2;
        const [lx, ly] = polar(cx, cy, lR, mid);
        return (
          <g key={i}>
            <Arc cx={cx} cy={cy} r={26} a0={bounds[i]} a1={bounds[i + 1]} accent={isTarget(lab)} />
            <Label x={lx} y={ly} text={lab} accent={isTarget(lab)} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
    </>
  );
}

// إزاحات النصوص حسب الرُّبع حول نقطة التقاطع.
const QUAD: Record<'tl' | 'tr' | 'bl' | 'br', [number, number]> = {
  tl: [-24, -13],
  tr: [24, -13],
  bl: [-24, 15],
  br: [24, 15],
};

function ParallelTransversal({
  a,
  b,
}: {
  a: { pos: TransversalPos; label: string };
  b: { pos: TransversalPos; label: string };
}) {
  const x0 = 22;
  const x1 = 218;
  const topY = 48;
  const botY = 118;
  // نقطتا تقاطع القاطع مع المتوازيين، والقاطع مائل.
  const topX = 104;
  const botX = 140;
  const dx = botX - topX;
  const dy = botY - topY;
  const ext = 0.42;
  const p0: [number, number] = [topX - dx * ext, topY - dy * ext];
  const p1: [number, number] = [botX + dx * ext, botY + dy * ext];

  const place = ({ pos, label }: { pos: TransversalPos; label: string }, accent: boolean) => {
    const [line, quad] = pos.split('-') as ['t' | 'b', 'tl' | 'tr' | 'bl' | 'br'];
    const ix = line === 't' ? topX : botX;
    const iy = line === 't' ? topY : botY;
    const [ox, oy] = QUAD[quad];
    return <Label x={ix + ox} y={iy + oy} text={label} accent={accent} />;
  };

  return (
    <>
      {/* المتوازيان */}
      <line x1={x0} y1={topY} x2={x1} y2={topY} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={x0} y1={botY} x2={x1} y2={botY} stroke="currentColor" strokeWidth={STROKE} />
      {/* أسهم التوازي */}
      <ParallelTick x={x1 - 30} y={topY} />
      <ParallelTick x={x1 - 30} y={botY} />
      {/* القاطع */}
      <line
        x1={p0[0]}
        y1={p0[1]}
        x2={p1[0]}
        y2={p1[1]}
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      <circle cx={topX} cy={topY} r={2.2} fill="currentColor" />
      <circle cx={botX} cy={botY} r={2.2} fill="currentColor" />
      {place(a, isTarget(a.label))}
      {place(b, isTarget(b.label))}
    </>
  );
}

/** سهم صغير (‹) يدلّ على التوازي. */
function ParallelTick({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="currentColor" strokeWidth={STROKE} fill="none" className="text-muted-foreground">
      <path d={`M ${x} ${y - 4} L ${x - 6} ${y} L ${x} ${y + 4}`} />
    </g>
  );
}

const TRI = {
  A: [120, 32] as [number, number],
  B: [50, 126] as [number, number],
  C: [190, 126] as [number, number],
};

function TriangleAngles({
  angles,
  rightAngleAt,
  isoscelesApex,
  exterior,
}: {
  angles: [string, string, string];
  rightAngleAt?: 0 | 1 | 2;
  isoscelesApex?: 0 | 1 | 2;
  exterior?: { atVertex: 0 | 1 | 2; label: string };
}) {
  const V: [number, number][] = [TRI.A, TRI.B, TRI.C];
  const cen: [number, number] = [
    (TRI.A[0] + TRI.B[0] + TRI.C[0]) / 3,
    (TRI.A[1] + TRI.B[1] + TRI.C[1]) / 3,
  ];
  const toward = ([vx, vy]: [number, number], dist: number): [number, number] => {
    const dx = cen[0] - vx;
    const dy = cen[1] - vy;
    const m = Math.hypot(dx, dy) || 1;
    return [vx + (dx / m) * dist, vy + (dy / m) * dist];
  };

  return (
    <>
      <polygon
        points={V.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      {isoscelesApex != null && <IsoTicks apex={isoscelesApex} />}
      {V.map((v, i) => {
        if (rightAngleAt === i) return <RightAngleMark key={i} vertex={v} center={cen} />;
        const [lx, ly] = toward(v, 30);
        return <Label key={i} x={lx} y={ly} text={angles[i]} accent={isTarget(angles[i])} />;
      })}
      {exterior && <ExteriorAngle vertex={exterior.atVertex} label={exterior.label} />}
    </>
  );
}

function IsoTicks({ apex }: { apex: 0 | 1 | 2 }) {
  const V: [number, number][] = [TRI.A, TRI.B, TRI.C];
  const others = [0, 1, 2].filter((i) => i !== apex);
  const mid = (p: [number, number], q: [number, number]): [number, number] => [
    (p[0] + q[0]) / 2,
    (p[1] + q[1]) / 2,
  ];
  return (
    <>
      {others.map((oi, k) => {
        const [mx, my] = mid(V[apex], V[oi]);
        return (
          <line
            key={k}
            x1={mx - 4}
            y1={my - 5}
            x2={mx + 4}
            y2={my + 5}
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-muted-foreground"
          />
        );
      })}
    </>
  );
}

function RightAngleMark({
  vertex,
  center,
}: {
  vertex: [number, number];
  center: [number, number];
}) {
  const [vx, vy] = vertex;
  const dx = center[0] - vx;
  const dy = center[1] - vy;
  const m = Math.hypot(dx, dy) || 1;
  const s = 12;
  const ux = (dx / m) * s;
  const uy = (dy / m) * s;
  // مربّع صغير موجّه نحو المركز (تخطيطي).
  return (
    <path
      d={`M ${vx + ux} ${vy + uy} l ${-uy} ${ux} l ${ux} ${uy} l ${uy} ${-ux}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    />
  );
}

function ExteriorAngle({ vertex, label }: { vertex: 0 | 1 | 2; label: string }) {
  // نمدّد القاعدة B→C خارج الرأس ونعلّم الزاوية الخارجية (مصمّم لأسفل يمين C).
  const V: [number, number][] = [TRI.A, TRI.B, TRI.C];
  const [vx, vy] = V[vertex];
  // اتجاه امتداد الضلع من الرأس المجاور خلال هذا الرأس
  const prev = V[(vertex + 2) % 3];
  const dx = vx - prev[0];
  const dy = vy - prev[1];
  const m = Math.hypot(dx, dy) || 1;
  const ex = vx + (dx / m) * 40;
  const ey = vy + (dy / m) * 40;
  const lx = vx + (dx / m) * 26;
  const ly = vy + (dy / m) * 26 - 12;
  return (
    <>
      <line
        x1={vx}
        y1={vy}
        x2={ex}
        y2={ey}
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeDasharray="3 3"
        className="text-muted-foreground"
      />
      <Label x={lx} y={ly} text={label} accent={isTarget(label)} />
    </>
  );
}

function TriangleSides({ sides }: { sides: [string, string, string] }) {
  // sides[0]=AB، sides[1]=BC (القاعدة)، sides[2]=CA
  const edges: [[number, number], [number, number]][] = [
    [TRI.A, TRI.B],
    [TRI.B, TRI.C],
    [TRI.C, TRI.A],
  ];
  const cen: [number, number] = [
    (TRI.A[0] + TRI.B[0] + TRI.C[0]) / 3,
    (TRI.A[1] + TRI.B[1] + TRI.C[1]) / 3,
  ];
  return (
    <>
      <polygon
        points={[TRI.A, TRI.B, TRI.C].map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      {edges.map(([p, q], i) => {
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        // ندفع النص للخارج بعيداً عن المركز
        const dx = mx - cen[0];
        const dy = my - cen[1];
        const d = Math.hypot(dx, dy) || 1;
        const lx = mx + (dx / d) * 16;
        const ly = my + (dy / d) * 16;
        return <Label key={i} x={lx} y={ly} text={sides[i]} accent={isTarget(sides[i])} />;
      })}
    </>
  );
}

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
      return <TriangleSides sides={spec.sides} rightAngleAt={spec.rightAngleAt} />;
    case 'rect':
      return <Rect w={spec.w} h={spec.h} square={spec.square} />;
    case 'triangleBaseHeight':
      return <TriangleBaseHeight base={spec.base} height={spec.height} />;
    case 'rightTriangle':
      return <RightTriangle legs={spec.legs} hyp={spec.hyp} />;
    case 'parallelogram':
      return <Parallelogram base={spec.base} height={spec.height} />;
    case 'trapezoid':
      return <Trapezoid base1={spec.base1} base2={spec.base2} height={spec.height} />;
    case 'rhombus':
      return <Rhombus diag1={spec.diag1} diag2={spec.diag2} />;
    case 'circle':
      return <CircleFig radius={spec.radius} diameter={spec.diameter} chord={spec.chord} shaded={spec.shaded} />;
    case 'concentricCircles':
      return <ConcentricCircles outer={spec.outer} inner={spec.inner} />;
    case 'circleSector':
      return <CircleSector angle={spec.angle} radius={spec.radius} mode={spec.mode} />;
    case 'rectPlusTriangle':
      return <RectPlusTriangle w={spec.w} h={spec.h} triBase={spec.triBase} triHeight={spec.triHeight} />;
    case 'rectPlusSemicircle':
      return <RectPlusSemicircle w={spec.w} h={spec.h} radius={spec.radius} />;
    case 'lShape':
      return <LShape outerW={spec.outerW} outerH={spec.outerH} cutW={spec.cutW} cutH={spec.cutH} />;
    case 'inscribedCircleSquare':
      return <InscribedCircleSquare side={spec.side} radius={spec.radius} />;
    case 'stadium':
      return <Stadium w={spec.w} h={spec.h} radius={spec.radius} />;
    case 'borderedRect':
      return <BorderedRect outerW={spec.outerW} outerH={spec.outerH} border={spec.border} />;
    case 'coordinatePlane':
      return (
        <CoordinatePlane
          points={spec.points}
          segments={spec.segments}
          polygon={spec.polygon}
          highlightQuadrant={spec.highlightQuadrant}
          range={spec.range}
        />
      );
    case 'solid':
      return <Solid kind={spec.kind} dims={spec.dims} open={spec.open} />;
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

function TriangleSides({
  sides,
  rightAngleAt,
}: {
  sides: [string, string, string];
  rightAngleAt?: 0 | 1 | 2;
}) {
  // sides[0]=AB، sides[1]=BC (القاعدة)، sides[2]=CA
  const V: [number, number][] = [TRI.A, TRI.B, TRI.C];
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
        points={V.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      {rightAngleAt != null && <RightAngleMark vertex={V[rightAngleAt]} center={cen} />}
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

/* ---------------- shared helpers for batch-2 figures ---------------- */

/** يستخرج أول عدد من نصّ التسمية (لتحجيم القطاع/القصّ)، وإلا القيمة الاحتياطية. */
function num(s: string | undefined, fb: number): number {
  if (!s) return fb;
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : fb;
}

/** منطقة مظلّلة بلون الإبراز (للإجابة/الحلقة/الفجوة). */
function Shade({ d, points }: { d?: string; points?: string }) {
  return d ? (
    <path d={d} fillRule="evenodd" fill="currentColor" fillOpacity={0.14} stroke="none" className="text-primary" />
  ) : (
    <polygon points={points} fill="currentColor" fillOpacity={0.14} stroke="none" className="text-primary" />
  );
}

/** علامة زاوية قائمة محاذية للمحاور عند نقطة (الاتجاه: dx/dy = ±1). */
function RightAngleBox({ x, y, dx, dy }: { x: number; y: number; dx: number; dy: number }) {
  const s = 10;
  return (
    <path
      d={`M ${x + dx * s} ${y} L ${x + dx * s} ${y + dy * s} L ${x} ${y + dy * s}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
    />
  );
}

/** خطّ متقطّع (ارتفاع/امتداد مساعد). */
function Dashed({ x1, y1, x2, y2, muted }: { x1: number; y1: number; x2: number; y2: number; muted?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeDasharray="3 3"
      className={muted ? 'text-muted-foreground' : undefined}
    />
  );
}

const outline = { fill: 'none', stroke: 'currentColor', strokeWidth: STROKE } as const;

/* ---------------- polygons ---------------- */

function Rect({ w, h, square }: { w: string; h: string; square?: boolean }) {
  const cw = square ? 86 : 122;
  const ch = square ? 86 : 74;
  const x0 = 120 - cw / 2;
  const y0 = 80 - ch / 2;
  return (
    <>
      <rect x={x0} y={y0} width={cw} height={ch} {...outline} />
      <Label x={120} y={y0 + ch + 14} text={w} accent={isTarget(w)} />
      <Label x={x0 - 15} y={80} text={h} accent={isTarget(h)} />
    </>
  );
}

function TriangleBaseHeight({ base, height }: { base: string; height: string }) {
  const A: [number, number] = [52, 122];
  const B: [number, number] = [188, 122];
  const apex: [number, number] = [138, 44];
  const foot: [number, number] = [apex[0], 122];
  return (
    <>
      <polygon points={`${A} ${B} ${apex}`} {...outline} />
      <Dashed x1={apex[0]} y1={apex[1]} x2={foot[0]} y2={foot[1]} muted />
      <RightAngleBox x={foot[0]} y={foot[1]} dx={-1} dy={-1} />
      <Label x={120} y={136} text={base} accent={isTarget(base)} />
      <Label x={foot[0] + 16} y={84} text={height} accent={isTarget(height)} />
    </>
  );
}

function RightTriangle({ legs, hyp }: { legs: [string, string]; hyp?: string }) {
  const A: [number, number] = [60, 122]; // الزاوية القائمة
  const B: [number, number] = [186, 122];
  const C: [number, number] = [60, 46];
  return (
    <>
      <polygon points={`${A} ${B} ${C}`} {...outline} />
      <RightAngleBox x={A[0]} y={A[1]} dx={1} dy={-1} />
      <Label x={(A[0] + B[0]) / 2} y={136} text={legs[0]} accent={isTarget(legs[0])} />
      <Label x={A[0] - 15} y={(A[1] + C[1]) / 2} text={legs[1]} accent={isTarget(legs[1])} />
      {hyp && <Label x={(B[0] + C[0]) / 2 + 20} y={(B[1] + C[1]) / 2 - 4} text={hyp} accent={isTarget(hyp)} />}
    </>
  );
}

function Parallelogram({ base, height }: { base: string; height: string }) {
  const pts: [number, number][] = [
    [55, 120],
    [175, 120],
    [205, 50],
    [85, 50],
  ];
  return (
    <>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} {...outline} />
      <Dashed x1={110} y1={50} x2={110} y2={120} muted />
      <RightAngleBox x={110} y={120} dx={1} dy={-1} />
      <Label x={115} y={134} text={base} accent={isTarget(base)} />
      <Label x={124} y={86} text={height} accent={isTarget(height)} />
    </>
  );
}

function Trapezoid({ base1, base2, height }: { base1: string; base2: string; height: string }) {
  const pts: [number, number][] = [
    [45, 120],
    [195, 120],
    [155, 52],
    [85, 52],
  ];
  return (
    <>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} {...outline} />
      <Dashed x1={85} y1={52} x2={85} y2={120} muted />
      <RightAngleBox x={85} y={120} dx={1} dy={-1} />
      <Label x={120} y={134} text={base1} accent={isTarget(base1)} />
      <Label x={120} y={42} text={base2} accent={isTarget(base2)} />
      <Label x={99} y={86} text={height} accent={isTarget(height)} />
    </>
  );
}

function Rhombus({ diag1, diag2 }: { diag1: string; diag2: string }) {
  const top: [number, number] = [120, 38];
  const right: [number, number] = [182, 80];
  const bottom: [number, number] = [120, 122];
  const left: [number, number] = [58, 80];
  return (
    <>
      <polygon points={`${top} ${right} ${bottom} ${left}`} {...outline} />
      <line x1={left[0]} y1={left[1]} x2={right[0]} y2={right[1]} stroke="currentColor" strokeWidth={STROKE} className="text-muted-foreground" />
      <line x1={top[0]} y1={top[1]} x2={bottom[0]} y2={bottom[1]} stroke="currentColor" strokeWidth={STROKE} className="text-muted-foreground" />
      <Label x={152} y={72} text={diag1} accent={isTarget(diag1)} />
      <Label x={106} y={102} text={diag2} accent={isTarget(diag2)} />
    </>
  );
}

/* ---------------- circle family ---------------- */

const CC: [number, number] = [120, 80];

function CircleFig({
  radius,
  diameter,
  chord,
  shaded,
}: {
  radius?: string;
  diameter?: string;
  chord?: string;
  shaded?: boolean;
}) {
  const R = 55;
  const [cx, cy] = CC;
  const dLabel = diameter ?? chord;
  return (
    <>
      {shaded && <circle cx={cx} cy={cy} r={R} fill="currentColor" fillOpacity={0.12} stroke="none" className="text-primary" />}
      <circle cx={cx} cy={cy} r={R} {...outline} />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
      {radius && (
        <>
          {(() => {
            const [ex, ey] = polar(cx, cy, R, 35);
            const [lx, ly] = polar(cx, cy, R * 0.55, 35);
            return (
              <>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="currentColor" strokeWidth={STROKE} />
                <Label x={lx} y={ly - 8} text={radius} accent={isTarget(radius)} />
              </>
            );
          })()}
        </>
      )}
      {dLabel && (
        <>
          <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="currentColor" strokeWidth={STROKE} />
          <Label x={cx} y={cy + 15} text={dLabel} accent={isTarget(dLabel)} />
        </>
      )}
    </>
  );
}

function ConcentricCircles({ outer, inner }: { outer: string; inner: string }) {
  const [cx, cy] = CC;
  const Ro = 58;
  const Ri = 34;
  const ring =
    `M ${cx - Ro},${cy} a ${Ro},${Ro} 0 1,0 ${2 * Ro},0 a ${Ro},${Ro} 0 1,0 ${-2 * Ro},0 Z ` +
    `M ${cx - Ri},${cy} a ${Ri},${Ri} 0 1,0 ${2 * Ri},0 a ${Ri},${Ri} 0 1,0 ${-2 * Ri},0 Z`;
  const [ox, oy] = polar(cx, cy, Ro, 55);
  const [ix, iy] = polar(cx, cy, Ri, 235);
  return (
    <>
      <Shade d={ring} />
      <circle cx={cx} cy={cy} r={Ro} {...outline} />
      <circle cx={cx} cy={cy} r={Ri} {...outline} />
      <line x1={cx} y1={cy} x2={ox} y2={oy} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx} y1={cy} x2={ix} y2={iy} stroke="currentColor" strokeWidth={STROKE} />
      <Label x={polar(cx, cy, Ro * 0.6, 55)[0] + 8} y={polar(cx, cy, Ro * 0.6, 55)[1] - 6} text={outer} accent={isTarget(outer)} />
      <Label x={polar(cx, cy, Ri * 0.6, 235)[0] - 8} y={polar(cx, cy, Ri * 0.6, 235)[1] + 10} text={inner} accent={isTarget(inner)} />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
    </>
  );
}

function CircleSector({ angle, radius, mode }: { angle: string; radius: string; mode: 'sector' | 'arc' | 'remaining' }) {
  const [cx, cy] = CC;
  const R = 55;
  const theta = Math.min(350, Math.max(10, num(angle, 90)));
  const wedge = `${cx},${cy} ${arcPoints(cx, cy, R, 0, theta)} ${cx},${cy}`;
  const rest = `${cx},${cy} ${arcPoints(cx, cy, R, theta, 360)} ${cx},${cy}`;
  const [r0x, r0y] = polar(cx, cy, R, 0);
  const [rTx, rTy] = polar(cx, cy, R, theta);
  const [aLx, aLy] = polar(cx, cy, 30, theta / 2);
  const [radLx, radLy] = polar(cx, cy, R * 0.55, theta / 2);
  return (
    <>
      {mode === 'remaining' ? (
        <>
          <Shade points={rest} />
          <circle cx={cx} cy={cy} r={R} {...outline} />
          <line x1={cx} y1={cy} x2={r0x} y2={r0y} stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
          <line x1={cx} y1={cy} x2={rTx} y2={rTy} stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
        </>
      ) : (
        <>
          {mode === 'sector' && <Shade points={wedge} />}
          <circle cx={cx} cy={cy} r={R} {...outline} className={mode === 'arc' ? 'text-muted-foreground' : undefined} />
          <line x1={cx} y1={cy} x2={r0x} y2={r0y} stroke="currentColor" strokeWidth={STROKE} />
          <line x1={cx} y1={cy} x2={rTx} y2={rTy} stroke="currentColor" strokeWidth={STROKE} />
          {mode === 'arc' && (
            <polyline points={arcPoints(cx, cy, R, 0, theta)} fill="none" stroke="currentColor" strokeWidth={3} className="text-primary" />
          )}
        </>
      )}
      <Label x={aLx} y={aLy} text={angle} accent={isTarget(angle)} />
      <Label x={radLx} y={radLy - 8} text={radius} accent={isTarget(radius)} />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
    </>
  );
}

/* ---------------- composites ---------------- */

function RectPlusTriangle({ w, h, triBase, triHeight }: { w: string; h: string; triBase: string; triHeight: string }) {
  const x0 = 72;
  const x1 = 168;
  const yTop = 82;
  const yBot = 130;
  const apex: [number, number] = [(x0 + x1) / 2, 44];
  return (
    <>
      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} {...outline} />
      <polygon points={`${x0},${yTop} ${x1},${yTop} ${apex}`} {...outline} />
      <Dashed x1={apex[0]} y1={apex[1]} x2={apex[0]} y2={yTop} muted />
      <Label x={120} y={yBot + 14} text={w} accent={isTarget(w)} />
      <Label x={x0 - 14} y={(yTop + yBot) / 2} text={h} accent={isTarget(h)} />
      <Label x={apex[0] + 30} y={62} text={triHeight} accent={isTarget(triHeight)} />
      <Label x={94} y={yTop - 8} text={triBase} accent={isTarget(triBase)} />
    </>
  );
}

function RectPlusSemicircle({ w, h, radius }: { w: string; h: string; radius: string }) {
  const x0 = 66;
  const x1 = 174;
  const yTop = 80;
  const yBot = 128;
  const R = (x1 - x0) / 2;
  const cx = (x0 + x1) / 2;
  const [ex, ey] = polar(cx, yTop, R, 60);
  return (
    <>
      <rect x={x0} y={yTop} width={x1 - x0} height={yBot - yTop} {...outline} />
      <polyline points={arcPoints(cx, yTop, R, 0, 180)} {...outline} />
      <line x1={cx} y1={yTop} x2={ex} y2={ey} stroke="currentColor" strokeWidth={STROKE} />
      <Label x={(cx + ex) / 2 + 6} y={(yTop + ey) / 2} text={radius} accent={isTarget(radius)} />
      <Label x={120} y={yBot + 14} text={w} accent={isTarget(w)} />
      <Label x={x0 - 14} y={(yTop + yBot) / 2} text={h} accent={isTarget(h)} />
    </>
  );
}

function LShape({ outerW, outerH, cutW, cutH }: { outerW: string; outerH: string; cutW: string; cutH: string }) {
  const OW = 122;
  const OH = 92;
  const x0 = 120 - OW / 2;
  const y0 = 80 - OH / 2;
  const cw = OW * Math.min(0.7, num(cutW, 4) / num(outerW, 10));
  const ch = OH * Math.min(0.7, num(cutH, 3) / num(outerH, 8));
  const pts: [number, number][] = [
    [x0, y0],
    [x0 + OW - cw, y0],
    [x0 + OW - cw, y0 + ch],
    [x0 + OW, y0 + ch],
    [x0 + OW, y0 + OH],
    [x0, y0 + OH],
  ];
  return (
    <>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} {...outline} />
      <Label x={x0 + (OW - cw) / 2} y={y0 + OH + 14} text={outerW} accent={isTarget(outerW)} />
      <Label x={x0 - 14} y={y0 + OH / 2} text={outerH} accent={isTarget(outerH)} />
      <Label x={x0 + OW - cw / 2} y={y0 - 8} text={cutW} accent={isTarget(cutW)} />
      <Label x={x0 + OW + 12} y={y0 + ch / 2} text={cutH} accent={isTarget(cutH)} />
    </>
  );
}

function InscribedCircleSquare({ side, radius }: { side: string; radius: string }) {
  const S = 104;
  const x0 = 120 - S / 2;
  const y0 = 80 - S / 2;
  const [cx, cy] = [120, 80];
  const R = S / 2;
  const gap =
    `M ${x0},${y0} h ${S} v ${S} h ${-S} Z ` +
    `M ${cx - R},${cy} a ${R},${R} 0 1,0 ${2 * R},0 a ${R},${R} 0 1,0 ${-2 * R},0 Z`;
  return (
    <>
      <Shade d={gap} />
      <rect x={x0} y={y0} width={S} height={S} {...outline} />
      <circle cx={cx} cy={cy} r={R} {...outline} />
      <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke="currentColor" strokeWidth={STROKE} />
      <Label x={cx + R / 2} y={cy - 9} text={radius} accent={isTarget(radius)} />
      <Label x={120} y={y0 + S + 14} text={side} accent={isTarget(side)} />
      <circle cx={cx} cy={cy} r={2.4} fill="currentColor" />
    </>
  );
}

function Stadium({ w, h, radius }: { w: string; h: string; radius: string }) {
  const x0 = 82;
  const x1 = 158;
  const yTop = 52;
  const yBot = 108;
  const R = (yBot - yTop) / 2;
  const cyc = (yTop + yBot) / 2;
  return (
    <>
      <line x1={x0} y1={yTop} x2={x1} y2={yTop} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcPoints(x0, cyc, R, 90, 270)} {...outline} />
      <polyline points={arcPoints(x1, cyc, R, -90, 90)} {...outline} />
      <Label x={120} y={44} text={w} accent={isTarget(w)} />
      <Label x={120} y={120} text={h} accent={isTarget(h)} />
      <Label x={x0 - 22} y={cyc} text={radius} accent={isTarget(radius)} />
    </>
  );
}

function BorderedRect({ outerW, outerH, border }: { outerW: string; outerH: string; border: string }) {
  const OW = 130;
  const OH = 88;
  const m = 15;
  const x0 = 120 - OW / 2;
  const y0 = 80 - OH / 2;
  return (
    <>
      <rect x={x0} y={y0} width={OW} height={OH} {...outline} />
      <rect x={x0 + m} y={y0 + m} width={OW - 2 * m} height={OH - 2 * m} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      <Label x={120} y={y0 + OH + 14} text={outerW} accent={isTarget(outerW)} />
      <Label x={x0 - 15} y={80} text={outerH} accent={isTarget(outerH)} />
      <Label x={120} y={y0 + m / 2 + 1} text={border} accent={isTarget(border)} />
    </>
  );
}

/* ---------------- coordinate plane ---------------- */

function CoordinatePlane({
  points = [],
  segments = [],
  polygon,
  highlightQuadrant,
  range,
}: {
  points?: { x: number; y: number; label?: string; target?: boolean }[];
  segments?: [[number, number], [number, number]][];
  polygon?: { x: number; y: number }[];
  highlightQuadrant?: 1 | 2 | 3 | 4;
  range?: number;
}) {
  const coords = [
    ...points.map((p) => [p.x, p.y] as const),
    ...segments.flat(),
    ...(polygon ?? []).map((p) => [p.x, p.y] as const),
  ];
  const maxAbs = Math.max(5, ...coords.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))));
  const R = range ?? maxAbs + 1;
  const s = Math.min(102 / R, 62 / R);
  const SX = (x: number) => 120 + x * s;
  const SY = (y: number) => 80 - y * s;
  const grid: number[] = [];
  if (R <= 10) for (let i = -Math.floor(R); i <= Math.floor(R); i++) if (i !== 0) grid.push(i);
  const quad: Record<number, [number, number]> = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };
  return (
    <>
      {highlightQuadrant && (
        <rect
          x={quad[highlightQuadrant][0] > 0 ? 120 : 18}
          y={quad[highlightQuadrant][1] > 0 ? 15 : 80}
          width={102}
          height={65}
          fill="currentColor"
          fillOpacity={0.08}
          stroke="none"
          className="text-primary"
        />
      )}
      {grid.map((i) => (
        <g key={i} className="text-muted-foreground">
          <line x1={SX(i)} y1={15} x2={SX(i)} y2={145} stroke="currentColor" strokeWidth={0.5} opacity={0.4} />
          <line x1={18} y1={SY(i)} x2={222} y2={SY(i)} stroke="currentColor" strokeWidth={0.5} opacity={0.4} />
        </g>
      ))}
      {/* المحاور */}
      <line x1={16} y1={80} x2={224} y2={80} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={120} y1={148} x2={120} y2={12} stroke="currentColor" strokeWidth={STROKE} />
      <polygon points={`224,80 216,76 216,84`} fill="currentColor" />
      <polygon points={`120,12 116,20 124,20`} fill="currentColor" />
      {polygon && (
        <polygon points={polygon.map((p) => `${SX(p.x)},${SY(p.y)}`).join(' ')} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      )}
      {segments.map(([a, b], i) => (
        <g key={i} className="text-primary">
          <line x1={SX(a[0])} y1={SY(a[1])} x2={SX(b[0])} y2={SY(b[1])} stroke="currentColor" strokeWidth={2} />
          <circle cx={SX(a[0])} cy={SY(a[1])} r={2.6} fill="currentColor" />
          <circle cx={SX(b[0])} cy={SY(b[1])} r={2.6} fill="currentColor" />
        </g>
      ))}
      {points.map((p, i) => (
        <g key={i} className={p.target ? 'text-primary' : undefined}>
          <circle cx={SX(p.x)} cy={SY(p.y)} r={3} fill="currentColor" />
          <Label x={SX(p.x) + (p.x < 0 ? -20 : 20)} y={SY(p.y) - 9} text={p.label ?? `(${p.x}, ${p.y})`} accent={p.target} />
        </g>
      ))}
    </>
  );
}

/* ---------------- 3D solids (isometric) ---------------- */

// متجه العمق (للخلف-اليمين) للرسم متساوي القياس.
const DEPTH: [number, number] = [30, -18];

function Solid({ kind, dims, open }: { kind: 'box' | 'cube' | 'triangularPrism' | 'pentagonalPrism'; dims?: string[]; open?: boolean }) {
  if (kind === 'triangularPrism') return <PrismSolid sides={3} />;
  if (kind === 'pentagonalPrism') return <PrismSolid sides={5} />;
  return <BoxSolid dims={dims} open={open} cube={kind === 'cube'} />;
}

function BoxSolid({ dims, open, cube }: { dims?: string[]; open?: boolean; cube?: boolean }) {
  const W = cube ? 64 : 74;
  const H = cube ? 64 : 60;
  const [dx, dy] = DEPTH;
  // الوجه الأمامي (F = أمامي-سفلي-يسار)
  const Fx = 66;
  const Fy = 122;
  const add = (p: [number, number], q: [number, number]): [number, number] => [p[0] + q[0], p[1] + q[1]];
  const FBL: [number, number] = [Fx, Fy];
  const FBR: [number, number] = [Fx + W, Fy];
  const FTL: [number, number] = [Fx, Fy - H];
  const FTR: [number, number] = [Fx + W, Fy - H];
  const BBL = add(FBL, [dx, dy]);
  const BBR = add(FBR, [dx, dy]);
  const BTL = add(FTL, [dx, dy]);
  const BTR = add(FTR, [dx, dy]);
  const faceFill = { fill: 'currentColor', fillOpacity: 0.08, stroke: 'none', className: 'text-muted-foreground' } as const;
  const dimLabels = dims ?? [];
  return (
    <>
      {/* أوجه خفيفة للعمق: العلوي والجانبي */}
      {!open && <polygon points={`${FTL} ${FTR} ${BTR} ${BTL}`} {...faceFill} />}
      <polygon points={`${FTR} ${FBR} ${BBR} ${BTR}`} {...faceFill} />
      {/* الأحرف المخفيّة (من الرأس الخلفي-السفلي-اليسار) */}
      <Dashed x1={BBL[0]} y1={BBL[1]} x2={FBL[0]} y2={FBL[1]} muted />
      <Dashed x1={BBL[0]} y1={BBL[1]} x2={BBR[0]} y2={BBR[1]} muted />
      <Dashed x1={BBL[0]} y1={BBL[1]} x2={BTL[0]} y2={BTL[1]} muted />
      {/* الوجه الأمامي */}
      <polygon points={`${FBL} ${FBR} ${FTR} ${FTL}`} {...outline} />
      {/* الأحرف الظاهرة للخلف */}
      <line x1={FTL[0]} y1={FTL[1]} x2={BTL[0]} y2={BTL[1]} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={FTR[0]} y1={FTR[1]} x2={BTR[0]} y2={BTR[1]} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={FBR[0]} y1={FBR[1]} x2={BBR[0]} y2={BBR[1]} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={BTL[0]} y1={BTL[1]} x2={BTR[0]} y2={BTR[1]} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={BTR[0]} y1={BTR[1]} x2={BBR[0]} y2={BBR[1]} stroke="currentColor" strokeWidth={STROKE} />
      {open && (
        <polygon points={`${FTL} ${FTR} ${BTR} ${BTL}`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="2 2" className="text-muted-foreground" />
      )}
      {/* أبعاد */}
      {dimLabels[0] && <Label x={(FBL[0] + FBR[0]) / 2} y={Fy + 14} text={dimLabels[0]} accent={isTarget(dimLabels[0])} />}
      {dimLabels[1] && <Label x={FBL[0] - 14} y={(FBL[1] + FTL[1]) / 2} text={dimLabels[1]} accent={isTarget(dimLabels[1])} />}
      {dimLabels[2] && <Label x={(FTR[0] + BTR[0]) / 2 + 10} y={(FTR[1] + BTR[1]) / 2 - 8} text={dimLabels[2]} accent={isTarget(dimLabels[2])} />}
    </>
  );
}

function PrismSolid({ sides }: { sides: 3 | 5 }) {
  const [dx, dy] = DEPTH;
  // قاعدة أمامية (مضلّع) ثم نسخة خلفية بإزاحة العمق.
  const cx = 96;
  const cy = 88;
  const r = sides === 3 ? 46 : 40;
  const startDeg = 90; // رأس للأعلى
  const front: [number, number][] = Array.from({ length: sides }, (_, i) => polar(cx, cy, r, startDeg + (360 * i) / sides));
  const back: [number, number][] = front.map((p) => [p[0] + dx, p[1] + dy]);
  return (
    <>
      <polygon points={back.map((p) => p.join(',')).join(' ')} fill="currentColor" fillOpacity={0.08} stroke="currentColor" strokeWidth={STROKE} className="text-muted-foreground" />
      {front.map((p, i) => (
        <line key={i} x1={p[0]} y1={p[1]} x2={back[i][0]} y2={back[i][1]} stroke="currentColor" strokeWidth={STROKE} />
      ))}
      <polygon points={front.map((p) => p.join(',')).join(' ')} {...outline} />
    </>
  );
}

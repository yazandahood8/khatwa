'use client';

import type { FigureSpec, TransversalPos } from '@khatwa/shared';
import { cn } from '@/lib/utils';

/**
 * يرسم مخطط سؤال كـ SVG تعريفي (رياضيات) أو كتلة HTML (مثال/مصفوفة لعلوم الحاسوب).
 * مخطط تخطيطي للتوضيح؛ الألوان من الثيم (text-foreground / text-primary).
 */
export function ProblemFigure({ spec }: { spec: FigureSpec }) {
  // مخططات علوم الحاسوب تُعرض كـ HTML (نصّ أحادي المسافة / خلايا) لا كـ SVG.
  if (spec.type === 'ioExample')
    return <IoExample input={spec.input} output={spec.output} note={spec.note} />;
  if (spec.type === 'arrayCells')
    return <ArrayCells values={spec.values} showIndices={spec.showIndices} highlight={spec.highlight} caption={spec.caption} />;
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

/* ---------------- CS: example & array (HTML) ---------------- */

function IoExample({ input, output, note }: { input?: string; output: string; note?: string }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">مثال</p>
      {input != null && input !== '' && (
        <div className="mb-1.5 text-sm">
          <span className="text-muted-foreground">المدخل: </span>
          <code dir="ltr" className="font-mono">{input}</code>
        </div>
      )}
      <div className="text-xs text-muted-foreground">الناتج:</div>
      <pre dir="auto" className="mt-1 overflow-x-auto rounded-md bg-card p-2 font-mono text-[13px] leading-snug text-foreground">
        {output}
      </pre>
      {note != null && note !== '' && <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function ArrayCells({ values, showIndices = true, highlight, caption }: { values: string[]; showIndices?: boolean; highlight?: number[]; caption?: string }) {
  const hi = new Set(highlight ?? []);
  return (
    <div className="mt-4">
      {caption != null && caption !== '' && <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{caption}</p>}
      <div dir="ltr" className="flex gap-1 overflow-x-auto pb-1">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={cn('flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2 font-mono text-sm', hi.has(i) ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-border bg-card text-foreground')}>
              {v}
            </div>
            {showIndices && <span className="mt-1 font-mono text-[10px] text-muted-foreground">{i}</span>}
          </div>
        ))}
      </div>
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
      return <Rect w={spec.w} h={spec.h} square={spec.square} diagonal={spec.diagonal} />;
    case 'triangleBaseHeight':
      return <TriangleBaseHeight base={spec.base} height={spec.height} />;
    case 'rightTriangle':
      return <RightTriangle legs={spec.legs} hyp={spec.hyp} squares={spec.squares} altitude={spec.altitude} />;
    case 'parallelogram':
      return <Parallelogram base={spec.base} height={spec.height} angle={spec.angle} diagonal={spec.diagonal} />;
    case 'trapezoid':
      return <Trapezoid base1={spec.base1} base2={spec.base2} height={spec.height} leg={spec.leg} mid={spec.mid} />;
    case 'similarTriangles':
      return <SimilarTriangles a={spec.a} b={spec.b} right={spec.right} />;
    case 'triangleParallelLine':
      return <TriangleParallelLine ad={spec.ad} db={spec.db} de={spec.de} bc={spec.bc} />;
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
          lines={spec.lines}
          intersection={spec.intersection}
          vector={spec.vector}
          mapped={spec.mapped}
          mappedPolygon={spec.mappedPolygon}
          reflectAxis={spec.reflectAxis}
          rotationDeg={spec.rotationDeg}
          parabolas={spec.parabolas}
          verticalLines={spec.verticalLines}
        />
      );
    case 'numberLine':
      return <NumberLine min={spec.min} max={spec.max} rays={spec.rays} segment={spec.segment} points={spec.points} ticks={spec.ticks} />;
    case 'congruentTriangles':
      return <CongruentTriangles marks={spec.marks} criterion={spec.criterion} />;
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

function Rect({ w, h, square, diagonal }: { w: string; h: string; square?: boolean; diagonal?: string }) {
  const cw = square ? 86 : 122;
  const ch = square ? 86 : 74;
  const x0 = 120 - cw / 2;
  const y0 = 80 - ch / 2;
  return (
    <>
      <rect x={x0} y={y0} width={cw} height={ch} {...outline} />
      {diagonal != null && (
        <line x1={x0} y1={y0 + ch} x2={x0 + cw} y2={y0} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      )}
      {diagonal != null && (
        <Label x={120} y={80 - 8} text={diagonal} accent={isTarget(diagonal)} />
      )}
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

function RightTriangle({
  legs,
  hyp,
  squares,
  altitude,
}: {
  legs: [string, string];
  hyp?: string;
  squares?: boolean;
  altitude?: { seg1: string; seg2: string; h: string };
}) {
  if (altitude) return <RightTriangleAltitude seg1={altitude.seg1} seg2={altitude.seg2} h={altitude.h} />;
  // مع squares نُصغّر المثلث لإفساح المجال للمربّعات على الأضلاع.
  const A: [number, number] = squares ? [110, 86] : [60, 122]; // الزاوية القائمة
  const B: [number, number] = squares ? [150, 86] : [186, 122];
  const C: [number, number] = squares ? [110, 50] : [60, 46];
  return (
    <>
      {squares && <PythSquares A={A} B={B} C={C} legs={legs} hyp={hyp} />}
      <polygon points={`${A} ${B} ${C}`} {...outline} />
      <RightAngleBox x={A[0]} y={A[1]} dx={1} dy={-1} />
      {!squares && (
        <>
          <Label x={(A[0] + B[0]) / 2} y={136} text={legs[0]} accent={isTarget(legs[0])} />
          <Label x={A[0] - 15} y={(A[1] + C[1]) / 2} text={legs[1]} accent={isTarget(legs[1])} />
          {hyp && <Label x={(B[0] + C[0]) / 2 + 20} y={(B[1] + C[1]) / 2 - 4} text={hyp} accent={isTarget(hyp)} />}
        </>
      )}
    </>
  );
}

/** مربّعات على أضلاع المثلث القائم لتفسير a²+b²=c². */
function PythSquares({
  A,
  B,
  C,
  legs,
  hyp,
}: {
  A: [number, number];
  B: [number, number];
  C: [number, number];
  legs: [string, string];
  hyp?: string;
}) {
  // مربّع للخارج على قطعة P→Q، بعيداً عن الرأس المقابل T.
  const sq = (P: [number, number], Q: [number, number], T: [number, number]) => {
    const dx = Q[0] - P[0];
    const dy = Q[1] - P[1];
    let nx = dy;
    let ny = -dx;
    const mx = (P[0] + Q[0]) / 2;
    const my = (P[1] + Q[1]) / 2;
    if ((T[0] - mx) * nx + (T[1] - my) * ny > 0) {
      nx = -nx;
      ny = -ny;
    }
    const p3: [number, number] = [Q[0] + nx, Q[1] + ny];
    const p4: [number, number] = [P[0] + nx, P[1] + ny];
    const cen: [number, number] = [(P[0] + Q[0] + p3[0] + p4[0]) / 4, (P[1] + Q[1] + p3[1] + p4[1]) / 4];
    return { pts: `${P} ${Q} ${p3} ${p4}`, cen };
  };
  const base = sq(A, B, C); // مربّع على الضلع القائم الأفقي
  const left = sq(C, A, B); // مربّع على الضلع القائم الرأسي
  const hypSq = sq(B, C, A); // مربّع على الوتر للخارج
  const faint = { fill: 'currentColor', fillOpacity: 0.08, stroke: 'currentColor', strokeWidth: STROKE, className: 'text-muted-foreground' } as const;
  const acc = { fill: 'currentColor', fillOpacity: 0.1, stroke: 'currentColor', strokeWidth: STROKE, className: 'text-primary' } as const;
  return (
    <>
      <polygon points={base.pts} {...faint} />
      <polygon points={left.pts} {...faint} />
      <polygon points={hypSq.pts} {...acc} />
      <Label x={base.cen[0]} y={base.cen[1]} text={legs[0]} accent={isTarget(legs[0])} />
      <Label x={left.cen[0]} y={left.cen[1]} text={legs[1]} accent={isTarget(legs[1])} />
      {hyp && <Label x={hypSq.cen[0]} y={hypSq.cen[1]} text={hyp} accent />}
    </>
  );
}

/** مثلث قائم مع الارتفاع على الوتر (المتوسط الهندسي): الوتر أفقي والرأس القائم فوق القدم. */
function RightTriangleAltitude({ seg1, seg2, h }: { seg1: string; seg2: string; h: string }) {
  const A: [number, number] = [40, 120]; // يسار الوتر
  const B: [number, number] = [200, 120]; // يمين الوتر
  // قدم الارتفاع D تقسم الوتر بنسبة seg1:seg2 (تخطيطي، وإلا المنتصف)
  const r1 = num(seg1, 1);
  const r2 = num(seg2, 1);
  const t = r1 + r2 > 0 ? r1 / (r1 + r2) : 0.5;
  const D: [number, number] = [A[0] + (B[0] - A[0]) * t, 120];
  const apexY = 46;
  const C: [number, number] = [D[0], apexY]; // الزاوية القائمة فوق القدم
  return (
    <>
      <polygon points={`${A} ${B} ${C}`} {...outline} />
      <Dashed x1={C[0]} y1={C[1]} x2={D[0]} y2={D[1]} muted />
      <RightAngleBox x={C[0]} y={C[1]} dx={-1} dy={1} />
      <RightAngleBox x={D[0]} y={D[1]} dx={1} dy={-1} />
      <Label x={(A[0] + D[0]) / 2} y={134} text={seg1} accent={isTarget(seg1)} />
      <Label x={(D[0] + B[0]) / 2} y={134} text={seg2} accent={isTarget(seg2)} />
      <Label x={D[0] + 14} y={(apexY + 120) / 2} text={h} accent={isTarget(h)} />
    </>
  );
}

function Parallelogram({ base, height, angle, diagonal }: { base?: string; height?: string; angle?: string; diagonal?: boolean }) {
  const bl: [number, number] = [55, 120];
  const br: [number, number] = [175, 120];
  const tr: [number, number] = [205, 50];
  const tl: [number, number] = [85, 50];
  return (
    <>
      <polygon points={[bl, br, tr, tl].map((p) => p.join(',')).join(' ')} {...outline} />
      {diagonal && <line x1={bl[0]} y1={bl[1]} x2={tr[0]} y2={tr[1]} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />}
      {height != null && (
        <>
          <Dashed x1={110} y1={50} x2={110} y2={120} muted />
          <RightAngleBox x={110} y={120} dx={1} dy={-1} />
          <Label x={124} y={86} text={height} accent={isTarget(height)} />
        </>
      )}
      {base != null && <Label x={115} y={134} text={base} accent={isTarget(base)} />}
      {angle != null && (
        <>
          <Arc cx={bl[0]} cy={bl[1]} r={20} a0={0} a1={60} />
          <Label x={bl[0] + 30} y={bl[1] - 11} text={angle} accent={isTarget(angle)} />
        </>
      )}
    </>
  );
}

function Trapezoid({ base1, base2, height, leg, mid }: { base1: string; base2: string; height?: string; leg?: string; mid?: string }) {
  const bl: [number, number] = [45, 120];
  const br: [number, number] = [195, 120];
  const tr: [number, number] = [155, 52];
  const tl: [number, number] = [85, 52];
  return (
    <>
      <polygon points={[bl, br, tr, tl].map((p) => p.join(',')).join(' ')} {...outline} />
      {height != null && (
        <>
          <Dashed x1={85} y1={52} x2={85} y2={120} muted />
          <RightAngleBox x={85} y={120} dx={1} dy={-1} />
          <Label x={99} y={86} text={height} accent={isTarget(height)} />
        </>
      )}
      {mid != null && (
        <>
          <line x1={(bl[0] + tl[0]) / 2} y1={86} x2={(br[0] + tr[0]) / 2} y2={86} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
          <Label x={120} y={78} text={mid} accent={isTarget(mid)} />
        </>
      )}
      {leg != null && <Label x={(br[0] + tr[0]) / 2 + 12} y={86} text={leg} accent={isTarget(leg)} />}
      <Label x={120} y={134} text={base1} accent={isTarget(base1)} />
      <Label x={120} y={42} text={base2} accent={isTarget(base2)} />
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

/* ---------------- similarity (grade 9) ---------------- */

/** مثلثان متشابهان (قائمان) بأحجام مختلفة، مع علامة زاوية متساوية. */
function SimilarTriangles({ a, b, right }: { a: [string, string, string?]; b: [string, string, string?]; right?: boolean }) {
  const tri = (ox: number, oy: number, bw: number, bh: number, s: [string, string, string?]) => {
    // مثلث قائم: الزاوية القائمة أسفل-اليسار
    const A: [number, number] = [ox, oy];
    const B: [number, number] = [ox + bw, oy];
    const C: [number, number] = [ox, oy - bh];
    return (
      <g>
        <polygon points={`${A} ${B} ${C}`} {...outline} />
        {right && <RightAngleBox x={A[0]} y={A[1]} dx={1} dy={-1} />}
        <Arc cx={B[0]} cy={B[1]} r={15} a0={180 - Math.round((Math.atan2(bh, bw) * 180) / Math.PI)} a1={180} accent />
        <Label x={(A[0] + B[0]) / 2} y={oy + 13} text={s[0]} accent={isTarget(s[0])} />
        <Label x={A[0] - 13} y={oy - bh / 2} text={s[1]} accent={isTarget(s[1])} />
        {s[2] && <Label x={(B[0] + C[0]) / 2 + 12} y={(B[1] + C[1]) / 2 - 6} text={s[2]} accent={isTarget(s[2])} />}
      </g>
    );
  };
  return (
    <>
      {tri(40, 118, 44, 34, a)}
      {tri(130, 122, 78, 60, b)}
    </>
  );
}

/** نظرية طاليس: مثلث ABC وقطعة DE ∥ BC. */
function TriangleParallelLine({ ad, db, de, bc }: { ad: string; db: string; de: string; bc: string }) {
  const A: [number, number] = [120, 30];
  const B: [number, number] = [52, 128];
  const C: [number, number] = [200, 128];
  const t = 0.42; // موقع D,E على الضلعين (تخطيطي)
  const D: [number, number] = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
  const E: [number, number] = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
  return (
    <>
      <polygon points={`${A} ${B} ${C}`} {...outline} />
      <line x1={D[0]} y1={D[1]} x2={E[0]} y2={E[1]} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      {[A, B, C, D, E].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2} fill="currentColor" />
      ))}
      <Label x={A[0]} y={A[1] - 8} text="A" />
      <Label x={B[0] - 8} y={B[1] + 8} text="B" />
      <Label x={C[0] + 8} y={C[1] + 8} text="C" />
      <Label x={(A[0] + D[0]) / 2 - 10} y={(A[1] + D[1]) / 2} text={ad} accent={isTarget(ad)} />
      <Label x={(D[0] + B[0]) / 2 - 10} y={(D[1] + B[1]) / 2} text={db} accent={isTarget(db)} />
      <Label x={(D[0] + E[0]) / 2} y={(D[1] + E[1]) / 2 - 8} text={de} accent={isTarget(de)} />
      <Label x={(B[0] + C[0]) / 2} y={(B[1] + C[1]) / 2 + 13} text={bc} accent={isTarget(bc)} />
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

/** قصّ قطعة إلى مستطيل الرسم (Liang–Barsky) في إحداثيات الشاشة. */
function clipSeg(x1: number, y1: number, x2: number, y2: number): [number, number, number, number] | null {
  const xmin = 16, xmax = 224, ymin = 12, ymax = 148;
  const dx = x2 - x1, dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - xmin, xmax - x1, y1 - ymin, ymax - y1];
  let t0 = 0, t1 = 1;
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return null;
    } else {
      const r = q[i] / p[i];
      if (p[i] < 0) {
        if (r > t1) return null;
        if (r > t0) t0 = r;
      } else {
        if (r < t0) return null;
        if (r < t1) t1 = r;
      }
    }
  }
  return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
}

function Arrow({ x1, y1, x2, y2, accent, dashed }: { x1: number; y1: number; x2: number; y2: number; accent?: boolean; dashed?: boolean }) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 6;
  const a1 = ang + Math.PI - 0.4;
  const a2 = ang + Math.PI + 0.4;
  return (
    <g className={accent ? 'text-primary' : undefined}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={STROKE} strokeDasharray={dashed ? '3 3' : undefined} />
      <polygon points={`${x2},${y2} ${x2 + h * Math.cos(a1)},${y2 + h * Math.sin(a1)} ${x2 + h * Math.cos(a2)},${y2 + h * Math.sin(a2)}`} fill="currentColor" />
    </g>
  );
}

function CoordinatePlane({
  points = [],
  segments = [],
  polygon,
  highlightQuadrant,
  range,
  lines = [],
  intersection,
  vector,
  mapped = [],
  mappedPolygon,
  reflectAxis,
  rotationDeg,
  parabolas = [],
  verticalLines = [],
}: {
  points?: { x: number; y: number; label?: string; target?: boolean }[];
  segments?: [[number, number], [number, number]][];
  polygon?: { x: number; y: number }[];
  highlightQuadrant?: 1 | 2 | 3 | 4;
  range?: number;
  lines?: { m?: number; b?: number; p1?: [number, number]; p2?: [number, number]; dashed?: boolean; accent?: boolean }[];
  intersection?: { x: number; y: number };
  vector?: { from: [number, number]; d: [number, number] };
  mapped?: { x: number; y: number; label?: string }[];
  mappedPolygon?: { x: number; y: number }[];
  reflectAxis?: 'x' | 'y';
  rotationDeg?: number;
  parabolas?: { a: number; b?: number; c?: number; dashed?: boolean; accent?: boolean }[];
  verticalLines?: number[];
}) {
  const coords = [
    ...points.map((p) => [p.x, p.y] as const),
    ...segments.flat(),
    ...(polygon ?? []).map((p) => [p.x, p.y] as const),
    ...mapped.map((p) => [p.x, p.y] as const),
    ...(mappedPolygon ?? []).map((p) => [p.x, p.y] as const),
    ...(intersection ? [[intersection.x, intersection.y] as const] : []),
    ...(vector ? [vector.from, [vector.from[0] + vector.d[0], vector.from[1] + vector.d[1]] as const] : []),
  ];
  const maxAbs = Math.max(5, ...coords.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y))));
  const R = range ?? maxAbs + 1;
  const s = Math.min(102 / R, 62 / R);
  const SX = (x: number) => 120 + x * s;
  const SY = (y: number) => 80 - y * s;
  const grid: number[] = [];
  if (R <= 12) for (let i = -Math.floor(R); i <= Math.floor(R); i++) if (i !== 0) grid.push(i);
  const quad: Record<number, [number, number]> = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };

  // نقطتا كل خطّ في إحداثيات الشاشة ثم القصّ.
  const lineSeg = (ln: { m?: number; b?: number; p1?: [number, number]; p2?: [number, number] }) => {
    let a: [number, number], b: [number, number];
    if (ln.p1 && ln.p2) {
      a = ln.p1;
      b = ln.p2;
      if (a[0] === b[0]) return clipSeg(SX(a[0]), SY(-R - 2), SX(a[0]), SY(R + 2)); // رأسي
    } else {
      const m = ln.m ?? 0;
      const bb = ln.b ?? 0;
      a = [-R - 2, m * (-R - 2) + bb];
      b = [R + 2, m * (R + 2) + bb];
    }
    return clipSeg(SX(a[0]), SY(a[1]), SX(b[0]), SY(b[1]));
  };

  // عيّنات القطع المكافئ مقصوصة إلى مستطيل الرسم (قطع متعدّدة عند الخروج).
  const paraSegs = (p: { a: number; b?: number; c?: number }) => {
    const a = p.a, b = p.b ?? 0, c = p.c ?? 0;
    const segs: string[] = [];
    let cur: string[] = [];
    const xmin = -R - 1, xmax = R + 1;
    const step = (xmax - xmin) / 90;
    for (let x = xmin; x <= xmax + 1e-9; x += step) {
      const sx = SX(x), sy = SY(a * x * x + b * x + c);
      if (sx >= 16 && sx <= 224 && sy >= 12 && sy <= 148) cur.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
      else {
        if (cur.length > 1) segs.push(cur.join(' '));
        cur = [];
      }
    }
    if (cur.length > 1) segs.push(cur.join(' '));
    return segs;
  };

  return (
    <>
      {highlightQuadrant && (
        <rect x={quad[highlightQuadrant][0] > 0 ? 120 : 18} y={quad[highlightQuadrant][1] > 0 ? 15 : 80} width={102} height={65} fill="currentColor" fillOpacity={0.08} stroke="none" className="text-primary" />
      )}
      {grid.map((i) => (
        <g key={i} className="text-muted-foreground">
          <line x1={SX(i)} y1={15} x2={SX(i)} y2={145} stroke="currentColor" strokeWidth={0.5} opacity={0.4} />
          <line x1={18} y1={SY(i)} x2={222} y2={SY(i)} stroke="currentColor" strokeWidth={0.5} opacity={0.4} />
        </g>
      ))}
      {/* محور انعكاس مبرَز */}
      {reflectAxis === 'x' && <line x1={16} y1={80} x2={224} y2={80} stroke="currentColor" strokeWidth={2.4} className="text-primary" />}
      {reflectAxis === 'y' && <line x1={120} y1={148} x2={120} y2={12} stroke="currentColor" strokeWidth={2.4} className="text-primary" />}
      {/* المحاور */}
      <line x1={16} y1={80} x2={224} y2={80} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={120} y1={148} x2={120} y2={12} stroke="currentColor" strokeWidth={STROKE} />
      <polygon points={`224,80 216,76 216,84`} fill="currentColor" />
      <polygon points={`120,12 116,20 124,20`} fill="currentColor" />
      {/* محاور التماثل (رأسية متقطّعة) */}
      {verticalLines.map((vx, i) => {
        const seg = clipSeg(SX(vx), SY(R + 2), SX(vx), SY(-R - 2));
        return seg ? <line key={`vl${i}`} x1={seg[0]} y1={seg[1]} x2={seg[2]} y2={seg[3]} stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" /> : null;
      })}
      {/* خطوط y=mx+b */}
      {lines.map((ln, i) => {
        const seg = lineSeg(ln);
        if (!seg) return null;
        return <line key={`ln${i}`} x1={seg[0]} y1={seg[1]} x2={seg[2]} y2={seg[3]} stroke="currentColor" strokeWidth={2} strokeDasharray={ln.dashed ? '4 3' : undefined} className={ln.accent ? 'text-primary' : undefined} />;
      })}
      {/* قطوع مكافئة */}
      {parabolas.map((p, i) =>
        paraSegs(p).map((pts, j) => (
          <polyline key={`pa${i}-${j}`} points={pts} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray={p.dashed ? '4 3' : undefined} className={p.accent ? 'text-primary' : undefined} />
        )),
      )}
      {polygon && <polygon points={polygon.map((p) => `${SX(p.x)},${SY(p.y)}`).join(' ')} fill="currentColor" fillOpacity={0.1} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />}
      {mappedPolygon && <polygon points={mappedPolygon.map((p) => `${SX(p.x)},${SY(p.y)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="4 3" className="text-primary" />}
      {segments.map(([a, b], i) => (
        <g key={`sg${i}`} className="text-primary">
          <line x1={SX(a[0])} y1={SY(a[1])} x2={SX(b[0])} y2={SY(b[1])} stroke="currentColor" strokeWidth={2} />
          <circle cx={SX(a[0])} cy={SY(a[1])} r={2.6} fill="currentColor" />
          <circle cx={SX(b[0])} cy={SY(b[1])} r={2.6} fill="currentColor" />
        </g>
      ))}
      {/* سهم انسحاب */}
      {vector && <Arrow x1={SX(vector.from[0])} y1={SY(vector.from[1])} x2={SX(vector.from[0] + vector.d[0])} y2={SY(vector.from[1] + vector.d[1])} accent />}
      {/* روابط من الأصل إلى الصورة */}
      {mapped.map((mp, i) =>
        points[i] ? <Arrow key={`mc${i}`} x1={SX(points[i].x)} y1={SY(points[i].y)} x2={SX(mp.x)} y2={SY(mp.y)} accent dashed /> : null,
      )}
      {/* قوس دوران */}
      {rotationDeg != null && (
        <g className="text-primary">
          <polyline points={arcPoints(120, 80, 24, 0, rotationDeg)} fill="none" stroke="currentColor" strokeWidth={STROKE} />
          <Label x={polar(120, 80, 34, rotationDeg / 2)[0]} y={polar(120, 80, 34, rotationDeg / 2)[1]} text={`${rotationDeg}°`} accent />
        </g>
      )}
      {intersection && (
        <g className="text-primary">
          <circle cx={SX(intersection.x)} cy={SY(intersection.y)} r={3.4} fill="currentColor" />
          <Label x={SX(intersection.x) + 22} y={SY(intersection.y) - 9} text={`(${intersection.x}, ${intersection.y})`} accent />
        </g>
      )}
      {mapped.map((mp, i) => (
        <g key={`mp${i}`} className="text-primary">
          <circle cx={SX(mp.x)} cy={SY(mp.y)} r={3} fill="none" stroke="currentColor" strokeWidth={STROKE} />
          <Label x={SX(mp.x) + (mp.x < 0 ? -20 : 20)} y={SY(mp.y) - 9} text={mp.label ?? `(${mp.x}, ${mp.y})`} accent />
        </g>
      ))}
      {points.map((p, i) => (
        <g key={`pt${i}`} className={p.target ? 'text-primary' : undefined}>
          <circle cx={SX(p.x)} cy={SY(p.y)} r={3} fill="currentColor" />
          <Label x={SX(p.x) + (p.x < 0 ? -20 : 20)} y={SY(p.y) + (p.y < 0 ? 12 : -9)} text={p.label ?? `(${p.x}, ${p.y})`} accent={p.target} />
        </g>
      ))}
    </>
  );
}

/* ---------------- 3D solids (isometric) ---------------- */

// متجه العمق (للخلف-اليمين) للرسم متساوي القياس.
const DEPTH: [number, number] = [30, -18];

function Solid({
  kind,
  dims,
  open,
}: {
  kind: 'box' | 'cube' | 'triangularPrism' | 'pentagonalPrism' | 'cylinder' | 'cone' | 'cylinderCone' | 'coneInCylinder';
  dims?: string[];
  open?: boolean;
}) {
  if (kind === 'triangularPrism') return <PrismSolid sides={3} />;
  if (kind === 'pentagonalPrism') return <PrismSolid sides={5} />;
  if (kind === 'cylinder') return <CylinderSolid dims={dims} open={open} />;
  if (kind === 'cone') return <ConeSolid dims={dims} />;
  if (kind === 'cylinderCone') return <CylinderConeSolid dims={dims} />;
  if (kind === 'coneInCylinder') return <ConeInCylinderSolid dims={dims} />;
  return <BoxSolid dims={dims} open={open} cube={kind === 'cube'} />;
}

/* ---------------- cylinder & cone ---------------- */

const ELL_RY = 12; // نصف ارتفاع القطع الناقص (منظور القاعدة الدائرية)

/** قطع ناقص كمسار (قاعدة أسطوانة/مخروط بمنظور). */
function ellipsePath(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx},${cy} a ${rx},${ry} 0 1,0 ${2 * rx},0 a ${rx},${ry} 0 1,0 ${-2 * rx},0 Z`;
}

function CylinderSolid({ dims = [], open }: { dims?: string[]; open?: boolean }) {
  const rx = 40;
  const ry = ELL_RY;
  const cx = 108;
  const topY = 44;
  const botY = 122;
  const [rLabel, hLabel] = dims;
  return (
    <>
      {/* جانب */}
      <line x1={cx - rx} y1={topY} x2={cx - rx} y2={botY} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx + rx} y1={topY} x2={cx + rx} y2={botY} stroke="currentColor" strokeWidth={STROKE} />
      {/* قاعدة سفلى: نصف أمامي ظاهر ونصف خلفي متقطّع */}
      <polyline points={arcEllipse(cx, botY, rx, ry, 0, 180)} fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, botY, rx, ry, 180, 360)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
      {/* قمّة: بيضاوي كامل (مفتوحة = حلقة فقط) */}
      <path d={ellipsePath(cx, topY, rx, ry)} fill={open ? 'none' : 'currentColor'} fillOpacity={open ? 0 : 0.08} stroke="currentColor" strokeWidth={STROKE} className={open ? undefined : 'text-muted-foreground'} />
      {open && <path d={ellipsePath(cx, topY, rx * 0.72, ry * 0.72)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="2 2" className="text-muted-foreground" />}
      {/* نصف قطر + ارتفاع */}
      <line x1={cx} y1={topY} x2={cx + rx} y2={topY} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      {rLabel && <Label x={cx + rx / 2} y={topY - 8} text={rLabel} accent={isTarget(rLabel)} />}
      {hLabel && <Label x={cx + rx + 16} y={(topY + botY) / 2} text={hLabel} accent={isTarget(hLabel)} />}
      {hLabel && <Dashed x1={cx + rx + 4} y1={topY} x2={cx + rx + 4} y2={botY} muted />}
    </>
  );
}

/** نقاط قوس بيضاوي (زاوية بالدرجات؛ y للأسفل موجب). */
function arcEllipse(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): string {
  const step = 6;
  const pts: string[] = [];
  const dir = a1 >= a0 ? 1 : -1;
  for (let a = a0; dir > 0 ? a <= a1 : a >= a1; a += dir * step)
    pts.push(`${cx + rx * Math.cos(rad(a))},${cy + ry * Math.sin(rad(a))}`);
  pts.push(`${cx + rx * Math.cos(rad(a1))},${cy + ry * Math.sin(rad(a1))}`);
  return pts.join(' ');
}

function ConeSolid({ dims = [] }: { dims?: string[] }) {
  const rx = 42;
  const ry = ELL_RY;
  const cx = 108;
  const baseY = 120;
  const apexY = 40;
  const [rLabel, hLabel, slantLabel] = dims;
  return (
    <>
      {/* القاعدة: أمامي ظاهر وخلفي متقطّع */}
      <polyline points={arcEllipse(cx, baseY, rx, ry, 0, 180)} fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, baseY, rx, ry, 180, 360)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
      {/* المولّدان */}
      <line x1={cx - rx} y1={baseY} x2={cx} y2={apexY} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx + rx} y1={baseY} x2={cx} y2={apexY} stroke="currentColor" strokeWidth={STROKE} />
      {/* ارتفاع متقطّع */}
      <Dashed x1={cx} y1={apexY} x2={cx} y2={baseY} muted />
      {/* نصف قطر */}
      <line x1={cx} y1={baseY} x2={cx + rx} y2={baseY} stroke="currentColor" strokeWidth={STROKE} className="text-primary" />
      {rLabel && <Label x={cx + rx / 2} y={baseY + 13} text={rLabel} accent={isTarget(rLabel)} />}
      {hLabel && <Label x={cx - 12} y={(apexY + baseY) / 2} text={hLabel} accent={isTarget(hLabel)} />}
      {slantLabel && <Label x={(cx + rx / 2) + 12} y={(apexY + baseY) / 2 - 6} text={slantLabel} accent={isTarget(slantLabel)} />}
    </>
  );
}

function CylinderConeSolid({ dims = [] }: { dims?: string[] }) {
  const rx = 36;
  const ry = 10;
  const cx = 108;
  const cylTop = 92;
  const cylBot = 132;
  const apexY = 34;
  const [rLabel, hLabel] = dims;
  return (
    <>
      {/* أسطوانة */}
      <line x1={cx - rx} y1={cylTop} x2={cx - rx} y2={cylBot} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx + rx} y1={cylTop} x2={cx + rx} y2={cylBot} stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, cylBot, rx, ry, 0, 180)} fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, cylBot, rx, ry, 180, 360)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
      {/* مخروط فوقها */}
      <line x1={cx - rx} y1={cylTop} x2={cx} y2={apexY} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx + rx} y1={cylTop} x2={cx} y2={apexY} stroke="currentColor" strokeWidth={STROKE} />
      <path d={ellipsePath(cx, cylTop, rx, ry)} fill="none" stroke="currentColor" strokeWidth={STROKE} className="text-muted-foreground" />
      {rLabel && <Label x={cx + rx + 14} y={cylTop - 6} text={rLabel} accent={isTarget(rLabel)} />}
      {hLabel && <Label x={cx + rx + 16} y={(cylTop + cylBot) / 2} text={hLabel} accent={isTarget(hLabel)} />}
    </>
  );
}

function ConeInCylinderSolid({ dims = [] }: { dims?: string[] }) {
  const rx = 40;
  const ry = 12;
  const cx = 108;
  const topY = 46;
  const botY = 124;
  const [rLabel, hLabel] = dims;
  return (
    <>
      <line x1={cx - rx} y1={topY} x2={cx - rx} y2={botY} stroke="currentColor" strokeWidth={STROKE} />
      <line x1={cx + rx} y1={topY} x2={cx + rx} y2={botY} stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, botY, rx, ry, 0, 180)} fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <polyline points={arcEllipse(cx, botY, rx, ry, 180, 360)} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeDasharray="3 3" className="text-muted-foreground" />
      <path d={ellipsePath(cx, topY, rx, ry)} fill="currentColor" fillOpacity={0.06} stroke="currentColor" strokeWidth={STROKE} className="text-muted-foreground" />
      {/* مخروط داخلي (متقطّع مبرَز) قمّته بمركز القمّة */}
      <line x1={cx - rx} y1={botY} x2={cx} y2={topY} stroke="currentColor" strokeWidth={STROKE} strokeDasharray="4 3" className="text-primary" />
      <line x1={cx + rx} y1={botY} x2={cx} y2={topY} stroke="currentColor" strokeWidth={STROKE} strokeDasharray="4 3" className="text-primary" />
      {rLabel && <Label x={cx + rx / 2} y={topY - 8} text={rLabel} accent={isTarget(rLabel)} />}
      {hLabel && <Label x={cx + rx + 16} y={(topY + botY) / 2} text={hLabel} accent={isTarget(hLabel)} />}
    </>
  );
}

/* ---------------- number line ---------------- */

function NumberLine({
  min,
  max,
  rays = [],
  segment,
  points = [],
  ticks,
}: {
  min: number;
  max: number;
  rays?: { at: number; dir: 'left' | 'right'; closed: boolean }[];
  segment?: { from: number; to: number; closedFrom: boolean; closedTo: boolean };
  points?: { at: number; label?: string; closed?: boolean }[];
  ticks?: number[];
}) {
  const x0 = 20, x1 = 220, y = 84;
  const SX = (v: number) => x0 + ((v - min) / (max - min)) * (x1 - x0);
  const tickVals = ticks ?? Array.from({ length: Math.floor(max) - Math.ceil(min) + 1 }, (_, i) => Math.ceil(min) + i);
  const dot = (v: number, closed: boolean, accent = true) =>
    closed ? (
      <circle cx={SX(v)} cy={y} r={4} fill="currentColor" className={accent ? 'text-primary' : undefined} />
    ) : (
      <circle cx={SX(v)} cy={y} r={4} fill="var(--bg, #fff)" stroke="currentColor" strokeWidth={STROKE} className={accent ? 'text-primary' : undefined} />
    );
  return (
    <>
      <line x1={12} y1={y} x2={228} y2={y} stroke="currentColor" strokeWidth={STROKE} />
      <polygon points={`228,${y} 220,${y - 4} 220,${y + 4}`} fill="currentColor" />
      <polygon points={`12,${y} 20,${y - 4} 20,${y + 4}`} fill="currentColor" />
      {tickVals.map((v) => (
        <g key={v}>
          <line x1={SX(v)} y1={y - 4} x2={SX(v)} y2={y + 4} stroke="currentColor" strokeWidth={STROKE} />
          <Label x={SX(v)} y={y + 16} text={String(v)} />
        </g>
      ))}
      {rays.map((r, i) => (
        <g key={`r${i}`} className="text-primary">
          <line x1={SX(r.at)} y1={y} x2={r.dir === 'right' ? x1 : x0} y2={y} stroke="currentColor" strokeWidth={3} />
          {dot(r.at, r.closed)}
        </g>
      ))}
      {segment && (
        <g className="text-primary">
          <line x1={SX(segment.from)} y1={y} x2={SX(segment.to)} y2={y} stroke="currentColor" strokeWidth={3} />
          {dot(segment.from, segment.closedFrom)}
          {dot(segment.to, segment.closedTo)}
        </g>
      )}
      {points.map((p, i) => (
        <g key={`p${i}`}>
          {dot(p.at, p.closed ?? true)}
          {p.label && <Label x={SX(p.at)} y={y - 12} text={p.label} accent />}
        </g>
      ))}
    </>
  );
}

/* ---------------- congruent triangles ---------------- */

function CongruentTriangles({
  marks,
  criterion,
}: {
  marks?: { sides?: [0 | 1 | 2 | 3, 0 | 1 | 2 | 3, 0 | 1 | 2 | 3]; angles?: [0 | 1 | 2, 0 | 1 | 2, 0 | 1 | 2] };
  criterion?: string;
}) {
  const sideMarks = marks?.sides ?? [0, 0, 0];
  const angleMarks = marks?.angles ?? [0, 0, 0];
  const tri = (ox: number): [number, number][] => [
    [ox + 6, 118],
    [ox + 74, 118],
    [ox + 30, 52],
  ];
  const renderTri = (ox: number, keyPrefix: string) => {
    const V = tri(ox);
    const cen: [number, number] = [(V[0][0] + V[1][0] + V[2][0]) / 3, (V[0][1] + V[1][1] + V[2][1]) / 3];
    const edges: [[number, number], [number, number]][] = [
      [V[0], V[1]],
      [V[1], V[2]],
      [V[2], V[0]],
    ];
    return (
      <g key={keyPrefix}>
        <polygon points={V.map((p) => p.join(',')).join(' ')} {...outline} />
        {edges.map(([p, q], i) => {
          const n = sideMarks[i];
          if (!n) return null;
          const mx = (p[0] + q[0]) / 2;
          const my = (p[1] + q[1]) / 2;
          const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) + Math.PI / 2;
          return (
            <g key={`s${i}`} className="text-primary">
              {Array.from({ length: n }, (_, k) => {
                const off = (k - (n - 1) / 2) * 4;
                const bx = mx + Math.cos(ang - Math.PI / 2) * off;
                const by = my + Math.sin(ang - Math.PI / 2) * off;
                return <line key={k} x1={bx - Math.cos(ang) * 4} y1={by - Math.sin(ang) * 4} x2={bx + Math.cos(ang) * 4} y2={by + Math.sin(ang) * 4} stroke="currentColor" strokeWidth={STROKE} />;
              })}
            </g>
          );
        })}
        {angleMarks.map((n, i) => {
          if (!n) return null;
          const [vx, vy] = V[i];
          const dx = cen[0] - vx;
          const dy = cen[1] - vy;
          const base = (Math.atan2(-dy, dx) * 180) / Math.PI;
          return <Arc key={`a${i}`} cx={vx} cy={vy} r={13 + n * 3} a0={base - 22} a1={base + 22} accent />;
        })}
      </g>
    );
  };
  return (
    <>
      {renderTri(28, 't1')}
      {renderTri(132, 't2')}
      {criterion && <Label x={120} y={140} text={criterion} accent />}
    </>
  );
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

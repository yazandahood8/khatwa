/**
 * مخططات هندسية للأسئلة — declarative geometry figure specs attached to a Problem.
 *
 * تُخزَّن في العمود `Problem.figure` (Json)، وتُؤلَّف بجانب السؤال في مولّدات المسائل،
 * ويرسمها مكوّن `<ProblemFigure>` في الواجهة كـ SVG (بلا صور مرفوعة، آمن وقابل للثيم).
 * النصوص (labels) حرّة لتقبل أرقاماً ("65°") أو تعابير ("٣س+١٠").
 */

/** أحد الزوايا الثماني الناتجة عن قاطع يقطع مستقيمين متوازيين.
 *  الحرف الأول = المستقيم (t علوي / b سفلي)، ثم رُبع الزاوية حول نقطة التقاطع (tl/tr/bl/br). */
export type TransversalPos =
  | 't-tl'
  | 't-tr'
  | 't-bl'
  | 't-br'
  | 'b-tl'
  | 'b-tr'
  | 'b-bl'
  | 'b-br';

/** زاوية معلّمة على مخطط القاطع: موقعها ونصّها. */
export interface TransversalAngle {
  pos: TransversalPos;
  label: string;
}

export type FigureSpec =
  // زاويتان متجاورتان مجموعهما 90° (متتامّتان) أو 180° (متكاملتان)
  | { type: 'anglePair'; kind: 'complement' | 'supplement'; labels: [string, string] }
  // زوايا متجاورة على مستقيم (مجموعها 180°)
  | { type: 'anglesOnLine'; labels: string[] }
  // مستقيمان متقاطعان: الزوايا المتقابلة بالرأس. labels = [الأولى، مقابلتها]
  | { type: 'verticalAngles'; labels: [string, string] }
  // زوايا حول نقطة (مجموعها 360°)
  | { type: 'anglesAroundPoint'; labels: string[] }
  // مستقيمان متوازيان + قاطع. a = المعطاة، b = المطلوبة (تُبرَز)
  | { type: 'parallelTransversal'; a: TransversalAngle; b: TransversalAngle }
  // مثلث بزوايا داخلية معلّمة (وربما زاوية خارجية أو علامة قائمة/تساوي ساقين)
  | {
      type: 'triangleAngles';
      angles: [string, string, string];
      rightAngleAt?: 0 | 1 | 2; // رأس فيه زاوية قائمة (يُرسَم مربّع بدل القوس)
      isoscelesApex?: 0 | 1 | 2; // رأس متساوي الساقين (يُعلّم الضلعان الخارجان منه بعلامة تساوٍ)
      exterior?: { atVertex: 0 | 1 | 2; label: string }; // زاوية خارجية عند رأس
    }
  // مثلث بأطوال أضلاع معلّمة (لمتباينة المثلث)
  | { type: 'triangleSides'; sides: [string, string, string] };

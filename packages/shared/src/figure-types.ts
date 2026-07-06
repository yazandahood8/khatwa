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
  // مثلث بأطوال أضلاع معلّمة (لمتباينة المثلث/التصنيف)
  | { type: 'triangleSides'; sides: [string, string, string]; rightAngleAt?: 0 | 1 | 2 }
  // --- مضلّعات ---
  // مستطيل/مربّع بأبعاد معلّمة
  | { type: 'rect'; w: string; h: string; square?: boolean }
  // مثلث بقاعدة وارتفاع (الارتفاع خطّ متقطّع عمودي)
  | { type: 'triangleBaseHeight'; base: string; height: string }
  // مثلث قائم الزاوية: ضلعان قائمان + وتر
  | { type: 'rightTriangle'; legs: [string, string]; hyp?: string }
  // متوازي أضلاع بقاعدة وارتفاع
  | { type: 'parallelogram'; base: string; height: string }
  // شبه منحرف بقاعدتين وارتفاع
  | { type: 'trapezoid'; base1: string; base2: string; height: string }
  // معيّن بقطرين
  | { type: 'rhombus'; diag1: string; diag2: string }
  // --- الدائرة ---
  // دائرة بنصف قطر/قطر/وتر معلّم (shaded = تُظلّل المساحة)
  | { type: 'circle'; radius?: string; diameter?: string; chord?: string; shaded?: boolean }
  // دائرتان متّحدتا المركز (تُظلّل الحلقة بينهما)
  | { type: 'concentricCircles'; outer: string; inner: string }
  // قطاع دائري: sector = القطاع، arc = إبراز القوس، remaining = المتبقّي بعد إزالة القطاع
  | { type: 'circleSector'; angle: string; radius: string; mode: 'sector' | 'arc' | 'remaining' }
  // --- أشكال مركّبة ---
  // مثلث فوق مستطيل
  | { type: 'rectPlusTriangle'; w: string; h: string; triBase: string; triHeight: string }
  // نصف دائرة فوق الحافة العليا لمستطيل
  | { type: 'rectPlusSemicircle'; w: string; h: string; radius: string }
  // شكل حرف L: مستطيل كبير مقطوع منه ركن
  | { type: 'lShape'; outerW: string; outerH: string; cutW: string; cutH: string }
  // مربّع بداخله دائرة مماسّة (تُظلّل المنطقة بين المربّع والدائرة)
  | { type: 'inscribedCircleSquare'; side: string; radius: string }
  // مضمار: مستطيل بنصفَي دائرة على طرفيه القصيرين
  | { type: 'stadium'; w: string; h: string; radius: string }
  // مستطيل بإطار/ممرّ داخلي بعرض ثابت (يُبرَز المستطيل الداخلي)
  | { type: 'borderedRect'; outerW: string; outerH: string; border: string }
  // --- جملة المحاور ---
  | {
      type: 'coordinatePlane';
      points?: { x: number; y: number; label?: string; target?: boolean }[];
      segments?: [[number, number], [number, number]][];
      polygon?: { x: number; y: number }[];
      highlightQuadrant?: 1 | 2 | 3 | 4;
      range?: number; // نصف مدى المحاور (افتراضياً يُشتقّ من أكبر إحداثي)
    }
  // --- مجسّمات ثلاثية الأبعاد (رسم متساوي القياس isometric) ---
  | { type: 'solid'; kind: 'box' | 'cube' | 'triangularPrism' | 'pentagonalPrism'; dims?: string[]; open?: boolean };

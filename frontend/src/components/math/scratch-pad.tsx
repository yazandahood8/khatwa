'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLORS = ['#1e293b', '#2563eb', '#dc2626'];
const SIZES = { small: 2, medium: 4, large: 7 } as const;

/** مسودة حرة بالإصبع/الماوس — free-draw scratch pad (Canvas). */
export function ScratchPad({ onAnalyze }: { onAnalyze?: (base64Png: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState<keyof typeof SIZES>('medium');
  const [eraser, setEraser] = useState(false);

  // ضبط أبعاد الكانفاس — size the canvas to its box
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  function pos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = eraser ? SIZES[size] * 4 : SIZES[size];
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function end() {
    drawing.current = false;
  }

  function clear() {
    const canvas = canvasRef.current!;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
  }

  /** يصدّر المسودة على خلفية بيضاء ويرسلها للمساعد — export on white bg + send. */
  function analyze() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    // تأكّد أن فيها رسم — skip blank canvas
    const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasInk = false;
    for (let i = 3; i < px.length; i += 4) {
      if (px[i] !== 0) {
        hasInk = true;
        break;
      }
    }
    if (!hasInk) return;

    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tctx = tmp.getContext('2d')!;
    tctx.fillStyle = '#ffffff';
    tctx.fillRect(0, 0, tmp.width, tmp.height);
    tctx.drawImage(canvas, 0, 0);
    onAnalyze?.(tmp.toDataURL('image/png').split(',')[1]);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            className={cn(
              'h-7 w-7 rounded-full border-2',
              color === c && !eraser ? 'border-foreground' : 'border-transparent',
            )}
            style={{ backgroundColor: c }}
            aria-label="لون"
          />
        ))}
        <Button size="sm" variant={eraser ? 'default' : 'outline'} onClick={() => setEraser((v) => !v)}>
          🧹 ممحاة
        </Button>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value as keyof typeof SIZES)}
          className="h-8 rounded-md border bg-background px-2 text-sm"
        >
          <option value="small">رفيع</option>
          <option value="medium">متوسط</option>
          <option value="large">عريض</option>
        </select>
        <Button size="sm" variant="ghost" onClick={clear}>
          مسح الكل
        </Button>
        {onAnalyze && (
          <Button size="sm" variant="gradient" className="ms-auto" onClick={analyze}>
            <Sparkles className="h-4 w-4" /> اعرض مسودتي للمساعد
          </Button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="h-64 w-full touch-none rounded-lg border bg-white"
      />
    </div>
  );
}

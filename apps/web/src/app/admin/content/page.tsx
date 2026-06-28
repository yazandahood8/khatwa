'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  type Subject,
  type Grade,
  type Level,
  type Topic,
  type Lesson,
  getSubjects,
  getGrades,
  getLevels,
  getTopics,
  getLessons,
  createSubject,
  deleteSubject,
  createGrade,
  deleteGrade,
  createLevel,
  deleteLevel,
  createTopic,
  deleteTopic,
  createLesson,
  deleteLesson,
  publishLesson,
} from '@/lib/content-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LessonVideoUpload } from '@/components/admin/lesson-video-upload';

const ALL_GRADES = [7, 8, 9, 10, 11, 12];

export default function ContentPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = (p: Promise<unknown>, after: () => void) =>
    p.then(after).catch((e) => setErr(e instanceof Error ? e.message : 'حدث خطأ'));

  const reloadSubjects = useCallback(() => void getSubjects().then(setSubjects).catch(() => {}), []);
  useEffect(() => reloadSubjects(), [reloadSubjects]);
  useEffect(() => void (subject && getGrades(subject.id).then(setGrades)), [subject]);
  useEffect(() => void (grade && getLevels(grade.id).then(setLevels)), [grade]);
  useEffect(() => void (level && getTopics(level.id).then(setTopics)), [level]);
  useEffect(() => void (topic && getLessons(topic.id).then(setLessons)), [topic]);

  // التنقل لأعلى — navigate up by clicking a breadcrumb
  const goSubjects = () => {
    setSubject(null);
    setGrade(null);
    setLevel(null);
    setTopic(null);
  };
  const goGrades = () => {
    setGrade(null);
    setLevel(null);
    setTopic(null);
  };
  const goLevels = () => {
    setLevel(null);
    setTopic(null);
  };
  const goTopics = () => setTopic(null);

  const crumb = (label: string, onClick?: () => void) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={onClick ? 'text-primary hover:underline' : 'font-medium'}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">إدارة المحتوى</h1>

      {/* مسار التنقل — breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {crumb('المواد', subject ? goSubjects : undefined)}
        {subject && <span>›</span>}
        {subject && crumb(`${subject.icon ?? ''} ${subject.nameAr}`, grade ? goGrades : undefined)}
        {grade && <span>›</span>}
        {grade && crumb(`صف ${grade.gradeNumber}`, level ? goLevels : undefined)}
        {level && <span>›</span>}
        {level && crumb(level.name, topic ? goTopics : undefined)}
        {topic && <span>›</span>}
        {topic && crumb(topic.nameAr)}
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}

      {/* ---------------- Subjects ---------------- */}
      {!subject && (
        <Section
          title="المواد"
          addLabel="إضافة مادة"
          fields={[
            { name: 'nameAr', placeholder: 'اسم المادة (مثال: رياضيات)' },
            { name: 'icon', placeholder: 'أيقونة (📐)', className: 'w-24' },
          ]}
          onAdd={(v) =>
            run(createSubject({ nameAr: v.nameAr, icon: v.icon || undefined }), reloadSubjects)
          }
          items={subjects.map((s) => ({
            id: s.id,
            label: `${s.icon ?? '📘'} ${s.nameAr}`,
            meta: `${s._count?.grades ?? 0} صفوف`,
            onOpen: () => setSubject(s),
            onDelete: () => run(deleteSubject(s.id), reloadSubjects),
          }))}
        />
      )}

      {/* ---------------- Grades ---------------- */}
      {subject && !grade && (
        <GradeSection
          existing={grades}
          onAdd={(gradeNumber) =>
            run(createGrade({ subjectId: subject.id, gradeNumber }), () =>
              getGrades(subject.id).then(setGrades),
            )
          }
          onOpen={setGrade}
          onDelete={(id) => run(deleteGrade(id), () => getGrades(subject.id).then(setGrades))}
        />
      )}

      {/* ---------------- Levels ---------------- */}
      {grade && !level && (
        <Section
          title={`مستويات صف ${grade.gradeNumber}`}
          addLabel="إضافة مستوى"
          fields={[{ name: 'name', placeholder: 'اسم المستوى (مثال: 4יח׳)' }]}
          onAdd={(v) =>
            run(createLevel({ gradeId: grade.id, name: v.name }), () =>
              getLevels(grade.id).then(setLevels),
            )
          }
          items={levels.map((l) => ({
            id: l.id,
            label: l.name,
            meta: `${l._count?.topics ?? 0} مواضيع`,
            onOpen: () => setLevel(l),
            onDelete: () => run(deleteLevel(l.id), () => getLevels(grade.id).then(setLevels)),
          }))}
        />
      )}

      {/* ---------------- Topics ---------------- */}
      {level && !topic && (
        <Section
          title="المواضيع"
          addLabel="إضافة موضوع"
          fields={[
            { name: 'nameAr', placeholder: 'اسم الموضوع' },
            { name: 'description', placeholder: 'وصف (اختياري)' },
          ]}
          onAdd={(v) =>
            run(
              createTopic({
                levelId: level.id,
                nameAr: v.nameAr,
                description: v.description || undefined,
              }),
              () => getTopics(level.id).then(setTopics),
            )
          }
          items={topics.map((t) => ({
            id: t.id,
            label: t.nameAr,
            meta: `${t._count?.lessons ?? 0} دروس · ${t._count?.problems ?? 0} مسائل`,
            onOpen: () => setTopic(t),
            onDelete: () => run(deleteTopic(t.id), () => getTopics(level.id).then(setTopics)),
          }))}
        />
      )}

      {/* ---------------- Lessons ---------------- */}
      {topic && (
        <div className="flex justify-end">
          <Link href={`/admin/problems?topicId=${topic.id}`}>
            <Button variant="outline">🧮 مسائل هذا الموضوع</Button>
          </Link>
        </div>
      )}
      {topic && (
        <Section
          title="الدروس"
          addLabel="إضافة درس"
          fields={[
            { name: 'title', placeholder: 'عنوان الدرس' },
            { name: 'description', placeholder: 'وصف (اختياري)' },
          ]}
          onAdd={(v) =>
            run(
              createLesson({
                topicId: topic.id,
                title: v.title,
                description: v.description || undefined,
              }),
              () => getLessons(topic.id).then(setLessons),
            )
          }
          items={lessons.map((le) => ({
            id: le.id,
            label: `${le.videoUrl ? '🎬 ' : ''}${le.title}`,
            meta: le.isPublished ? '🟢 منشور' : '⚪ مسودة',
            extra: (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  run(publishLesson(le.id, !le.isPublished), () =>
                    getLessons(topic.id).then(setLessons),
                  )
                }
              >
                {le.isPublished ? 'إلغاء النشر' : 'نشر'}
              </Button>
            ),
            onDelete: () => run(deleteLesson(le.id), () => getLessons(topic.id).then(setLessons)),
            body: (
              <LessonVideoUpload
                lesson={le}
                onChange={() => getLessons(topic.id).then(setLessons)}
              />
            ),
          }))}
        />
      )}
    </div>
  );
}

// ---------------- Reusable list + add-form section ----------------

interface Field {
  name: string;
  placeholder: string;
  className?: string;
}
interface Item {
  id: string;
  label: string;
  meta?: string;
  extra?: React.ReactNode;
  body?: React.ReactNode;
  onOpen?: () => void;
  onDelete?: () => void;
}

function Section({
  title,
  addLabel,
  fields,
  onAdd,
  items,
  note,
}: {
  title: string;
  addLabel: string;
  fields: Field[];
  onAdd: (values: Record<string, string>) => void;
  items: Item[];
  note?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.every((f) => (f.name === fields[0].name ? values[f.name]?.trim() : true))) return;
    onAdd(values);
    setValues({});
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>

      <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
        {fields.map((f) => (
          <Input
            key={f.name}
            placeholder={f.placeholder}
            value={values[f.name] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            className={f.className ?? 'w-64'}
          />
        ))}
        <Button type="submit">{addLabel}</Button>
      </form>

      {note && <p className="text-xs text-muted-foreground">{note}</p>}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا يوجد عناصر بعد.</p>
      ) : (
        <div className="grid gap-2">
          {items.map((it) => (
            <Card key={it.id}>
              <CardContent className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={it.onOpen}
                    disabled={!it.onOpen}
                    className={it.onOpen ? 'text-start hover:underline' : 'text-start'}
                  >
                    <span className="font-medium">{it.label}</span>
                    {it.meta && (
                      <span className="ms-2 text-xs text-muted-foreground">{it.meta}</span>
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    {it.extra}
                    {it.onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('متأكد من الحذف؟ سيُحذف كل ما بداخله.')) it.onDelete!();
                        }}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>
                {it.body}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Grade section (pick from 7..12) ----------------

function GradeSection({
  existing,
  onAdd,
  onOpen,
  onDelete,
}: {
  existing: Grade[];
  onAdd: (gradeNumber: number) => void;
  onOpen: (g: Grade) => void;
  onDelete: (id: string) => void;
}) {
  const taken = new Set(existing.map((g) => g.gradeNumber));
  const available = ALL_GRADES.filter((g) => !taken.has(g));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">الصفوف</h2>

      {available.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">إضافة صف:</span>
          {available.map((g) => (
            <Button key={g} variant="outline" size="sm" onClick={() => onAdd(g)}>
              + صف {g}
            </Button>
          ))}
        </div>
      )}

      {existing.length === 0 ? (
        <p className="text-sm text-muted-foreground">لا يوجد صفوف بعد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {existing.map((g) => (
            <Card key={g.id}>
              <CardContent className="flex items-center justify-between p-3">
                <button onClick={() => onOpen(g)} className="font-medium hover:underline">
                  صف {g.gradeNumber}
                  <span className="ms-2 text-xs text-muted-foreground">
                    {g._count?.levels ?? 0} مستويات
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('حذف الصف وكل ما بداخله؟')) onDelete(g.id);
                  }}
                >
                  🗑️
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

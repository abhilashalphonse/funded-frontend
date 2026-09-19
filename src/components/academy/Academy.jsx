import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  GraduationCap,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";
import { ACADEMY_CATEGORIES, ACADEMY_LESSONS, ACADEMY_LESSON_MAP, academyCategory } from "./academyContent.js";

const API_URL = import.meta.env.VITE_API_URL || "";

const CATEGORY_ICONS = {
  start: Sparkles,
  trader: TerminalSquare,
  risk: ShieldCheck,
  basics: BookOpen,
  playbook: GraduationCap,
};

function pct(value) {
  return Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 0));
}

export default function Academy({ initialLessonId = null, onLessonOpened = () => {} }) {
  const { getAccessToken } = useAuth();
  const [progress, setProgress] = useState({
    completedLessonIds: [],
    lastViewedLessonId: null,
    quizResults: [],
  });
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId || null);

  useEffect(() => {
    if (initialLessonId && ACADEMY_LESSON_MAP[initialLessonId]) setSelectedLessonId(initialLessonId);
  }, [initialLessonId]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setSyncError("");
        const token = await getAccessToken();
        if (!token) throw new Error("Your session has expired.");
        const response = await fetch(`${API_URL}/api/customer/academy/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || "Unable to load Academy progress.");
        if (!cancelled && payload?.data) setProgress(payload.data);
      } catch (error) {
        if (!cancelled) setSyncError(error?.message || "Unable to load Academy progress.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [getAccessToken]);

  const completed = useMemo(() => new Set(progress.completedLessonIds || []), [progress.completedLessonIds]);
  const completedCount = completed.size;
  const completionPercent = pct((completedCount / ACADEMY_LESSONS.length) * 100);
  const selectedLesson = selectedLessonId ? ACADEMY_LESSON_MAP[selectedLessonId] : null;

  const openLesson = async lessonId => {
    if (!ACADEMY_LESSON_MAP[lessonId]) return;
    setSelectedLessonId(lessonId);
    onLessonOpened(lessonId);
    setProgress(current => ({ ...current, lastViewedLessonId: lessonId }));
    try {
      const token = await getAccessToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/api/customer/academy/lessons/${encodeURIComponent(lessonId)}/view`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload?.data) setProgress(payload.data);
    } catch {
      // Viewing should remain available even if progress sync is temporarily offline.
    }
  };

  const completeLesson = async (lessonId, score) => {
    const token = await getAccessToken();
    if (!token) throw new Error("Your session has expired.");
    const response = await fetch(`${API_URL}/api/customer/academy/lessons/${encodeURIComponent(lessonId)}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.message || "Unable to save lesson progress.");
    if (payload?.data) setProgress(payload.data);
    return payload?.data;
  };

  if (selectedLesson) {
    return (
      <LessonReader
        lesson={selectedLesson}
        completed={completed.has(selectedLesson.id)}
        onBack={() => setSelectedLessonId(null)}
        onComplete={completeLesson}
        onNext={() => {
          const index = ACADEMY_LESSONS.findIndex(item => item.id === selectedLesson.id);
          const next = ACADEMY_LESSONS[index + 1];
          if (next) void openLesson(next.id);
          else setSelectedLessonId(null);
        }}
      />
    );
  }

  const continueId = progress.lastViewedLessonId && ACADEMY_LESSON_MAP[progress.lastViewedLessonId]
    ? progress.lastViewedLessonId
    : ACADEMY_LESSONS.find(lesson => !completed.has(lesson.id))?.id;
  const continueLesson = continueId ? ACADEMY_LESSON_MAP[continueId] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {syncError && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-[11px] text-amber-300">
          Progress sync is temporarily unavailable. Lessons remain readable. {syncError}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#666]">
              <span className="size-1 rounded-full bg-white" />
              ACG Academy
            </span>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.6rem,4vw,2.5rem)] font-semibold tracking-[-0.045em] text-white">
              Learn the platform. Understand the rules. Trade with a plan.
            </h2>
            <p className="mt-3 max-w-2xl text-[12px] leading-6 text-[#858585]">
              Short practical lessons about ACG Funded, ACG Trader, market mechanics and evaluation risk. No signals, no guaranteed strategies.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-[#777]">Overall progress</span>
              <span className="font-mono text-[11px] text-white">{completedCount}/{ACADEMY_LESSONS.length}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${completionPercent}%` }} />
            </div>
            <p className="mt-2 text-[9px] text-[#555]">{Math.round(completionPercent)}% complete</p>
          </div>
        </div>
      </section>

      {continueLesson && (
        <section>
          <SectionTitle title={completed.has(continueLesson.id) ? "Review lesson" : "Continue learning"} />
          <button
            type="button"
            onClick={() => void openLesson(continueLesson.id)}
            className="group mt-3 flex w-full items-center gap-4 rounded-xl border border-white/[0.09] bg-[#090909] p-4 text-left transition hover:border-white/[0.16] hover:bg-[#0c0c0c]"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-black">
              <Play size={15} fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#626262]">{academyCategory(continueLesson.category).title}</span>
              <h3 className="mt-1 truncate text-[13px] font-semibold text-white">{continueLesson.title}</h3>
              <p className="mt-1 line-clamp-1 text-[10px] text-[#717171]">{continueLesson.summary}</p>
            </div>
            <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-medium text-[#777] sm:flex">
              {continueLesson.duration} min <ChevronRight size={13} />
            </span>
          </button>
        </section>
      )}

      <section>
        <SectionTitle title="Learning paths" subtitle="Start anywhere. Risk Management is recommended before increasing exposure." />
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {ACADEMY_CATEGORIES.map(category => {
            const Icon = CATEGORY_ICONS[category.id] || BookOpen;
            const lessons = ACADEMY_LESSONS.filter(lesson => lesson.category === category.id);
            const done = lessons.filter(lesson => completed.has(lesson.id)).length;
            const firstIncomplete = lessons.find(lesson => !completed.has(lesson.id)) || lessons[0];
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => firstIncomplete && void openLesson(firstIncomplete.id)}
                className="rounded-xl border border-white/[0.08] bg-[#080808] p-4 text-left transition hover:border-white/[0.15] hover:bg-[#0b0b0b]"
              >
                <div className="flex items-center justify-between">
                  <div className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#888]">
                    <Icon size={16} />
                  </div>
                  <span className="font-mono text-[9px] text-[#555]">{done}/{lessons.length}</span>
                </div>
                <h3 className="mt-4 text-[12px] font-semibold text-white">{category.title}</h3>
                <p className="mt-1.5 min-h-10 text-[10px] leading-5 text-[#666]">{category.description}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full bg-white" style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="All lessons" subtitle={loading ? "Loading your progress…" : "Short lessons designed for the dashboard."} />
        <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[#080808]">
          {ACADEMY_CATEGORIES.map((category, categoryIndex) => {
            const lessons = ACADEMY_LESSONS.filter(lesson => lesson.category === category.id);
            return (
              <div key={category.id} className={categoryIndex ? "border-t border-white/[0.08]" : ""}>
                <div className="flex items-center justify-between bg-white/[0.015] px-4 py-3">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#666]">{category.title}</span>
                  <span className="text-[9px] text-[#4f4f4f]">{lessons.reduce((sum, lesson) => sum + lesson.duration, 0)} min</span>
                </div>
                <div className="divide-y divide-white/[0.055]">
                  {lessons.map(lesson => (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() => void openLesson(lesson.id)}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.025]"
                    >
                      <div className={`grid size-7 shrink-0 place-items-center rounded-full border ${completed.has(lesson.id) ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-400" : "border-white/[0.08] text-[#555]"}`}>
                        {completed.has(lesson.id) ? <Check size={12} /> : <Circle size={10} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-[11px] font-medium text-[#d8d8d8]">{lesson.title}</h4>
                        <p className="mt-0.5 line-clamp-1 text-[9px] text-[#5e5e5e]">{lesson.summary}</p>
                      </div>
                      <span className="shrink-0 text-[9px] text-[#555]">{lesson.duration} min</span>
                      <ChevronRight size={13} className="shrink-0 text-[#444]" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LessonReader({ lesson, completed, onBack, onComplete, onNext }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const category = academyCategory(lesson.category);
  const allAnswered = lesson.quiz.every((_, index) => answers[index] !== undefined);
  const correct = lesson.quiz.reduce((sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0), 0);
  const score = lesson.quiz.length ? Math.round((correct / lesson.quiz.length) * 100) : 100;
  const passed = score === 100;

  useEffect(() => {
    setAnswers({});
    setChecked(false);
    setError("");
  }, [lesson.id]);

  const submit = async () => {
    if (!allAnswered) return;
    setChecked(true);
    if (!passed) return;
    try {
      setSaving(true);
      setError("");
      await onComplete(lesson.id, score);
    } catch (submitError) {
      setError(submitError?.message || "Unable to save lesson progress.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="mx-auto max-w-3xl animate-in fade-in duration-300">
      <button type="button" onClick={onBack} className="mb-5 inline-flex min-h-9 items-center gap-2 text-[11px] font-medium text-[#777] transition hover:text-white">
        <ArrowLeft size={14} /> Back to Academy
      </button>

      <header className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#606060]">
          <span>{category.title}</span><span>•</span><span className="inline-flex items-center gap-1"><Clock3 size={10} /> {lesson.duration} min</span>
          {completed && <><span>•</span><span className="text-emerald-400">Completed</span></>}
        </div>
        <h2 className="mt-3 text-[clamp(1.7rem,5vw,2.7rem)] font-semibold tracking-[-0.05em] text-white">{lesson.title}</h2>
        <p className="mt-3 text-[13px] leading-6 text-[#858585]">{lesson.summary}</p>
      </header>

      <div className="divide-y divide-white/[0.07]">
        {lesson.sections.map((section, index) => (
          <section key={section.heading} className="py-6">
            <span className="text-[9px] font-mono text-[#4f4f4f]">0{index + 1}</span>
            <h3 className="mt-2 text-[14px] font-semibold text-white">{section.heading}</h3>
            <p className="mt-2 text-[12px] leading-6 text-[#8a8a8a]">{section.body}</p>
            {section.example && (
              <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3 font-mono text-[11px] text-[#cfcfcf]">
                {section.example}
              </div>
            )}
          </section>
        ))}
      </div>

      <section className="mt-2 rounded-xl border border-white/[0.09] bg-[#080808] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#888]" />
          <h3 className="text-[12px] font-semibold text-white">Knowledge check</h3>
        </div>
        <p className="mt-1 text-[10px] text-[#626262]">Answer both correctly to complete the lesson. You can retry immediately.</p>

        <div className="mt-5 space-y-6">
          {lesson.quiz.map((question, questionIndex) => (
            <div key={question.question}>
              <p className="text-[11px] font-medium leading-5 text-[#d2d2d2]">{questionIndex + 1}. {question.question}</p>
              <div className="mt-2 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[questionIndex] === optionIndex;
                  const isCorrect = checked && optionIndex === question.answer;
                  const isWrong = checked && selected && optionIndex !== question.answer;
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        setAnswers(current => ({ ...current, [questionIndex]: optionIndex }));
                        setChecked(false);
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-left text-[10px] transition ${isCorrect ? "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-300" : isWrong ? "border-rose-500/30 bg-rose-500/[0.07] text-rose-300" : selected ? "border-white/25 bg-white/[0.06] text-white" : "border-white/[0.07] text-[#888] hover:border-white/[0.14]"}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {checked && (
                <p className={`mt-2 text-[9px] leading-4 ${answers[questionIndex] === question.answer ? "text-emerald-400" : "text-[#777]"}`}>
                  {question.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-[10px] text-rose-400">{error}</p>}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered || saving}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-[#e8e8e8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : checked && !passed ? "Check again" : completed ? "Retake check" : "Complete lesson"}
            <Check size={13} />
          </button>
          {checked && !passed && (
            <button
              type="button"
              onClick={() => { setAnswers({}); setChecked(false); }}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.09] px-4 text-[11px] text-[#aaa]"
            >
              <RotateCcw size={13} /> Retry
            </button>
          )}
        </div>

        {checked && passed && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] font-medium text-emerald-300">Knowledge check passed · {score}%</span>
            <button type="button" onClick={onNext} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white">
              Next lesson <ArrowRight size={12} />
            </button>
          </div>
        )}
      </section>

      <p className="mt-5 text-[9px] leading-4 text-[#4f4f4f]">
        Academy material is educational and explains platform mechanics and risk concepts. It does not provide trade signals or guarantee evaluation results.
      </p>
    </article>
  );
}

function SectionTitle({ title, subtitle = null }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a8a8a]">{title}</h3>
      {subtitle && <p className="mt-1 text-[9px] text-[#555]">{subtitle}</p>}
    </div>
  );
}

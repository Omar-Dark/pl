import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { api } from "@/lib/api";
import { fetchQuestions } from "@/lib/questions.functions";
import { useAuth } from "@/lib/auth";
import { addAttempt } from "@/lib/quiz-store";
import { Layout } from "@/components/Layout";
import { ChevronLeft, Check } from "lucide-react";

export const Route = createFileRoute("/quiz/$id")({
  component: QuizPage,
});

function QuizPage() {
  const { id } = Route.useParams();
  const { user, addXp } = useAuth();
  const navigate = useNavigate();
  const fetchQ = useServerFn(fetchQuestions);
  const { data: questionsResp, isLoading } = useQuery({
    queryKey: ["q", id],
    queryFn: () => fetchQ({ data: { quizId: id } }),
  });
  const questions = questionsResp?.questions;
  const { data: quizzes } = useQuery({ queryKey: ["quizzes"], queryFn: api.quizzes });
  const quiz = quizzes?.find((q) => q._id === id);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ score: number; total: number } | null>(null);

  const submit = () => {
    if (!questions) return;
    let score = 0;
    questions.forEach((q) => {
      if (q.answer && answers[q._id] === q.answer) score++;
    });
    const result = { score, total: questions.length };
    setSubmitted(result);
    if (user) {
      addAttempt(user.id, { quizId: id, title: quiz?.title || "Quiz", ...result, takenAt: new Date().toISOString() });
      addXp(score * 10);
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to profile
        </Link>

        {quiz && (
          <div className="mt-4">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{quiz.rank}</span>
            <h1 className="mt-2 text-3xl font-bold">{quiz.title}</h1>
            <p className="mt-2 text-muted-foreground">{quiz.description}</p>
          </div>
        )}

        {isLoading && <div className="mt-8 h-32 rounded-xl border border-border bg-card animate-pulse" />}

        {submitted && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center shadow-glow">
            <Check className="mx-auto h-10 w-10 text-success" />
            <h2 className="mt-3 text-2xl font-bold">You scored {submitted.score} / {submitted.total}</h2>
            <p className="mt-2 text-sm text-muted-foreground">+{submitted.score * 10} XP added to your profile</p>
            <div className="mt-5 flex justify-center gap-2">
              <Link to="/profile" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View profile</Link>
              <button onClick={() => { setSubmitted(null); setAnswers({}); }} className="rounded-md border border-border bg-background px-4 py-2 text-sm">Retry</button>
            </div>
          </div>
        )}

        {!submitted && questions && (
          <div className="mt-6 space-y-4">
            {questions.map((q, i) => (
              <div key={q._id} className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs font-semibold text-primary">Question {i + 1}</div>
                <p className="mt-2 font-semibold">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((o) => {
                    const sel = answers[q._id] === o;
                    return (
                      <label key={o} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${sel ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"}`}>
                        <input type="radio" name={q._id} checked={sel} onChange={() => setAnswers((a) => ({ ...a, [q._id]: o }))} className="accent-primary" />
                        {o}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={submit}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full rounded-md bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {!isLoading && (!questions || questions.length === 0) && !submitted && (
          <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            No questions available for this quiz yet.
          </div>
        )}
      </section>
    </Layout>
  );
}

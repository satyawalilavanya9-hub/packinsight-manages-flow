import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react";
import { askPackInsight } from "@/lib/ai-insights.functions";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({ meta: [{ title: "AI Insights — PackInsight" }, { name: "robots", content: "noindex" }] }),
  component: AiInsightsPage,
});

const SUGGESTIONS = [
  "Why did OEE drop this week?",
  "Which customer has the biggest overdue exposure?",
  "What's causing our top 3 defects and how do I fix them?",
  "Are we on track to hit the July revenue target?",
  "Which machine is my biggest bottleneck right now?",
  "How does our carbon footprint compare to industry average?",
];

interface Turn {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

function AiInsightsPage() {
  const ask = useServerFn(askPackInsight);
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = async (q: string) => {
    const question = q.trim();
    if (!question || loading) return;
    setInput("");
    setTurns((t) => [...t, { role: "user", content: question }]);
    setLoading(true);
    try {
      const res = await ask({ data: { question } });
      setTurns((t) => [...t, { role: "assistant", content: res.answer, source: res.source }]);
    } catch (e) {
      setTurns((t) => [...t, { role: "assistant", content: `Error: ${(e as Error).message}`, source: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                PackInsight AI
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">Beta</Badge>
              </CardTitle>
              <CardDescription>Ask anything about your plant — production, quality, orders, inventory, sustainability.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <Card className="flex flex-col min-h-[520px]">
          <CardContent className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
            {turns.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-16">
                <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
                Start with a question or pick a suggestion →
              </div>
            )}
            {turns.map((t, i) => (
              <div key={i} className={`flex gap-3 ${t.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-8 w-8 shrink-0 rounded-md flex items-center justify-center ${t.role === "user" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
                  {t.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${t.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {t.content}
                  {t.source === "fallback" && <div className="mt-2 text-[10px] opacity-60 uppercase tracking-wider">Demo mode</div>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing your plant data…
                </div>
              </div>
            )}
          </CardContent>
          <div className="border-t border-border p-3 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
              placeholder="Ask about production, OEE, defects, orders, sustainability…"
              className="min-h-[44px] max-h-32 resize-none"
              disabled={loading}
            />
            <Button onClick={() => submit(input)} disabled={loading || !input.trim()} className="shrink-0 self-end">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Try asking</div>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              disabled={loading}
              className="w-full text-left text-sm p-3 rounded-md border border-border bg-card hover:border-primary/40 hover:bg-accent transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

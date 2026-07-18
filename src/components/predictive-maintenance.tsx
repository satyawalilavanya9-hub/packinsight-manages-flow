import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cpu, Wrench, TrendingDown } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

interface Prediction {
  machine: string;
  cause: string;
  causeHi: string;
  daysUntil: number;
  confidence: number; // 0-100
  risk: "high" | "medium" | "low";
}

const PREDICTIONS: Prediction[] = [
  { machine: "Auto Folder-Gluer", cause: "Belt tension degrading — vibration up 34% over 14d", causeHi: "बेल्ट तनाव कमजोर हो रहा — 14 दिनों में वाइब्रेशन 34% बढ़ा", daysUntil: 2, confidence: 87, risk: "high" },
  { machine: "Flexo Printer 4C", cause: "Ink pump pressure variance rising above threshold", causeHi: "इंक पंप दबाव में बढ़ती अस्थिरता", daysUntil: 9, confidence: 71, risk: "medium" },
  { machine: "Corrugator B", cause: "Steam temperature drift on preheater roll #3", causeHi: "प्रीहीटर रोल #3 पर स्टीम तापमान परिवर्तन", daysUntil: 14, confidence: 62, risk: "medium" },
  { machine: "Rotary Die-Cutter", cause: "Blade wear within normal range", causeHi: "ब्लेड पहनाव सामान्य सीमा में", daysUntil: 42, confidence: 34, risk: "low" },
];

const RISK_STYLE: Record<Prediction["risk"], { badge: string; bar: string }> = {
  high: { badge: "bg-destructive/15 text-destructive border-destructive/30", bar: "[&>div]:bg-destructive" },
  medium: { badge: "bg-warning/15 text-warning-foreground border-warning/30", bar: "[&>div]:bg-warning" },
  low: { badge: "bg-success/15 text-success border-success/30", bar: "[&>div]:bg-success" },
};

export function PredictiveMaintenance() {
  const { t, lang } = useLang();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Cpu className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {t("predictive.title")}
              <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">ML</Badge>
            </CardTitle>
            <CardDescription className="text-xs">{t("predictive.subtitle")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {PREDICTIONS.map((p) => {
          const style = RISK_STYLE[p.risk];
          return (
            <div key={p.machine} className="border border-border rounded-md p-3 space-y-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{p.machine}</div>
                  <div className="text-xs text-muted-foreground leading-snug mt-0.5">
                    {lang === "hi" ? p.causeHi : p.cause}
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${style.badge}`}>
                  {t(`predictive.risk.${p.risk}` as "predictive.risk.high")}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Failure in ~{p.daysUntil}d</span>
                <span>·</span>
                <span>Confidence {p.confidence}%</span>
              </div>
              <Progress value={p.confidence} className={`h-1 ${style.bar}`} />
              {p.risk !== "low" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs mt-1"
                  onClick={() => toast.success(`${t("predictive.action")}: ${p.machine}`)}
                >
                  <Wrench className="h-3 w-3 mr-1.5" /> {t("predictive.action")}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

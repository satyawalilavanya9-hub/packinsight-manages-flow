import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, AlertTriangle, TrendingUp, PackageX } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

const PRIORITIES = [
  {
    icon: AlertTriangle,
    tone: "text-destructive bg-destructive/10 border-destructive/30",
    text: "Auto Folder-Gluer still down — 145 min lost; belt replacement ETA 3 PM",
    en: "Auto Folder-Gluer still down — 145 min lost; belt replacement ETA 3 PM",
    hi: "ऑटो फोल्डर-ग्लूअर बंद है — 145 मिनट का नुकसान; बेल्ट बदलने का ETA 3 बजे",
  },
  {
    icon: PackageX,
    tone: "text-warning bg-warning/10 border-warning/30",
    text: "Kraft Liner 180 GSM at 82% of reorder — raise PO before EOD",
    en: "Kraft Liner 180 GSM at 82% of reorder — raise PO before EOD",
    hi: "क्राफ्ट लाइनर 180 GSM रीऑर्डर के 82% पर — शाम से पहले PO जारी करें",
  },
  {
    icon: TrendingUp,
    tone: "text-success bg-success/10 border-success/30",
    text: "Flipkart order SO-8809 ready for dispatch — invoice pending approval",
    en: "Flipkart order SO-8809 ready for dispatch — invoice pending approval",
    hi: "फ्लिपकार्ट ऑर्डर SO-8809 डिस्पैच के लिए तैयार — इनवॉइस अनुमोदन बाकी",
  },
];

function greetingKey(): "greeting.morning" | "greeting.afternoon" | "greeting.evening" {
  const h = new Date().getHours();
  if (h < 12) return "greeting.morning";
  if (h < 17) return "greeting.afternoon";
  return "greeting.evening";
}

export function GreetingCard() {
  const { t, lang } = useLang();
  const firstName = CURRENT_USER.name.split(" ")[0];
  const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-widest opacity-70">{today}</div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1 leading-tight">
              {t(greetingKey())}, {firstName} 👋
            </h1>
            <div className="text-sm opacity-80 mt-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {t("greeting.subtitle")}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-widest opacity-70">Live OEE</div>
            <div className="text-3xl font-bold tabular-nums">74.6%</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-widest opacity-80 mb-2">{t("greeting.priorities")}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {PRIORITIES.map((p, i) => (
              <div key={i} className="rounded-md bg-background/95 text-foreground border border-border/40 p-3 flex gap-2.5">
                <div className={`h-7 w-7 shrink-0 rounded-md border flex items-center justify-center ${p.tone}`}>
                  <p.icon className="h-3.5 w-3.5" />
                </div>
                <div className="text-xs leading-snug">{lang === "hi" ? p.hi : p.en}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Compact snapshot of live plant data — sent to the model as grounding context.
// Keeping this inline avoids importing the whole mock-data module server-side.
const PLANT_SNAPSHOT = `
Company: Mannat Packaging Pvt. Ltd. (Ghaziabad, UP). Corrugated packaging for FMCG, Pharma, Electronics, Food, E-commerce.
Current period: July 2026.

KPIs (last 24h): output 65,300 boxes, target 72,000, OEE 74.6%, on-time delivery 88.2%, defect rate 1.9%, revenue MTD ₹41.2 L, open NCRs 7.

Machines: Corrugator A (Running, OEE 82.4%), Corrugator B (Running, 76.1%), Flexo Printer 4C (Running, 79.8%), Flexo Printer 2C (Idle, 68.2%), Rotary Die-Cutter (Running, 81.0%), Auto Folder-Gluer (DOWN — belt breakage, 145 min lost), Semi-Auto Folder-Gluer (Preventive Maintenance, 240 min).

Top defects (30d): Print misalignment 420, Weak glue bond 310, Ink smudging 265, Delamination 180, Warping 145.

Low stock alerts: Kraft Liner 180 GSM (9,800 kg vs 12,000 reorder), Corrugation Starch Glue (620 kg vs 800), Flexo Ink Magenta (180 L vs 200).

Top customers by outstanding: Flipkart ₹35.6 L, Cipla ₹21.0 L, Meesho ₹18.1 L, Dabur ₹12.4 L.
Overdue payment: Meesho SO-8807 (₹12.75 L).

Sustainability: 92% recycled kraft input, paper waste 3.4%, water 4.2 L / 1000 boxes, CO₂ 1.8 kg / 1000 boxes (industry avg ~2.4).
`.trim();

const AskInput = z.object({ question: z.string().min(1).max(500) });

export const askPackInsight = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AskInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;

    // Graceful fallback so the demo still shows something meaningful without a key.
    if (!key) {
      return {
        answer: `Auto-analysis (demo mode — no AI key configured):\n\nBased on the current plant snapshot, the key driver for your question "${data.question}" is likely the Auto Folder-Gluer downtime (145 min lost today) and the Flipkart shipper backlog on Corrugator B. Overall OEE is 74.6% vs a 82% target — the 7.4 pt gap is mostly availability loss, not speed loss.`,
        source: "fallback",
      };
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are PackInsight AI, an operations analyst for Mannat Packaging, a corrugated cardboard manufacturer in Ghaziabad, India. Answer using ONLY the plant snapshot below. Be concise (max 6 short bullets or ~120 words), use ₹ for money, cite numbers, and end with one recommended action. If the snapshot doesn't cover the question, say so honestly.\n\n" +
              PLANT_SNAPSHOT,
          },
          { role: "user", content: data.question },
        ],
      }),
    });

    if (res.status === 429) return { answer: "AI rate limit reached — please try again in a minute.", source: "error" };
    if (res.status === 402) return { answer: "AI credits exhausted on this workspace. Add credits to continue using PackInsight AI.", source: "error" };
    if (!res.ok) return { answer: `AI gateway error (${res.status}). Please try again.`, source: "error" };

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const answer = json.choices?.[0]?.message?.content?.trim() ?? "No answer.";
    return { answer, source: "ai" as const };
  });

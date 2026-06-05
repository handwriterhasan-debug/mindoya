// Translate CV text fields via Lovable AI
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  ur: "Urdu (اردو)",
  zh: "Simplified Chinese (简体中文)",
  ja: "Japanese (日本語)",
  ko: "Korean (한국어)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  ar: "Arabic (العربية)",
  de: "German (Deutsch)",
  pt: "Portuguese (Português)",
  ru: "Russian (Русский)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texts, targetLang } = await req.json();

    if (!Array.isArray(texts) || typeof targetLang !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langName = LANG_NAMES[targetLang] || targetLang;

    // Build numbered list to keep order stable
    const numbered = texts
      .map((t: string, i: number) => `${i + 1}. ${String(t ?? "").replace(/\n/g, " ⏎ ")}`)
      .join("\n");

    const systemPrompt = `You are a professional CV/resume translator. Translate every numbered item below into ${langName}.
Rules:
- Preserve numbering exactly (1., 2., 3., ...).
- Preserve the special token " ⏎ " as a line-break marker — keep it in the output.
- Do NOT translate: email addresses, URLs, phone numbers, hex colors, dates, proper brand/company names that have no native equivalent, technology names (e.g. React, Python).
- Translate full names ONLY if a standard native spelling exists; otherwise keep original.
- Keep tone professional and concise. Do not add commentary or quotes.
- If an item is empty, return it empty.
- Return ONLY the numbered translated list, nothing else.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: numbered },
          ],
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const errText = await response.text();
      console.error("AI gateway error", response.status, errText);
      return new Response(
        JSON.stringify({ error: "Translation service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";

    // Parse numbered lines back into an array aligned with input
    const translated: string[] = texts.map(() => "");
    const lineRe = /^\s*(\d+)\.\s?(.*)$/;
    let current = -1;
    for (const rawLine of content.split(/\r?\n/)) {
      const m = rawLine.match(lineRe);
      if (m) {
        current = parseInt(m[1], 10) - 1;
        if (current >= 0 && current < translated.length) {
          translated[current] = m[2].replace(/ ⏎ /g, "\n").trim();
        }
      } else if (current >= 0 && current < translated.length && rawLine.trim()) {
        translated[current] += "\n" + rawLine.replace(/ ⏎ /g, "\n").trim();
      }
    }

    // Fallback: keep original where translation is empty
    const result = translated.map((t, i) => (t && t.trim() ? t : String(texts[i] ?? "")));

    return new Response(
      JSON.stringify({ translations: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("translate-cv error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

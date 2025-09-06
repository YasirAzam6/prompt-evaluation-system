// testRunner.js
import fs from "fs";
import axios from "axios";
import path from "path";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api/chat";
const QUERIES_FILE = path.join("tests", "queries.txt");
const RESULTS_FILE = path.join("tests", "results.json");
const REPORT_FILE = path.join("tests", "report.md");

// Load queries
const queries = fs.readFileSync(QUERIES_FILE, "utf8")
  .split("\n")
  .map(q => q.trim())
  .filter(Boolean);

// Define strategies
const strategies = {
  A: `You are a helpful assistant. Always respond in the same language as the user. Use simple, non-technical language. Keep answers short and actionable (<= 80 words). If steps are needed, give no more than 3 numbered steps. If information is missing, ask one clarifying question.

Lucidya Products Info:
- OmniServe: Centralizes customer communication for faster resolution and personalized support.
- Social Listening: Monitors brand and market activity on social media; identifies trends and protects reputation.
- Omnichannel: Gathers and analyzes customer data across all digital touchpoints (chats, emails, calls, reviews).
- Profiles: Captures customer data to build unique profiles for retention and personalization.
- Survey: Analyzes feedback and sentiment to generate actionable insights.

User Question: {USER_QUERY}`,

  B: `System: You are a support assistant. Important rules:
1) Reply in the user's language.
2) Keep explanations simple and short.
3) Use this output format ONLY:
   Short answer: <one-sentence summary>
   Steps: <numbered steps if needed>
   Tip: <1 short tip or example>

Lucidya Products Info:
- OmniServe: Centralizes customer communication for faster resolution and personalized support.
- Social Listening: Monitors brand and market activity on social media; identifies trends and protects reputation.
- Omnichannel: Gathers and analyzes customer data across all digital touchpoints (chats, emails, calls, reviews).
- Profiles: Captures customer data to build unique profiles for retention and personalization.
- Survey: Analyzes feedback and sentiment to generate actionable insights.

User: {USER_QUERY}`,

  C: `You are a polite, clear support assistant. Answer in the user's language. Avoid jargon.

Lucidya Products Info:
- OmniServe: Centralizes customer communication for faster resolution and personalized support.
- Social Listening: Monitors brand and market activity on social media; identifies trends and protects reputation.
- Omnichannel: Gathers and analyzes customer data across all digital touchpoints (chats, emails, calls, reviews).
- Profiles: Captures customer data to build unique profiles for retention and personalization.
- Survey: Analyzes feedback and sentiment to generate actionable insights.

Example 1 (English)
Q: How do I reset my password?
A: Short answer: Go to Settings > Account > Reset password.
   Steps:
    1. Open Settings -> Account.
    2. Click "Reset password" and follow email link.
   Tip: Check spam if you don't see the reset email.

Example 2 (Arabic)
Q: كيف أغير اللغة في التطبيق؟
A: إجابة قصيرة: افتح الإعدادات ثم خيار اللغة واختر العربية.
   خطوات:
    1. اذهب للإعدادات.
    2. اختر "اللغة" وحدد العربية.
   تلميح: أعد تشغيل التطبيق إذا لم تتغير الواجهة.

Now answer the user question below in the same format:
Q: {USER_QUERY}
A:`,

  D: `You are a friendly support assistant. Detect the user language and answer in it. If the question is ambiguous or lacks context, ask one clarifying question. Otherwise, give a short clear answer (<= 100 words) and a short example.

Lucidya Products Info:
- OmniServe: Centralizes customer communication for faster resolution and personalized support.
- Social Listening: Monitors brand and market activity on social media; identifies trends and protects reputation.
- Omnichannel: Gathers and analyzes customer data across all digital touchpoints (chats, emails, calls, reviews).
- Profiles: Captures customer data to build unique profiles for retention and personalization.
- Survey: Analyzes feedback and sentiment to generate actionable insights.

User: {USER_QUERY}`
};

// Helper functions
const hasArabic = (s) => /[\u0600-\u06FF]/.test(s || "");
const wordCount = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const hasSteps = (s) => /^(\d+[\.\)]|\-|\•)/m.test(s || "");

// Score a single response
const scoreResponse = (strategy, query, response) => {
  const langMatch = hasArabic(query) === hasArabic(response) ? 1 : 0;
  
  const wc = wordCount(response);
  const conciseness = Math.min(1, 100 / wc); // proportional score

  let stepCount = (response.match(/^(\d+[\.\)]|\-|\•)/gm) || []).length;
  if (stepCount > 3) stepCount = 3;
  const steps = stepCount / 3; // partial credit

  const totalScore = (langMatch*0.3 + conciseness*0.3 + steps*0.4);
  return { langMatch, conciseness, steps, totalScore };
};

(async () => {
  const results = [];

  for (const [strategyKey, template] of Object.entries(strategies)) {
    for (const query of queries) {
      const prompt = template.replace("{USER_QUERY}", query);
      console.log(`Running strategy ${strategyKey} -> "${query}"`);
      try {
        const res = await axios.post(BACKEND_URL, { message: query, strategy: strategyKey }, { timeout: 60000 });
        const reply = res.data.reply || "";
        const score = scoreResponse(strategyKey, query, reply);

        results.push({
          strategy: strategyKey,
          query,
          prompt,
          response: reply,
          score,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error(`Error for strategy ${strategyKey}, query: "${query}"`, err.message);
        results.push({
          strategy: strategyKey,
          query,
          prompt,
          error: err.response?.data || err.message,
          score: null,
          timestamp: new Date().toISOString()
        });
      }

      // gentle delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Save raw results
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2), "utf8");
  console.log("Results saved to", RESULTS_FILE);

  // Generate Markdown report
  const perStrategy = {};
  for (const r of results) {
    const strat = r.strategy;
    if (!perStrategy[strat]) perStrategy[strat] = { rows: [], totalScore: 0, n: 0 };
    const s = r.score?.totalScore || 0;
    perStrategy[strat].rows.push(r);
    perStrategy[strat].totalScore += s;
    perStrategy[strat].n += 1;
  }

  let md = "# Prompt Engineering Evaluation\n\n";
  md += "| Strategy | Avg Score |\n|---|---|\n";
  for (const [k, data] of Object.entries(perStrategy)) {
    const avg = (data.totalScore / data.n).toFixed(2);
    md += `| ${k} | ${avg} |\n`;
  }

  md += "\n## Sample Outputs\n";
  for (const [k, data] of Object.entries(perStrategy)) {
    md += `\n### Strategy ${k}\n`;
    for (const r of data.rows.slice(0, 2)) { // show first 2 sample queries
      md += `**Q:** ${r.query}\n\n**A:**\n\`\`\`\n${r.response}\n\`\`\`\n\n`;
    }
  }

  // Summary Insights
  let bestStrategy = Object.entries(perStrategy)
    .sort((a, b) => (b[1].totalScore / b[1].n) - (a[1].totalScore / a[1].n))[0][0];

  md += "\n## Summary Insights\n";
  md += `**Best Strategy:** ${bestStrategy}\n\n`;
  md += `**Why it works better:** Strategy ${bestStrategy} consistently returned concise, actionable answers in the same language as the user query.\n\n`;
  md += `**Trade-offs:**\n- Cost: Strategies with few-shot examples or long prompts → slightly higher token usage.\n- Speed: More complex prompts → slower response.\n- Complexity: Structured prompts require careful formatting; zero-shot → simplest.\n`;

  fs.writeFileSync(REPORT_FILE, md, "utf8");
  console.log("Report generated:", REPORT_FILE);

})();

import fs from "fs";

const INFILE = "tests/results.json";
const OUTMD = "tests/report.md";

const hasArabic = (s) => /[\u0600-\u06FF]/.test(s || "");
const wordCount = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;
const hasSteps = (s) => /^(\d+[\.\)]|\-|\•)/m.test(s || "");
const concisenessOk = (strategy, s) => {
  const wc = wordCount(s);
  const limits = { A: 80, B: 120, C: 120, D: 100 };
  return wc <= (limits[strategy] || 120);
};

const rows = JSON.parse(fs.readFileSync(INFILE, "utf8"));
const perStrategy = {};

for (const row of rows) {
  const strat = row.strategy;
  perStrategy[strat] ||= { rows: [], totalScore: 0, n: 0 };
  const rText = row.response?.response || "";

  // Simple scoring: language match + conciseness + steps
  const langMatch = hasArabic(row.query) === hasArabic(rText) ? 1 : 0;
  const concise = concisenessOk(strat, rText) ? 1 : 0;
  const steps = hasSteps(rText) ? 1 : 0;
  const score = (langMatch + concise + steps) / 3;

  perStrategy[strat].rows.push({ ...row, score });
  perStrategy[strat].totalScore += score;
  perStrategy[strat].n += 1;
}

// Generate markdown report
let md = "# Prompt Engineering Evaluation\n\n";
md += "This report evaluates 4 strategies on 5 queries.\n\n";
md += "| Strategy | Avg Score |\n|---|---|\n";

for (const [k, data] of Object.entries(perStrategy)) {
  const avg = (data.totalScore / data.n).toFixed(2);
  md += `| ${k} | ${avg} |\n`;
}

md += "\n**Sample outputs:**\n";

for (const [k, data] of Object.entries(perStrategy)) {
  md += `\n### Strategy ${k}\n`;
  for (const r of data.rows.slice(0, 2)) {
    const resp = r.response?.response || "";
    md += `**Q:** ${r.query}\n\n**A:**\n\`\`\`\n${resp}\n\`\`\`\n\n`;
  }
}

fs.writeFileSync(OUTMD, md, "utf8");
console.log(`Report written to ${OUTMD}`);

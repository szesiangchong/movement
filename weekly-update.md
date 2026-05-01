---
name: weekly-update
description: Generate a Partners Weekly DD Update presentation for Project Diamond (Carats & Co acquisition). Use when the user mentions "weekly update", "partners update", "weekly deck", "DD update deck", "weekly prep", or wants to prepare a status update for Movement partners on the Carats DD process. This skill reads from the VDR folder structure, IRL tracker, and on-site meeting notes to produce a structured PowerPoint deck.
---

# Partners Weekly DD Update — Project Diamond

> **CRITICAL — LIVE DEAL, DD PHASE**: This skill is used during an active due diligence process. All content in the deck MUST be strictly factual and sourced directly from the files in the VDR and on-site meeting notes. Do NOT make assumptions, infer, extrapolate, or fill in gaps with general knowledge. If a data point is not explicitly stated in the source files, do not include it — flag it as "not yet received" or "pending confirmation" instead. Every finding, number, and statement must be traceable to a specific file or document. Maintain clarity and precision on all pointers at all times — ambiguous or vague language is not acceptable in a partners-facing DD update.

Generates a PowerPoint deck summarising the week's DD progress for Movement partners. The deck uses the Movement template and is structured into 4 segments plus appendices.

## Prerequisites

- **Template file**: `Weekly update template.pptx` in the uploads folder or workspace. This contains the Movement header bar.
- **PPTX skill**: Read and follow `/sessions/nice-dazzling-pascal/mnt/.claude/skills/pptx/SKILL.md` and its sub-guides (`editing.md`, `pptxgenjs.md`) for all slide creation/editing.

## Workspace Structure

```
202602 Carat & Co (SG building signages)/
├── 04 - Due Diligence/
│   └── On-site Meetings/          ← Source for Segment 2 findings (merged with VDR findings)
├── 08 - VDR/
│   ├── VDR caa {DD MMM YYYY}/    ← Weekly VDR drops (e.g., "VDR caa 23 April 2026")
│   │   ├── Project Diamond - Information Request List.xlsx   ← IRL tracker
│   │   ├── A. Corporate and Entity Structure/
│   │   ├── B. Financial Statements and Management Accounts/
│   │   ├── C. FY26 Budget and Growth Plan/
│   │   ├── D. Revenue, Order Book and Drivers/
│   │   ├── E. Working Capital and Cash/
│   │   ├── F. Assets, Leases and Insurance/
│   │   ├── G. Tax and Compliance/
│   │   ├── H. Legal and Contracts/
│   │   ├── I. People and Organisation/
│   │   └── J. Technology and Systems/
│   └── Pre-LOI VDR/
└── ...
```

## Template Layout

The template has a single slide with the Movement header bar. All content slides replicate this header:

- **Header bar**: Full-width navy rectangle (`#001530`), height 0.45"
  - Movement logo (white mark) at x=0.25, y=0.05, w=0.9, h=0.35
  - "PROJECT DIAMOND" in Georgia Bold 10pt white, x=1.3, valign middle
  - "Carats & Co" in Calibri 8pt muted (`#8896A6`), x=3.3, valign middle
  - "STRICTLY CONFIDENTIAL" in Calibri 6pt gold (`#B8952A`), right-aligned
  - "WEEKLY UPDATE AS OF {DATE} | DD PHASE" in Calibri 6pt muted, right-aligned below
- **Content area**: Starts at y=0.6, full slide width with 0.5" margins
- **Layout**: `LAYOUT_16x9` (10" × 5.625")

### Color Palette

| Element | Hex |
|---------|-----|
| Header bar / table headers | `#001530` (deep navy) |
| Accent / gold | `#B8952A` |
| Muted text | `#8896A6` |
| Tier 1 (high priority) badge | `#C62828` (red) |
| Tier 2 (medium priority) badge | `#E65100` (orange) |
| Done / completed / positive YoY | `#2E7D32` (green) |
| Negative YoY / 0% categories | `#C62828` (red) |
| Body text | `#1A1A1A` |
| Light background for table rows | `#F5F7FA` |

### Typography

| Element | Font | Size |
|---------|------|------|
| Slide title | Georgia Bold | 16pt |
| Section header | Calibri Bold | 11pt |
| Body / table content | Calibri | 8–9pt |
| Table header | Calibri Bold | 8pt, white on navy |
| Finding tables | Calibri | 7–8pt (to fit 5-column layout) |
| Captions / footnotes | Calibri | 7pt, muted |

## Deck Structure

### Slide 1: Cover
- Navy background (`#001530`)
- Movement logo (centred, white on white rectangle)
- "PROJECT DIAMOND" in large Georgia Bold white
- "Carats & Co" in muted text
- Gold divider line
- "WEEKLY UPDATE AS OF {DATE} | DD PHASE"
- "STRICTLY CONFIDENTIAL" in gold

---

### Slide 2: VDR Progress (Segment 1)

**Title**: "1. VDR — Items Received This Week"

- **Key stats callout** (large, prominent):
  - Left: "{N} files received" (bold, large font)
  - Right: "IRL Progress: X/Y (Z%)" (bold, large font)
- **Category table** (A–K):

| Cat | Category | IRL | Done | % | Files |
|-----|----------|-----|------|---|-------|

- Green text for 100% categories, red for 0%
- Navy header row, alternating `#F5F7FA` / white body rows
- Bold total row at bottom

---

### Slide 3: Key Items Not Yet Received

**Title**: "Key Items Not Yet Received"

Prioritised table of the most critical outstanding IRL items blocking workstreams:

| Priority | Ref | Item | Why It Matters |
|----------|-----|------|----------------|

- Priority levels: **Critical** (red text), **High** (orange text), **Standard** (muted text)
- Critical = blocking a major workstream (model, legal DD, FDD advisor)
- High = needed within 1–2 weeks
- Standard = important but not blocking
- Include items like: Gleamedia screen inventory (F2), legal contracts (H1/H2/H7), revenue data gaps (D3–D12), budget (C1–C4), people data (I3–I6)

---

### Slide 4: Key Findings Overview (Segment 2)

**Title**: "2. Key Findings & Red Flags"

Two summary tables on one slide:

**Table 1: Group Financial Summary** (from B6 Monthly P&L)

| Entity | FY24 Rev | FY25 Rev | YoY | FY24 EBITDA | FY24 Margin | FY25 EBITDA | FY25 Margin |
|--------|----------|----------|-----|-------------|-------------|-------------|-------------|

- Calculate EBITDA as: PBT + Depreciation + Finance Costs (read from P&L)
- YoY column: green for positive, red for negative
- Bold group total row

**Table 2: Customer Concentration** (from D13)

| Entity | Top 1 Client | Top 1 % | Top 5 % | Top 10 % |
|--------|-------------|---------|---------|----------|

- Red text for any concentration >20%
- Gold callout box below with key risk narrative (e.g., Stellar Ace CoC provisions)

---

### Slides 5–6: Key Findings — Tier 1 (High Priority)

**Title**: "Key Findings — Tier 1 (High Priority)" with red T1 badge

Findings from ALL sources (on-site meetings AND VDR analysis) are merged into a single prioritised list. Do NOT separate findings by source — categorise by topic area instead (e.g., Operations, Financial, Commercial, Legal).

5-column table format with bullet-pointed content in cells:

| Category | Topic | Description | Impact | Action |
|----------|-------|-------------|--------|--------|

- **Content in each cell uses bullet points** (• marker with `<br>` line breaks), not prose paragraphs
- Topic column: bold, concise label
- Description: factual bullets from meeting notes or VDR files. Include source reference and any pending items in [brackets]
- Impact: so-what bullets for the deal — **include dollar value estimates where possible** (see Quantification section below)
- Action: next steps, who owns it, timeline
- Use 7–8pt font to fit content
- Split across 2 slides if >3 findings (aim for 2–3 findings per slide)
- Reference appendices where supporting data exists (e.g., "Refer to Appendices for table")

**Types of T1 findings:**
- Customer concentration risk (single client >20% of entity revenue)
- Revenue decline or EBITDA compression vs prior year
- Client base churning — assess replacement rate (new client revenue vs lost client revenue)
- P&L red flags (margin collapse, unusual cost spikes, one-offs)
- Keyman risk on critical operations
- Undisclosed liabilities or contingent exposures

**Include a top client analysis table** (can be on its own slide or in appendices):
- Blended top clients across FY2023–FY2025, sorted by FY2025 descending
- Include ALL clients that were in the top 10 in ANY of the 3 years — shows the churn
- Bottom rows: Top 10 per year total, Total entity revenue, Top 10 % of total
- YoY column: green for positive, red for negative, "New" or "Exit" where applicable

---

### Slide 7: Key Findings — Tier 2 (Medium Priority)

**Title**: "Key Findings — Tier 2 (Medium Priority)" with orange T2 badge

Same 5-column table format, same merged approach (on-site + VDR findings together). These are issues that need attention but are manageable or will be resolved in FDD/post-close.

**Types of T2 findings:**
- Working capital trends where DSO shows volatility but no structural deterioration (flag for FDD confirmation)
- Dividend distribution patterns (include entity-level breakdown table by year)
- Growth trajectory of sub-segments (e.g., Adactive L&M)
- Operational fragility (outsourced workforce, manual processes)
- Intercompany pricing gaps or transfer pricing issues

**Dividend detail sub-table** (on the same slide, below the findings table):
- Columns by year (FY2024, FY2025, etc.) — use all available years from board minutes
- Rows by entity (Carats, Gleamedia, Adactive)
- Notes column for context (e.g., "S$21M from property sale")
- Total row with recurring vs extraordinary split

---

### Quantifying Findings — Dollar Value Estimates

**Every finding should include a dollar value estimate where possible** to show partners the scale of each issue. This is critical for prioritising DD efforts and informing valuation adjustments.

**How to quantify:**
1. **Customer concentration** — state the revenue at risk (e.g., "Stellar Ace: S$4.5M = 30% of Carats revenue; CoC provisions could trigger loss of contract post-close")
2. **Client churn** — calculate net revenue impact (e.g., "Net client churn: -S$2.03M (S$7.44M lost vs S$5.41M replaced)")
3. **Unallocated costs** — estimate the annual cost exposure (e.g., "Unallocated worker costs: S$1.67M/year across X workers not assigned to projects")
4. **Intercompany gaps** — quantify the margin leakage (e.g., "Gleamedia interco pricing gap: S$32K vs S$34–51K at cost = potential margin subsidy")
5. **Revenue decline** — show absolute and percentage (e.g., "Carats FY25 revenue: S$15.0M, down S$1.5M (-9.1%) YoY")
6. **Keyman risk** — estimate operational value tied to individual (e.g., "Raymond oversees S$X M of annual production output")
7. **Rostrum / segment isolation** — flag when data is unavailable to quantify (e.g., "Rostrum revenue buried in Local Sales S$14.8M — cannot isolate without D3–D6 project-level data")

**If a dollar value cannot be estimated**, explicitly state why (e.g., "data not yet received", "requires D3–D6 project-level breakdown") so the team knows to request the data.

**Do NOT fabricate or estimate loosely.** All numbers must be traceable to VDR files or on-site meeting notes. Use ranges where precision is not possible (e.g., "S$1.5–2.0M estimated impact").

---

### Slide 11: IC Memo & Model + Next Week (Segments 3 & 4)

**Combined on one slide** (or split into two if content is heavy).

**Segment 3**: IC Memo & Financial Model Progress
- Status update per entity on what data is still needed for the model
- IC memo status (not started / drafting / review)

**Segment 4**: Next Week — Key Activities
- Bullet list of planned activities
- Include **Operations Committee (OpsCo) agenda** if scheduled — list proposed agenda items in a numbered sub-table

---

### Appendices (Final slides)

Multiple appendix slides as needed:

1. **Top Client Analysis Table** — blended top 10+ clients FY2023–2025 with revenue by year, YoY change
2. **Working Capital & DSO Trend** — quarterly tables showing Trade AR, Quarterly Revenue, and DSO for each entity. Use annual revenue / 365 method for DSO. Include explanatory note comparing entities.
3. **Daily Labour Allocation** — photo/screenshot from on-site (if available)
4. **VDR File Listing** — complete file listing by category (if requested)

All appendix slides use the same header bar and 7–9pt font for tables.

---

## Execution Steps

1. **Read the PPTX skill**: Always read the PPTX SKILL.md first.

2. **Identify the current week's VDR folder**:
   ```bash
   ls "08 - VDR/" | grep "VDR caa"
   ```

3. **Read the IRL tracker**: Parse categories and column L completion status.

4. **Scan VDR files**: Count per category, list key documents.

5. **Analyse VDR files substantively**: Open and read key xlsx files (B6, E1, D13, D15, B7, D7) to extract financial data, calculate trends, and identify risks. **Quantify each finding with a dollar value.**

6. **Read on-site meeting notes**: Extract findings from `.docx` files in `04 - Due Diligence/On-site Meetings/`. **Quantify findings where possible using VDR data.**

6b. **Merge all findings**: Combine on-site and VDR findings into a single prioritised list. Categorise by topic (Operations, Financial, Commercial, Legal), NOT by source.

7. **Build the deck**: Use pptxgenjs to create from scratch, replicating the header bar on every slide.

8. **QA**: Convert to PDF/images, inspect with subagent, fix issues.

9. **Save output**:
   ```
   06 - Correspondence/Project Diamond - Weekly Update ({date}).pptx
   ```

---

## Important Notes

- **Do not fabricate findings.** Only report what is actually in the files.
- **Cross-reference with memory.** Check auto-memory for Project Diamond context but verify against current files.
- **Maintain confidentiality markings.** Every slide must carry "STRICTLY CONFIDENTIAL".
- **Date format**: "DD MMMM YYYY" (e.g., "24 APRIL 2026").
- **Keep it tight.** Aim for 10–14 slides total (including appendices). Partners want signal, not noise.
- **Findings use table format with bullet-pointed content in cells.** Do NOT use prose paragraphs or standalone bullet lists for findings. Use the 5-column table (Category | Topic | Description | Impact | Action) with • bullets and `<br>` line breaks within each cell.
- **Findings are merged by topic, not by source.** Do NOT separate "On-site Findings" from "VDR Findings". All findings go into a single T1 or T2 section, categorised by topic area (Operations, Financial, Commercial, Legal).
- **Every finding needs a dollar value.** Quantify the scale of each issue where possible. If data is unavailable, state what's needed to quantify it. See the Quantification section above.
- **DSO methodology**: Always use Annual Revenue / 365 as the denominator. Do NOT estimate quarterly revenue or use monthly revenue — pull actual figures from B6 monthly P&L and sum appropriately.
- **File-gap tracking goes in Segment 1** (Key Items Not Yet Received), NOT in Segment 2 findings. Segment 2 is for substantive analysis of files that HAVE been received.

---

## Post-Execution Review Layer

> **After building the deck, run this checklist before delivering to the user.** These are the patterns Jerry (Partner) consistently flags. Catching them pre-delivery avoids rework and builds credibility.

### R1. Tone Calibration — "Positions to Test, Not Decisions Made"

Scan every Description, Impact, and Action cell for conclusive or alarmist language. The deck is a DD working document, not a final IC memo — findings should read as hypotheses under investigation, not verdicts.

**Find and replace patterns:**
- "directly impacts entry multiple" → "subject to negotiation; informs our view on entry multiple"
- "could be called" / "would unwind entirely" / "risk of facility recall" → "we will need to size and work through with [counterparty]"
- "delays model build by X weeks" → frame as a workstream with timeline, not a delay claim
- Any conclusion stated as fact → add "subject to FDD", "indicative, pending validation", or "based on available data"
- "recommend" / "should" in Action → "propose" / "position to test" (unless it's a procedural step like "request data from TH")

**Judgment calls:** Factor in transition effort and dependencies. Present recommendations as positions to test, not decisions made. The partner audience will push back on premature conclusions.

**IMPORTANT — Fact-check all Claude outputs before circulating.** This is a recurring issue. Every number, headcount, operational claim, and utilisation rate must be verified against source files before the deck ships. Do not trust prior-session outputs without re-checking — the same factual slip has come up multiple times.

### R2. Tier Categorisation Rubric

Before finalising tier assignments, apply this rubric:

| Tier | Criteria | Examples |
|------|----------|---------|
| **Tier 1** | Moderate to high impact on LOI investment case; deeper DD needed to size or resolve | Customer concentration with CoC risk, keyman with no succession, material revenue decline |
| **Tier 2** | Low to moderate impact; clarification or DD follow-up needed | Banking facilities within LOI parameters, operational process gaps, interco pricing |
| **Observations** | Minimal to low impact; FYI items | Clean litigation, positive warranty history, sub-scale but growing segments |

**Common mis-categorisations to watch for:**
- PG/BG and banking items that are within LOI case → T2, not T1 (unless they surface a new risk not contemplated in LOI). Restricted cash being addressed in equity bridge does not warrant T1.
- UOB CoC / facility items where amount is low and continuity of operations and debt serviceability are intact → T2. Drop alarmist framing ("facility recall, repricing") if actual exposure doesn't warrant it.
- Family dynamics / segment items (e.g., Rostrum) where the segment may not be significant to group revenue → T2 or Observation. Verify materiality before elevating.
- Items that read as "FYI" or "no action needed" → Observations, not T2. Carried-forward T2 items (e.g., interco billing, Adactive L&M, dividends) that haven't changed and read as informational should be moved to Observations.
- Carried-forward items that haven't changed → consider downgrading if no new information.

**Re-sort discipline:** After applying the rubric, re-order slides so all T1s appear first, then T2s, then Observations. Within each tier, new findings appear before carried-forward. Label each slide title with "(new this week)" or "(Week of X, carried forward)" accordingly.

### R3. Factual Accuracy — Verify Before Stating

Every number, headcount, and operational claim must be traceable to a specific VDR file or meeting note. Common error patterns:

- **Headcount attribution**: Do not aggregate worker categories loosely. Cross-check against the org chart / I-series files. If the slide says "~100 workers under Raymond", verify which categories (construction, manufacturing, maintenance) are actually under his supervision vs. managed by other team leads.
- **Facility utilisation**: When quoting utilisation rates, specify which sub-facility (PG vs PG2 vs OD) and show the calculation. Do not divide total outstanding by a single sub-limit.
- **Revenue figures**: Cross-check any revenue figure cited in findings against B6 P&L. If the top-client appendix shows a different total than the P&L, flag and reconcile — do not let inconsistencies ship.
- **Compensation / savings estimates**: Distinguish between gross savings (if person exits entirely) vs. realistic phased savings (transition arrangements, advisor roles). State assumptions.

### R4. Compensation & Add-back Discipline

When presenting family compensation findings:

- **Do not present gross savings as falling to EBITDA at completion.** Frame as potential, phased, and pre-completion governance.
- **Phasing**: Assume ~50–75% realisation in Y1 (transition arrangements, face-saving titles), full run-rate Y2+. State this explicitly.
- **Incentive restructuring ≠ EBITDA add-back**: Shifting fixed bonuses to variable comp (e.g., moving 2nd-month AWS to performance-linked) does not flow to EBITDA unless total comp drops. Do not put it in the add-back stack. Present it as what it is: alignment improvement.
- **Commission / profit-sharing**: Flag if BU-level profit-sharing creates entity silos rather than group alignment. Recommend group-level KPIs and MIP structure post-completion.
- **Governance overlay**: Include compensation committee with threshold (e.g., ~S$150K) — any manager above that gets a documented role + market benchmark, plus any family-related staff.

### R5. Risk Framing — Balanced, Not Alarmist

For high-profile risks (customer concentration, CoC clauses, keyman):

- **Always include mitigation context.** A 30-day termination clause is legally real but commercially harder to trigger. State both sides.
- **Frame switching costs**: If the counterparty's own SLAs carry penalties, if prior vendors have failed, if operational scale is hard to replicate — say so.
- **Net assessment**: End the Impact cell with a balanced net view (e.g., "Risk is real — size SPA protections — but commercial reality suggests low near-term probability of exercise").
- **Avoid**: "could be called", "would unwind entirely", "at risk of immediate loss" without qualification.

### R6. FDD Provider References

Do not hardcode a specific FDD provider name (e.g., "KPMG") unless the engagement is formally signed. Until then, use "FDD provider (TBD)" or "FDD workstream" throughout the deck. This applies to:
- NWC baseline references
- Scope descriptions
- Action items referencing FDD deliverables

If a specific provider has been engaged for a limited scope (e.g., secondment for AR analysis), name them for that specific scope only and clarify the boundary.

### R7. Cross-Slide Consistency & QC Check

Before delivering, run these specific checks:

**Number consistency:**
- Revenue figures in findings slides must match B6 P&L and appendix totals. If the top-client appendix shows FY23 = S$22M but the P&L shows a different figure, reconcile or flag the delta.
- EBITDA, margin, and YoY figures cited in findings must match the summary table on the Key Findings overview slide.
- Any dollar value cited in Impact/Description must be traceable — grep the deck for each figure and verify its source.

**Rate / ratio consistency:**
- Utilisation rates must be consistent between findings slides and appendices. If the appendix says "PG: 42%, PG2: 99.9%", the findings slide must not say "97%".
- DSO figures must use the same methodology (Annual Revenue / 365) across all slides.
- Concentration percentages (Top 1%, Top 5%) must match between the overview and detailed findings.

**Structural consistency:**
- Tier labels on slide titles must match the content's actual tier assignment after R2 re-sorting.
- Carried-forward items: check if new information this week changes the tier or content. Update or flag.
- Slide numbering references within the deck (e.g., "Refer to Appendices") must point to the correct slide after any re-ordering.

**Factual cross-checks:**
- Headcount claims: verify against org chart / I-series VDR files. Do not state "~100 workers under X" without checking which categories are actually under that person's supervision.
- Contract terms: verify clause references (e.g., CoC section numbers, termination notice periods) against the actual facility letters or contracts in the VDR.
- Dates and timelines: ensure "as of" dates, expiry dates, and "since" dates are accurate (e.g., "OD undrawn since May'24" — verify against bank statements).

### R8. Next Week Activities — Operational Depth

The "Next Week" slide should include at least one operational/commercial activity beyond desk-based DD:
- **Ridealongs / site visits**: Customer sites, tender meetings, production floor, maintenance routes
- **Management sessions**: OpsCo agenda items, 1-on-1s with key operators
- **Stakeholder engagement**: UOB (for CoC), key customers (if appropriate at this stage)

Frame activities as building conviction and understanding the business beyond data room artefacts.

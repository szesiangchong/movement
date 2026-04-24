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
│   └── On-site Meetings/          ← Source for Segment 2 (on-site findings)
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

### Slides 5–6: On-site Findings — Tier 1

**Title**: "On-site Findings — Tier 1 (High Priority)" with red T1 badge

5-column table format with bullet-pointed content in cells:

| Category | Topic | Description | Impact | Action |
|----------|-------|-------------|--------|--------|

- **Content in each cell uses bullet points** (• marker with `<br>` line breaks), not prose paragraphs
- Topic column: bold, concise label
- Description: factual bullets from meeting notes. Include source reference and any pending items in [brackets]
- Impact: so-what bullets for the deal
- Action: next steps, who owns it, timeline
- Use 7–8pt font to fit content
- Split across 2 slides if >3 findings (aim for 2–3 findings per slide)
- Reference appendices where supporting data exists (e.g., "Refer to Appendices for table")

---

### Slide 7: On-site Findings — Tier 2

**Title**: "On-site Findings — Tier 2 (Medium Priority)" with orange T2 badge

Same 5-column table format. These are issues that need attention but are manageable or will be resolved in FDD/post-close.

---

### Slides 8–9: VDR Findings — Tier 1

**Title**: "VDR Findings — Tier 1 (High Priority)" with red T1 badge

Same 5-column table format. **These findings come from substantive analysis of actual VDR file contents**, not just file-gap tracking.

**How to generate VDR findings:**
1. **Read the financial data** — open B6 (monthly P&L), E1 (monthly BS), D13 (clients), D15 (revenue breakdown), B7 (interco), D7 (L&M split) using openpyxl
2. **Assess trends** — is revenue growing or declining? Is WC in line with revenue? Any margin compression?
3. **Flag anomalies** — AR aging deterioration, client concentration, revenue lumpiness, unusual cost spikes
4. **Link to deal context** — how does this affect valuation, structure, or risk assessment?
5. **Use the right DSO methodology** — DSO = Trade AR / (Annual Revenue / 365). Do NOT use monthly or estimated quarterly revenue as denominator. Verify against actual B6 monthly P&L data.

**Types of T1 VDR findings:**
- Customer concentration risk (single client >20% of entity revenue)
- Revenue decline or EBITDA compression vs prior year
- Client base churning — assess replacement rate (new client revenue vs lost client revenue)
- P&L red flags (margin collapse, unusual cost spikes, one-offs)

**Include a top client analysis table** (can be on its own slide or in appendices):
- Blended top clients across FY2023–FY2025, sorted by FY2025 descending
- Include ALL clients that were in the top 10 in ANY of the 3 years — shows the churn
- Bottom rows: Top 10 per year total, Total entity revenue, Top 10 % of total
- YoY column: green for positive, red for negative, "New" or "Exit" where applicable

---

### Slide 10: VDR Findings — Tier 2

**Title**: "VDR Findings — Tier 2 (Medium Priority)" with orange T2 badge

Same 5-column table format. These are notable findings that don't rise to T1 but should be tracked.

**Types of T2 VDR findings:**
- Working capital trends where DSO shows volatility but no structural deterioration (flag for FDD confirmation)
- Dividend distribution patterns (include entity-level breakdown table by year)
- Adactive L&M growth trajectory
- Operational fragility (outsourced workforce, manual processes)

**Dividend detail sub-table** (on the same slide, below the findings table):
- Columns by year (FY2024, FY2025, etc.) — use all available years from board minutes
- Rows by entity (Carats, Gleamedia, Adactive)
- Notes column for context (e.g., "S$21M from property sale")
- Total row with recurring vs extraordinary split

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

5. **Analyse VDR files substantively**: Open and read key xlsx files (B6, E1, D13, D15, B7, D7) to extract financial data, calculate trends, and identify risks.

6. **Read on-site meeting notes**: Extract findings from `.docx` files in `04 - Due Diligence/On-site Meetings/`.

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
- **DSO methodology**: Always use Annual Revenue / 365 as the denominator. Do NOT estimate quarterly revenue or use monthly revenue — pull actual figures from B6 monthly P&L and sum appropriately.
- **File-gap tracking goes in Segment 1** (Key Items Not Yet Received), NOT in Segment 2 findings. Segment 2 is for substantive analysis of files that HAVE been received.

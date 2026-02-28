# Annex Generator — DDQ/IRL & Market Overview

> **Trigger:** After completing a target screening memo using `target-screening-lite.md`, run this prompt to generate two standalone Word documents as annexes. These are external-facing deliverables — suitable for sending to the seller, broker, or VDR.

---

## Document 1: DDQ & IRL

**Filename:** `[YYMMDD] Annex - [Project Name] DDQ and IRL.docx`

Generate a Word document containing the due diligence questions and information request list, split into two sections. Use the screening memo's analysis, financial profile, and risk flags as inputs to generate targeted, opinionated questions.

### Document Format

**Header (every page):**
- Movement logo (`movement-logo.png` from this repo), centered
- Below logo: `[PROJECT NAME]  |  DDQ & Information Request List  |  [Context, e.g. "Post-Info Request 260203"]` — centered, 8pt, bold project name in dark (#1A2332), rest in grey (#666666)

**Footer (every page):**
- `Movement  |  CONFIDENTIAL  |  Page [X]` — centered, 7pt, grey (#999999)

**Title block:**
- Title: `[Project Name] — DDQ & Information Request List`
- Subtitle: `[Target Legal Name]  |  [Context]`
- Date line: `Prepared: [DD Month YYYY]  |  Movement`

### Section: Key Findings

Before the questions, include a **Key Findings** summary table. This is the "so what" bridge — what we learned from the last round of information exchange and what it means for the deal.

| Finding | Investment Implication |
|---|---|
| [Concise finding — 1 line] | [Why it matters for the thesis — 1-2 lines] |

Target 4-8 rows. Each row should be a distinct finding that motivates one or more questions below. Bold the finding column. Dark header row (#1A2332, white text).

### Section A: Follow-Up Questions

Discussion items for management meetings and calls — things requiring explanation, context, or judgement.

| # | Tag | Topic | Question | Rationale | Pri. | Status |
|---|---|---|---|---|---|---|
| 1 | [TAG] | [Topic] | [Full question — multi-part where needed] | [Opinionated: what the bull vs. bear answer looks like] | P0/P1/P2 | ☐ |

**Tag types:**
- **PUSHBACK** — previously asked but deflected or inadequately answered. Must be re-raised.
- **FOLLOW-UP** — based on a prior response that opened a new thread.
- **NEW** — not previously asked. Driven by screening memo analysis.
- **IN-PERSON** — requires physical meeting or factory tour.

**Priority:**
- **P0** = Pre-LOI gating. Must be answered before any term sheet.
- **P1** = Phase 1 DD (weeks 1-3 post-LOI).
- **P2** = Nice-to-have / confirmatory.

**Guidance:**
- Questions should require management explanation, not just data. If answerable by sending a file, it belongs in Section B.
- Multi-part questions are preferred where a single topic requires several angles.
- Rationale should state what the bull vs. bear answer looks like and what it means for the deal.
- Target 10-15 focused questions.

**Priority ordering (group rows in this sequence):**
1. Seller alignment & governance
2. Revenue quality & commercial
3. Operations & capability
4. Strategic

### Section B: Further Information / Files Required

Specific documents, schedules, and data sets to request.

| # | Tag | Topic | Document / Data Required | Purpose | Pri. | Status |
|---|---|---|---|---|---|---|
| 1 | [TAG] | [Topic] | [Specific deliverable — named, with format preference] | [What it validates or disproves in the thesis] | P0/P1/P2 | ☐ |

**Same tag and priority system as Section A.**

**Guidance:**
- Each row = a specific, named deliverable. Not "financial data" but "BU-level P&L for FY2022-FY2025 (revenue, GP, EBITDA by service line), Excel preferred."
- Purpose should tie back to the investment thesis or a specific risk flag.
- Target 15-20 specific document requests.

**Priority ordering (group rows in this sequence):**
1. Financial data — BU-level P&Ls, restated figures, audited accounts
2. Contracts & legal — lease documents, client agreements, CoC clauses
3. Operational data — org chart, headcount, asset schedules, supplier lists
4. Balance sheet & WC — related-party schedules, FX exposure, depreciation detail
5. Strategic — product roadmaps, R&D budgets, distributor agreements

### Legend (below each table)

`**Legend: P0** = Pre-LOI  **P1** = Phase 1 (wks 1–3)  **P2** = Nice-to-have  |  **PUSHBACK** = Previously deflected  **NEW** = Not previously asked  **FOLLOW-UP** = Based on prior response`

### Table Formatting

- Dark header row: background #1A2332, white text, bold
- Alternating row shading: white / light grey (#F5F5F5)
- Tag column: bold, ALL CAPS
- Priority column: bold
- Status column: ☐ (unchecked checkbox)
- Table width: full page width (landscape if needed for readability)
- Cell padding: comfortable (80 top/bottom, 120 left/right in DXA)
- Font: 9pt body, 8pt for rationale column

---

## Document 2: Market Overview

**Filename:** `[YYMMDD] Annex - [Project Name] Market Overview.docx`

Extract and expand Section 6 (Market Overview) from the screening memo into a standalone Word document. This is a reference annex — not a summary, but the full market context with all tables, sources, and analysis.

### Document Format

**Header (every page):**
- Movement logo (`movement-logo.png`), centered
- Below logo: `[PROJECT NAME]  |  Market Overview  |  [Sector]` — same styling as DDQ

**Footer (every page):**
- `Movement  |  CONFIDENTIAL  |  Page [X]` — centered, 7pt, grey (#999999)

**Title block:**
- Title: `[Project Name] — Market Overview`
- Subtitle: `[Sector / Industry]  |  [Geography]`
- Date line: `Prepared: [DD Month YYYY]  |  Movement`

### Content (extract from screening memo Section 6)

Transfer the following sub-sections in full, preserving all tables, source citations, and analysis:

1. **Market Size** — TAM/SAM/SOM table with source column, segment-level breakdown, derivation notes
2. **Right to Play & Right to Win** — licences, certifications, competitive edge, capability gaps
3. **Competitive Landscape & Structural Moat** — three-tier competitor table, combined observations paragraph
4. **Preliminary Risks & Mitigants** — thesis killers, commercial diligence roadmap table

### Formatting

- All tables should use the same dark header row style (#1A2332, white text)
- Source citations must be preserved as hyperlinks
- [ASSUMPTION] tags must be preserved with derivation notes
- Section headers: Heading 1 for main sections, Heading 2 for sub-sections
- Professional, clean — suitable for sharing with co-investors or advisors

---

## Execution Notes

- Both documents must pass the IC Review Gate (SYSTEM_PROMPT.md) before delivery.
- Both documents must use the Movement logo from `movement-logo.png` in this repo.
- If this is a **follow-up** round (i.e., prior DDQ responses have been received), tag questions appropriately as PUSHBACK / FOLLOW-UP / NEW and include a Key Findings table summarising what was learned.
- If this is a **first-round** screening DDQ (no prior responses), omit the Key Findings table and tag all questions as NEW.
- Date format in filename: YYMMDD (e.g., 260228 for 28 Feb 2026).

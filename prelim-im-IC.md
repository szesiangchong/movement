---
name: prelim-im-IC
description: >
  Generate Preliminary Information Memorandums (PIMs) for Movement's Investment Committee presentation at the term sheet stage. Use this skill whenever the user asks to draft a PIM, preliminary memo, term sheet memo, or preliminary investment memorandum for IC review. Also trigger when the user says "draft PIM", "write PIM", "PIM for [project name]", or "preliminary memo for IC".
---

# Preliminary Information Memorandum (PIM) — Term Sheet Stage

> **North-Star Outcome:** Provide the Investment Committee with enough factual, structured information on the target company to make a **go / no-go decision** on whether to proceed to LOI/term sheet.
>
> **Why this matters:** IC members have limited time. The PIM must be action-oriented — "should we engage?" — not an exhaustive DD report. Every section exists to answer one question: does this business warrant deploying Movement capital and bandwidth? If the PIM doesn't drive that decision, it has failed.

Generate a PIM for Movement's IC to decide whether to proceed to LOI/term sheet. The PIM is action-oriented — "should we engage?" — not exhaustive DD.

## Before You Start

1. **Read `Claude.md` and `SYSTEM_PROMPT.md`** from the movement repo for Movement context, IC Review Gate protocol, and communication standards.
2. **Clarify before building.** Never generate on incomplete inputs. Ask one focused round of clarifying questions for any missing data below.
3. **Tag assumptions.** If user says "use best judgment", proceed but tag every gap-fill with `[ASSUMPTION]`.

### Minimum Required Inputs

- Target company name and project codename
- What the business does (products/services, geography)
- Why now — the transition catalyst (founder exit, succession, distress, carve-out, dislocation)
- Historical financials (minimum 2 years: Revenue, EBITDA, margins)
- Indicative valuation or asking price
- Any CIM, teaser, or source materials

If any of the above are missing, stop and ask before proceeding.

### Handling Missing Information

For sections where data is not yet available (e.g., market sizing, comparable companies, detailed customer data):
- **Include the section header** in the document — do not skip it
- Below the header, insert: *"[No information at this stage, to follow-up during DD]"* in grey italic
- If partial information exists, present what is available and tag gaps with `[DD Action: ...]` notes
- This ensures the PIM serves as a living checklist of what still needs to be addressed

### Output Format

**Two-stage output:**
- **Stage 1 (Default):** Generate as a Claude artifact (HTML) for user review and amendment.
- **Stage 2 (On request):** Export to `.docx` using the docx skill, retaining format and style.

This allows iterative review before committing to a Word document.

When exporting to .docx, apply Movement branding:

- **Logo:** `movement-logo.png` centered in header, ~4 inches wide, auto-height
- **Thin horizontal rule** below logo before title
- **Company name:** "Movement" only (never "Movement Capital" or "Invest Movement")
- **Font:** Arial, 12pt body, headings per docx skill style definitions
- **Classification:** "Confidential" on cover page
- **Symbols:** ✓ for highlights, ✗ for risks, ⚠️ for red flags

---

## PIM Section Structure

### 1. Cover Page

Two-section layout inspired by institutional IM cover pages (e.g., Victoria/DVC format):

**Top Section:**
- Movement logo (left-aligned) and target company logo (right-aligned, if available) at the top
- Target company name as large heading (Movement blue, #1F4E79)
- Subtitle: "Preliminary Information Memorandum"
- Date below subtitle

**Main Section (two-column table, no visible borders):**

| Left Column (60% width) | Right Column (40% width) |
|--------------------------|--------------------------|
| **Image placeholder(s)** — 1-2 product/company/facility images. Use grey placeholder boxes with italic "[Insert company/product image]" text if images not available. Stack vertically. | **Key deal metrics** as a bulleted summary: |
| | - **Company Name:** [Target] |
| | - **Country:** [Geography] |
| | - **Activity:** [1-line description] |
| | - **Date:** [Month Year] |
| | - **Deal Type:** [e.g., LBO, Restructuring, Carve-out] |
| | - **FY__A Financials:** Revenue, Adj. EBITDA, Net Debt (with leverage ratio) |
| | - **Structure:** Movement stake %, equity ticket, implied EV and multiple |

**Bottom Section:**
- Confidentiality disclaimer in small font (8-9pt), light grey background
- Standard boilerplate: "This document is confidential, contains unpublished and/or commercially sensitive information..."

**Implementation notes:**
- Use a 2-column table with `BorderStyle.NONE` for the main section
- Left column: image placeholders as grey-shaded cells with centered italic text
- Right column: bulleted key metrics with bold labels
- Color scheme: Movement blue (#1F4E79) for headings, black body text
- Total cover page should fit on one page without scrolling

### 2. Contents Page

> *Added in v2.* For a 20+ page document, IC members need section navigation.

- Hyperlinked table of contents with dot-leader page numbers
- Sections 1–8 with sub-sections listed for Company Overview, Market Overview, and Financial Overview
- Page numbers right-aligned; links jump to corresponding bookmarks in document
- Implementation: Word bookmarks at each heading, `w:hyperlink` with `w:anchor` for TOC links

### 3. Executive Summary

The first substantive page after the cover and contents. IC members may only read this. Keep it tight.

**Must include:**
- Target at a glance (1-2 paragraphs: what it does, where, how big, entity structure)
- Key metrics snapshot table:

| Metric | Value |
|--------|-------|
| Revenue (FY__A) | |
| EBITDA (FY__A) | |
| EBITDA Margin | |
| Employees | |
| Facilities | |
| Key Clients | |
| Recurring Revenue % | |

- Recent developments and status of engagement

> *Change from v1:* Added Key Clients and Recurring Revenue % rows. Dropped "Go/no-go recommendation" from exec summary — this is a PIM, not a screening memo; the recommendation sits in Investment Rationale (Section 7).

### 4. Company Overview

Consolidates: who they are, why now, who runs it, and who buys from them. For multi-entity targets, dedicate a sub-section per entity.

#### 4a. Entity-by-Entity Overview

> *Added in v2.* Instead of a single "The Business" block, break out each entity with its own Key Takeaways callout box. For a multi-entity group, this means:
> - **[Target] Overview** — core business, revenue trends, key operating metrics
> - **[Entity 2] Overview** — with unit economics deep-dive (e.g., revenue per screen, capex per unit, fill rates)
> - **[Entity 3] Overview** — with standalone vs. intercompany revenue split
>
> Each entity sub-section must include a "Key Takeaways" callout box summarising the 3–5 most important points for IC, with analytical commentary (not just data restating).

Each entity overview must cover:
- Products/services description
- Revenue breakdown (by type: project vs. recurring vs. maintenance)
- Key operating metrics relevant to the entity
- Unit economics where applicable (revenue/unit, capex/unit, margin/unit)
- Order book / backlog analysis with book-to-bill ratio
- Intercompany revenue as % of total (flagged for standalone viability assessment)

**Chart Conventions (prescriptive — do not deviate):**

| Data Type | Chart Type | Notes |
|-----------|-----------|-------|
| Revenue / EBITDA over time (by BU) | Clustered bar chart | X-axis = FY periods, one colour per BU. Stacked bar acceptable if showing total + mix simultaneously |
| Revenue or EBITDA mix % over time | 100% stacked bar chart | Shows composition shift across periods. Never use pie charts |
| Margin trends (GP%, EBITDA%) | Line chart overlaid on bar | Bars = absolute values, lines = margin %. Dual y-axis (left = S$, right = %) |
| Unit economics (revenue/screen, capex/unit) | Horizontal bar chart | Ranked by value, highest to lowest. Use for site-level or per-unit comparisons |
| Order book / backlog by category | Stacked bar chart | One bar per period, segments = project type (e.g., Project / Adhoc / Maintenance) |
| Book-to-bill ratio over time | Line chart | Single line with 1.0x reference line. Overlay on backlog bar chart if space allows |
| Customer concentration (top 5/10) | Horizontal bar chart | Ranked descending by % of revenue. Include a cumulative % line if top-10 |
| Balance sheet composition | Waterfall chart | For showing asset/liability bridges or net debt to net cash swings |
| Cash / debt bridge over time | Waterfall chart | Opening → movements → closing format |
| Dividend history by entity | Clustered bar chart | X-axis = FY periods, one colour per entity |
| NWC composition over time | Stacked bar chart | Current assets (positive) vs. current liabilities (negative), net line overlaid |
| DSO / DPO / CCC trends | Line chart | Multiple lines on single axis, annotate inflection points |
| Revenue projections (5-year) | Clustered bar chart | Actuals in solid fill, projections in hatched/lighter fill. YoY growth % as data labels |
| FCF waterfall | Waterfall chart | Revenue → EBITDA → adjustments → LFCF. Green = positive, red = negative |
| Returns sensitivity (MoIC/IRR) | Heat map table | Entry multiple rows × exit multiple columns. Colour gradient: green (high) → red (low). Not a chart — formatted table |
| Competitive capability matrix | ✓/✗ table | Never chart this — table format only |
| Market sizing | Bar chart | Segments side-by-side or stacked. Include CAGR annotation |

**Rules:**
- Never use pie charts. They don't show time trends and are hard to compare across periods.
- Prefer bar + line combos over standalone bars when both absolute and % metrics matter.
- All charts must have: axis labels, a title, data source footnote, and Movement blue (#1F4E79) as primary colour.
- Use consistent BU colours across all charts in the document (e.g., Carats = blue, Gleamedia = teal, Adactive = orange).
- Waterfall charts: green for positive movements, red for negative, grey for totals.
- When a chart would have fewer than 3 data points, use a table instead.

#### 4b. Timeline of Key Events

- Bullet chronology from founding to present engagement
- Must include: corporate restructurings, prior sale attempts (with diagnosis of failure), property/asset transactions, key contract wins

#### 4c. Transition Catalyst (Why Now)

- Transition catalyst articulated clearly (founder exit, succession vacuum, aging shareholders, market dislocation, failed prior sale, carve-out rationale)
- If prior sale process failed: diagnose why — per Javier's framework, complexity taxes the multiple
- Seller's fatigue assessment — how long in market, how many approaches, leverage implications
- What transition Movement is facilitating

#### 4d. Management Team

> *Updated in v2:* Split management table into Gen-1 (exiting) and Gen-2 (continuing) where applicable. Include compensation column (FY__A) to flag normalisation items upfront.

- Key personnel table: Name, Role, Entity, Tenure, Compensation (FY__A), Notes
- Gen-1 / Gen-2 split where generational succession is the catalyst
- Strengths and gaps assessment
- Post-close management continuity plan (retain/replace/augment)

#### 4e. Key Person Risk

> *Added in v2.* Separated from management table into its own dedicated sub-section. Key person risks warrant standalone treatment so IC can assess concentration risk clearly.

- Identify individuals whose departure would materially impact revenue or operations
- Quantify where possible (e.g., "originates ~80% of pipeline")
- Assess replaceability — is there an understudy? How long is the transition?
- Link to deal structure implications (retention incentives, earnout alignment)

#### 4f. Customer Dynamics

- Customer concentration (top 5/10 clients as % revenue)
- Retention / churn metrics
- Contract structure (duration, renewal rates, pricing mechanism)
- Revenue quality: decompose % captive/intercompany vs. genuine external revenue

### 5. Market Overview

> *Restructured in v2.* Market Overview now has 4 distinct sub-sections instead of a single block. This gives IC a clearer picture of the macro tailwind, sector dynamics, and competitive positioning separately.

#### 5a. Macro Tailwind / Infrastructure Context

- The "why this market, why now" framing (per Jerry's AVS feedback — must land the macro story upfront)
- Macro demand drivers with specific data (e.g., BCA pipeline, government spending forecasts)
- Mega project pipeline table: Project, Est. Value, Timing, Relevance to target
- Connect macro to target: how does the pipeline create demand for this specific business?
- Sources must be cited

#### 5b. Core Market (Signage / Fabrication / Services)

- Market structure and segmentation
- Competitive tiering per Jerry's framework:
  - **Tier 1:** Global / MNC players
  - **Tier 2:** Mid-market / regional
  - **Tier 3:** Budget / local
- Target's positioning within tiers
- Secular tailwinds (3–5 bullet points with sourcing)
- Regulatory environment (if material)

#### 5c. Adjacent/Growth Market (e.g., DOOH, Digital Signage)

> *Added in v2.* Where the target operates across traditional + digital/media segments, the digital segment warrants its own market section with separate sizing, competitive landscape, and growth rates. This prevents conflating a 5% growth fabrication market with a 15% growth digital media market.

- Market size with global and local data points
- Separate competitive landscape table (different players than core market)
- Technology inflection points (e.g., programmatic buying, audience analytics)
- How the target fits into this adjacent market

#### 5d. Competitive Positioning & Landscape

- Capability comparison matrix (target vs. competitors across key capabilities)
- Use ✓ / ✗ matrix format
- Moat assessment: what is genuinely differentiated vs. replicable?
- Post-acquisition positioning: how does Movement ownership enhance competitive position?

### 6. Financial Overview

> *Restructured in v2.* Financial Overview expanded from a single P&L/BS section to 5 sub-sections. Added Debt & Cash Bridge, Dividend History, and expanded NWC Analysis as standalone items. Each sub-section includes a "Key Pointers" callout box.

#### 6a. P&L Overview

- KPI header bar: FY__A Revenue, Gross Profit, EBITDA, Net Profit with margins and CAGRs
- Consolidated P&L table (3–5 years) with line items
- Revenue mix table (% by BU/segment over time)
- Gross Profit by BU table with margins
- EBITDA by BU table with margins and % of group
- "Key Pointers" callout box: 5–7 analytical observations, not just restating numbers — identify trends, inflection points, and DD items

#### 6b. Balance Sheet Overview

- KPI header bar: Total Assets, Cash Position, Total Debt, Net Cash/(Debt)
- Consolidated balance sheet table (3–5 years)
- Footnotes explaining major movements (property disposals, reclassifications, etc.)
- "Key Pointers" callout box

#### 6c. Debt & Cash Bridge

> *Added in v2.*

- Detailed cash and debt schedule (FY22–FY25)
- Restricted vs. unrestricted cash breakdown
- Pledged deposits / performance bond requirements
- Change-of-control clause implications for facilities
- "Key Pointers" callout box on cash accessibility for transaction

#### 6d. Dividend History

> *Added in v2.*

- Entity-level dividend table (5 years where available)
- Identify unusual spikes and their funding source (operating cash flow vs. asset disposal proceeds)
- Implications for locked-box mechanism and permitted leakage

#### 6e. NWC Analysis

- KPI header bar: NWC, DSO, DPO, Cash Conversion Cycle
- Detailed NWC composition table (current assets vs. current liabilities, excl. debt & tax)
- NWC as % of revenue trend
- "Key Pointers" callout box linking NWC to transaction structure (locked-box, permitted leakage thresholds)

> **Deferred to DD stage (removed from v1):** Revenue bridge (volume × price), EBITDA bridge (current → normalized → achievable), capex split (maintenance vs. growth), and intercompany pricing analysis. The PIM should flag these as DD items, not attempt to build them on incomplete data.

### 7. Transaction Proposal

#### 7a. Deal Structure

- 1–2 paragraph summary of proposed structure (stake %, rollover, earnout mechanics)
- EV-to-Equity bridge table
- Sources & Uses table
- Deal structure notes: earnout triggers, locked-box mechanics, debt terms

#### 7b. Projected Revenue by BU

- 5-year revenue projections by business unit
- Clearly state basis: management estimates for near-term, growth extrapolation for outer years
- Show % of total and YoY growth

#### 7c. Projected FCF Schedule

- Revenue → EBITDA → EBIT → Pre-tax → LFCF waterfall
- Debt service schedule (interest + principal)
- DSCR calculation
- Earnout payment timing and impact on levered FCF
- RCF draw/repay if applicable
- Cumulative excess cash

#### 7d. Returns Analysis

- Base case returns table: Exit EBITDA, Exit Multiple, EV, Net Cash at Exit, Equity Value, Sponsor Share, MoIC, IRR
- 2 scenarios minimum: Flat multiple + Re-rate
- MoIC sensitivity matrix: Entry Multiple vs. Exit Multiple
- IRR sensitivity matrix: Entry Multiple vs. Exit Multiple
- State key assumptions in footnotes

> **Deferred to DD stage (removed from v1):** 3-scenario business plan table (Base/Upside/Downside), comp-anchored valuation, quantified synergies with calculation shown, and liquidation analysis. At the PIM stage, these are premature — the data isn't robust enough. Returns analysis uses management projections with sensitivity tables to show the range.

### 8. Investment Rationale

**Investment Highlights** — use ✓ prefix:
- 7–9 highlights covering contracted revenue, entry valuation, complexity discount, platform positioning, growth engine, cash generation, client base, management alignment, and value creation levers
- Each highlight must be defensible — "if challenged, do we have a basis?"
- Lead with quantified thesis bullets, not qualitative assertions

**Key Risks** — use ✗ prefix:
- 8–13 risks covering: market, operational, financial, talent, regulatory, technology
- Format: `✗ [Risk description with specific data]`
- Each risk should be specific and quantified where possible (e.g., "Yu Hang originating 80% of pipeline" not "key person risk")

> *Change from v1:* Dropped the `→ Mitigant: [specific action]` format for each risk. At PIM stage, mitigants are often premature or speculative. Risks should be stated clearly; mitigants are for the IC discussion and DD phase. Also dropped the ⚠️ red flag marker — if something is a red flag, it should be stated plainly in the risk description.

### 9. Recent Updates & Next Steps

**Recommended Next Steps:**
- Status diagram or visual (e.g., process timeline showing current stage)
- Concrete, time-bound next steps where dates are known

**Key DD Topics:**

> *Added in v2.* Numbered DD topic list (5–8 topics) serving as the DD agenda. Each topic is a 1–2 sentence scope definition, not a detailed question list. This gives IC a clear view of what we still need to answer before LOI.

- Topics should cover: growth plan, revenue sustainability, BU economics, earnings quality, NWC/balance sheet, leadership continuity
- Each topic: title + 1–2 sentence scope
- Ordered by priority / sequencing dependency

### 10. Appendices

> *De-emphasised in v2.* Include only if data is already available. Do not create placeholder appendices that promise content not yet produced. If appendices are included, limit to: detailed financial tables (full P&L, balance sheet), org chart, and any key contracts or data room items referenced in the body.

---

## IC Review Gate (Mandatory)

Before presenting the PIM to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity

*Underlying traits:* Credibility-first thinking. Structured thinker. Honest about uncertainty.

- Scan for overstatements and single-datapoint extrapolations
- Apply reality/tone filter — soften claims that won't withstand external challenge
- Verify factual accuracy (names, numbers, terminology)
- Flag naming inconsistencies and unverified market claims
- Ensure competitive analysis uses structured tier system (not flat lists)
- Ensure TAM/market sizing is bottom-up with shown workings
- Ensure "Key Pointers" boxes contain analytical commentary, not data restating
- Ensure next steps are concrete and time-bound
- **Cross-deal contamination check:** Scan for industry terms, company descriptors, structural assumptions from other active deals
- Core test: *"If challenged, do we have a basis to stand on?"*

### Pass 2 — Javier Ballve (Partner): Thesis & Analytical Challenge

*Underlying traits:* First-principles skeptic. Counterparty awareness. Looks for the hidden subsidy.

- Distil into 3–5 gating questions: what it unlocks, bull vs. bear answer with numbers, flow to valuation/structure
- Verify unit economics support top-down narrative
- Challenge framing: are we validating seller's pitch?
- Check intercompany pricing for hidden subsidies
- Strip captive/internal revenue before assessing standalone viability
- Check valuation uses differentiated multiples per entity/segment
- Failed prior sales = data — ensure diagnosis included
- Core test: *"Build from unit economics up, not EBITDA down."*

**Protocol:**
- Fix flagged issues silently, present clean deliverable
- If material thesis-changing issues found: surface explicitly to user before finalizing

---

## Self-Evaluation Gate (Mandatory)

> Before responding with the completed PIM, run this verification checklist to catch errors that undermine IC credibility. This gate runs AFTER the IC Review Gate and focuses on mechanical correctness.

### 1. Number Verification

- Cross-check every financial figure in the PIM against the source files provided (financial statements, Excel models, data room documents)
- Verify all calculated metrics (margins, CAGRs, ratios, multiples) by recomputing from raw numbers
- Check that FY labels match the actual periods in source data
- Confirm revenue/EBITDA figures are consistent across all sections (exec summary, P&L, transaction proposal, returns analysis)
- Verify Sources & Uses table balances
- Verify returns math: EV → Equity Value → Sponsor Share → MoIC chain

### 2. Internal Consistency

- Metrics quoted in Executive Summary must match Financial Overview tables exactly
- Entity names, percentages, and employee counts must be consistent throughout
- Deal structure (stake %, earnout terms, debt terms) must be identical in every section it appears
- Key Risks must reference data that actually appears in earlier sections

### 3. Fragment Synthesis Check

- Per SYSTEM_PROMPT.md rules: test every specific claim — "Where exactly was this stated?"
- Flag any claim where the answer is "I inferred it" or "reasonable synthesis"
- Never upgrade vague to specific. Never reframe a metric into a different context
- Memory files are high-risk — apply extra scrutiny

### 4. Cross-Deal Contamination Scan

- Confirm project codename and target company at the top
- Scan for industry terms belonging to other active deals
- Scan for structural assumptions (rollover %, earnout terms) that haven't been confirmed for this deal
- Scan for boilerplate language carried over from prior deliverables

### 5. Completeness Check

- All section headers present (even if marked "[No information at this stage]")
- Key Pointers boxes present for each Financial Overview sub-section
- At least 7 investment highlights and 8 key risks
- DD Topics section populated with 5+ items

**Protocol:**
- If any number discrepancy is found: fix it and note the correction
- If a claim cannot be traced to source: remove it or tag `[ASSUMPTION]`
- If contamination is detected: remove and flag to user
- Only after passing all 5 checks: present the PIM to the user

---

## Style Rules

- Direct, no fluff. Lead with the answer, then supporting detail.
- If something doesn't work, say so clearly — don't hedge.
- Quantify wherever possible.
- Never use more than one em dash (—) in a single sentence.
- Distinguish between: **Stated in materials** (cite source), **Inferred** (logical conclusion), **Assumed** (gap-fill tagged `[ASSUMPTION]`).
- Never present assumptions or inferences as facts.
- "Key Pointers" boxes must contain analytical "so-what" commentary, not restate the data above them.

---

## Training Data

This skill is trained on Movement's existing PIMs. As new PIMs are uploaded to the `IMs & PIMs` folder, reference them to refine section depth, tone, and formatting conventions. Current training set:

- 07072025_123TV_PIM.docx
- 09122025_Frumecar_PIM.pdf
- Beroil PIM_22052025.docx
- Max Finance PIM.docx
- Victoria PIM v.BO.docx
- **260402 Project Diamond - PIM v2.docx** — Primary reference for the updated section structure, Key Pointers format, entity-by-entity breakdown, and analytical commentary depth.

When generating a new PIM, match the depth and tone of these reference documents for each corresponding section.

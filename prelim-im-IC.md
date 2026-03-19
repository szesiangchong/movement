---
name: prelim-im-IC
description: >
  Generate Preliminary Information Memorandums (PIMs) for Movement's Investment Committee presentation at the term sheet stage. Use this skill whenever the user asks to draft a PIM, preliminary memo, term sheet memo, or preliminary investment memorandum for IC review. Also trigger when the user says "draft PIM", "write PIM", "PIM for [project name]", or "preliminary memo for IC".
---

# Preliminary Information Memorandum (PIM) — Term Sheet Stage

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

---

## Document Format

Output as `.docx` using the docx skill. Apply Movement branding:

- **Logo:** `movement-logo.png` centered in header, ~4 inches wide, auto-height
- **Thin horizontal rule** below logo before title
- **Company name:** "Movement" only (never "Movement Capital" or "Invest Movement")
- **Font:** Arial, 12pt body, headings per docx skill style definitions
- **Classification:** "Confidential" on cover page
- **Symbols:** ✓ for highlights, ✗ for risks, ⚠️ for red flags

---

## PIM Section Structure

### 1. Cover Page

| Element | Detail |
|---------|--------|
| Logo | Movement logo, centered header |
| Title | "Preliminary Information Memorandum" |
| Project name | Project [Codename] |
| Target name | Full legal entity name |
| Date | DD Month YYYY |
| Classification | CONFIDENTIAL |
| Deal team | Names and roles from Movement team |

### 2. The Target

What the business does. Keep it tight — 1-2 paragraphs max, then a key metrics snapshot table.

**Must include:**
- Products/services description
- Geography and operations footprint
- Founding year and ownership structure
- Key metrics snapshot table:

| Metric | Value |
|--------|-------|
| Revenue (FY__A) | |
| EBITDA (FY__A) | |
| EBITDA Margin | |
| Employees | |
| Locations / Assets | |

### 3. The Context

Why now. What complexity creates the opportunity. This is the most Movement-specific section.

**Must include:**
- Transition catalyst articulated clearly (founder exit, succession vacuum, aging shareholders, market dislocation, failed prior sale, carve-out rationale)
- Historical timeline of key events (bullet chronology)
- If prior sale process failed: diagnose why (structure, politics, expectations, unsolved problems) — per Javier's framework, complexity taxes the multiple
- What transition Movement is facilitating

### 4. Management Team

**Must include:**
- Key personnel table (Name, Role, Tenure, Background)
- Strengths and gaps assessment
- Founder dependency risk (if applicable)
- Post-close management continuity plan (retain/replace/augment)
- Key person risk flags and mitigation

### 5. Market & Competitive Landscape

**Must include:**
- Market size — bottom-up with shown workings (segment-level, unit economics), using appropriate benchmarks ($/MW, $/unit, $/sqft). No top-down TAM assertions without backup.
- CAGR and growth drivers
- Competitive tiering per Jerry's framework:
  - **Tier 1:** Global / MNC players
  - **Tier 2:** Mid-market / regional
  - **Tier 3:** Budget / local
- Target's positioning within tiers
- Regulatory environment (if material)
- Geographic moat stress-test: contract enforceability varies by jurisdiction

### 6. Consumer / Customer Dynamics

**Must include:**
- Customer concentration (top 5/10 clients as % revenue)
- Retention / churn metrics
- Contract structure (duration, renewal rates, pricing mechanism)
- Channel mix
- Pricing power indicators
- Revenue quality: decompose % captive/intercompany vs. genuine external revenue

### 7. Financial Highlights

**Must include:**
- Historical P&L summary (3-5 years) in table format
- Revenue bridge (volume × price, or by segment/geography)
- EBITDA bridge: current → normalized → achievable, with each adjustment line itemized
- Key operating metrics relevant to the business
- Cash conversion and working capital trends
- Capex split: maintenance vs. growth (per Javier — capex-to-grow = working capital drag affecting multiple/financing)
- Intercompany pricing analysis if multi-entity: compare charges to sister entities vs. external clients; gap = subsidy

### 8. Business Plan

**Must include 3 scenarios:**

| | Base | Upside | Downside |
|--|------|--------|----------|
| Revenue CAGR | | | |
| Exit EBITDA | | | |
| Key assumptions | | | |

- Value creation levers (operational, financial, strategic) — quantified, not vague
- EBITDA bridge from entry to exit
- Synergies: explicit quantified basis with calculation shown; reject vague "synergy potential"

### 9. Transaction Structure

**Must include:**
- Entry valuation with comp anchoring (never same multiple across multi-entity deals — pull sector-specific comps per Javier)
- Articulate the multiple-earning gap: why this multiple for this business quality
- Sources & Uses table:

| Sources | Amount | Uses | Amount |
|---------|--------|------|--------|
| Equity | | Enterprise Value | |
| Senior Debt | | Transaction Costs | |
| Vendor Loan | | Working Capital | |
| **Total** | | **Total** | |

- Debt structure and key terms
- Equity required from Movement
- Key deal terms / conditions
- Exit optionality (patient capital advantage)
- Pre-deal control signals: flag seller conditions (e.g., employment requirements) — price in or structure earnout/deferred

### 10. Investment Highlights & Key Risks

**Investment Highlights** — use ✓ prefix:
- Lead with thesis bullets (3-5 max)
- Each highlight must be defensible — "if challenged, do we have a basis?"

**Key Risks** — use ✗ prefix, each with mitigant:
- 8-13 risks covering: market, operational, financial, talent, regulatory, technology
- Format: `✗ [Risk] → Mitigant: [specific action/structure]`
- ⚠️ for any red flags requiring immediate attention

**Downside / Margin of Safety:**
- What do we own if things go wrong?
- For asset-heavy targets: asset-by-asset liquidation value with recovery assumptions (cash 100%, receivables 80%, inventory 60%, PP&E at forced-sale discount)
- Entry valuation vs. replacement cost, liquidation value, comp floor

### 11. Recent Updates & Next Steps

- Latest developments since materials were received
- **Concrete, time-bound next steps** — never open-ended
- Example: "IC recommendation within 2-3 weeks pending DDQ responses and management call"
- Clear go/no-go recommendation or conditions for proceeding

### 12. Appendix

Include as needed:
- Detailed financial tables (full P&L, balance sheet)
- Organizational chart
- Asset register (if asset-heavy)
- Comparable company table
- Geographic / facility map

---

## IC Review Gate (Mandatory)

Before presenting the PIM to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity
- Scan for overstatements and single-datapoint extrapolations
- Apply reality/tone filter — soften claims that won't withstand external challenge
- Verify factual accuracy (names, numbers, terminology)
- Flag naming inconsistencies and unverified market claims
- Ensure competitive analysis uses structured tier system (not flat lists)
- Ensure TAM/market sizing is bottom-up with shown workings
- Ensure downside protection calculated before upside presented
- Ensure next steps are concrete and time-bound
- Core test: "If challenged, do we have a basis to stand on?"

### Pass 2 — Javier Ballve (Partner): Thesis & Analytical Challenge
- Distill into 3-5 gating questions: what it unlocks, bull vs bear answer with numbers, flow to valuation/structure
- Verify unit economics support top-down narrative
- Challenge framing: are we validating seller's pitch?
- Check intercompany pricing for hidden subsidies
- Strip captive/internal revenue before assessing standalone viability
- Verify capex-to-grow vs capex-to-maintain distinction
- Check valuation uses differentiated multiples per entity/segment
- Failed prior sales = data — ensure diagnosis is included
- Core test: "Build from unit economics up, not EBITDA down"

**Protocol:**
- Fix flagged issues silently, present clean deliverable
- If material thesis-changing issues found: surface explicitly to user before finalizing

---

## Style Rules

- Direct, no fluff. Lead with the answer, then supporting detail.
- If something doesn't work, say so clearly — don't hedge.
- Quantify wherever possible.
- Never use more than one em dash (—) in a single sentence.
- Distinguish between: **Stated in materials** (cite source), **Inferred** (logical conclusion), **Assumed** (gap-fill tagged `[ASSUMPTION]`).
- Never present assumptions or inferences as facts.

---

## Training Data

This skill is trained on Movement's existing PIMs. As new PIMs are uploaded to the `IMs & PIMs` folder, reference them to refine section depth, tone, and formatting conventions. Current training set:

- 07072025_123TV_PIM.docx
- 09122025_Frumecar_PIM.pdf
- Beroil PIM_22052025.docx
- Max Finance PIM.docx
- Victoria PIM v.BO.docx

When generating a new PIM, match the depth and tone of these reference documents for each corresponding section.

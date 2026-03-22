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

### Handling Missing Information

For sections where data is not yet available (e.g., market sizing, comparable companies, detailed customer data):
- **Include the section header** in the document — do not skip it
- Below the header, insert: *"[No information at this stage, to follow-up during DD]"* in grey italic
- If partial information exists, present what is available and tag gaps with `[DD Action: ...]` notes
- This ensures the PIM serves as a living checklist of what still needs to be addressed

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

Two-section layout inspired by institutional IM cover pages (e.g., Victoria/DVC format):

**Top Section:**
- Movement logo (left-aligned) and target company logo (right-aligned, if available) at the top
- Target company name as large heading (Movement blue, #1F4E79)
- Subtitle: "Preliminary Information Memorandum" or "Investment Memorandum"
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

### 2. Executive Summary

The first substantive page after the cover and contents. IC members may only read this. Keep it tight.

**Must include:**
- Target at a glance (1-2 paragraphs: what it does, where, how big)
- Key metrics snapshot table:

| Metric | Value |
|--------|-------|
| Revenue (FY__A) | |
| EBITDA (FY__A) | |
| EBITDA Margin | |
| Employees | |
| Locations / Assets | |

- Go/no-go recommendation with conditions
- Recent developments and status of engagement

### 3. Company Overview

Consolidates: who they are, why now, who runs it, and who buys from them.

**Must include:**

**The Business:**
- Products/services description
- Geography and operations footprint
- Founding year and ownership structure

**The Context (Why Now):**
- Transition catalyst articulated clearly (founder exit, succession vacuum, aging shareholders, market dislocation, failed prior sale, carve-out rationale)
- Historical timeline of key events (bullet chronology)
- If prior sale process failed: diagnose why — per Javier's framework, complexity taxes the multiple
- What transition Movement is facilitating

**Management Team:**
- Key personnel table (Name, Role, Tenure, Background)
- Strengths and gaps assessment
- Founder dependency risk (if applicable)
- Post-close management continuity plan (retain/replace/augment)
- Key person risk flags and mitigation

**Customer Dynamics:**
- Customer concentration (top 5/10 clients as % revenue)
- Retention / churn metrics
- Contract structure (duration, renewal rates, pricing mechanism)
- Revenue quality: decompose % captive/intercompany vs. genuine external revenue

### 4. Market Overview

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

### 5. Financial Overview

**Must include:**
- Historical P&L summary (3-5 years) in table format
- Revenue bridge (volume × price, or by segment/geography)
- EBITDA bridge: current → normalized → achievable, with each adjustment line itemized
- Key operating metrics relevant to the business
- Cash conversion and working capital trends
- Capex split: maintenance vs. growth (per Javier — capex-to-grow = working capital drag affecting multiple/financing)
- Intercompany pricing analysis if multi-entity: compare charges to sister entities vs. external clients; gap = subsidy

### 6. Transaction Proposal

Consolidates: how we plan to buy it and what we plan to do with it.

**Must include:**

**Business Plan (3 scenarios):**

| | Base | Upside | Downside |
|--|------|--------|----------|
| Revenue CAGR | | | |
| Year 5 EBITDA | | | |
| Key assumptions | | | |

- Value creation levers (operational, financial, strategic) — quantified, not vague
- EBITDA bridge from entry to projected
- Synergies: explicit quantified basis with calculation shown; reject vague "synergy potential"

**Transaction Structure:**
- Entry valuation with comp anchoring (never same multiple across multi-entity deals — pull sector-specific comps per Javier)
- Articulate the multiple-earning gap: why this multiple for this business quality
- Sources & Uses table
- Debt structure and key terms
- Equity required from Movement
- Key deal terms / conditions
- Pre-deal control signals: flag seller conditions — price in or structure earnout/deferred

### 7. Investment Rationale

Consolidates: why we should do this deal, what could go wrong, and what's next.

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

**Next Steps:**
- Latest developments since materials were received
- **Concrete, time-bound next steps** — never open-ended
- Clear go/no-go recommendation or conditions for proceeding

**Appendix** (at end of document):
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

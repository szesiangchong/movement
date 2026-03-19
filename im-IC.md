---
name: im-IC
description: >
  Generate full Investment Memorandums (IMs) for Movement's Investment Committee presentation at the SPA stage. Use this skill whenever the user asks to draft an IM, investment memorandum, final IC memo, SPA-stage memo, or full investment memo. Also trigger when the user says "draft IM", "write IM", "IM for [project name]", "final memo for IC", or "SPA memo".
---

# Investment Memorandum (IM) — SPA Stage

Generate a comprehensive IM for Movement's IC to make a final investment decision before signing the SPA. This is the definitive document — full DD findings, refined thesis, definitive deal terms, and clear recommendation.

## Before You Start

1. **Read `Claude.md` and `SYSTEM_PROMPT.md`** from the movement repo for Movement context, IC Review Gate protocol, and communication standards.
2. **Check if a PIM exists for this deal.** If so, read it first — the IM builds on and deepens the PIM, incorporating DD findings that validate or challenge the preliminary thesis.
3. **Clarify before building.** Never generate on incomplete inputs. Ask one focused round of clarifying questions for any missing data below.
4. **Tag assumptions.** If user says "use best judgment", proceed but tag every gap-fill with `[ASSUMPTION]`.

### Minimum Required Inputs

- Target company name and project codename
- Complete DD findings (commercial, operational, financial, legal)
- Updated/audited financials (minimum 3 years)
- Definitive deal terms (valuation, structure, SPA key terms)
- Management assessment and post-close plan
- Business plan with scenario analysis
- Risk register with mitigants

If any critical inputs are missing, stop and ask before proceeding.

---

## Document Format

Output as `.docx` using the docx skill. Apply Movement branding:

- **Logo:** `movement-logo.png` centered in header, ~4 inches wide, auto-height
- **Thin horizontal rule** below logo before title
- **Company name:** "Movement" only (never "Movement Capital" or "Invest Movement")
- **Font:** Arial, 12pt body, headings per docx skill style definitions
- **Classification:** "Strictly Confidential" on cover page
- **Symbols:** ✓ for highlights, ✗ for risks, ⚠️ for red flags
- **Table of Contents** auto-generated with page numbers

---

## IM Section Structure

### 1. Cover Page

| Element | Detail |
|---------|--------|
| Logo | Movement logo, centered header |
| Title | "Investment Memorandum" |
| Project name | Project [Codename] |
| Target name | Full legal entity name |
| Date | DD Month YYYY |
| Classification | STRICTLY CONFIDENTIAL |
| Deal team | Names and roles |
| FY snapshot | Revenue / EBITDA / Margin for latest FY |

### 2. Table of Contents

Full TOC with page numbers, auto-generated. Heading depth: 2 levels.

### 3. Executive Summary

1-2 pages maximum. This is the most important section — IC members may only read this before the meeting.

**Must include:**
- Investment thesis (3-5 bullet summary)
- Deal terms snapshot (entry multiple, EV, equity cheque, structure)
- Returns summary (base case IRR / MOIC)
- 3-5 gating questions and their resolution (per Javier's framework — see Section 16)
- Key risks in one line each
- Clear IC recommendation (Proceed / Proceed with conditions / Decline)

### 4. The Target

Expanded from PIM. Full business deep-dive.

**Must include:**
- Detailed business description (products/services by segment)
- Corporate and legal entity structure (diagram if multi-entity)
- Geographic footprint with operational detail per location
- Technology / IP overview
- Key contracts and relationships
- Founding history and ownership chain
- Key metrics table (expanded from PIM with DD-validated numbers)

### 5. The Context

Full situation history validated through DD.

**Must include:**
- Complete timeline of events leading to transaction
- Transition catalyst with DD-validated evidence
- Prior sale process analysis (if any): diagnose why it failed — structure, politics, expectations, unsolved problems. Complexity taxes the multiple.
- Stakeholder dynamics: who benefits, who gets hurt, misalignments
- Seller motivation and urgency assessment
- What transition Movement is facilitating and why we are the right buyer

### 6. Management Team

**Must include:**
- Detailed personnel assessment table (Name, Role, Tenure, Background, DD Assessment)
- Strengths, gaps, and development needs per individual
- 100-day leadership plan (retain / replace / augment with specifics)
- Retention and incentive structure (proposed)
- Key person risk and mitigation plan
- Organizational depth below C-suite
- Culture assessment from DD interactions

### 7. Market & Competitive Landscape

Deep analysis validated through DD.

**Must include:**
- Market size — bottom-up with shown workings (segment-level, unit economics), using benchmarks ($/MW, $/unit, $/sqft). No top-down TAM assertions without backup.
- TAM → SAM → SOM funnel with unit economics basis
- CAGR with growth driver decomposition
- Competitive tiering per Jerry's framework:
  - **Tier 1:** Global / MNC players (profile each)
  - **Tier 2:** Mid-market / regional (profile key competitors)
  - **Tier 3:** Budget / local (characterize segment)
- Target's positioning, differentiation, and defensibility
- Regulatory deep-dive (current and upcoming changes)
- Secular trends (tailwinds and headwinds)
- Geographic moat stress-test: contract enforceability by jurisdiction; exclusive agreements that hold in one market may fail in another

### 8. Commercial Due Diligence Findings

Dedicated section — this does not exist in PIMs.

**Must include:**
- Customer interview / reference findings (anonymized)
- Pipeline analysis and revenue visibility
- Contract analysis: duration, renewal rates, pricing mechanisms, termination clauses
- Customer concentration risk (top 5/10/20 as % revenue, trend)
- Revenue quality: decompose % captive/intercompany vs. genuine external. Strip internal revenue before standalone viability assessment.
- Churn / retention data with cohort analysis if available
- Win/loss analysis and competitive displacement risk
- Pricing vs. market benchmarks
- Commercial DD = primary evidence (customer calls, landlord conversations, lost-bid analysis, pricing benchmarks) — not just spreadsheet work per Javier

### 9. Operational Due Diligence Findings

Dedicated section — this does not exist in PIMs.

**Must include:**
- Operations assessment (capacity, utilization, efficiency metrics)
- Cost structure decomposition (fixed vs variable, by line item)
- Intercompany pricing analysis: compare cost-bearing entity charges to sister entities vs. external clients. Gap = subsidy determining margin compression at arm's length.
- Supply chain analysis (concentration, alternatives, pricing power)
- Technology infrastructure assessment
- Workforce analysis (headcount, productivity, labor relations, key dependencies)
- Facility / asset condition assessment
- Operational improvement opportunities identified (quantified)
- Info requests (file-answerable) vs. DD questions (requiring management explanation, judgment, external validation) — clearly separate per Javier

### 10. Financial Analysis

**Must include:**
- Full historical financials (5 years) — P&L, Balance Sheet, Cash Flow in table format
- Normalized EBITDA bridge with each adjustment itemized and justified:

| Adjustment | Amount | Basis |
|------------|--------|-------|
| Reported EBITDA | | Audited |
| (+) Owner compensation above market | | [ASSUMPTION] / Stated |
| (+) One-off costs | | Stated in CIM p.XX |
| (-) Below-market rent adjustment | | [INFERENCE] based on... |
| **Normalized EBITDA** | | |

- Quality of earnings findings (if external QoE performed)
- Working capital analysis (NWC as % revenue, seasonal patterns, peg)
- Cash flow analysis (FCF conversion, capex intensity)
- Debt and liability analysis (on/off balance sheet)
- Capex split: maintenance vs. growth — buyer-funded scaling = working capital drag affecting multiple/financing per Javier
- Separate conflated line items: trading vs. rental COGS, depreciation life vs. replacement cycle

### 11. Business Plan & Value Creation

**Must include 4 scenarios:**

| | Management | Base | Downside | Extreme |
|--|------------|------|----------|---------|
| Revenue CAGR | | | | |
| Exit EBITDA | | | | |
| Exit Year | | | | |
| Key assumptions | | | | |

- Detailed value creation plan with quantified initiatives:
  - **Operational:** margin improvement, cost reduction (with $ impact and timeline)
  - **Financial:** debt optimization, working capital improvement
  - **Strategic:** bolt-on acquisitions, geographic expansion, product extension
- EBITDA bridge from entry to exit (waterfall format)
- Capex plan: maintenance vs. growth, year-by-year
- Synergies: explicit quantified basis with calculation shown; reject vague "synergy potential"
- Each initiative: owner, timeline, probability-weighted impact

### 12. Transaction Structure

**Must include:**
- Entry valuation with comp anchoring — never same multiple across multi-entity deals. Pull sector-specific comps (OOH for media, industrial services for fabrication, etc.).
- Articulate the multiple-earning gap: why this multiple for this business quality. If listed peer at lower multiple is more digital/scalable, target can't claim premium.
- Definitive Sources & Uses:

| Sources | Amount | Uses | Amount |
|---------|--------|------|--------|
| Equity — Movement | | Enterprise Value | |
| Senior Debt | | Transaction Costs | |
| Vendor Loan / Deferred | | Working Capital Adj. | |
| Earnout (if applicable) | | Capex Reserve | |
| **Total** | | **Total** | |

- Debt terms: facility, amount, rate, tenor, covenants, amortization
- SPA key terms: reps & warranties, indemnities, conditions precedent, escrow
- Earnout / deferred consideration structure (if applicable) and rationale
- Pre-deal control signals: seller conditions on employment, board composition, etc. — priced in or structured via earnout/deferred per Javier
- Completion timeline and conditions

### 13. Returns Analysis

**Must include:**
- Base case returns: IRR and MOIC with key assumptions stated
- Sensitivity tables (minimum 2):

**Entry Multiple × Exit Multiple:**

| | Exit 4.0x | Exit 5.0x | Exit 6.0x | Exit 7.0x |
|--|-----------|-----------|-----------|-----------|
| Entry 4.0x | | | | |
| Entry 5.0x | | | | |
| Entry 6.0x | | | | |

**Leverage × Margin Improvement:**

| | +0pp | +200bps | +400bps | +600bps |
|--|------|---------|---------|---------|
| 2.0x D/E | | | | |
| 2.5x D/E | | | | |
| 3.0x D/E | | | | |

- Returns by scenario (Management / Base / Downside / Extreme)
- Comparison to hurdle rate
- Cash-on-cash and payback period
- Patient capital advantage: show how longer hold improves returns if applicable

### 14. Investment Highlights

Use ✓ prefix. 5-8 highlights, each backed by DD evidence.

Format:
```
✓ [Highlight headline]
  DD evidence: [specific finding from commercial/operational/financial DD]
```

Each highlight must be defensible — "if challenged, do we have a basis to stand on?"

### 15. Key Risks & Mitigants

Use ✗ prefix. Comprehensive risk register.

**Must include:**
- 10-15 risks across categories: market, operational, financial, talent, regulatory, technology, deal execution
- Each risk formatted as:

```
✗ [Risk description]
  Probability: [High/Medium/Low] | Impact: [High/Medium/Low]
  Mitigant: [specific action, structure, or contractual protection]
  Residual risk: [what remains after mitigation]
```

- ⚠️ for any red flags requiring immediate attention or deal-breaker conditions
- Downside / margin of safety analysis:
  - What do we own if things go wrong?
  - For asset-heavy targets: asset-by-asset liquidation value with recovery assumptions (cash 100%, receivables 80%, inventory 60%, PP&E at forced-sale discount)
  - Entry valuation vs. replacement cost, liquidation value, comp floor

### 16. Gating Questions Resolution

Per Javier's "what actually matters" framework. This section is unique to the IM.

**Must include 3-5 gating questions, each formatted as:**

```
GATING QUESTION [#]: [Question]

What it unlocks: [downstream decision/value this determines]

Bull answer: [specific outcome with numbers]
Bear answer: [specific outcome with numbers]

Resolution from DD: [what we found, citing specific DD workstream]

Flow to valuation/structure: [how this answer affects entry price, structure, or terms]
```

Non-outcome-changing questions excluded — no filler. The model, earnout targets, waterfall, and equity split should flow from getting these 3-5 right.

### 17. IC Recommendation & Next Steps

**Must include:**
- Clear recommendation: Proceed / Proceed with conditions / Decline
- If "Proceed with conditions": list specific conditions
- Approval requested: signing authority, equity commitment amount
- Concrete, time-bound next steps — never open-ended
- Key dates: SPA target signing, completion, first 100 days milestones
- Outstanding items to resolve pre-signing

### 18. Appendix

Include as applicable:
- Detailed financial model outputs (P&L, BS, CF projections)
- Organizational chart
- Asset register with individual asset detail (if asset-heavy)
- Legal entity structure diagram
- Comparable company analysis table
- DD tracker summary (workstream, status, key findings)
- Stakeholder testimonials / client feedback (anonymized)
- Key contract summaries
- Regulatory filing requirements
- Insurance coverage summary

---

## IC Review Gate (Mandatory)

Before presenting the IM to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity
- Scan for overstatements and single-datapoint extrapolations
- Apply reality/tone filter — soften claims that won't withstand external challenge
- Verify factual accuracy (names, numbers, terminology, technical descriptions)
- Flag naming inconsistencies and unverified market claims
- Remove sensitive details inappropriate for writing
- Ensure competitive analysis uses structured tier system (not flat lists)
- Ensure TAM/market sizing is bottom-up with shown workings
- Ensure downside protection calculated before upside presented
- For asset-heavy targets: verify property/asset-level detail including tenure, book vs market value, strategy per asset
- Ensure next steps are concrete and time-bound
- Core test: "If challenged, do we have a basis to stand on?"

### Pass 2 — Javier Ballve (Partner): Thesis & Analytical Challenge
- Verify 3-5 gating questions are genuinely outcome-changing (no filler)
- Each gating question: (a) downstream unlock, (b) bull vs bear with numbers, (c) flow to valuation/structure
- Verify unit economics support top-down narrative — build from unit economics up, not EBITDA down
- Challenge framing: are we validating seller's pitch? Stress-test thesis benefit (us vs counterparty)
- Check intercompany pricing for hidden subsidies — who bears costs vs who shows margins
- Strip captive/internal revenue before assessing standalone viability
- Verify capex-to-grow vs capex-to-maintain distinction
- Check valuation uses differentiated multiples per entity/segment; anchor to business quality not sector alone
- Public comps reality-check: if listed peer at lower multiple is more digital/scalable, target can't claim premium
- Failed prior sales = data — verify diagnosis included
- Pre-deal control signals flagged and priced in
- Commercial DD prioritizes primary evidence over spreadsheet-only work
- Info requests clearly separated from DD questions
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
- Distinguish between: **Stated in materials** (cite page/source), **Inferred** (logical conclusion from data), **Assumed** (gap-fill tagged `[ASSUMPTION]`).
- Never present assumptions or inferences as facts.
- For every deal, answer: What do we own in the downside?
- Movement is NOT a traditional LBO shop — think restructuring, operational transformation, complexity arbitrage.
- Patient capital = can hold longer than typical PE. Factor into return analysis.
- Family office backing = less LP pressure, more flexibility on structure and timing.

---

## PIM → IM Evolution Guide

When upgrading a PIM to an IM, the following sections are **new or substantially expanded**:

| Section | PIM | IM |
|---------|-----|-----|
| Table of Contents | None | Full with page numbers |
| Executive Summary | None | 1-2 pages with recommendation |
| Commercial DD Findings | Embedded in Customer Dynamics | Dedicated section with primary evidence |
| Operational DD Findings | Embedded in Financial Highlights | Dedicated section with cost decomposition |
| Financial Analysis | 3-5 year summary | 5-year full financials + QoE + NWC analysis |
| Scenarios | 3 (Base/Up/Down) | 4 (Mgmt/Base/Down/Extreme) |
| Returns Analysis | Indicative | Full sensitivity tables |
| Risk Assessment | Bullet risks + mitigants | Probability/impact register + residual risk |
| Gating Questions | None | Dedicated section (3-5 questions) |
| Recommendation | Next steps | Formal IC recommendation |
| Appendix | Minimal | Comprehensive (model outputs, DD tracker, testimonials) |

---

## Training Data

This skill is trained on Movement's existing IMs. As new IMs are uploaded to the `IMs & PIMs` folder, reference them to refine section depth, tone, and formatting conventions. Current training set:

- 15092025_123TV_IM.docx
- 20250911_Kimitec_IM_v.1.docx
- Soltec_IM_vFull 27082025.docx

When generating a new IM, match the depth and tone of these reference documents for each corresponding section.

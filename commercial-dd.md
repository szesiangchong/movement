---
name: commercial-dd
description: >
  Generate Commercial Due Diligence reports for Movement's deal targets, covering market attractiveness, competitive positioning, customer landscape, and growth vector assessment. Use this skill whenever the user asks to run commercial DD, draft a commercial due diligence report, assess market attractiveness, review competitive positioning, evaluate growth vectors, or assess a target's business plan. Also trigger on "commercial DD for [project]", "CDD report", "market assessment for [target]", "growth plan review", or "competitive positioning analysis". This is an APAC-default skill for Movement-led internal DD work.
---

# Commercial Due Diligence Report

Generate a comprehensive commercial DD report for Movement's deal targets. This document serves dual purpose: (1) working document built during DD, and (2) standalone IC deliverable once polished. Focus is on market attractiveness, competitive positioning, customer landscape, and growth vector assessment with an APAC default lens.

## Before You Start

1. **Read `Claude.md` and `SYSTEM_PROMPT.md`** from the movement repo for Movement context, IC Review Gate protocol, and communication standards.
2. **Check if a PIM or IM exists for this deal.** If so, read it — the CDD should be consistent with and feed into the IM's Commercial DD Findings section.
3. **Clarify before building.** Never generate on incomplete inputs. Ask one focused round of clarifying questions for any missing data below.
4. **Tag assumptions.** If user says "use best judgment", proceed but tag every gap-fill with `[ASSUMPTION]`.

### Minimum Required Inputs

- Target company name and project codename
- What the business does (products/services, end markets)
- Geography of operations (countries, regions)
- Available financial data (Revenue, EBITDA, margins — minimum 2 years)
- Any source materials (CIM, management presentations, data room access)
- Specific DD questions or hypotheses to test

If critical inputs are missing, stop and ask before proceeding.

---

## Document Format

Output as `.docx` using the docx skill. Apply Movement branding:

- **Logo:** `movement-logo.png` centered in header, ~4 inches wide, auto-height
- **Thin horizontal rule** below logo before title
- **Company name:** "Movement" only
- **Font:** Arial, 12pt body
- **Classification:** "Confidential — Work Product"

---

## CDD Report Section Structure

The report follows a 7-section structure synthesized from best-in-class advisory CDD frameworks (BCG, L.E.K., Roland Berger, Deloitte). Each section below includes the analytical framework to apply, the minimum deliverables, and the methodology.

---

### 1. Executive Summary

**Purpose:** 2-3 page distillation. IC members may only read this.

**Must include:**
- Target at a glance (1 paragraph: what it does, where, how big)
- Key commercial DD findings (5-7 bullets, each one sentence)
- Market attractiveness verdict (attractive / moderately attractive / unattractive) with 1-line rationale
- Competitive positioning verdict (strong / adequate / weak) with 1-line rationale
- Growth plan feasibility assessment (% of plan rated achievable vs at-risk)
- Top 3 commercial risks with mitigants
- Top 3 commercial opportunities beyond management plan
- Clear recommendation: commercial thesis supports / partially supports / does not support investment

---

### 2. Company & Business Overview

**Purpose:** Establish what the target actually does before assessing its market. Ground the reader.

**Must include:**
- Business model description: how the company makes money at the unit level
- Product/service segmentation with revenue contribution per segment
- Geographic footprint with revenue contribution per geography
- Value chain position: where the target sits (upstream/midstream/downstream)
- Customer segments served (B2B/B2C/B2G split)
- Revenue model characteristics:
  - Recurring vs project-based vs transactional (% split)
  - Contract vs spot (% split, average duration)
  - Stickiness assessment: what creates lock-in (switching costs, regulatory requirements, relationship depth, proprietary technology)
- Key operating metrics table:

| Metric | FY__ | FY__ | FY__ | Trend |
|--------|------|------|------|-------|
| Revenue | | | | |
| Revenue by segment | | | | |
| Revenue by geography | | | | |
| Gross margin | | | | |
| EBITDA margin | | | | |
| Customer count | | | | |
| Revenue per customer | | | | |
| Customer retention rate | | | | |
| Order backlog / pipeline | | | | |

---

### 3. Market Environment & Attractiveness

**Purpose:** Assess whether this is a market worth being in. Is there a structural tailwind or headwind?

#### 3A. Market Sizing

**Framework: Three-Pronged Approach** (per L.E.K./BCG methodology)

1. **Drivers:** What are the underlying growth drivers?
   - Macro drivers (GDP, demographics, urbanization, income growth, regulation)
   - Sector-specific drivers (technology adoption, outsourcing trends, policy mandates)
   - Categorize each driver by impact: High / Medium / Low

2. **Addressability:** What is the target's addressable market?
   - TAM → SAM → SOM funnel
   - Cross-sectional mapping: Geography × Product Segment matrix
   - Bottom-up sizing with shown workings (unit economics: $/unit, $/sqft, $/head, $/MW — whichever is appropriate)
   - Top-down validation using industry reports as cross-check (never as primary)
   - If multi-geography: size each market separately, then aggregate

3. **Growth:** What are the near-term high-growth pockets?
   - Segment-level CAGR analysis (historical 5Y and forecast 5Y)
   - Volume vs price decomposition of growth
   - Identify segments growing above/below market average

**Deliverable: Market sizing table**

| Segment | Market Size (Current) | Market Size (Forecast) | CAGR | Target Share | Share Trajectory |
|---------|----------------------|----------------------|------|-------------|-----------------|
| | | | | | |

#### 3B. Market Structure & Dynamics

- Market concentration: fragmented vs consolidated (top 5/10 share)
- Barriers to entry (regulatory, capital, distribution, relationships, certifications)
- Pricing dynamics: tender-based vs negotiated vs posted, pricing power assessment
- Cyclicality: how did the market perform in the last downturn? (COVID, GFC, sector-specific)
- Regulatory environment: current regime, upcoming changes, compliance burden
- For APAC markets: contract enforceability by jurisdiction, regulatory variance across countries

#### 3C. Market Drivers & Restraints Matrix

For each key driver/restraint, assess impact level:

| Factor | Type | Impact | Evidence |
|--------|------|--------|----------|
| [e.g., Government infrastructure spend] | Driver | High | [quantified basis] |
| [e.g., Labor cost escalation] | Restraint | Medium | [quantified basis] |

**APAC-Specific Considerations:**
- Trade modernization stage (modern vs general trade penetration)
- Tier-city dynamics (T1/T2/T3 city growth differentials)
- Middle & Affluent Consumer (MAC) population growth trajectories
- Regulatory fragmentation across ASEAN jurisdictions
- Currency and FX exposure across operating geographies

---

### 4. Customer Universe & Commercial Relationships

**Purpose:** Understand revenue quality, customer dependency, and commercial defensibility.

#### 4A. Customer Concentration & Dependency

- Top 5/10/20 customer revenue concentration (% and trend over 3-5 years)
- Customer tenure analysis: % of revenue from relationships of 1yr / 3yr / 5yr / 10yr+
- Revenue by customer segment (B2B/B2C/B2G, by industry vertical)
- Intercompany/captive revenue identification: % captive vs genuine external (strip internal revenue before standalone viability assessment per Javier's framework)

#### 4B. Customer Behavior & Purchasing Criteria

**Framework: Key Purchasing Criteria (KPC) Assessment** (per BCG/L.E.K. methodology)

Rank the criteria customers use to select suppliers, then benchmark the target:

| KPC | Importance Rank | Target Performance | vs Competitor A | vs Competitor B |
|-----|----------------|-------------------|----------------|----------------|
| [e.g., Reliability of supply] | 1 | Strong | Parity | Ahead |
| [e.g., Technical support] | 2 | Strong | Ahead | Ahead |
| [e.g., Price] | 3 | Moderate | Behind | Parity |
| [e.g., Innovation/range] | 4 | Strong | Ahead | Ahead |

**Data sources (prioritize primary evidence per Javier's framework):**
- Customer interviews (minimum 5-10 if possible, mix of introduced and independent)
- Lost-bid / win-loss analysis
- Contract renewal rates and pricing trends
- NPS or satisfaction data if available

#### 4C. Revenue Quality Assessment

- Recurring vs project-based revenue trend
- Contract backlog / pipeline analysis
- Revenue visibility (% of next 12 months secured/high probability/pipeline)
- Pricing power: can the target pass through cost increases?
- Cross-sell / upsell penetration across customer base

**Deliverable: Probability-weighted pipeline** (per Roland Berger methodology)

| Category | Probability | Revenue | Weighted Revenue |
|----------|------------|---------|-----------------|
| Secured (contracted) | 100% | | |
| High likelihood (verbal/advanced) | 75-100% | | |
| Medium likelihood (proposal stage) | 50-75% | | |
| Low likelihood (early stage) | 25-50% | | |
| Preliminary (identified) | 0-25% | | |

---

### 5. Competitive Environment & Positioning

**Purpose:** Assess whether the target can defend its position and where it's vulnerable.

#### 5A. Competitive Landscape Mapping

**Framework: Tiered Competitor Classification** (per Jerry's framework + BCG methodology)

| Tier | Description | Players | Revenue Range | Geographic Scope |
|------|-------------|---------|---------------|-----------------|
| Tier 1 | Global/MNC | | | Multi-country |
| Tier 2 | Regional/mid-market | | | 2-5 countries |
| Tier 3 | Local/budget | | | Single country |

For each material competitor, profile:
- Revenue, margins (triangulate from annual reports, interviews, secondary sources)
- Geographic and segment coverage
- Key strengths and weaknesses
- Strategic direction (growing, stable, retrenching)

#### 5B. Competitive Positioning Assessment

**Framework: Multi-Dimensional Positioning Map**

Assess the target across these dimensions vs competitors:

1. **Scale & Scope:** Revenue, geographic coverage, segment breadth
2. **Capabilities:** Technical expertise, innovation velocity, technology adoption
3. **Commercial Strength:** Brand awareness, distribution reach, customer relationships
4. **Certifications & Regulatory Standing:** Licenses, accreditations, compliance grades (critical in APAC regulated industries)
5. **Financial Performance:** Margins, growth rate, return on capital

**Deliverable: Competitive positioning matrix**

| Dimension | Target | Comp A | Comp B | Comp C |
|-----------|--------|--------|--------|--------|
| Scale | | | | |
| Capabilities | | | | |
| Commercial strength | | | | |
| Certifications | | | | |
| Financial performance | | | | |

#### 5C. Market Share & Trajectory

- Current market share by segment and geography
- Share trajectory (gaining/stable/losing) over 3-5 years
- Share headroom: realistic ceiling given market structure
- Competitive displacement risk: who could take share and how?

#### 5D. Competitive Moat Assessment

- What is the target's defensible advantage?
- How durable is it? (regulatory moat, relationship moat, scale moat, technology moat)
- Geographic moat stress-test: does the moat hold across all operating jurisdictions?
- What would it cost a new entrant to replicate the target's position?

---

### 6. Growth Vector Assessment & Business Plan Review

**Purpose:** Evaluate the target's growth plan AND independently identify opportunities they may have missed.

#### 6A. Management Plan Feasibility Assessment

**Framework: Achievability Classification** (per L.E.K. methodology)

For each component of the management plan, classify:

| Plan Component | Revenue Target | Achievability Rating | Key Assumptions | Risk Factors |
|---------------|----------------|---------------------|-----------------|-------------|
| [e.g., Organic — existing customers] | | Highly achievable (>80% confidence) | | |
| [e.g., New customer acquisition] | | Achievable with execution risk (50-80%) | | |
| [e.g., New geography entry] | | Aspirational (<50% confidence) | | |

**Summary:** X% of plan rated highly achievable, Y% achievable with risk, Z% aspirational

**Validation methodology:**
- Historical performance as proof point (has the company achieved similar growth before?)
- Unit economics: does bottom-up math support the top-down narrative? (per Javier)
- Market growth attribution: how much is market tailwind vs share gain?
- Benchmark against comparable companies' achieved growth rates

#### 6B. Organic Growth Vectors

For each identified growth vector (both management's plan AND independently identified):

**Framework: Growth Vector Scorecard** (per BCG methodology)

| Vector | Description | Revenue Potential | Timeline | Right-to-Win | Investment Required | Risk Level |
|--------|-------------|------------------|----------|-------------|-------------------|-----------|
| | | | | | | |

**Right-to-Win Assessment** for each vector:
- Which of the target's competitive advantages apply?
- Market precedent: has anyone done this successfully?
- Execution capability: does the target have the people, systems, capital?
- Cannibalization risk: does this vector eat existing revenue?

**Growth vector categories to systematically evaluate:**
1. **Existing customer deepening:** cross-sell, upsell, ARPU expansion, wallet share increase
2. **New customer acquisition:** adjacent segments, underserved geographies, new verticals
3. **Product/service extension:** new categories, longer shelf-life variants, premium tiers, adjacent products
4. **Channel expansion:** new distribution channels, modern trade penetration, B2B, digital/e-commerce
5. **Geographic expansion:** new countries, new city tiers, regional expansion within existing markets
6. **Business model evolution:** recurring revenue conversion, SaaS/subscription, platform plays, distribution arm monetization

#### 6C. Inorganic Growth (M&A) Assessment

If the business plan includes acquisitions:

**Framework: M&A Screening** (per L.E.K. methodology)

Evaluate the M&A pipeline on 6 dimensions:
1. **Revenue filter:** Anchor acquisitions (>$15-20M revenue) vs bolt-ons ($3-15M)
2. **Product/segment fit:** Portfolio gap-filling, synergy potential
3. **Supplier/partner assessment:** Exclusivity status, relationship stability
4. **Financial assessment:** Margins >30% gross, healthy EBITDA, strong cash flow
5. **HR/Culture fit:** Integration complexity, key person dependencies
6. **Regulatory/compliance:** Jurisdictional risks, FCPA/anti-bribery

**Historical M&A track record validation:**
- Past acquisitions: revenue and EBITDA growth post-close
- Integration success rate
- Entity-level margin improvement trajectories

#### 6D. Independent Growth Opportunity Identification

Beyond what management presents, systematically assess:

**Framework: Opportunity Tiering** (per L.E.K. methodology)

| Tier | Description | Opportunities |
|------|-------------|--------------|
| Tier 1 — Strategic | Direct extensions of core, high right-to-win | |
| Tier 2 — Adjacent | Leverage existing capabilities into nearby markets | |
| Tier 3 — Emerging | Longer-term, require new capabilities or partnerships | |

For each independently identified opportunity:
- Directional market size estimate
- Right-to-win assessment
- Investment and timeline required
- Risk and cannibalization assessment

---

### 7. Risk Assessment & Key Findings

**Purpose:** Synthesize all commercial risks and opportunities into a clear framework for IC.

#### 7A. Commercial Risk Register

**Framework: Likelihood × Impact Matrix**

| Risk | Category | Likelihood | Impact | Mitigation | Residual Risk |
|------|----------|-----------|--------|-----------|---------------|
| | Market | H/M/L | H/M/L | | |
| | Competitive | H/M/L | H/M/L | | |
| | Customer | H/M/L | H/M/L | | |
| | Execution | H/M/L | H/M/L | | |
| | Regulatory | H/M/L | H/M/L | | |

**Risk categories to systematically cover:**
- Market risk (cyclicality, secular decline, regulatory change)
- Competitive risk (new entrants, price war, technology disruption, private label threat)
- Customer risk (concentration, churn, pricing pressure, channel shift)
- Execution risk (management capability, growth plan delivery, integration)
- Regulatory risk (licensing, compliance, cross-border, environmental)
- Raw material / input cost risk
- Talent risk (key person dependency, labor market, retention)
- ESG / reputational risk

#### 7B. Scenario Analysis

| Scenario | Probability | Revenue Impact | EBITDA Impact | Key Assumptions |
|----------|------------|---------------|---------------|----------------|
| Base case | 60-70% | | | Market grows at trend, plan partially delivered |
| Upside | 15-25% | | | Market accelerates, full plan + new vectors |
| Downside | 10-20% | | | Market slowdown, competitive pressure, plan underdelivery |

#### 7C. Key Findings Summary

Final synthesis for IC, structured as:

**Commercial strengths (✓):**
- [Finding backed by specific DD evidence]

**Commercial risks (✗):**
- [Risk with specific mitigant]

**Open questions requiring further DD:**
- [Question with recommended workstream to resolve]

**Gating questions** (per Javier's framework — 3-5 questions that determine whether this deal works):
- Each with: what it unlocks, bull vs bear answer with numbers, flow to valuation/structure

---

### 8. Appendix

Include as applicable:
- Market sizing methodology and data sources
- Customer interview notes (anonymized)
- Competitor profiles (detailed)
- Survey methodology and results
- Data room document index
- Glossary of industry-specific terms
- Source bibliography

---

## IC Review Gate (Mandatory)

Before presenting the CDD to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity
- Verify market sizing is bottom-up with shown workings — no unsupported TAM assertions
- Ensure competitive analysis uses structured tier system (Tier 1/2/3), not flat lists
- Scan for overstatements and single-datapoint extrapolations
- Verify all market claims are sourced or flagged as `[ASSUMPTION]`
- Check that KPC benchmarking references actual primary evidence, not assumptions
- Ensure next steps and recommendations are concrete and time-bound
- Core test: "If challenged, do we have a basis to stand on?"

### Pass 2 — Javier Ballve (Partner): Thesis & Analytical Challenge
- Verify unit economics support top-down narrative — build from unit economics up
- Check intercompany/captive revenue stripped before standalone viability assessment
- Challenge framing: are we validating the seller's pitch?
- Verify growth plan feasibility uses historical proof points, not just projections
- Check M&A pipeline uses differentiated multiples per entity/segment
- Ensure primary evidence (customer calls, lost-bid analysis, pricing benchmarks) prioritized over spreadsheet-only work
- Separate info requests (file-answerable) from DD questions (requiring judgment/validation)
- Verify growth vectors assess right-to-win, not just market opportunity
- Core test: "Build from unit economics up, not EBITDA down"

**Protocol:**
- Fix flagged issues silently, present clean deliverable
- If material thesis-changing issues found: surface explicitly to user before finalizing

---

## Style Rules

- Direct, no fluff. Lead with the answer, then supporting detail.
- Quantify wherever possible. Every assertion needs a number or a source.
- Never use more than one em dash (—) in a single sentence.
- Distinguish: **Stated in materials** (cite source), **Inferred** (logical conclusion), **Assumed** (gap-fill tagged `[ASSUMPTION]`).
- Primary evidence > secondary research > management assertions. Always flag the source tier.
- For APAC markets: always flag regulatory fragmentation, FX exposure, and contract enforceability differences across jurisdictions.

---

## Analytical Toolkit Reference

These frameworks are drawn from best practices across BCG, L.E.K., Roland Berger, and Deloitte CDD reports. Use the appropriate tool for each situation:

| Tool | When to Use | Section |
|------|------------|---------|
| Three-Pronged Market Sizing (Drivers/Addressability/Growth) | Every deal — market sizing | §3A |
| Cross-Sectional Market Map (Geography × Segment) | Multi-geography or multi-segment targets | §3A |
| Drivers & Restraints Matrix | Every deal — market dynamics | §3C |
| KPC Assessment | Every deal — customer purchasing behavior | §4B |
| Probability-Weighted Pipeline | Targets with project/contract-based revenue | §4C |
| Tiered Competitor Classification | Every deal — competitive landscape | §5A |
| Multi-Dimensional Positioning Map | Every deal — competitive positioning | §5B |
| Growth Vector Scorecard | Every deal — growth assessment | §6B |
| Achievability Classification | Evaluating management business plans | §6A |
| M&A Screening Framework (6-stage) | Targets with inorganic growth plans | §6C |
| Opportunity Tiering (3-tier) | Independently identifying new growth vectors | §6D |
| Likelihood × Impact Risk Matrix | Every deal — risk assessment | §7A |
| Scenario Analysis (Base/Up/Down) | Every deal — stress-testing | §7B |

---

## Training Data

This skill is trained on commercial DD reports from leading advisory firms. As new reports are uploaded, reference them to refine analytical depth, framework application, and quality benchmarks. Current training set:

| Report | Advisor | Target Sector | Geography | Key Frameworks Absorbed |
|--------|---------|--------------|-----------|------------------------|
| Project Starlight | Deloitte | Facility Management & Engineering | Singapore | SWOT-to-growth story, BCA certification matrix, 3-scenario business case (BAU/Incremental/Further), technology adoption matrix, tender price index tracking |
| Project Rio | BCG | FMCG / Baked Goods | Indonesia | 5-advantage competitive model (Brand/Distribution/Product/Manufacturing/Talent), consumer KPC survey (N=1500), Van Westendorp pricing, MAC population forecasting, 6-lever growth platform, product-channel-income matrix |
| Project Libra | L.E.K. | Life Sciences Distribution | SEA + India | 3-pronged TAM methodology, cross-sectional market mapping, KPC benchmarking (N=303), supplier KSC assessment, achievability classification (55%/30%/15%), M&A 6-stage screening, opportunity tiering |
| Project Emerald | Roland Berger | Workforce Solutions | Singapore | Probability-weighted pipeline, project archetype matrix, worker segmentation framework, dual market sizing (top-down vs bottom-up validation), 4-tiered growth lever system |

When generating a new CDD, match the analytical rigor of these reference reports. Adapt the frameworks to the target's sector and geography.

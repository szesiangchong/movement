# Annex Generator — Market Overview

> **Trigger:** After completing a target screening memo using `target-screening-lite.md`, run this prompt to generate a standalone Market Overview Word document as a separate annex. This is a reference document — not a summary, but the full market context with all tables, sources, competitive analysis, and structural moat assessment.

> **Companion templates:** `target-screening-lite.md` (screening memo), `annex-ddq-irl.md` (DDQ & IRL)

---

## Filename Convention

`[YYMMDD] Annex - [Project Name] Market Overview.docx`

Date format: YYMMDD (e.g., 260301 for 01 March 2026).

---

## Document Format

**Page setup:**
- US Letter (8.5" × 11"), portrait orientation
- 1" margins all sides
- Font: Arial throughout

**Header (every page):**
- Movement logo (`movement-logo.png` from this repo), left-aligned
- No additional header text (logo speaks for itself)

**Footer (every page):**
- `CONFIDENTIAL  |  Movement  |  Page [X]` — centered, 8pt, grey (#999999)

**Title block (page 1):**
- Title: `[Project Name] — Market Overview` — 16pt, bold, dark navy (#1F3864)
- Subtitle: `[Target Name]  |  Annex to Acquisition Screening` — 10pt, grey (#666666)
- Date line: `Updated: [DD Month YYYY]  |  [Context, e.g. "Post-Management Meeting (26 Feb 2026)"]` — 9pt, light grey (#999999)

**Table styling (all tables):**
- Dark header row: background #1F3864, white text, bold, 9pt
- Body text: 8.5pt, dark grey (#333333)
- Alternating row shading: white / light grey (#F8F9FA)
- Cell padding: 80 top/bottom, 120 left/right (DXA)
- Borders: 1pt, #CCCCCC
- Table width: full content width (9360 DXA for US Letter with 1" margins)
- Always use `WidthType.DXA` — never percentages

**Section headers:**
- Main sections: 12pt, bold, dark navy (#1F3864), spacing before 360, after 180
- Sub-sections: 10pt, bold, dark navy (#1F3864), spacing before 240, after 120

---

## Content Structure

### Change Log (if updating a prior version)

If this market overview is an update to a prior version (e.g., post-management meeting, post-DD responses), include a **Change Log** table at the top before any content sections. This tells the reader what moved and why.

| Item | Original ([Date]) | Updated ([Date]) |
|---|---|---|
| [What changed] | [Old position/data] | [New position/data and why] |

**Rules:**
- Only include items where the position, data, or assessment materially changed
- Target 5-8 rows. If nothing changed, omit this section entirely
- Column widths: Item (1800 DXA), Original (3400 DXA), Updated (4160 DXA)
- Bold the Item column
- Use alternating row shading

If this is the **first version** (no prior market overview exists), omit the Change Log entirely.

---

### 1. Executive Summary

2-3 short paragraphs covering:
- Market opportunity: addressable market size, growth rate, structural tailwinds
- Target's positioning at the intersection of relevant segments
- Timing thesis: why now is the right time to buy (macro, regulatory, or competitive catalysts)

**Post-meeting / post-DD update flags:** If new information has changed the thesis, insert update callout boxes inline:

> ⚠️ POST-MEETING UPDATE: [What changed and why it matters]

Format: Light yellow background (#FFF3CD), bold amber prefix (#CC6600), body text in dark amber (#664400). Use sparingly — only where the update materially changes the prior assessment.

---

### 2. Market Size

Present as a **single table** with a Source column. Every row must end with a VP-level observation — not a description, but an *investment implication.*

| Level | Market Segment | Size (Year) | CAGR | Observations | Source |
|---|---|---|---|---|---|
| **TAM** | [Broadest relevant market] | | | *Why does this matter for exit / strategic interest?* | [Report, Year](URL) |
| **SAM** | [Segments the company competes in] | | | *What does this growth rate mean for the platform thesis?* | [Report, Year](URL) or [ASSUMPTION] |
| **SOM** | [Realistic near-term capture] | | | *Current share % — what does it tell us?* | Target financials |

**Column widths:** Level (1000), Market Segment (2200), Size (1100), CAGR (900), Observations (4160) — total 9360 DXA.

**Source citation rules (same as screening memo):**
- Format: `[Source Name, Year](URL)` — always include the hyperlink
- If derived/estimated, mark as `[ASSUMPTION]` and include a derivation note below the table
- SOM should cite the target's actual financials (not projections)

**SAM derivation note** (required if SAM is estimated):
> State the methodology, show the calculation with ranges, cite inputs, flag what needs DD validation.

Follow with a **Segment-Level Breakdown** table:

| Segment | Addressable Market | Growth Rate | Target BU | Implied Priority |
|---|---|---|---|---|
| [Segment 1] | [Size] | [CAGR] | [BU name] | [Cash cow / Growth engine / Multiple driver + brief context] |

**Column widths:** Segment (2000), Addressable Market (1800), Growth (1000), Target BU (1400), Implied Priority (3160) — total 9360 DXA.

Include regional or macro growth context where relevant (construction market size, smart city trends, regulatory catalysts) as body text after the table.

---

### 3. Right to Play & Right to Win

Three bullet points with bold labels:

- **Right to Play:** What gives the company permission to compete (licences, certifications, track record, relationships, regulatory approvals)?
- **Right to Win:** What gives the company an edge (proprietary capability, cost advantage, installed base, exclusivity, regulatory moat)? Be specific — name the differentiator and quantify where possible.
- **What They Lack:** Capability gaps or structural weaknesses that limit SAM capture (geography, capacity, governance, product gaps).

Insert update callout boxes where post-meeting / post-DD findings change the assessment.

---

### 4. Competitor Analysis

Present as a **single table** covering all relevant value chain layers or competitor tiers. The columns should surface the key IC questions in one scan.

**Option A — Value Chain Map** (use when the target spans multiple value chain layers):

| Value Chain Layer | Core Participants | Target Position | Ease of Replicating [Target's Model] |
|---|---|---|---|
| [Layer 1] | [Names] | [How target plays here] | **HIGH/MOD/LOW.** [One-line: mechanism] |

**Column widths:** Layer (1800), Participants (2600), Target Position (2200), Ease of Replicating (2760) — total 9360 DXA.

**Option B — Three-Tier Competitor Table** (use when the target competes in a single layer but has tiered competitors):

| Tier | Competitor | Owner (Acquirable?) | Can Bundle [Key Capability]? | Project / Client Overlap | Threat to [Target] |
|---|---|---|---|---|---|

Follow the column guidance from `target-screening-lite.md` Section 6.3.

**After the table, write a Key Takeaway paragraph** (one dense paragraph): what the competitive landscape means for the target's defensibility, the primary structural threat, and what DD actions have been submitted to test it.

**Tag [UPDATED] inline** where post-meeting / post-DD info changes a competitor assessment. Format: bold red text (#CC0000) prefix.

---

### 5. Structural Moat & Vulnerability

**The Moat** — assess along three dimensions with a rating (HIGH / MODERATE / LOW) for each:

- **Switching Costs:** What does it cost a customer to replace the target? Is it one vendor or multiple? Quantify where possible.
- **Pricing Power:** Where in the portfolio is pricing power strongest/weakest? What drives it (exclusivity, installed base, regulatory lock-in)?
- **Operational Leverage:** What structural cost advantage does the target have (in-house vs. outsourced, scale, vertical integration)?

Insert update callout boxes where post-meeting / post-DD findings introduce caveats or change the rating.

**The Vulnerability** — the inherent structural weaknesses (not external threats):

- **[Vulnerability 1]:** [Description + specific trigger for when this becomes a problem]
- **[Vulnerability 2]:** [Description + specific trigger]
- **[NEW] [Vulnerability 3]:** [Tag as NEW if discovered post-screening]

Each vulnerability should have an update callout if post-meeting findings change the severity or introduce new information.

---

### 6. Preliminary Risks & Commercial DD Roadmap

**Thesis Killers:** 3-4 items, each framed as: *"It's 5 years from now and the deal failed — why?"*

Format each as a bullet with bold label:
- **Thesis Killer #1:** [Risk event]. [Consequence for what we bought]. [STATUS: DD action taken]
- **[NEW] Thesis Killer #2:** [Tag as NEW if discovered post-screening]
- **[UPDATED] Thesis Killer #3:** [Tag as UPDATED if the risk assessment changed]

**Commercial DD Roadmap** — present as a table:

| Risk / Item | DD Action | Timeline |
|---|---|---|
| [Specific risk or data gap] | [Specific, actionable DD step] | [Pre-LOI / CDD Phase 1 / CDD Phase 2] |

**Column widths:** Risk (2800), DD Action (4200), Timeline (2360) — total 9360 DXA.

Close with a note: *"Full DDQ and Information Request List issued separately. See: [YYMMDD] Annex — [Project Name] DDQ and IRL.docx"*

---

## Execution Notes

1. **Source material:** The primary input is Section 6 (Market Overview) from the screening memo generated via `target-screening-lite.md`. If the screening memo has been updated post-meeting or post-DD, the market overview must reflect all updates — not just the original screening data.

2. **Change Log trigger:** Include the Change Log table if *any* of the following are true:
   - A management meeting has occurred since the original screening
   - DD responses have been received that change market assumptions
   - Financial data has been updated (e.g., unaudited actuals replacing CIM projections)
   - IC feedback has challenged or refined the market thesis

3. **Update flags:** Use `[UPDATED]` tags inline in tables and `⚠️ POST-MEETING UPDATE:` callout boxes in prose sections. Both should clearly state what changed and why.

4. **IC Review Gate:** This document must pass the IC Review Gate (see `SYSTEM_PROMPT.md`) before delivery. Jerry lens: verify source citations, flag unsubstantiated claims, check competitive tiering is structured. Javier lens: test whether the integration thesis / moat assessment is backed by evidence or just management narrative.

5. **Do NOT duplicate content that belongs in other annexes.** Specifically:
   - Detailed DD questions → `annex-ddq-irl.md`
   - Deal structure / waterfall → `deal-structure-waterfall.md`
   - LBO model → LBO section in screening memo
   - Financial deep-dive → Financial Profile section in screening memo

6. **Logo:** Use `movement-logo.png` from this repo for the header.

7. **Word generation:** Use `docx-js` (npm package) to generate the .docx file. Follow the docx skill's formatting rules (dual widths on tables, ShadingType.CLEAR, no unicode bullets, etc.).

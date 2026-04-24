---
name: weekly-update
description: Generate a Partners Weekly DD Update presentation for Project Diamond (Carats & Co acquisition). Use when the user mentions "weekly update", "partners update", "weekly deck", "DD update deck", "weekly prep", or wants to prepare a status update for Movement partners on the Carats DD process. This skill reads from the VDR folder structure, IRL tracker, and on-site meeting notes to produce a structured PowerPoint deck.
---

# Partners Weekly DD Update — Project Diamond

> **CRITICAL — LIVE DEAL, DD PHASE**: This skill is used during an active due diligence process. All content in the deck MUST be strictly factual and sourced directly from the files in the VDR and on-site meeting notes. Do NOT make assumptions, infer, extrapolate, or fill in gaps with general knowledge. If a data point is not explicitly stated in the source files, do not include it — flag it as "not yet received" or "pending confirmation" instead. Every finding, number, and statement must be traceable to a specific file or document. Maintain clarity and precision on all pointers at all times — ambiguous or vague language is not acceptable in a partners-facing DD update.

Generates a PowerPoint deck summarising the week's DD progress for Movement partners. The deck uses the Movement template (`Weekly update template.pptx`) and is structured into 4 segments.

## Prerequisites

- **Template file**: `Weekly update template.pptx` in the uploads folder or workspace. This contains the Movement header bar (navy `#001530`, Movement logo, "PROJECT DIAMOND", "Carats & Co", "STRICTLY CONFIDENTIAL", date/phase subtitle).
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

## Determining the Current Week

When the user triggers this skill:
1. List the folders under `08 - VDR/` to find the latest `VDR caa {date}` folder.
2. Use that folder as the current week's VDR source unless the user specifies otherwise.
3. Update the deck date in the header to match (e.g., "WEEKLY UPDATE AS OF {DATE} | DD PHASE").

## Template Layout

The template has a single slide with the Movement header bar. All content slides should replicate this header bar structure:

- **Header bar**: Full-width navy rectangle (`#001530`), height ~475488 EMU
  - Movement logo (white mark) at left
  - "PROJECT DIAMOND" in Georgia Bold 13pt white
  - "Carats & Co" logo/text in Calibri 10pt muted (`#8896A6`)
  - "STRICTLY CONFIDENTIAL" in Calibri 7pt gold (`#B8952A`), right-aligned
  - "WEEKLY UPDATE AS OF {DATE} | DD PHASE" in Calibri 7pt muted (`#8896A6`), right-aligned below confidential marker
- **Content area**: Below the header bar, use the full slide width with 0.5" margins

### Color Palette

| Element | Hex |
|---------|-----|
| Header bar / section headers | `#001530` (deep navy) |
| Accent / gold | `#B8952A` |
| Muted text | `#8896A6` |
| Tier 1 (high priority) flag | `#C62828` (red) |
| Tier 2 (medium priority) flag | `#E65100` (orange) |
| Done / completed | `#2E7D32` (green) |
| Body text | `#1A1A1A` |
| Light background for tables | `#F5F7FA` |

### Typography

| Element | Font | Size |
|---------|------|------|
| Slide title | Georgia Bold | 18pt |
| Section header | Calibri Bold | 14pt |
| Body / table content | Calibri | 10–11pt |
| Table header | Calibri Bold | 10pt, white on navy |
| Captions / footnotes | Calibri | 8pt, muted |

## Deck Structure

### Cover Slide (Slide 1)
Use the template slide as-is. Update the date: "WEEKLY UPDATE AS OF {DATE} | DD PHASE".

---

### SEGMENT 1: VDR Received This Week

**Purpose**: Summarise what was received in the VDR for the week and track IRL progress.

#### Data Sources
1. **IRL tracker**: `08 - VDR/VDR caa {date}/Project Diamond - Information Request List.xlsx`
   - Read the Excel file using openpyxl
   - Column L contains the status (look for "Done", checkmarks, "Y", or similar completion markers)
   - Group items by their category column (should map to the VDR folder categories A–J)
2. **VDR folder contents**: List all files within each category subfolder (A through J) of the current week's VDR folder

#### Slide 2: IRL Progress Overview
- **Title**: "1. VDR — Items Received This Week"
- **Lead with two key stats** (large callout, prominent placement):
  1. **Files received**: Total count of files across all category subfolders this week (e.g., "23 files received")
  2. **IRL progress**: X/Y (Z%) — count of items marked "Done" in column L of the IRL tracker vs total IRL items (e.g., "47/128 (37%)")
- **Category breakdown table** below the callouts:

| Category | IRL Items | Done | % | Files Received |
|----------|-----------|------|---|----------------|
| A. Corporate and Entity Structure | X | X | X% | X |
| B. Financial Statements... | X | X | X% | X |
| ... | ... | ... | ... | ... |
| **Total** | **X** | **X** | **X%** | **X** |

- Use green text or a green dot (●) for categories that are fully done
- Use the alternating row background (`#F5F7FA` / white)

#### Slide 3+: Category Summaries
For each VDR category (A through J) that has files received this week, summarise the files received before moving to the next category:
- **Section header**: Category name in bold (e.g., "B. Financial Statements and Management Accounts")
- **Sub-header**: "X files received" + IRL status for that category (e.g., "5/12 Done (42%)")
- **Bullet list**: For each file received in this category:
  - File name
  - One-line description of what the document contains (read the file if possible, or infer from filename)
  - Flag any notable items or gaps
- **Complete one category fully before moving to the next**
- Group multiple categories per slide where the content is light (aim for 2–3 categories per slide if they have few files)
- Skip categories with zero files received

#### Key Items Not Yet Received
After the category summaries, include a prioritised table of the most critical outstanding items from the IRL. This surfaces the key gaps that are blocking workstreams (model, legal DD, FDD advisor engagement). Format:

| Priority | IRL Ref | Item | Why It Matters |
|----------|---------|------|----------------|
| Critical | D3–D6 | [description] | [what it blocks] |
| High | F2 | [description] | [what it blocks] |
| Standard | J1–J2 | [description] | [what it blocks] |

Priority levels: **Critical** (blocking a major workstream), **High** (needed within 1–2 weeks), **Standard** (important but not blocking).

---

### SEGMENT 2: Key Findings & Red Flags

**Purpose**: Surface material findings from both on-site DD and VDR analysis, tiered by priority.

#### Data Sources
1. **On-site findings**: Read all files in `04 - Due Diligence/On-site Meetings/`
   - These are typically `.docx` files from on-site meetings (finance team, BU heads, etc.)
   - Extract key findings, issues, gaps, and concerns from the meeting notes
2. **VDR findings**: Analyse files within the current week's VDR folder (`08 - VDR/VDR caa {date}/`)
   - Read key documents (financial statements, contracts, org charts, etc.)
   - Identify discrepancies, risks, missing items, or notable findings

#### Classification Framework

All findings are classified into:
- **Category 1: On-site** — findings from physical DD / management meetings
- **Category 2: From VDR** — findings from document review

Within each category, tier by priority:
- **Tier 1 (High Priority / Material)**: Issues that could affect valuation, deal structure, or are deal-breakers. Flag in red (`#C62828`).
- **Tier 2 (Medium Priority)**: Issues that need attention but are manageable. Flag in orange (`#E65100`).

#### Format: Bullet Points (Not Tables)

Use bullet-point format for all findings — easier to read and present. Each finding follows this structure:

```
- **[Category] Topic.** Description of the finding. *Impact:* What this means for the deal / valuation / operations. *Action:* What needs to happen next.
```

- **Category labels**: Financials, Operations, Revenue, Legal, IT/Systems, Governance, Working Capital, People, Tax, Assets
- Sort by Tier (T1 first), then by Category within each tier
- On-site findings: prefix with the source meeting (e.g., "Source: 260423 Finance Team Meeting")
- VDR findings: reference the specific file or sub-folder analysed

#### VDR Findings — Substantive Analysis Required

**VDR findings are NOT just about what files are in or out.** The primary purpose is to read and analyse the actual file contents to assess risk. File-gap tracking belongs in Segment 1.

For Category 2 (From VDR), the analysis should:

1. **Read the financial data** — open xlsx/PDF files and extract key figures
2. **Assess trends** — e.g., is working capital increasing in line with revenue, or disproportionately?
3. **Flag anomalies** — e.g., AR aging deterioration, margin compression, revenue lumpiness
4. **Link findings back to deal context** — e.g., "Revenue has been growing 15% YoY, so a modest increase in AR is expected. However, the >90-day bucket has grown from X% to Y%, suggesting collection issues with specific clients."
5. **Identify commercial and operational risks** — not just financial. E.g., customer concentration, contract dependency, key-person risk from org charts, insurance coverage gaps.

**Examples of substantive VDR findings (Tier 1):**
- "Monthly P&L (B6) shows Carats gross margin declined from 38% in H1 FY24 to 32% in H2 FY25. This coincides with the ramp-up of the [project name] contract, suggesting the bid was margin-dilutive. Verify tender assumptions."
- "AR aging (E2) shows S$X in the >90 day bucket, representing Y% of total receivables — up from Z% a year ago. Top exposure is [Client Name] at S$X. Cross-reference with D13 (top 20 clients) to assess whether this is a systemic issue."
- "Customer concentration (D13): Top 1 client represents X% of group revenue. If this is a transport operator contract expiring 2033–34, concentration risk is mitigated by duration. But if it's a project-based relationship, concentration is a concern."

**Examples of substantive VDR findings (Tier 2):**
- "Inter-company billing checklists (B7) show Adactive billed Carats S$Xk in FY25 for software, but Carats' cost of this is buried in overheads. Need to quantify for elimination."
- "FA register (F1) shows average asset age of X years. Bulk of Carats assets are [category]. No major capex cycle imminent, but screen assets at Gleamedia may need refresh in 2–3 years."
- "Dividend workings show total distributions of S$Xm across all entities in FY25 — represents Y% of EBITDA. High distribution rate reduces retained cash cushion."

If a file cannot be read (e.g., still syncing), note it as **"Pending analysis — file not yet accessible"** and flag what you plan to assess once available.

---

### SEGMENT 3: IC Memo / Financial Model Progress

**Purpose**: Track progress on the investment committee memo and financial model.

**DO NOT auto-populate.** Leave this as a placeholder slide with the title and empty structure. The user will prompt with specific content.

#### Slide Layout
- **Title**: "3. IC Memo & Financial Model Progress"
- **Two-column layout**:
  - Left: "IC Memo" — bullet placeholder for status items
  - Right: "Financial Model" — bullet placeholder for status items
- **Footer note**: "[To be completed — prompt with specific updates]"

---

### SEGMENT 4: Next Week Key Activities

**Purpose**: Outline planned activities for the coming week.

**DO NOT auto-populate.** Leave as a placeholder slide for the user to prompt.

#### Slide Layout
- **Title**: "4. Next Week — Key Activities"
- **Bullet list placeholder** with 5–6 empty bullet points
- **Footer note**: "[To be completed — prompt with specific activities]"

---

## Execution Steps

When this skill is triggered:

1. **Read the PPTX skill**: Always read `/sessions/nice-dazzling-pascal/mnt/.claude/skills/pptx/SKILL.md` first for slide creation best practices.

2. **Identify the current week's VDR folder**:
   ```bash
   ls "08 - VDR/" | grep "VDR caa"
   ```
   Use the latest dated folder, or the one the user specifies.

3. **Read the IRL tracker**:
   - Open the `Project Diamond - Information Request List.xlsx` in the VDR week folder
   - Parse categories and completion status from column L
   - Count totals and per-category progress

4. **Scan VDR files received**:
   - List all files in each category subfolder (A–J)
   - Count files per category
   - Read key documents for content summaries (prioritise financial statements, contracts, org charts)

5. **Read on-site meeting notes**:
   - Read all `.docx` files in `04 - Due Diligence/On-site Meetings/`
   - Extract findings, red flags, and observations

6. **Build the deck**:
   - Use the template-based editing workflow (unpack → duplicate slides → edit → clean → pack)
   - OR use pptxgenjs to create from scratch, replicating the header bar from the template
   - Replicate the header bar on every slide
   - Populate Segments 1 and 2 from the data gathered
   - Leave Segments 3 and 4 as placeholders

7. **QA**: Follow the PPTX skill's QA process — convert to images, inspect with subagent, fix issues.

8. **Save output**: Save the final deck to:
   ```
   202602 Carat & Co (SG building signages)/06 - Correspondence/Project Diamond - Weekly Update ({date}).pptx
   ```

### APPENDIX: Detailed File Listing (Final Slide of Deck)

This is always the **last slide(s)** of the entire deck, after all 4 segments.

- **Title**: "Appendix — VDR File Listing ({date})"
- **Full table** listing every file received across all categories:

| # | Category | File Name | Description |
|---|----------|-----------|-------------|
| 1 | A. Corporate... | file.pdf | Brief description |
| 2 | B. Financial... | file.xlsx | Brief description |
| ... | ... | ... | ... |

- Use small font (9pt Calibri) to fit more rows
- Navy header row (`#001530`, white text)
- Alternating row backgrounds (`#F5F7FA` / white)
- If too many files for one slide, split across multiple slides with continuation title ("Appendix — VDR File Listing (cont.)")
- Sort by category (A–J), then alphabetically within each category

---

## Important Notes

- **Do not fabricate findings.** Only report what is actually in the files. If a document cannot be read, note it as "unable to parse" rather than guessing.
- **Cross-reference with memory.** Check auto-memory for Project Diamond context (deal overview, prior findings) but verify against current files before including.
- **Maintain confidentiality markings.** Every slide must carry the "STRICTLY CONFIDENTIAL" marker.
- **Date format**: Use "DD MMMM YYYY" format (e.g., "24 APRIL 2026") consistently.
- **Keep it tight.** Partners want signal, not noise. Aim for 8–12 slides total. If findings are extensive, summarise on the slide and note "detailed analysis available in [file]".

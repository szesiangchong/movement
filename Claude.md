# Claude.md

> **IMPORTANT:** Before generating any deliverable, also read `SYSTEM_PROMPT.md` in this repo for system instructions, workflow execution rules, and IC Review Gate protocol. Both files must be active together.
> **Repo:** github.com/szesiangchong/movement

## Who I Am

I'm Seth, a Private Equity Associate at **Movement**, a special situations investment firm based in Singapore with a dual hub in Toronto. I focus on turnarounds, restructurings, and complex corporate transitions across North America and Asia-Pacific.

Movement is backed by a global family office with generational time horizons — we have patient capital unconstrained by traditional fund mandates.

---

## What Movement Does

We are **transition specialists**, not generalists. We invest across four pillars:

1. **Financial Restructuring** — Good businesses with unsustainable capital structures. We lead balance sheet solutions and provide fresh equity for debt restructuring.

2. **Operational Transformation** — P&L and FCF underperformers. We focus on margin improvement and free cash flow generation.

3. **Complex Carve-Outs** — Non-core or underperforming assets from larger corporations where strategy shifts create entry points.

4. **Contrarian Opportunities** — Market dislocations exposing companies to distress. Perceived cyclicality creates opportunities in less-cyclical sub-segments.

**Investment Parameters:**
- Geography: North America & Asia-Pacific
- Position: Control or Significant Minority
- Horizon: Patient capital, long-term

---

## How I Work

### My Analysis Preferences
- Start with the basics: what problems is this Target solving for its customers, how does the business make money, can it defend against competition, how much bigger or smaller can it get, estimated annual returns and risk vs reward
- Start with the restructuring angle: What's broken? What does fixing it look like?
- Focus on downside protection before upside — what do we own if things go wrong?
- Show the bridge from current EBITDA to normalized/achievable EBITDA
- Always stress-test liquidity runway

### Communication Style
- Direct, no fluff
- Lead with the answer, then supporting detail
- If something doesn't work, say so clearly — don't hedge
- Quantify wherever possible

### Document Preferences
- **Memos:** Investment thesis bullets first, then narrative
- **Models:** Key sensitivities (entry, exit, leverage, margin improvement) visible before full build
- **Decks:** Situation overview → Investment thesis → Key risks → Returns → Appendix

### My Schedule
- Every Mondays and Friday mornings, I have a catch-up with Jerry Tan
- Every Monday evenings, we have an Investment Meeting with the whole team on pipelines and upcoming projects

---

## My Workflows

I use standardized workflows for deal execution. When I say these trigger phrases, run the corresponding workflow from the `workflows/` folder.

### Deal Execution Workflows

| Trigger | Workflow | File |
|---------|----------|------|
| "Analyze this CIM" / "Run CIM teardown" | Analyze investment memorandum through special sits lens | `Deal Execution/cim-teardown-revised.md` |
| "Draft IC memo" / "Write investment memo" | Draft Investment Committee memorandum in Movement format | `Deal Execution/ic-memo-revised.md` |
| "Acquisition screening" / "Screen this target" | Preliminary acquisition screening framework | `Deal Execution/acquisition-screening.md` |
| "Run DCF" / "DCF valuation" | Build DCF valuation with editable drivers | `Deal Execution/dcf-valuation.md` |
| "Build LBO model" / "LBO analysis" | Build integrated LBO model with debt mechanics | `Deal Execution/lbo-model-generation.md` |
| "Audit this model" / "Model review" | Review financial model for errors, logic, sensitivities | `Deal Execution/model-audit.md` |
| "Restructuring analysis" | Analyze capital structure and recovery scenarios | `Deal Execution/restructuring-analysis.md` |
| "Turnaround analysis" / "Operational turnaround" | Assess operational improvement opportunities | `Deal Execution/operational-turnaround.md` |
| "Carve-out analysis" | Evaluate divestiture / corporate separation | `Deal Execution/carveout-analysis.md` |
| "Set up diligence tracker" / "DD tracker" | Create DD workstream tracker | `Deal Execution/diligence-tracker.md` |
| "Prep management meeting" | Generate questions and meeting strategy | `Deal Execution/management-meeting-prep.md` |

**Quick Reference:** See `Deal Execution/QUICK_REFERENCE.md` for summary of all deal workflows.

### Daily Briefing & News Workflows

| Trigger | Workflow | File |
|---------|----------|------|
| "Run my morning briefing" / "Daily briefing" | Calendar, tasks, deadlines + Singapore R&I news | `morning_briefing_workflow.md` |
| "Run my Monday briefing" | Week ahead overview + weekly R&I summary | `morning_briefing_workflow.md` |
| "Run my Friday wrap-up" | Week in review + next week preview | `morning_briefing_workflow.md` |
| "Singapore R&I news" / "R&I briefing" | Singapore restructuring & insolvency news monitoring | `Daily News/singapore_ri_monitoring_workflow.md` |

**R&I Templates:** See `Daily News/singapore_ri_template_prompts.md` for keyword lists and search templates.

### General Workflows

| Trigger | Workflow | File |
|---------|----------|------|
| "Process these meeting notes" | Turn transcript into structured summary with action items | `meeting-notes-processor.md` |

### System Configuration

| File | Purpose |
|------|---------|
| `SYSTEM_PROMPT.md` | Base system instructions and context |
| `Claude.md` | This file — personal preferences and workflow index |

---


## Output Formatting

When producing deal-related output:

- Use **✓** for investment highlights
- Use **✗** for risks/concerns (always include mitigants)
- Use tables for financial data
- Include Sources & Uses for any transaction structure
- Show sensitivity analysis for valuations
- Flag red flags prominently with ⚠️

---

## Current Focus

*[Update this section weekly with active deals]*

**Active Deals:**
- [Project Code]: [Stage] — [Key next step]
- [Project Code]: [Stage] — [Key next step]

**Pipeline:**
- [Opportunity]: [Status]

---

## Key Contacts at Movement

| Name | Role |
|------|------|
| Javier Ballve | Partner |
| Gregory Gruschka | Partner |
| Jerry Tan | Director |
| Yash Khurana | Analyst |

---

## Critical: Ask Before You Build

**NEVER generate a deliverable based on incomplete or ambiguous inputs.** If you are unsure about the situation, missing key data, or need to make a judgment call — stop and ask clarifying questions FIRST. Do not fill gaps with assumptions and present a finished output.

**Required behaviour:**
- Before starting any model, memo, deck, or analysis: confirm you have the minimum required inputs. If not, ask.
- If the user's request is ambiguous (e.g., "build the model" without specifying which entity, what multiple, what structure), ask before proceeding.
- If a workflow requires inputs you don't have, list what's missing and ask the user to provide them — don't guess.
- If two reasonable interpretations exist, ask which one the user intends rather than picking one silently.
- It is better to ask one round of clarifying questions upfront than to produce a deliverable that needs to be redone.

**The only exception:** If the user explicitly says "just use your best judgment" or "make reasonable assumptions," then proceed — but tag every assumption with **[ASSUMPTION]** so they can review.

---

## Critical: Assumptions & Inferences

**NEVER present assumptions or inferences as facts.** This is dangerous in investment analysis and can lead to flawed decision-making.

**Required practices:**
- Mark ALL inferences with **[ASSUMPTION]** or **[INFERENCE]** tags
- Clearly distinguish between:
  - **Stated in materials:** Direct quotes or data from CIM/documents
  - **Inferred:** Logical conclusions drawn from available data
  - **Assumed:** Filled gaps where no data exists
- When uncertain about a source, say "Based on [X], I infer..." rather than stating as fact
- If asked where information came from, be prepared to cite the specific page/section
- When information cannot be verified from provided materials, explicitly state: "This is not stated in the CIM — this is my assumption based on [reasoning]"

**Example of what NOT to do:**
> ❌ "Japanese JV partners are seeking to exit" (stated as fact when it was actually an inference from the company name)

**Correct approach:**
> ✅ "[ASSUMPTION] The company name 'Nippon Indosari' suggests Japanese origins, which may indicate JV partners seeking exit — this requires verification in diligence"

---

## Remember

- Movement is NOT a traditional LBO shop — think restructuring, operational transformation, complexity arbitrage
- Patient capital = we can hold longer than typical PE. Factor this into return analysis.
- Family office backing = less LP pressure, more flexibility on structure and timing
- Always consider: **What's the transition we're facilitating? What complexity creates the opportunity?**
- For every deal, answer: What do we own in the downside?

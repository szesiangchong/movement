# LBO Sketch Template

> **Template for a back-of-envelope LBO analysis**
> *Base: Carats & Co (full buyout) + RJ Crocker (majority acquisition with rollover)*
> Currency: S$'000 unless stated

---

## Deal Archetypes

This template supports multiple deal structures. The core LBO mechanics are shared, but the sheet layout and formula complexity vary by archetype:

| Archetype | Example | Key Structural Features | Complexity |
|---|---|---|---|
| **Full Buyout** | Carats & Co | 100% acquisition, sponsor + family split, no rollover, no SF, no earnout | Simple |
| **Majority Acquisition with Rollover** | RJ Crocker | <100% acquisition, seller rollover equity, seller financing, earnout, MIP/ESOP | Complex |
| **Platform + Bolt-on** | (Future) | Initial platform buyout followed by add-on acquisitions at lower multiples | Advanced |
| **Minority Growth Equity** | (Future) | Minority stake, no control premium, growth-oriented returns, no leverage | Different framework |

> Select the archetype that matches your deal and follow the corresponding section markers below. Sections marked [ROLLOVER] are only needed for majority acquisitions with rollover. Sections marked [ALL] apply to every archetype.

---

## Sheet Layout

### Full Buyout (Simple)

| Region | Rows | Purpose |
|---|---|---|
| Header | 1–3 | Deal title, date, confidentiality notice |
| Key Assumptions | 4–24 | All blue-font inputs + notes |
| A. Entry Val | 26–36 | EV, equity value, ownership split |
| Sources & Uses | 38–47 | Dual-column S&U with percentages |
| B. Net Debt Bridge + FCF | 49–82 | Pro forma debt, 5-yr FCF, net cash |
| C. Exit Valuation | 84–91 | Two exit scenarios (flat + re-rate) |
| D. Returns | 93–98 | MoIC and IRR for both scenarios |
| Sensitivity | 101–106 | Entry × Exit multiple MoIC table |
| Named Scenarios | 108+ | Base / Downside / Upside with full FCF each |
| Returns Waterfall | after scenarios | Component decomposition of sponsor returns |

### Majority Acquisition with Rollover (Complex)

| Region | Rows | Purpose |
|---|---|---|
| Header | 1–2 | Deal title + structure summary |
| Key Assumptions | 4–29 | Inputs incl. rollover %, SF terms, exit mult, MIP/ESOP toggles |
| A. Entry Val | 31–39 | EV, earnout, extractable cash, equity value |
| Ownership & Pricing | 41–44 | Per-party stake pricing |
| Sources & Uses | 46–62 | At-close + deferred (SF, earnout) — dual column |
| B. Target EBITDA & Earnout | 64–73 | Achievement schedule, earnout calc |
| C. Net Debt Bridge | 75–79 | Pro forma opening position |
| D. FCF Schedule | 81–117 | Revenue → EBITDA → MIP → tax → FCF → debt → SF → excess cash |
| E. Exit Valuation | 118–124 | Single exit multiple, pre-MIP EBITDA basis |
| F. Returns | 127–133 | 4-way MIP × ESOP matrix (MoIC + IRR) |
| Sensitivity | 135–165 | 3 tables: Entry/Exit, Margin/Exit, Margin/CAGR |
| SF Interest Sensitivity | after sens. | SF rate impact on cash flow and returns |
| Named Scenarios | after SF sens. | Base / Downside / Upside with full FCF each |
| Returns Waterfall | after scenarios | Dual waterfall: Movement + rollover party |

---

## Formatting Conventions [ALL]

| Convention | Style |
|---|---|
| Blue font (`#0000FF`) | Hardcoded inputs (user editable) |
| Black font | Formulas / calculations |
| Grey italic font | Supporting labels, notes, ratios |
| Dark header rows | White bold text on `#1F4E79` background |
| Bold | Section totals and key outputs |
| Number formats | `#,##0;(#,##0);"-"` for currency, `0.0x` for multiples, `0.0%` for percentages |

---

## KEY ASSUMPTIONS [ALL]

All inputs in column C (blue font). Notes in column I (grey italic).

### Core Inputs (both archetypes)

| Row | Label | Example (Carats) | Example (RJC) | Format |
|---|---|---|---|---|
| 5 | EBITDA (reference year) | 7,172 | 3,747 | `#,##0` |
| 6/7 | Revenue (reference year) | 28,100 | 18,558 | `#,##0` |
| 8 | Revenue CAGR | 5.0% | 5.0% | `0.0%` |
| 9 | Entry Multiple | 6.0x | `=C34` (implied) | `0.0x` |
| 10 | Sponsor Stake (%) | 70% | 51% (AAI) | `0.0%` |
| 12 | Leverage (x EBITDA) | 2.0x | 1.0x | `0.0x` |
| 13 | Interest Rate | 4.0% | 4.0% | `0.0%` |
| 14 | Amortisation (years) | 5 | 7 | `0` |
| 15 | Hold Period (years) | 5 | 5 | `0` |
| 16 | Tax Rate | 17% | 17% | `0.0%` |
| 17 | Total Cash (AFS) | — | 1,750 | `#,##0` |
| 18 | Total Debt (AFS) | 2,701 | 517 | `#,##0` |
| 19 | Operating Cash Minimum | 2,000 | 1,700 | `#,##0` |
| 20 | Transaction Cost (% of stake) | 1.5% | 2.0% | `0.0%` |
| 28 | Exit Multiple | 6.0x | 6.0x | `0.0x` |

### Rollover-Specific Inputs [ROLLOVER]

| Row | Label | Example (RJC) | Format | Notes |
|---|---|---|---|---|
| 11 | Founder Secondary Exit (%) | 19% | `0.0%` | Vincent's partial exit |
| 21 | Upfront % for Sellers' Stakes | 80% | `0.0%` | Rest via SF |
| 22-23 | SF % / Tranches | 20%, 30/30/40 | `0.0%` | Deferred payment structure |
| 27 | SF Interest Rate | 0% | `0.0%` | Adjustable |
| I5 | MIP Toggle (1=On) | 1 | `0` | Turns MIP cost on/off in FCF |
| I6 | ESOP Pool (%) | 5% | `0.0%` | Dilutes sponsor at exit |

---

## A. ENTRY VALUATION [ALL]

### Full Buyout

| Row | Label | Formula |
|---|---|---|
| 28 | EBITDA | `=C5` |
| 29 | Entry Multiple | `=C6` |
| 30 | Enterprise Value | `=C28*C29` |
| 31 | (-) Net Debt / (+) Net Cash | `=C13-C14` |
| 32 | Equity Value (100%) | `=C30+C31` |

### Majority Acquisition with Rollover [ROLLOVER]

| Row | Label | Formula | Notes |
|---|---|---|---|
| 33 | EBITDA (FY2026) | `=F5` | Screening basis |
| 34 | Entry Multiple (Implied) | _input: 4.5x_ | Implied from EV ÷ EBITDA |
| 35 | Enterprise Value | `=C33*C34` | |
| 36 | (+) Earnout | `=C37-C35` | Contingent — see Section B |
| 37 | Total EV (incl. Earnout) | _input: 18,000_ | Negotiated total |
| 38 | (+) Extractable Cash | `=C17-C19` | Cash − Op. Minimum |
| 39 | **Equity Value (100%)** | `=C37+C38` | |

---

## SOURCES & USES [ALL]

### Full Buyout — Single-close structure

| Side | Row | Label | Formula |
|---|---|---|---|
| Uses | 40 | Enterprise value | `=C30` |
| Uses | 41 | Refinance existing debt | `=C14` |
| Uses | 42 | Transaction costs | `=C30*C16` |
| Uses | 45 | **Total Uses** | `=SUM(C40:C42)` |
| Sources | 40 | Acquisition debt | `=C8*C5` |
| Sources | 41 | Excess cash extraction | `=C13` |
| Sources | 42 | Total equity required | `=C45-F40-F41` |
| Sources | 43 | Sponsor equity | `=F42-F44` |
| Sources | 44 | Family rollover | `=(C45-F40)*(1-C7)` |

### Majority Acquisition with Rollover [ROLLOVER] — At-close + deferred

**At Close:**

| Side | Row | Label | Formula |
|---|---|---|---|
| Sources | 48 | Acquisition debt | `=C12*F5` |
| Sources | 49 | Excess cash extraction | `=C17-C19` |
| Sources | 50 | SPV equity | `=C53-C48-C49` |
| Sources | 51 | Movement (sponsor) | `=0.7*C50` |
| Sources | 52 | Vincent rollover (30%) | `=0.3*C50` |
| Uses | 48 | AAI 51% stake (80% upfront) | `=C42*C22` |
| Uses | 49 | Vincent 49% stake (80% upfront) | `=(C43+C44)*C22` |
| Uses | 50 | Refinance existing debt | `=C18` |
| Uses | 51 | Transaction costs | `=(C42+C43+C44)*C20` |

**Deferred:**

| Row | Label | Formula | Notes |
|---|---|---|---|
| 55 | Earnout (contingent — Year 4) | `=C36` | From Entry Val |
| 56 | SF — Vincent | `=(C43+C44)-F49` | Deferred portion |
| 57 | SF — AAI | `=C42-F48` | Deferred portion |
| 54-56 | SF Year 1/2/3 payments | `=(C56+C57)*C24` etc. | 30/30/40 tranches |

> Sources = Uses must balance at close. Deferred items (earnout, SF) are separate.

---

## B. TARGET EBITDA SCHEDULE & EARNOUT [ROLLOVER]

| Row | Label | FY27 | FY28 | FY29 | Notes |
|---|---|---|---|---|---|
| 66 | Target EBITDA | _input_ | _input_ | _input_ | 95% of budget, +5% YoY |
| 67 | Projected EBITDA | `=C84` | `=D84` | `=E84` | Links to FCF EBITDA |
| 68 | Achievement Ratio | `=C67/C66` | etc. | | |
| 70 | **Average Achievement** | `=AVERAGE(C68:E68)` | | | 3-year avg |
| 71 | **Earnout Earned** | `=IF(C70<0.8,0,MIN(C70,1)*C36)` | | | Floor 80%, cap 100% |

---

## FCF SCHEDULE [ALL]

### Full Buyout — includes Capex, D&A, NWC

Revenue → EBITDA → D&A → EBIT → Interest → Tax → D&A addback → Capex → NWC → Unlevered FCF → Levered FCF

### Majority Acquisition with Rollover [ROLLOVER] — includes MIP, SF

Revenue → EBITDA (pre-MIP) → MIP deduction → EBITDA after MIP → Interest → Tax → Operating FCF → Debt schedule → SF schedule → Earnout payment → Cash after debt service → Cumulative excess cash

**MIP Calculation (within FCF):**

| Row | Label | Formula per year | Notes |
|---|---|---|---|
| 85 | Target EBITDA (ref) | `=C66` (FY27-29), `=E66*1.05` (FY30+) | Extends at 5% YoY |
| 86 | Achievement Ratio | `=C84/C85` | Actual vs target |
| 87 | MIP % (tiered) | `=IF(C86<0.8,0,IF(C86<0.9,0.03,IF(C86<1,0.04,0.05)))` | 3/4/5% tiers |
| 88 | Less: MIP Cost | `=-C87*C84*$I$5` | Toggle-controlled |
| 89 | **EBITDA after MIP** | `=C84+C88` | |

**Seller Financing Schedule [ROLLOVER]:**

| Row | Label | Yr 1 | Yr 2 | Yr 3 | Yr 4-5 |
|---|---|---|---|---|---|
| 102 | Opening SF Balance | `=$C$56+$C$57` | `=C105` | etc. | |
| 103 | SF Interest | `=C102*$C$27` | | | |
| 104 | SF Principal | `=-($C$56+$C$57)*$C$24` | `*$C$25` | `*$C$26` | 0 |
| 105 | Closing SF Balance | `=MAX(C102+C103+C104,0)` | | | |

---

## EXIT VALUATION [ALL]

### Full Buyout — Two scenarios

| Row | Label | Scen 1 (Flat) | Scen 2 (Re-Rate) |
|---|---|---|---|
| 86 | Exit EBITDA | `=G58` | `=G58` |
| 87 | Exit Multiple | `=C17` | `=C18` |
| 88 | Enterprise Value | `=C86*C87` | `=E86*E87` |
| 90 | Exit Equity (100%) | `=C88+C89` | `=E88+E89` |
| 91 | Sponsor Share | `=C90*C7` | `=E90*C7` |

### Majority Acquisition [ROLLOVER] — Single exit + MIP/ESOP matrix

| Row | Label | Formula | Notes |
|---|---|---|---|
| 120 | Exit EBITDA (pre-MIP) | `=G84` | Year 5, before MIP |
| 121 | Exit Multiple | `=C28` | Single scenario |
| 122 | Enterprise Value | `=C120*C121` | |
| 123 | (+) Net Cash at Exit | `=C115` | From net debt bridge |
| 124 | **Exit Equity (100%)** | `=C122+C123` | |

---

## RETURNS [ALL]

### Full Buyout — Simple MoIC + IRR

| Row | Label | Scen 1 | Scen 2 |
|---|---|---|---|
| 95 | Sponsor equity invested | `=F42*C7` | |
| 96 | Sponsor exit proceeds | `=C91` | `=E91` |
| 97 | **MoIC** | `=C96/C95` | `=E96/E95` |
| 98 | IRR | `=C97^(1/C11)-1` | |

### Majority Acquisition [ROLLOVER] — 4-way MIP × ESOP matrix

Helper cells (computed once, referenced by matrix):
- **I125:** Base net cash (no MIP) = `=C115 - SUM(C88:G88)*(1-C16)` — adds back MIP if toggle was on
- **I126:** Cumul after-tax MIP = sum of `IF(achievement<0.8,0,...)*EBITDA*(1-tax)` per year

| Row | Label | Base (No MIP, No ESOP) | MIP Only | ESOP Only | Both |
|---|---|---|---|---|---|
| 129 | Exit EV | `=C120*C121` | same | same | same |
| 130 | (+) Net Cash | `=$I$125` | `=$I$125-$I$126` | `=$I$125` | `=$I$125-$I$126` |
| 131 | Sponsor Proceeds | `=(C129+C130)*(C10+C11)` | same | `*..*(1-I6)` | `*..*(1-I6)` |
| 132 | **MoIC** | `=C131/$C$51` | | | |
| 133 | IRR | `=C132^(1/$C$15)-1` | | | |

> The 4-way matrix shows the independent and combined impact of MIP (reduces FCF/cash) and ESOP (dilutes sponsor %) on returns, allowing partners to evaluate each lever separately.

---

## SENSITIVITY TABLES [ALL]

### Standard (both archetypes): Entry × Exit Multiple MoIC

Grid with 3 entry multiples (rows) × 5 exit multiples (columns). Cell formula:
```
=(ExitMult × Year5_EBITDA + NetCash) × SponsorShare / SponsorEquity
```

### Extended (Rollover archetype): 3 sensitivity tables

1. **Entry / Exit Multiple** — MoIC grid (same as above, ESOP-adjusted)
2. **EBITDA Margin / Exit Multiple** — MoIC at different margin assumptions
3. **EBITDA Margin / Revenue CAGR** — operational sensitivity at fixed 6x exit

---

## NAMED SCENARIOS [ALL]

Build three full FCF schedules side-by-side: Base, Downside, Upside. Each scenario gets its own column block (e.g., Base in C-H, Downside in J-O, Upside in Q-V) or its own tab.

### Scenario Assumptions

| Input | Base | Downside | Upside |
|---|---|---|---|
| Revenue CAGR | 5.0% | 0% (flat) | 8-10% |
| EBITDA Margin | FY26 actual | -200bps | +200bps |
| Exit Multiple | Entry (flat) | Entry -1.0x | Entry +1.0x |
| Capex / NWC | Budget | +10% drag | -10% |

### Workflow

1. Define the three assumption sets in a scenario input block (rows above or beside the main assumptions)
2. Replicate the full FCF schedule (Revenue → EBITDA → Tax → FCF → Debt → Excess Cash) for each scenario
3. Each scenario flows independently into its own Exit Valuation and Returns row
4. For rollover deals: MIP achievement ratios and earnout will differ per scenario — link each scenario's EBITDA to the Target EBITDA Schedule independently

### Output

| Metric | Base | Downside | Upside |
|---|---|---|---|
| Exit Equity (100%) | formula | formula | formula |
| Sponsor MoIC | formula | formula | formula |
| IRR | formula | formula | formula |

> Downside should stress-test the thesis: can we return 1.5-2.0x even if growth stalls? Upside frames the optionality.

---

## SF INTEREST SENSITIVITY [ROLLOVER]

Dedicated sensitivity table showing the cash flow impact of different SF interest rates during the hold period.

### Layout

Grid: SF Interest Rate (rows) × Metric (columns)

| SF Rate | Cumul SF Interest Paid | Cash After Debt Service (Yr 3) | Sponsor MoIC | IRR |
|---|---|---|---|---|
| 0% | formula | formula | formula | formula |
| 3% | formula | formula | formula | formula |
| 5% | formula | formula | formula | formula |

### Formula Logic

For each SF rate `r`:
- Cumul SF Interest = `SUM over Yr 1-3 of (Opening SF Balance × r)` — SF is fully repaid by Yr 3 under 30/30/40 tranches
- Cash impact flows through to exit net cash and therefore MoIC/IRR
- Use the same structure as the existing sensitivity tables: parameterise the rate in the row header, compute returns inline

### Workflow

1. Place below the existing sensitivity tables (or as a 4th table)
2. Row headers: 0%, 1%, 2%, 3%, 4%, 5%
3. Each cell computes the full impact: SF interest reduces levered FCF in Yr 1-3, which reduces cumulative excess cash at exit, which reduces exit equity
4. Reference the base model's debt schedule and exit valuation — only the SF interest line changes

---

## RETURNS WATERFALL [ALL]

Decomposes total sponsor returns into component drivers on an NPV basis. Shows where value comes from — entry equity, operating cash generation, multiple expansion, and dilution effects.

### Waterfall Components (Sponsor perspective)

| Component | Formula | Description |
|---|---|---|
| Entry Equity | `-C51` (sponsor cheque) | Cash out the door at close |
| Cumulative Operating FCF | `=SUM(C107:G107)` × sponsor % | Cash generated during hold, net of debt service |
| Multiple Expansion | `=(Exit Mult - Entry Mult) × Exit EBITDA × Sponsor %` | Value created by re-rating (zero if flat exit) |
| Net Cash at Exit | Op min + cumul excess cash - remaining debt | Cash on the balance sheet at exit |
| (-) MIP Dilution | Cumul after-tax MIP cost × sponsor % | Reduction from MIP payouts |
| (-) ESOP Dilution | Exit equity × ESOP % × sponsor share | Reduction from ESOP pool |
| **Net Return** | Sum of above | Should equal Sponsor Exit Proceeds - Entry Equity |

### For Rollover Deals — Dual Waterfall

Build two side-by-side waterfalls:
1. **Movement (Sponsor):** 70% (or 66.5% post-ESOP) of exit equity, bears MIP cost through FCF
2. **Rollover Party (e.g., Vincent):** 30% of exit equity, benefits from earnout, not diluted by ESOP

| Component | Movement | Rollover Party |
|---|---|---|
| Entry Equity | `=C51` | `=C52` |
| Share of Exit Equity | `=Exit Equity × 70% × (1-ESOP%)` | `=Exit Equity × 30%` |
| (+) Earnout Received | 0 | `=C73` (Vincent's share) |
| MoIC | formula | formula |
| IRR | formula | formula |

### Workflow

1. Place after the returns matrix (or as a new section G)
2. Compute each waterfall component using formulas that reference the existing model cells
3. Components should sum to total return (cross-check: Net Return = Sponsor Exit Proceeds - Entry Equity)
4. For presentation: this translates well into a stacked bar chart in the deck

---

## HOW TO USE THIS TEMPLATE

1. **Identify the deal archetype** — Full Buyout or Majority Acquisition with Rollover
2. Create a new sheet named "LBO Sketch"
3. Set up header (rows 1–3) with deal name and date
4. Enter all assumptions in column C (blue font) — use the archetype-appropriate input set
5. Build Entry Valuation — all formulas reference assumptions
6. Build Sources & Uses — must balance. For rollover deals, include deferred section (SF, earnout)
7. Build FCF Schedule — most formula-intensive section. For rollover deals, include MIP and SF sub-schedules
8. Build Exit Valuation — single or dual scenario
9. Build Returns — simple MoIC/IRR or 4-way matrix
10. Build Sensitivity Tables

### Key Relationships / Circular Check

- Total Uses == Total Sources (at close) ← must balance
- Net Cash at Exit feeds into exit valuation
- Year 5 EBITDA (pre-MIP) feeds into exit EV
- Total Equity Required feeds into sponsor equity invested
- No circular references — interest calculated on opening debt, not average

### Adapting for a New Deal

- Replace all blue-font assumptions with target company data
- If hold period ≠ 5 years, add/remove FCF columns and update cumulative column
- If multiple debt tranches, duplicate debt schedule rows for each
- For rollover deals: adjust rollover %, SF tranches, MIP tiers, ESOP pool as needed
- Adjust sensitivity table ranges as appropriate

---

*Template updated from: Carats & Co (v2) + RJ Crocker (v2)*
*Movement Holdings | May 2026*

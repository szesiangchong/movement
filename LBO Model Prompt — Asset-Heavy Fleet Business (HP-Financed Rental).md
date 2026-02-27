# LBO MODEL PROMPT — Asset-Heavy Fleet Business (HP-Financed Rental)

## CONTEXT

You are building an LBO model for the acquisition of an asset-heavy fleet rental business. The target company owns a fleet of physical assets (e.g., forklifts, vehicles, equipment) that are purchased via hire purchase (HP) financing, rented out over a defined cycle, then disposed and replaced. The business also has an equipment trading arm (buy-sell to third parties) alongside the core rental business.

The model must correctly capture the full asset lifecycle: Purchase → Finance → Rent → Dispose → Replace. This is critical because in fleet businesses, the disposal cash cycle FUNDS the replacement capex — getting this wrong will make a profitable self-funding business look like it's bleeding cash.

---

## MANDATORY MODELLING RULES (Read before writing any formula)

### Rule 1: Build the Physical Asset Lifecycle FIRST
Before touching the P&L or cash flow, model the physical asset cycle:
- Buy → How many units purchased per year? At what cost? Financed how?
- Deploy → Fleet size, utilisation, revenue per unit
- Operate → Operating costs, maintenance, servicing per unit per year
- Dispose → Units disposed = Fleet size ÷ Renewal cycle. At what residual price? What is NBV?
- Replace → Replacement units = disposed units. Growth units = fleet expansion.

Disposal volume must be derived from first principles: fleet size ÷ renewal cycle = units disposed per year. Never estimate from historical averages.

### Rule 2: Never Conflate Economically Different Activities
If two activities have different margin profiles, they MUST be modeled separately:
- Equipment trading (buy-sell, thin ~5-15% margin) vs fleet disposal (recycling end-of-life rental assets at residual, near-100% margin on cash vs low NBV)
- Rental income (recurring, high-margin) vs trading revenue (lumpy, low-margin)

These must have separate revenue lines, separate COGS where possible, and separate treatment in the CF.

### Rule 3: Accounting Gain ≠ Cash Proceeds (CRITICAL)
When converting EBITDA to operating cash flow:
- P&L gain on disposal = Sale price − Net Book Value (non-cash item in EBITDA)
- Cash disposal proceeds = Full sale price received
- In the CF: SUBTRACT the gain (non-cash) from EBITDA, then ADD BACK the full cash proceeds as a separate line
- These are only equal when NBV = 0. If the same number appears on both lines, it's wrong.

### Rule 4: Like-for-Like Comparisons Only
When benchmarking margins against comps, strip out non-comparable revenue. A pure-play rental comp at 80%+ gross margin cannot be compared to a blended rental+trading margin of 35%.

### Rule 5: Sanity-Check Against Unit Economics
After building the model, cross-check fleet-level outputs against per-unit economics:
- CFADS ÷ fleet units ≈ per-unit cash generation?
- Fleet disposal proceeds = units disposed × disposal price?
- If FCFE goes negative but per-unit economics are positive, trace the discrepancy — it's likely a missing cash line, not a business problem.

---

## MODEL ARCHITECTURE & LAYOUT

### Sheet: LBO Model
- Columns B-D: Labels, values, notes (assumptions area)
- Col E: FY-2A (3yrs before close) | F: FY-1A | G: FY0A (last full actual) | H: FY+1A (stub/partial)
- Col I: Year 1E (first full projection, post-close) through Col M: Year 5E
- Col N: Cumulative totals (where relevant) | Col A: Narrow spacer indent

### Formatting Standards
- Section headers (TRANSACTION ASSUMPTIONS, SOURCES, etc.): Bold, white text, blue bg (#4472C4), Arial 12pt
- Sub-headers (RENTAL INCOME, FLEET DISPOSAL): Bold, black text, Arial 12pt
- Input cells (hardcoded assumptions): Blue font (#0000FF), yellow bg (#FFFF99), thin grey border
- Formula cells: Black font, white background
- Summary/total rows: Bold, thin bottom border. Grand totals: thick double bottom border
- Percentages: 0.0% | Currency: #,##0 | Multiples: 0.0x

---

## SECTION-BY-SECTION SPECIFICATION

### 1. TRANSACTION ASSUMPTIONS (Rows ~2-31)

Layout: Label in col B, value in col C (blue font, yellow bg), notes in col D.
All values in col C are INPUT cells with thin grey borders. Col D has italic notes where needed.

Row structure:
```
[Header] TRANSACTION ASSUMPTIONS  (blue bg, white bold text)
[blank]
Company                            [text, company legal name]
Currency                           [text, e.g. SGD]
Close Date                         [text, e.g. 31 March 2026]
[blank]
FY24A Adjusted EBITDA (S$)         [hardcoded from actuals]
Enterprise Value (S$)              [hardcoded deal price]
Acquisition Multiple               [FORMULA: EV / EBITDA] (black font, black border)
[blank]
Bank HP Rate                       [e.g. 3.5%]
Bank HP Tenor (years)              [e.g. 5]
Seller Financing Rate              [e.g. 0%]
Seller Financing Tenor (years)     [e.g. 5]
[blank]
HP LTV on Capex                    [e.g. 90%]
Capex HP Rate                      [e.g. 3%]
Capex HP Tenor (years)             [e.g. 5]
[blank]
FY25 Fleet Size                    [e.g. 320]
Avg Cost per Asset (S$)            [e.g. 25,000]
Fleet Growth Rate                  [e.g. 5%]
Revenue per Unit Growth Rate       [e.g. 2%]
Fleet Renewal Cycle (years)        [e.g. 4]
Residual Value % at Disposal       [e.g. 45%]
Depreciation Useful Life (years)   [e.g. 7]
[blank]
Retained Cash at Close (S$)        [hardcoded]
Total Cash + FD on BS              [hardcoded]
Excess Cash Extracted              [FORMULA: Total Cash - Retained Cash]
```

---

### 2. SOURCES & USES (Rows ~33-40)

Side-by-side layout. Left (B-E): Sources | Right (H-J): Uses

**SOURCES** columns: Description (B), S$ (C), x FY24 EBITDA (D), % of total (E)
```
HP Financing (Bank)                [FORMULA: Total Uses - Seller - Equity - Excess Cash] (balancing plug)
Seller Financing                   [hardcoded input]
Sponsor Equity                     [hardcoded input]
Excess Cash                        [FORMULA: refs Excess Cash Extracted from assumptions]
Total Sources                      [FORMULA: sum above] (bold, double underline border)
```

**USES** columns: Description (H), S$ (I), x FY24 EBITDA (J)
```
Enterprise Value                   [FORMULA: refs EV from assumptions]
Financing Fees                     [hardcoded input]
Transaction Fees                   [hardcoded input]
Total Uses                         [FORMULA: sum above] (bold, double underline border)
```

**CHECK:** Total Sources must exactly equal Total Uses.

---

### 3. REVENUE DRIVERS (Rows ~42-70)

Year headers row: FY22A, FY23A, FY24A, FY25A, FY26E, FY27E, FY28E, FY29E, FY30E

**RENTAL INCOME:**
```
# Rental Assets                    [Historicals: hardcoded] [Forecast: Prior yr * (1 + Fleet Growth Rate)]
Forklift Rental Growth %           [Forecast: refs Fleet Growth Rate assumption]
[blank]
New Forklift Price                 [Forecast: Prior * (1 + price growth), with growth toggle set to 0]
% Growth in Price                  [hardcoded, default 0]
[blank]
Revenue per Unit (S$)              [Historicals: Rental Income / # Units] [Forecast: Prior * (1 + Rev Growth)]
Revenue per Unit Growth %          [refs Revenue per Unit Growth Rate assumption]
[blank]
Rental Income (S$)                 [Historicals: hardcoded] [Forecast: # Units x Revenue per Unit]
```

**EQUIPMENT SALES** (third-party TRADING, NOT fleet disposal):
```
# Forklifts Sold                   [Historicals: back-solved from revenue/price] [Forecast: Prior*(1+growth)]
Forklift Sales Growth %            [hardcoded, default 0]
[blank]
Avg Sale Price per Unit (S$)       [refs Avg Cost assumption, with growth toggle]
Forklift Sale Price Growth %       [hardcoded, default 0]
[blank]
Equipment Sales Revenue (S$)       [Historicals: hardcoded] [Forecast: # Sold x Avg Price]
```

**MAINTENANCE & SERVICES:**
```
Maintenance Growth Rate            [hardcoded, e.g. 3%]
Maintenance Revenue (S$)           [Historicals: hardcoded] [Forecast: Prior * (1 + growth)]
```

```
TOTAL REVENUE (S$)                 [FORMULA: Rental + Equipment Sales + Maintenance] (bold)
```

---

### 4. FLEET DISPOSAL (Rows ~72-78) ⚠️ CRITICAL SECTION

```
Units Disposed per Year            [FORMULA: ROUND(Prior Year Fleet Size / Renewal Cycle, 0)]
                                   ROLLING - uses prior year total fleet (including growth)
                                   e.g. FY26E refs FY25A fleet (320), FY27E refs FY26E fleet (336)

Disposal Price per Unit (S$)       [FORMULA: Avg Cost x Residual Value %]

Total Disposal Proceeds (S$)       [FORMULA: Units Disposed x Disposal Price] (bold)
                                   *** THIS IS THE CASH NUMBER — flows to CF Statement row 130 ***

NBV at Disposal per Unit (S$)      [FORMULA: Avg Cost x (1 - Renewal Cycle / Depreciation Useful Life)]
Gain on Disposal per Unit (S$)     [FORMULA: Disposal Price - NBV]

Total Gain on Disposal (S$)        [FORMULA: Units Disposed x Gain per Unit] (bold)
                                   *** THIS IS THE P&L NUMBER — flows to Income Statement row 95 ***
```

> ⚠️ **WARNING:** Total Disposal Proceeds and Total Gain are DIFFERENT numbers. They are only equal if NBV happens to be exactly zero. Proceeds >> Gain in most cases because NBV still has residual book value.

---

### 5. FLEET CAPEX (Rows ~80-86)

```
Growth Units                       [FORMULA: Current Year Fleet - Prior Year Fleet]
Replacement Units                  [FORMULA: refs Units Disposed from row 73] (must equal disposal)
Total Units Purchased              [FORMULA: Growth + Replacement]
Total Gross Capex (S$)             [FORMULA: Total Units x Avg Cost] (bold)
HP Drawn (90% of Capex)            [FORMULA: Gross Capex x HP LTV]
                                   *** Feeds the Capex HP tranche opening balance ***
Equity Down Payment (10%)          [FORMULA: Gross Capex x (1 - HP LTV)]
                                   *** Feeds CF Statement row 131 ***
```

---

### 6. INCOME STATEMENT (Rows ~88-118)

```
Revenue                            [FORMULA: refs Total Revenue from drivers]
Gross Profit                       [Historicals: hardcoded from AFS] [Forecast: Gross Margin % x Revenue]
  Gross Margin %                   [Historicals: GP/Revenue] [Forecast: carry forward last actual year %]
[blank]
Other Income & Gains               [Historicals: hardcoded from AFS (incl disposal gains)]
                                   [Forecast: refs Total Gain on Disposal (row 78)]
                                   *** ACCOUNTING gain, NOT cash proceeds ***
[blank]
EBITDA Margin % (forecast)         [Single input cell in assumptions area, e.g. 46%]
[blank]
Adjusted EBITDA                    [Historicals: hardcoded from AFS]
                                   [Forecast: ROUND(Revenue x EBITDA Margin %, 0)]
  EBITDA Margin %                  [FORMULA: EBITDA / Revenue]
[blank]
Normalised EBITDA                  [FORMULA: Adjusted EBITDA - Other Income]
  EBITDA Margin %                  [FORMULA: Normalised EBITDA / Revenue]
[blank]
Depreciation (PPE)                 [Historicals: hardcoded negative]
                                   [Forecast: Last actual x (1 + Fleet Growth Rate)]
Depreciation (ROU)                 [Hardcoded flat amount, negative]
EBIT                               [FORMULA: EBITDA + Dep(PPE) + Dep(ROU)] (bold)
[blank]
Finance Costs (Historical)         [Historicals only, zero in forecast years]
Finance Costs (Seller)             [FORMULA: negative of Seller Interest from debt schedule]
Finance Costs (Acq HP)             [FORMULA: negative of Acq HP Interest from debt schedule]
Finance Costs (Capex HP)           [FORMULA: negative of Capex HP Total Interest from summary]
Total Finance Costs                [FORMULA: sum of all four finance cost lines]
[blank]
Profit Before Tax                  [FORMULA: EBIT + Total Finance Costs]
Tax                                [Historicals: hardcoded] [Forecast: IF(PBT>0, ROUND(PBT x Tax Rate, 0), 0)]
                                   Tax rate stored as single assumption cell (e.g. -17%)
Net Profit                         [FORMULA: PBT + Tax]
  NP Margin %                      [FORMULA: Net Profit / Revenue]
```

---

### 7. CASH FLOW STATEMENT (Rows ~120-148) ⚠️ CRITICAL SECTION

```
Adjusted EBITDA                    [FORMULA: refs Adjusted EBITDA from IS]

(-) Gain on Disposal (non-cash)    [FORMULA: NEGATIVE of Other Income from IS]
                                   *** SUBTRACT the gain — non-cash, already embedded in EBITDA ***

Change in NWC                      [zero or hardcoded assumption]
Tax                                [FORMULA: refs Tax from IS]
Operating Cash Flow                [FORMULA: EBITDA + Gain adjustment + NWC + Tax] (bold, bottom border)
[blank]
(+) Fleet Disposal Proceeds (cash) [FORMULA: refs Total Disposal Proceeds (row 75)]
                                   *** ADD the FULL CASH received, NOT the accounting gain ***
                                   *** This number is LARGER than the gain subtracted above ***

(-) Equity Down Payment (total)    [FORMULA: negative of Equity Down Payment (row 86)]

Cash Flow Available for Debt Service [FORMULA: OCF + Disposal Proceeds - Equity DP] (bold, bottom border)
[blank]
Acq HP Interest                    [FORMULA: negative of Acq HP Interest from debt schedule]
Acq HP Principal                   [FORMULA: refs Acq HP Principal Repayment from debt schedule (negative)]
Capex HP Interest                  [FORMULA: negative of Total Interest from Capex HP Summary]
Capex HP Principal                 [FORMULA: refs Total Principal Repaid from Capex HP Summary (negative)]
Seller Interest                    [FORMULA: negative of Seller Interest from debt schedule]
Seller Principal                   [FORMULA: refs Seller Principal Repayment from debt schedule (negative)]

Free Cash Flow to Equity (FCFE)    [FORMULA: CFADS + all 6 debt service lines] (bold, double border)
[blank]
Opening Cash Balance               [Year 1: refs Retained Cash from assumptions] [Later: Prior year Closing]
Closing Cash Balance               [FORMULA: Opening + FCFE] (bold)
[blank]
Total Debt Outstanding             [FORMULA: Acq HP Closing + Seller Closing + Capex HP Total Outstanding]
Net Debt                           [FORMULA: Total Debt - Closing Cash]
Net Debt / EBITDA                  [FORMULA: IF(EBITDA>0, Net Debt / EBITDA, 0)]
```

---

### 8. DEBT SCHEDULES (Rows ~150-204)

**ACQUISITION HP (BANK):**
```
Opening Balance                    [Year 1: refs HP Financing from Sources] [Later: Prior year Closing]
Principal Repayment                [FORMULA: -IF(Opening>0, MIN(ROUND(Total HP / Tenor, 0), Opening), 0)]
Closing Balance                    [FORMULA: MAX(Opening + Principal, 0)]
Acq HP Interest                    [FORMULA: ROUND(Opening x Bank HP Rate, 0)]
```

**SELLER FINANCING:**
Same structure as Acq HP, using Seller Financing amount, rate, and tenor from assumptions.

**CAPEX HP — ROLLING TRANCHE SCHEDULE:**

> Each tranche drawn annually, [X]% interest, [Y]-year amortisation. One tranche per forecast year (5 tranches for 5-year projection).

```
TRANCHE 1 (drawn FY26):
  Opening Balance                  [Draw year: refs HP Drawn from Fleet Capex row 85]
                                   [Subsequent years: Prior year Closing Balance of THIS tranche]
  Principal Repaid                 [FORMULA: -ROUND(Original Draw Amount / Capex HP Tenor, 0)]
                                   NOTE: Always divides the ORIGINAL draw (year 1 opening), not current balance
  Closing Balance                  [FORMULA: MAX(Opening + Principal, 0)]
  Interest                         [FORMULA: ROUND(Opening x Capex HP Rate, 0)]

TRANCHE 2 (drawn FY27): Same structure. Opening in draw year refs FY27 HP Drawn.
TRANCHE 3 (drawn FY28): Same. Opens in FY28.
TRANCHE 4 (drawn FY29): Same. Opens in FY29.
TRANCHE 5 (drawn FY30): Same. Opens in FY30.
```

Each tranche only has values from its draw year onward. Prior years are blank/zero. Tranches STACK — by Year 5, all 5 tranches have outstanding balances and interest accruing.

**CAPEX HP SUMMARY:**
```
Total Interest                     [FORMULA: sum of all tranche Interest rows for that year]
Total Principal Repaid             [FORMULA: sum of all tranche Principal rows for that year]
Total Outstanding                  [FORMULA: sum of all tranche Closing Balance rows for that year]
```

---

### 9. RETURNS ANALYSIS (Rows ~207-232)

```
Exit Multiple                      [hardcoded input, e.g. 5.7x]
Sponsor Equity Invested            [FORMULA: refs Sponsor Equity from Sources]
[blank]
Year headers:                      Year 1 (FY26), Year 2 (FY27), ..., Year 5 (FY30)
Exit Year EBITDA                   [FORMULA: refs Adjusted EBITDA for each year]
Enterprise Value at Exit           [FORMULA: EBITDA x Exit Multiple]
Less: Total Debt at Exit           [FORMULA: negative of Total Debt Outstanding]
Plus: Cash at Exit                 [FORMULA: refs Closing Cash Balance]
Equity Value at Exit               [FORMULA: EV + Debt + Cash]
[blank]
MOIC                               [FORMULA: Equity Value / Sponsor Equity]
IRR                                [FORMULA: IF(MOIC>0, (MOIC)^(1/Year Number) - 1, 0)]
```

**EXIT MULTIPLE SENSITIVITY TABLE (Year 5 exit):**

Range of multiples: 4.0x, 4.5x, 5.0x, [base case], 6.0x, 6.5x, 7.0x, 7.5x

| Column | Formula |
|--------|---------|
| Exit Multiple | Input |
| MOIC | (Year5 EBITDA x Multiple + Year5 Cash - Year5 Debt) / Sponsor Equity |
| IRR | IF(MOIC>0, MOIC^(1/5) - 1, 0) |

---

### 10. NET DEBT BRIDGE (Rows ~235-250)

Year headers: At Close, FY26E through FY30E, Cumulative (col N)

```
Opening Net Debt                   [At Close: Acq HP + Seller - Retained Cash]
                                   [Later: Prior year Closing Net Debt]
[blank]
GROSS DEBT MOVEMENTS:
  (+) Capex HP Drawn               [FORMULA: refs tranche opening balance in draw year]
  (-) Acq HP Principal Repaid      [FORMULA: refs Acq HP Principal from CF]
  (-) Seller Principal Repaid      [FORMULA: refs Seller Principal from CF]
  (-) Capex HP Principal Repaid    [FORMULA: refs Capex HP Principal from CF]
[blank]
CASH MOVEMENT:
  (-) Cash Generated (FCFE)        [FORMULA: negative of FCFE (positive FCFE reduces net debt)]
[blank]
Closing Net Debt                   [FORMULA: SUM of all rows above]
  Check vs. Net Debt (CF Statement)[FORMULA: ROUND(Closing Bridge - Net Debt from CF, 0)]
                                   *** THIS MUST BE ZERO FOR EVERY YEAR ***

Column N: Cumulative sums for each debt movement line across all years.
```

---

## UNIT ECONOMICS TAB (Separate Sheet)

Build a per-unit cash flow waterfall on a separate sheet to cross-check the fleet model.

**KEY ASSUMPTIONS** (input cells, blue font, yellow bg):
- Purchase Price (New), HP Financing %, HP Loan Amount [formula], Equity Down Payment [formula]
- Rental Cycle (years), Annual Rental Income, HP Debt Service (per yr), HP Tenor (years)
- Servicing Costs (per yr), Residual Value %, Disposal Value [formula: Price x Residual%]

**CASH FLOW SUMMARY** (4-yr cycle + HP tail):
```
Cash Inflows:  Total Rental Income (rental x cycle) + Disposal Proceeds
Cash Outflows: Equity Down Payment + Servicing (cost x cycle) + Total HP Repaid (service x tenor)
NET CASH PROFIT PER UNIT (highlighted green bg)
```

**RETURN METRICS:**
- Cash-on-Cash Return (x): Net Profit / Equity
- Annualized CoC %: CoC / Cycle years
- Net Annual Rental Spread: Rental per yr - HP service per yr

**ANNUAL CASH FLOW WATERFALL** (Yr 0 through Yr 5):

| Row | Yr 0 | Yr 1 | Yr 2 | Yr 3 | Yr 4 | Yr 5 |
|-----|------|------|------|------|------|------|
| Down Payment | (out) | — | — | — | — | — |
| Rental Income | — | in | in | in | in | — |
| HP Debt Service | — | (out) | (out) | (out) | (out) | (out) |
| Servicing Costs | — | (out) | (out) | (out) | (out) | — |
| Disposal Proceeds | — | — | — | — | in | — |
| **Net Cash Flow** | | | | | | |
| **Cumulative Cash Flow** | | | | | | |

> ⚠️ **NOTE:** HP payments extend 1 year BEYOND the rental cycle (5yr HP vs 4yr rental). This creates a negative cash flow year at the end when HP continues but rental has stopped.

---

## POST-BUILD VERIFICATION CHECKLIST

After completing the model, verify ALL of the following before presenting:

| # | Check | Expected Result |
|---|-------|-----------------|
| 1 | Sources = Uses | Exact match, no rounding difference |
| 2 | Net Debt Bridge check | Zero for EVERY forecast year |
| 3 | Disposal proceeds (CF) ≠ Gain on disposal (IS) | **Must be different numbers.** Proceeds > Gain. Only equal if NBV = 0 |
| 4 | Units disposed traces to Fleet Size / Renewal Cycle | From assumptions, not estimated |
| 5 | FCFE negative but per-unit economics positive | Trace discrepancy — acq debt service / stacking HP are legitimate causes; missing disposal cash or netting errors are model bugs |
| 6 | Equipment trading revenue and fleet disposal proceeds | On SEPARATE lines with separate drivers — never conflated |
| 7 | Each HP tranche draw refs HP Drawn line (Fleet Capex row 85) | Not a hardcoded formula reconstructing the capex calculation |
| 8 | Closing Cash Balance positive throughout hold period | If negative, flag immediately — business cannot meet obligations |
| 9 | All input cells: blue font (#0000FF) on yellow bg (#FFFF99) | No hidden hardcodes buried in formula cells |
| 10 | Tax only triggers on positive PBT | `IF(PBT>0, ROUND(PBT x Rate, 0), 0)` — never apply to a loss year |

# LBO Model — Asset-Heavy Fleet Business (HP-Financed Rental)

> **Version:** v2 (Javier review)
> **Reference:** Project Enzo (Mashgate) — LBO Model v1.3, "LBO v2" tab
> **Output:** Single-sheet Excel LBO with integrated fleet capex, rolling HP tranches, and DSCR monitoring

---

## Purpose

Build a leveraged buyout model for an asset-heavy fleet rental business where:
- The fleet is classified as PPE (not inventory) and depreciated over its useful life
- New fleet capex is funded via hire purchase (HP) at 90% LTV with rolling tranches
- The business generates revenue from rental, trading (buy-resell), and services
- Disposal proceeds and gains on disposal are a material part of the cash flow profile
- Debt service coverage (DSCR) matters because rental income may not fully cover HP instalments

This model is NOT a traditional LBO where you lever up once at close and delever. It is a **perpetual capex machine** — every year you buy new units, finance them, depreciate the old ones, and dispose of end-of-life units. The debt never fully goes away; it rolls.

---

## Trigger Phrases

- "Build LBO model" / "LBO analysis" for a fleet / rental / equipment business
- "Asset-heavy LBO" / "HP-financed model"
- "Fleet capex model" / "Rolling HP model"

---

## Input Data Schema

### Transaction Assumptions

```yaml
company: "Target Name"
currency: "SGD"
close_date: "2026-03-31"

fy_adjusted_ebitda: 1742        # S$'000 — anchor EBITDA for entry multiple
enterprise_value: 7096          # S$'000
acquisition_multiple: "=EV/EBITDA"  # Formula, not hardcoded
```

### Financing Terms

```yaml
acquisition_financing:
  bank_hp:
    amount: 2356                # S$'000
    rate: 0.035                 # 3.5% p.a.
    tenor: 5                    # years, straight-line

  seller_financing:
    amount: 1785                # S$'000
    rate: 0.04                  # 4.0% p.a. — confirm with seller
    tenor: 5                    # years, straight-line

capex_hp:
  ltv: 0.90                    # On NEW capex only (post-close)
  rate: 0.015                  # 1.5% p.a. — lower rate, asset-secured
  tenor: 5                     # years per tranche

tax_rate: 0.17                 # Singapore corporate tax
```

### Fleet Assumptions

```yaml
fleet:
  fy25_size: 320               # units
  avg_cost_per_unit: 30        # S$'000
  growth_rate: 0.02            # 2% p.a.
  time_utilization: 0.70       # ⚠️ Industry norm 65-75%
  monthly_rental_rate: 0.986   # S$'000 (=S$986/mo) — FY25 implied
  rate_escalation: 0.02        # 2% p.a.
  renewal_cycle: 5             # years — when units are disposed
  residual_value_pct: 0.45     # % of original cost at disposal
  depreciation_life: 7         # years (straight-line)
  rou_depreciation: 148        # S$'000/yr — IFRS 16 (office, apt, vehicles)
```

### Cost Assumptions

```yaml
costs:
  rental_cash_cogs_pct: 0.20   # Of rental revenue — ex-depreciation (servicing, parts, transport)
  trading_cogs_pct: 0.70       # Of trading revenue — buy-resell at thin margin
  services_cogs_pct: 0.40      # Of services revenue — labor + parts
  distribution_base: 443       # S$'000 — FY24 actual, grows with revenue
  admin_base: 546              # S$'000 — FY24 actual, incl. director S$201K
  opex_growth_rate: 0.03       # 3% p.a.
  other_income: 45             # S$'000/yr — interest inc + govt grants
  ifrs16_lease_payment: 164    # S$'000/yr — S$139 principal + S$25 interest
```

### Working Capital Assumptions (% of Revenue)

```yaml
working_capital:
  inventories_pct_trading_rev: 0.41    # FY24: S$295K / S$712K
  trade_receivables_pct_total_rev: 0.155  # FY24: S$505K / S$3,267K (~56 DSO)
  trade_payables_pct_total_rev: 0.072  # FY24: S$234K / S$3,267K
  contract_liabilities_pct_rental_rev: 0.062  # FY24: S$204K / S$3,267K
  retained_cash_at_close: 400          # S$'000 — operating buffer
  cash_on_bs_at_close: 1603            # S$'000
```

---

## Model Architecture

### Single Sheet Layout

- Column A: Reserved (width marker — row 1 contains slide width reference `16.03`)
- Column B: Labels (indented with 2 spaces for sub-items)
- Column C: Input values / assumptions
- Column D: Notes / commentary
- Columns E–H: Historical actuals (FY22A–FY25A)
- Columns I–M: Projections (FY26E–FY30E)

**Formatting conventions:**
- Input cells: Blue font, yellow background
- Formula cells: Black font, white background
- Section headers: Bold, separated by blank rows
- Margin/ratio rows: Italic or indented with `%` suffix
- ⚠️ flags on assumptions that are sensitive or require validation

---

## Section-by-Section Specification

### 1. TRANSACTION ASSUMPTIONS (Rows 2–25)

Static inputs block. All deal parameters live here and are referenced by `$C$XX` throughout.

```
Company                          [input]
Currency                         [input]
Close Date                       [input]

FY24A Adjusted EBITDA (S$'000)   [input]
Enterprise Value (S$'000)        [input]
Acquisition Multiple             =EV/EBITDA  ← formula, not hardcoded
```

Financing terms (bank HP, seller financing, capex HP), tax rate — all in this block.

> **PRINCIPLE:** The acquisition multiple must always be a formula dividing EV by EBITDA. Never hardcode it — the user needs to see what they're paying in real time when they change EV.

---

### 2. FLEET ASSUMPTIONS (Rows 28–38)

Fleet size, cost per unit, growth rate, utilisation, rental rate, renewal cycle, residual value, depreciation life, ROU depreciation.

Key ⚠️ flags:
- **Time Utilization Rate** — this is the single most sensitive assumption. Industry norm is 65-75%. Small changes here move EBITDA materially.
- **Monthly Rental Rate** — should be derived from historical implied rate (= rental revenue ÷ fleet × 12 × utilisation), not management's ask price.

---

### 3. COST ASSUMPTIONS (Rows 40–48)

Segment-level COGS as % of segment revenue (rental, trading, services). This matters because:
- **Rental cash COGS** (ex-depreciation) is low (~20%) — servicing, parts, transport
- **Trading COGS** is high (~70%) — thin-margin buy-resell
- **Services COGS** is moderate (~40%) — labor + parts

Distribution and admin costs grow at a fixed opex rate from the FY24 base. IFRS 16 lease payment is a fixed annual outflow.

> **CRITICAL:** Rental COGS in this model is cash COGS only (ex-depreciation). Fleet depreciation flows separately through the depreciation schedule into Cost of Sales line. Do NOT double-count.

---

### 4. SOURCES & USES (Rows 57–64)

Standard S&U table with cross-references to the input block.

```
SOURCES          S$'000   x EBITDA   %       USES               S$'000   x EBITDA   %
Bank HP          =C14     =S/EBITDA  =S/Tot  Enterprise Value   =C10     =U/EBITDA  =U/Tot
Seller Fin       =C17     ...        ...     Financing Fees     [input]  ...        ...
Excess Cash      =BS Cash - Retained         Transaction Fees   [input]  ...        ...
Sponsor Equity   =Plug (Tot Uses - Other Sources)
Total Sources    =Total Uses                 Total Uses         =Sum
```

> **Excess cash** = Cash on BS at close minus operating cash buffer. This is cash trapped in the business that can be used to fund the deal.

---

### 5. REVENUE BUILD (Rows 66–86)

Three revenue streams, each with distinct drivers:

**Rental Business:**
```
Fleet Size (units)        [historical hardcoded] → [=prior × (1 + growth rate)]
Time Utilization %        [historical back-solved] → [=assumption]
Monthly Rate (S$'000)     [=base rate]            → [=base × (1 + escalation)^n]
Rental Revenue            [historical hardcoded]  → [=fleet × util × rate × 12]
```

**Trading Business:**
```
Units Sold                [historical hardcoded]  → [steady-state assumption]
Avg Sale Price (S$'000)   [=revenue/units]        → [input]
Trading Revenue           [historical hardcoded]  → [=units × price]
```

**Services:**
```
Services Revenue          [historical hardcoded]  → [=prior × (1 + opex growth)]
```

**Total Revenue** = Sum of three streams. Show rental mix % and trading mix % as memo lines.

**Key Operating KPIs (below revenue):**
```
OEC (S$'000)              =fleet × avg cost/unit    ← Original Equipment Cost
Dollar Utilization %      =rental rev / OEC          ← Revenue yield on fleet
Time Utilization %        =cross-ref from above
Capex / Revenue %         =gross capex / total rev   ← Capital intensity
```

---

### 6. INCOME STATEMENT (Rows 94–126)

```
Revenue                          =Revenue Build total

Cost of Sales:
  Rental Cash COGS               =-rental rev × rental COGS %
  Trading COGS                   =-trading rev × trading COGS %
  Services COGS                  =-services rev × services COGS %
  Depreciation — PPE (fleet)     =-Depreciation Schedule total   ← from Section 8
Total Cost of Sales              =Sum

Gross Profit                     =Revenue + COGS
  GP Margin %                    =GP / Revenue

Other Income                     =fixed other income + disposal gains
Distribution Costs               =-base × (1 + opex growth)^n
Admin & Other Expenses           =-base × (1 + opex growth)^n
Depreciation — ROU (IFRS 16)    =-fixed annual amount

EBIT                             =GP + Other Inc + Dist + Admin + ROU D&A

Finance Costs                    =-(Acq HP int + Seller int + Capex HP int + IFRS 16 int)

Profit Before Tax                =EBIT + Finance Costs
Tax                              =IF(PBT>0, -PBT × tax rate, 0)
Net Profit                       =PBT + Tax
  Net Margin %                   =NP / Revenue

EBITDA                           =PBT - Finance Costs + PPE D&A + ROU D&A
  EBITDA Margin %                =EBITDA / Revenue

Adj EBITDA (excl disposal gains) =EBITDA - disposal gains
```

> **Why Adj EBITDA excludes disposal gains:** Disposal gains are a function of the fleet renewal cycle, not operating performance. Including them inflates EBITDA and makes the business look cheaper than it is on a run-rate basis. The exit multiple should be applied to Adj EBITDA.

---

### 7. FLEET & CAPEX SCHEDULE (Rows 128–149)

**Fleet Movement:**
```
Opening Fleet                    =prior closing fleet
(-) Disposals                    =-ROUND(opening / renewal cycle, 0)
(+) Growth Units                 =closing - opening (net new)
(+) Replacement Units            =-disposals (1:1 replacement)
Closing Fleet                    =fleet size from assumptions
```

**Total Units Purchased** = Growth + Replacement
**Total Gross Capex** = -units purchased × avg cost/unit

```
HP Drawn (90% of Capex)          =capex × LTV
Equity Down Payment (10%)        =capex × (1 - LTV)
```

**Fleet Disposal:**
```
Units Disposed                   =same as disposals from fleet movement
Disposal Price/Unit (S$'000)     =avg cost × residual value %
Total Disposal Proceeds          =units × disposal price
NBV at Disposal/Unit             =avg cost × (1 - renewal cycle / dep life)
Total NBV at Disposal            =units × NBV/unit
Gain on Disposal                 =proceeds - NBV
```

> **KEY INSIGHT:** If renewal cycle < depreciation life, the unit still has book value at disposal. The gain = (residual value % − (1 − cycle/dep life)) × cost × units. If renewal cycle = 5yr and dep life = 7yr, NBV at disposal = 30K × (1 − 5/7) = S$8.6K/unit, and with 45% residual = S$13.5K/unit, gain = S$4.9K/unit.

---

### 8. DEPRECIATION SCHEDULE (Rows 155–163)

Vintage-year waterfall — each year's capex creates a new depreciation tranche:

```
Existing Fleet D&A               [hardcoded] ← FY24 PPE NBV ÷ remaining useful life
FY26 Capex D&A                   =ROUND(-FY26 capex / dep life, 0)  → carries forward
FY27 Capex D&A                   =ROUND(-FY27 capex / dep life, 0)  → carries forward
FY28 Capex D&A                   ...
FY29 Capex D&A                   ...

Total Depreciation — PPE         =Sum of all active tranches in that year
```

> **Existing fleet run-off:** Use FY24 PPE NBV ÷ estimated remaining life (e.g., S$4,187K ÷ 3.5yr = S$1,196K/yr for ~3 years, then drops to partial, then zero). This captures the step-down as old fleet fully depreciates.

---

### 9. WORKING CAPITAL (Rows 166–176)

```
Inventories                      =ROUND(trading rev × inv % trading rev, 0)
Trade Receivables                =ROUND(total rev × AR % total rev, 0)
Trade Payables                   =-ROUND(total rev × AP % total rev, 0)
Contract Liabilities             =-ROUND(rental rev × CL % rental rev, 0)

Net Working Capital              =Sum
Change in NWC                    =current NWC - prior NWC
```

> **Inventories are driven by trading revenue, not total revenue.** This is because the inventory is trading stock (forklifts held for resale), not spare parts for the rental fleet.

---

### 10. DEBT SCHEDULES (Rows 180–234)

Three debt instruments, each with its own amortisation profile:

**Acquisition HP (Bank):**
```
Opening Balance                  =acquisition HP amount (Year 1) / prior closing (Year 2+)
(-) Principal Repayment          =-ROUND(original amount / tenor, 0)  ← straight-line
Closing Balance                  =MAX(opening + repayment, 0)
Interest                         =ROUND(opening × rate, 0)
```

**Seller Financing:**
Same structure as Acquisition HP with seller terms.

**Capex HP — Rolling Tranches:**
Each year's capex HP creates a NEW tranche with its own 5-year amortisation:

```
Tranche 1 (FY26):  Drawn = -FY26 HP drawn (90% of capex)
  Opening Bal       =drawn amount (Yr 1) / prior closing (Yr 2+)
  (-) Principal     =-ROUND(drawn / tenor, 0)
  Closing Bal       =MAX(opening + principal, 0)
  Interest          =ROUND(opening × capex HP rate, 0)

Tranche 2 (FY27):  Drawn = -FY27 HP drawn
  ... same structure, starts in FY27 column

Tranche 3 (FY28):  ...
Tranche 4 (FY29):  ...
Tranche 5 (FY30):  ...
```

**Capex HP Summary:**
```
Total Capex HP Interest          =Sum of all tranche interest in that year
Total Capex HP Principal         =Sum of all tranche principal in that year
Total Capex HP Outstanding       =Sum of all tranche closing balances in that year
```

> **WHY ROLLING TRANCHES:** Unlike a single acquisition debt that amortises to zero, capex HP is perpetual. Every year you buy new units and draw new HP. The total outstanding capex HP balance stabilises (or grows) over time. This is a structural feature of asset-heavy fleet businesses — **the debt never fully goes away.** Model it as such.

---

### 11. HISTORICAL FREE CASH FLOW (Rows 237–275)

Reconstruct historical FCF from AFS data (hardcoded). This section is NOT formula-driven from the model — it uses actual AFS figures to provide a reality check.

```
OPERATING ACTIVITIES:
  Profit Before Tax              [AFS P&L]
  (+) D&A — PPE                  [Note 14]
  (+) D&A — ROU (IFRS 16)       [Note 15]
  (-) Gain on Disposals          [Note 14]
  (+/-) Other Non-Cash Items     [Interest, impairment]
  (+/-) Working Capital Changes  [Inventory, AR, AP, Contract Liabilities]
  (-) Tax Paid                   [Note 12]
Net Cash from Operations (OCF)

INVESTING ACTIVITIES:
  (-) Capex — Purchase of PPE    [Note 14]
  (+) Disposal Proceeds          [Note 14]
  (+) Interest Received
Net Cash from Investing (ICF)

FINANCING ACTIVITIES:
  (-) Dividends Paid             [Note 13]
  (-) Lease Repayments (IFRS 16) [Note 22 — principal]
  (-) Interest Paid (IFRS 16)   [Note 22]
  (+/-) Director Current Account [Note 3]
Net Cash from Financing (FCF)
```

**Free Cash Flow Measures:**
```
OCF − Gross Capex                ← Before disposal proceeds
OCF − Net Capex                  ← After disposal proceeds
Unlevered FCF (OCF−NetCapex−Leases)  ← Pre-debt, pre-dividend
```

**Valuation Cross-Check:**
```
Implied EV / UFCF                ← vs. EV/EBITDA — if UFCF yield is much worse, capex intensity is destroying value
EV at 5.0x UFCF                  ← Target price anchor
```

> **THIS SECTION IS THE JAVIER TEST:** If EV/UFCF is materially higher than EV/EBITDA, the business is capex-hungry and EBITDA overstates cash generation. Don't pay an EBITDA multiple for an UFCF business.

---

### 12. PROJECTED CASH FLOW STATEMENT (Rows 277–297)

```
Adj EBITDA (excl disposal gains)     =from P&L
(-) Change in NWC                    =-WC change (positive = cash outflow)
(-) Tax Paid                         =from P&L
(+) Disposal Proceeds                =from fleet schedule
(-) Equity Down Payment (10%)        =10% of capex (not HP-financed)
CFADS                                =Sum  ← Cash Flow Available for Debt Service

(-) Acq HP (Int + Princ)             =from debt schedule
(-) Seller (Int + Princ)             =from debt schedule
(-) Capex HP (Int + Princ)           =from debt schedule
(-) IFRS 16 Lease                    =-fixed annual payment
FCFE                                 =CFADS + all debt service

Opening Cash                         =retained cash (Yr 1) / prior closing (Yr 2+)
Closing Cash                         =opening + FCFE
Total Debt Outstanding               =all closing balances summed
Net Debt                             =total debt - cash
Net Debt / EBITDA                    =net debt / EBITDA
```

> **CFADS** is the critical metric for asset-heavy businesses. It includes disposal proceeds (which are real cash) but excludes the HP-financed portion of capex (since that's debt, not equity outflow). The equity down payment (10% of capex) is the actual cash cost of fleet growth.

---

### 13. RETURNS ANALYSIS (Rows 298–311)

```
Exit Multiple                    [input] — typically same-in/same-out for base case
Sponsor Equity Invested          =from Sources & Uses

For each exit year (Yr 1–5):
  Exit Year EBITDA               =EBITDA from P&L
  Enterprise Value at Exit       =EBITDA × exit multiple
  (-) Total Debt at Exit         =-sum of all debt closing balances
  (+) Cash at Exit               =closing cash
  Equity Value at Exit           =EV - debt + cash

  MOIC                           =equity at exit / sponsor equity invested
  IRR                            =(MOIC)^(1/years) - 1
  DSCR                           =CFADS / total debt service  ← must be >1.0x
```

> **DSCR** is shown for every year. If DSCR < 1.0x in any year, the business cannot service its debt from operations. This is common in Year 1-2 of fleet businesses where capex is front-loaded.

---

### 14. PURCHASE PRICE ANALYSIS (Rows 313–327)

Goal-seek section — what EV delivers a target IRR?

**Scenario A: Fixed Debt, Reduce Equity**
- Hold acquisition debt constant
- Solve for EV where equity check delivers target IRR
- Risk: Very thin equity (can go below 10% of uses)

**Scenario B: Scale Debt Proportionally with EV**
- Debt and equity scale together
- More conservative equity cushion

```
Target IRR                       [input, e.g., 25%]
EV for target IRR                [goal-seek or manual iteration]
Implied EV / Adj EBITDA          =EV / Adj EBITDA
Sponsor Equity Check             =EV + fees - debt - excess cash
Equity as % of Uses              =equity / total uses
Discount to asking price         =EV / asking EV - 1
```

---

## Key Modelling Principles

1. **Depreciation ≠ Capex.** In fleet businesses, annual depreciation (S$1.2M) is much lower than annual capex (S$2.0M+) because depreciation is straight-line over 7 years but the fleet renews every 5 years. Never use D&A as a capex proxy.

2. **Disposal gains are not operating income.** They are a function of accounting policy (residual value vs. NBV) and fleet turnover timing. Exclude from Adj EBITDA for valuation purposes.

3. **Capex HP is perpetual.** Unlike acquisition debt that amortises to zero, capex HP rolls every year. Total debt outstanding stabilises or grows. Model each year as a separate tranche.

4. **CFADS includes disposal proceeds.** When a unit is sold at end-of-life, the cash comes in and is available for debt service. This is a real cash flow, not an accounting entry.

5. **Utilisation is the key lever.** A 5% change in time utilisation (e.g., 70% to 75%) flows straight to rental revenue and drops almost entirely to EBITDA. Flag it with ⚠️.

6. **Trading revenue is low-margin noise.** At 70% COGS, it barely contributes to EBITDA. Don't let it distort the story — the business is a rental business with a trading sideline.

7. **DSCR matters more than leverage.** Net Debt/EBITDA is misleading in perpetual-capex businesses because debt never fully amortises. Focus on DSCR — can the business actually service its obligations each year?

---

## Post-Build Verification Checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | Sources = Uses | Exact tie |
| 2 | Acquisition multiple = EV / EBITDA (formula) | Not hardcoded |
| 3 | Fleet closing = opening - disposals + growth + replacement | Balances every year |
| 4 | Total units purchased = growth + replacement | Consistent with capex |
| 5 | Gross capex = units purchased × cost/unit | Ties exactly |
| 6 | HP drawn = 90% of capex; equity = 10% | LTV applied correctly |
| 7 | Each capex HP tranche amortises over 5 years from its start year | No early/late starts |
| 8 | Total D&A = sum of all vintage tranches + existing fleet run-off | Ties to P&L |
| 9 | EBITDA = PBT + finance costs + PPE D&A + ROU D&A | Standard add-back |
| 10 | Adj EBITDA = EBITDA − disposal gains | Disposal gains stripped |
| 11 | Finance costs = sum of all interest lines (acq HP + seller + capex HP + IFRS 16) | Complete |
| 12 | CFADS = Adj EBITDA − ΔNWC − tax + disposal proceeds − equity down payment | Cash basis |
| 13 | FCFE = CFADS − all debt service − IFRS 16 lease | After all obligations |
| 14 | Closing cash = opening + FCFE | Cash roll-forward |
| 15 | Net debt = total debt outstanding − cash | All three debt instruments |
| 16 | MOIC = equity at exit / sponsor equity | From S&U, not EV |
| 17 | IRR = MOIC^(1/n) − 1 | Simplified (no interim CF) |
| 18 | DSCR > 1.0x in all projection years | Flag if breached |
| 19 | Historical FCF section uses AFS figures (hardcoded), not model formulas | Reality check |
| 20 | EV/UFCF vs EV/EBITDA gap < 2.0x | If gap is wider, capex intensity is a problem |

---

## IC Review Notes

**Jerry lens:** Verify that all historical figures tie to AFS notes. The depreciation schedule existing-fleet run-off (S$4,187K NBV ÷ 3.5yr) should be cross-checked against actual Note 14 PPE rollforward. Flag if management's stated fleet size doesn't reconcile with Note 14 unit counts.

**Javier lens:** Go straight to CFADS ÷ total debt service. If DSCR < 1.0x in any year, the thesis is "we need to grow into our debt service" — that's a bet, not a margin of safety. Check whether the 45% residual value at disposal is supported by actual resale data (not just management's word). Stress-test utilisation at 60% and see if the model still works. If it doesn't, you're buying a utilisation bet, not a business.

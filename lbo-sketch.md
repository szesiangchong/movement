# LBO Sketch Template

> **Template for a back-of-envelope LBO analysis**
> *Replicated from: Carats & Co — LBO Sketch v2.xlsx*
> Currency: S$'000 unless stated

---

## Sheet Layout

Single sheet: **"LBO Sketch"**

| Region | Rows | Columns | Purpose |
|---|---|---|---|
| Header | 1–3 | B | Deal title, date, confidentiality notice |
| Key Assumptions | 4–24 | B–C, I | All blue-font inputs + notes |
| A. Entry Val | 26–36 | B–G | EV, equity value, ownership split |
| Sources & Uses | 38–47 | B–G | Dual-column S&U with percentages |
| B. Net Debt Bridge | 49–82 | B–H, I | Pro forma debt, 5-yr FCF, net cash |
| C. Exit Valuation | 84–91 | B–E | Two exit scenarios (flat + re-rate) |
| D. Returns | 93–98 | B–E | MoIC and IRR for both scenarios |
| Sensitivity | 101–106 | B–G | Entry × Exit multiple MoIC table |
| Footer | 108 | B | Firm branding |

---

## Formatting Conventions

| Convention | Style |
|---|---|
| Blue font + yellow bg | Hardcoded inputs (user editable) |
| Black font | Formulas / calculations |
| Grey italic font | Supporting labels, notes, ratios |
| Dark header rows | White bold text on `#1A2332` background |
| Light blue bg (`#DCE6F1`) | Key output / total rows |
| Light grey bg (`#F2F2F2`) | Subtotal rows |
| Bold | Section totals and key outputs |
| Number formats | `#,##0;(#,##0);-` for currency, `0.0x` for multiples, `0.0%` for percentages |

---

## KEY ASSUMPTIONS (Rows 5–24)

All inputs go in column C (blue font, yellow background `#FFFFCC`). Notes/sources go in column I (grey italic).

| Row | Label (Col B) | Input (Col C) | Format | Note (Col I) |
|---|---|---|---|---|
| 5 | EBITDA (FY2025, Unaudited) | 7,172 | `#,##0` | Source: Mgmt P&L FY2025 |
| 6 | Entry Multiple | 6.0x | `0.0x` | [ASSUMPTION] |
| 7 | Sponsor Stake (%) | 70% | `0.0%` | 100% acq; 75/25 sponsor/family |
| 8 | Leverage (x EBITDA) | 2.0x | `0.0x` | [ASSUMPTION] |
| 9 | Interest Rate (p.a.) | 4.0% | `0.0%` | Secured on company assets. [ASSUMPTION] |
| 10 | Amortisation (years) | 5 | `0` | Straight-line |
| 11 | Hold Period (years) | 5 | `0` | [ASSUMPTION] |
| 12 | Tax Rate | 17% | `0.0%` | SG corporate rate |
| 13 | Excess Cash (extractable) | 8,400 | `#,##0` | Source: Mgmt BS. Net of S$2M op. minimum. |
| 14 | Existing Debt (to refinance) | 2,701 | `#,##0` | Source: Mgmt BS FY2025 |
| 15 | Operating Cash Minimum | 2,000 | `#,##0` | Already netted in excess cash above |
| 16 | Transaction Cost (% of EV) | 1.5% | `0.0%` | [ASSUMPTION] |
| 17 | Exit Multiple — Scenario 1 | 6.0x | `0.0x` | Flat |
| 18 | Exit Multiple — Scenario 2 | 10.0x | `0.0x` | Platform re-rating |
| 19 | Base Revenue (FY2025) | 28,100 | `#,##0` | Source: Mgmt P&L FY2025 |
| 20 | Revenue CAGR | 5.0% | `0.0%` | Conservative (vs CIM ~8%) |
| 21 | EBITDA Margin | 26.0% | `0.0%` | FY2025 actual; cross-checks to C5 |
| 22 | Capex (annual) | 1,200 | `#,##0` | Fab facility + media sites |
| 23 | D&A (annual) | 1,240 | `#,##0` | FY2025 actual depreciation |
| 24 | NWC (% of Revenue) | 15.0% | `0.0%` | Incremental drag on growth |

---

## A. ENTRY VALUATION (Rows 26–36)

### Core Valuation (Rows 27–32)

| Row | Label | Formula | Notes |
|---|---|---|---|
| 28 | EBITDA (FY2025) | `=C5` | Links to assumption |
| 29 | Entry Multiple | `=C6` | Links to assumption |
| 30 | Enterprise Value | `=C28*C29` | EBITDA × Multiple |
| 31 | (-) Net Debt / (+) Net Cash | `=C13-C14` | Excess Cash − Existing Debt |
| 32 | Equity Value (100%) | `=C30+C31` | EV + Net Cash |

### Ownership Split (Rows 34–36)

| Row | Label | Formula |
|---|---|---|
| 35 | Sponsor (70%) | `=C32*C7` |
| 36 | Family Rollover (30%) | `=C32*(1-C7)` |

---

## SOURCES & USES (Rows 38–47)

Dual-column layout: Uses (B–D) and Sources (E–G).

### Uses Side (Columns B–D)

| Row | Label | Col C Formula | Col D (% of total) |
|---|---|---|---|
| 40 | Enterprise value (6.0x EBITDA) | `=C30` | `=C40/$C$45` |
| 41 | Refinance existing debt | `=C14` | `=C41/$C$45` |
| 42 | Transaction costs (~1.5%) | `=C30*C16` | `=C42/$C$45` |
| 45 | Total Uses | `=SUM(C40:C42)` | `=SUM(D40:D44)` |

### Sources Side (Columns E–G)

| Row | Label | Col F Formula | Col G (% of total) |
|---|---|---|---|
| 40 | Acquisition debt (2.0x EBITDA) | `=C8*C5` | `=F40/$C$45` |
| 41 | Excess cash extraction | `=C13` | `=F41/$C$45` |
| 42 | Total equity required | `=C45-F40-F41` | (blank) |
| 43 | Sponsor equity | `=F42-F44` | `=F43/$C$45` |
| 44 | Family rollover | `=(C45-F40)*(1-C7)` | `=F44/$C$45` |
| 45 | Total Sources | `=F40+F41+F42` | `=SUM(G40:G44)` |

> **Row 47 note (merged):** Debt: Secured term loan, 4.0% p.a. fixed, 5yr straight-line amort. Secured against fabrication facility + company assets.

---

## B. NET DEBT BRIDGE (Rows 49–82)

### Pro Forma Opening (Rows 50–53)

| Row | Label | Formula | Notes |
|---|---|---|---|
| 51 | Pro forma acquisition debt | `=F40` | Links to Sources |
| 52 | (-) Operating cash retained | `=-C15` | Op. cash minimum |
| 53 | Start: Pro Forma Net Debt | `=C51+C52` | |

### FCF Schedule (Rows 56–76)

Columns C–G = Year 1 through Year 5; Column H = Cumulative.

#### Revenue & EBITDA

| Row | Label | Yr 1 (Col C) | Yr 2 (Col D) | Pattern |
|---|---|---|---|---|
| 57 | Revenue | `=C19*(1+C20)^1` | `=C19*(1+C20)^2` | `=C19*(1+C20)^N` for year N |
| 58 | EBITDA | `=C57*$C$21` | `=D57*$C$21` | `=[YrCol]57*$C$21` |
| 59 | (-) D&A | `=-$C$23` | `=-$C$23` | Constant each year |
| 60 | EBIT | `=C58+C59` | `=D58+D59` | EBITDA − D&A |

#### Debt Schedule

| Row | Label | Yr 1 (Col C) | Yr 2+ Pattern |
|---|---|---|---|
| 62 | Opening Debt | `=F40` | `=[PrevYr]65` (prev closing debt) |
| 63 | Less: Interest | `=-C62*$C$9` | `=-[YrCol]62*$C$9` |
| 64 | (-) Principal Repayment | `=-F40/$C$10` | Constant: `=-F40/$C$10` |
| 65 | Closing Debt | `=C62+C64` | `=[YrCol]62+[YrCol]64` |

#### Income → FCF

| Row | Label | Yr 1 (Col C) | Pattern |
|---|---|---|---|
| 67 | Pre-tax Income | `=C60+C63` | EBIT + Interest (interest is negative) |
| 68 | Less: Tax (17%) | `=-C67*$C$12` | `=-[YrCol]67*$C$12` |
| 69 | (+) D&A Addback | `=$C$23` | Constant |
| 70 | (-) Capex | `=-$C$22` | Constant |
| 71 | (-) Change in NWC | `=-(C57-C19)*$C$24` | `=-([YrCol]57-[PrevYrCol]57)*$C$24` |
| 72 | Unlevered FCF | `=C67+C68+C69+C70+C71` | Sum of above |

#### Cash Flow Summary

| Row | Label | Yr 1 (Col C) | Pattern |
|---|---|---|---|
| 74 | Levered FCF | `=C72+C63+C64` | Unlevered FCF + Interest + Repayment |
| 75 | Cumulative Excess Cash | `=C74` (Yr1) / `=[PrevYr]75+[YrCol]74` (Yr2+) | |
| 76 | DSCR (FCF / Debt Service) | `=C72/(-C63-C64)` | Unlevered FCF / Total Debt Service |

#### Cumulative Column (Col H)

All cumulative cells use `=SUM(C[row]:G[row])` for the respective row.

### Net Debt Bridge Summary (Rows 78–82)

| Row | Label | Formula |
|---|---|---|
| 79 | Remaining debt at exit | `=G65` |
| 80 | Cash on hand at exit | `=C15+G75` |
| 81 | Net Cash Position at Exit | `=C80-C79` |
| 82 | Exit leverage (Debt/EBITDA) | `=C79/C5` |

---

## C. EXIT VALUATION (Rows 84–91)

Two scenarios side by side: Scenario 1 (Flat) in columns B–C, Scenario 2 (Re-Rate) in columns D–E.

| Row | Label | Scenario 1 (Col C) | Scenario 2 (Col E) |
|---|---|---|---|
| 86 | Exit EBITDA (Year 5) | `=G58` | `=G58` |
| 87 | Exit Multiple | `=C17` | `=C18` |
| 88 | Enterprise Value | `=C86*C87` | `=E86*E87` |
| 89 | (+) Net Cash at Exit | `=C81` | `=C81` |
| 90 | Exit Equity Value (100%) | `=C88+C89` | `=E88+E89` |
| 91 | Sponsor's 75% Share | `=C90*C7` | `=E90*C7` |

---

## D. RETURNS (Rows 93–98)

| Row | Label | Scenario 1 (Col C) | Scenario 2 (Col E) |
|---|---|---|---|
| 95 | Sponsor equity invested | `=F42*C7` | `=F42*C7` |
| 96 | Sponsor exit proceeds (75%) | `=C91` | `=E91` |
| 97 | MoIC | `=C96/C95` | `=E96/E95` |
| 98 | IRR (5-year hold) | `=C97^(1/C11)-1` | `=E97^(1/C11)-1` |

---

## SENSITIVITY TABLE (Rows 101–106)

Grid: Entry Multiple (rows) × Exit Multiple (columns) → Sponsor MoIC

**Header row 103:**

| Col B | Col C | Col D | Col E | Col F | Col G |
|---|---|---|---|---|---|
| Entry ↓ / Exit → | 5.0x | 6.0x | 8.0x | 10.0x | Sponsor Eq. |

**Data rows 104–106** (Entry multiples 5.0x, 6.0x, 7.0x in Col B):

**Sponsor Equity (Col G) formula:**
```
=(B[row]*C5*(1+C16)+C14-C8*C5-(C13-C15))*C7
```
Logic: (Entry EV including txn costs + refi debt − acq debt − net cash extraction) × sponsor %

**MoIC cell formula (Cols C–F):**
```
=([ExitMult]*G58+C81)*C7/G[row]
```
Logic: (Exit EV + Net Cash at Exit) × Sponsor % ÷ Sponsor Equity Invested

Where:
- `[ExitMult]` = the exit multiple from row 103 (C103, D103, E103, or F103)
- `G58` = Year 5 EBITDA
- `C81` = Net Cash Position at Exit
- `C7` = Sponsor stake %
- `G[row]` = Sponsor equity for that entry multiple row

---

## HOW TO USE THIS TEMPLATE

1. Create a new sheet named "LBO Sketch"
2. Set up the header (rows 1–3) with deal name and date
3. Enter all assumptions (rows 5–24) in column C with blue font (`#0000FF`) on yellow background (`#FFFFCC`)
4. Build Section A (Entry Valuation) — all formulas reference the assumptions above
5. Build Sources & Uses — dual-column layout, everything links to assumptions + Section A
6. Build Section B (Net Debt Bridge + FCF) — the most formula-intensive section; copy Yr 1 formulas across Yr 2–5
7. Build Section C (Exit Valuation) — two side-by-side scenarios
8. Build Section D (Returns) — MoIC and IRR reference entry equity and exit proceeds
9. Build Sensitivity Table — parametric MoIC grid

### Key Relationships / Circular Check

- `C45` (Total Uses) == `F45` (Total Sources) ← must balance
- `C81` (Net Cash at Exit) feeds into exit valuation
- `G58` (Year 5 EBITDA) feeds into exit EV
- `F42` (Total Equity Required) feeds into sponsor equity invested
- No circular references — interest is calculated on opening debt, not average debt

### Adapting for a New Deal

- Replace all blue-font assumptions with target company data
- Update header text (Row 1–2) and footer (Row 108)
- If hold period ≠ 5 years, add/remove FCF columns (C–G) and update cumulative column
- If multiple debt tranches needed, duplicate the debt schedule rows (62–65) for each tranche
- Adjust sensitivity table entry/exit ranges as appropriate

---

*Template generated from: Carats & Co — LBO Sketch v2.xlsx*
*Movement Capital | Project Cast | 23 February 2026*

# DEAL STRUCTURE & SHAREHOLDER WATERFALL MODEL

## CONTEXT

You are building a deal structure model for the acquisition of a multi-entity group where different shareholders hold different stakes across multiple operating companies. The model must: (1) normalise EBITDA for each entity on a standalone basis, (2) value each entity separately, (3) structure upfront vs. deferred consideration, (4) design earnout mechanics per entity, (5) allocate holdco equity post-close, and (6) produce a person-by-person cash waterfall showing exactly what each stakeholder walks away with.

This model is used when the target is a family business or multi-entity group where:
- Cross-entity cost subsidies distort reported profitability
- Different shareholders have different exit motivations (full exit, partial rollover, operator stay-on)
- The buyer needs to separate "what is this business actually earning" from "what does the P&L show"

---

## TRIGGER PHRASES

- "Build deal structure" / "Structure the deal"
- "Shareholder waterfall" / "Who gets what"
- "Normalise the EBITDA" / "Standalone P&L"
- "Earnout structure" / "Deferred consideration"
- "Holdco equity split"

---

## REQUIRED INPUTS

Before building, confirm the following with the user (or extract from uploaded materials):

### Entity-Level Financials
- Revenue, COGS, gross profit, employee costs, depreciation, other opex, finance costs, PBT per entity
- Which entity carries shared costs (employees, overhead, back office)
- Intercompany revenue or cost arrangements (if any)

### Shareholding Table
- Every shareholder's % ownership in every entity
- Which shareholders want full exit vs. rollover vs. operator stay-on

### Deal Parameters
- Target entry multiple (or range)
- Upfront vs. deferred split preference (% or fixed)
- Earnout measurement period and metrics
- Holdco equity allocation post-close (buyer %, operator rollover %, option pools)

---

## MODEL ARCHITECTURE

### Single Sheet Layout
- Column A: Labels (indented with spaces for sub-items)
- Columns B-E: Entity-level data (one column per entity + combined)
- Column F: Notes / rationale (italic, grey text)
- All assumption cells: Blue font (#0000FF), yellow background (#FFFF99)
- Formula cells: Black font, white background
- Section headers: Bold, white text, blue background (#4472C4)
- Totals: Bold, bottom border. Grand totals: double bottom border

---

## SECTION-BY-SECTION SPECIFICATION

### SECTION 1: REPORTED P&L

Reproduce the reported P&L as-is from management accounts, one column per entity plus a consolidated column.

```
                            Entity A    Entity B    Entity C    Consolidated
Revenue                     [input]     [input]     [input]     [SUM]
COGS                        [input]     [input]     [input]     [SUM]
Other income                [input]     [input]     [input]     [SUM]
Gross Profit + Other Income [FORMULA]   [FORMULA]   [FORMULA]   [SUM]
Employee benefits           [input]     [input]     [input]     [SUM]
Depreciation                [input]     [input]     [input]     [SUM]
Rental expenses             [input]     [input]     [input]     [SUM]
Other operating expenses    [input]     [input]     [input]     [SUM]
Finance costs               [input]     [input]     [input]     [SUM]
Profit Before Tax           [FORMULA]   [FORMULA]   [FORMULA]   [SUM]
Add back: Depreciation      [FORMULA]   [FORMULA]   [FORMULA]   [SUM]
Add back: Finance costs     [FORMULA]   [FORMULA]   [FORMULA]   [SUM]
EBITDA (as reported)        [FORMULA]   [FORMULA]   [FORMULA]   [SUM]
EBITDA margin               [FORMULA]   [FORMULA]   [FORMULA]   [FORMULA]
```

> ⚠️ **FLAG:** If one entity shows ALL the employee costs while others show zero, annotate this prominently. This is the core normalisation issue.

---

### SECTION 2: NORMALISATION ASSUMPTIONS

This is the most sensitive section. Every assumption must be flagged as a guess until validated by a segmented P&L from the target.

```
% of [cost-bearing entity] employee cost serving [Entity B]    [INPUT %]
  S$ reallocated                                                [FORMULA: % x total employee cost]

% of [cost-bearing entity] employee cost serving [Entity C]    [INPUT %]
  S$ reallocated                                                [FORMULA: % x total employee cost]
```

For each entity that would need standalone overhead if carved out:

```
[Entity] standalone overhead (new costs if carved out)
  Finance/admin (headcount)     [INPUT S$]
  Office space                  [INPUT S$]
  IT / systems                  [INPUT S$]
  Total                         [SUM]
```

> ⚠️ **NOTE in col F:** "Every assumption here is a guess until we get the segmented P&L"

---

### SECTION 3: NORMALISED EBITDA BRIDGE

Walk from reported EBITDA to normalised EBITDA per entity.

```
                                Entity A    Entity B    Entity C    Combined (A+B)
EBITDA as reported              [REF]       [REF]       [REF]       [SUM of target entities]
  Employee realloc: A -> B      [+]         [-]                     [zero-sum]
  Employee realloc: A -> C      [+]                     [-]
  Entity B standalone overhead              [-]                     [-]
  Entity C standalone overhead                          [-]
NORMALISED EBITDA               [FORMULA]   [FORMULA]   [FORMULA]   [FORMULA]
Normalised EBITDA margin        [FORMULA]   [FORMULA]   [FORMULA]   [FORMULA]
```

Show a "what normalisation does" summary:
```
  Entity A EBITDA:  [reported] -> [normalised]
  Entity B EBITDA:  [reported] -> [normalised]
  Entity C EBITDA:  [reported] -> [normalised]
```

---

### SECTION 4: VALUATION

Value each target entity separately at the entry multiple.

```
                        Entity A    Entity B    Combined
Normalised EBITDA       [REF]       [REF]       [SUM]
Entry multiple          [INPUT x]   [INPUT x]
Enterprise Value        [FORMULA]   [FORMULA]   [SUM]

[Any additional items, e.g. IP purchase at nominal value]
TOTAL CONSIDERATION                             [SUM]
```

> **PRINCIPLE:** Do NOT apply a blended multiple across entities. Value each on its own merits. Entities with unproven standalone economics should get a lower multiple or be acquired via earnout-heavy structures.

---

### SECTION 5: UPFRONT vs EARNOUT SPLIT

```
                        Entity A    Entity B    Combined
Upfront % of EV         [INPUT %]   [INPUT %]
Upfront cash             [FORMULA]   [FORMULA]   [SUM]
Earnout pool (deferred)  [FORMULA]   [FORMULA]   [SUM]

TOTAL DAY-1 CASH OUT                            [SUM of upfront + any IP]
TOTAL DEFERRED                                  [SUM of earnout pools]
```

> **NOTE:** Entity with less proven standalone earnings should have a higher earnout % (lower upfront %).

---

### SECTION 6: EARNOUT MECHANICS

For each entity's earnout, specify:

```
                            Entity A Earnout    Entity B Earnout
Earnout pool                [REF]               [REF]
Measurement period          [text, e.g. 3 years]
Metric                      [text, e.g. EBITDA only / Revenue + EBITDA dual gate]

Year 1 target               [text]              [text]
Year 2 target               [text]              [text]
Year 3 target               [text]              [text]

[If dual gate, show revenue targets separately]

Payout if hit               [text, e.g. 1/3 of pool per year]
Payout if missed            [text, e.g. pro-rata to % achieved]
Floor                       [text, e.g. 50% pool if >80% hit]
Cap                         [text, e.g. 100% / 125% if stretch]

Who earns it                [name]              [name]
Paid in                     [cash / equity election]
```

---

### SECTION 7: EARNOUT STRUCTURE — TWO-PIECE SPLIT

> **KEY DESIGN PRINCIPLE:** Split each entity's earnout into two pieces:
> 1. **Deferred consideration** — paid pro-rata to ALL shareholders in that entity. This is their money, just time-delayed. Floor should be maintenance of ~90% of baseline EBITDA.
> 2. **Management incentive** — paid ONLY to the operator running that entity. Funded from holdco (incremental to EV). Only pays on stretch targets. This is the carrot for above-and-beyond performance.

For each entity:

```
[ENTITY] EARNOUT

Piece 1: Deferred consideration (pro-rata, all shareholders)
Shareholder     Entity %    Their Share [FORMULA: % x earnout pool]
[name]          [%]         [S$]
[name]          [%]         [S$]
...
Total           100%        [= earnout pool]

Piece 2: Management incentive ([operator name] only, incremental to EV)
  Pool size                 [INPUT S$]
  Payout if stretch hit     [text]
  Payout if baseline but no stretch    [text]
  Payout if baseline missed [text]
```

---

### SECTION 8: HOLDCO EQUITY (POST-CLOSE)

```
                        % Equity    Role
Buyer (investor)        [INPUT %]   Majority control
[Operator 1]            [INPUT %]   CEO of Entity A. Earnout on EBITDA.
[Operator 2]            [INPUT %]   MD of Entity B. Earnout on revenue + EBITDA.
Management option pool  [INPUT %]   Key hires.
[Other key person]      [INPUT %]   Specific vesting terms.
Reserve                 [INPUT %]   Future co-investors or strategic.
Total                   100.0%
```

---

### SECTION 9: CASH WATERFALL — WHO WALKS AWAY WITH WHAT

This is the most important output. One row per stakeholder showing every cash flow they receive.

```
Stakeholder   Day-1 Cash   Entity A Deferred   Entity B Deferred   Mgmt Incentive   Total (max)   Holdco Equity   Notes
[name]        [FORMULA]    [FORMULA]            [FORMULA]           [amount or 0]    [SUM]         [% or dash]     [text]
...
```

**For shareholders rolling equity into holdco:**
Show the sub-calculation:
```
  Entitlement (across all entities)     [FORMULA: sum of pro-rata shares of upfront across entities]
  Holdco equity % (rolled)              [INPUT %]
  Value of rolled equity                [FORMULA: % x total EV or holdco notional value]
  Day-1 cash (entitlement minus roll)   [FORMULA: entitlement - rolled value]
```

**Summary:**
```
COST TO BUYER:
  Day-1 cash out                        [SUM of all day-1]
  Entity A deferred (X years)           [SUM]
  Entity B deferred (X years)           [SUM]
  Management incentives (if stretch)    [SUM]
  MAXIMUM TOTAL OUTLAY                  [SUM]
  Day-1 as % of max outlay             [FORMULA]
```

---

### SECTION 10: DEAL RISK COMMENTARY

Include a text section at the bottom flagging the key interpersonal / structural risks:
- Which stakeholders are at risk of feeling shortchanged?
- Where does the power dynamic sit?
- What mitigation is built into the structure?

> This section is qualitative. Write it in prose, not formulas.

---

## POST-BUILD VERIFICATION CHECKLIST

| # | Check | Expected Result |
|---|-------|-----------------|
| 1 | Normalisation adjustments net to zero across entities | Employee reallocation is zero-sum |
| 2 | All shareholding tables sum to 100% | Per entity |
| 3 | Earnout pool = EV x (1 - upfront %) per entity | Ties back exactly |
| 4 | Cash waterfall total = Day-1 + all deferred + all incentives | Reconciles to max outlay |
| 5 | Rolled equity: entitlement - rolled value = day-1 cash | For every rolling shareholder |
| 6 | No shareholder receives negative day-1 cash | Unless explicitly structured as full rollover |
| 7 | Dual-gate earnouts have BOTH metrics specified with targets | Revenue AND EBITDA, not just one |
| 8 | All assumption cells are blue font / yellow bg | No hidden hardcodes |
| 9 | Notes column populated for every non-obvious assumption | Rationale is auditable |
| 10 | Total consideration ties to Section 4 valuation | No leakage or double-counting |

---

## IC REVIEW GATE NOTES

**Jerry lens:** Every normalisation assumption must be flagged as unvalidated. Do not present normalised EBITDA as fact — always caveat that it depends on the segmented P&L. Check that sensitive shareholder details (exact ownership %, family dynamics commentary) are appropriate for the document's audience.

**Javier lens:** Challenge the entry multiple — is 5x appropriate for each entity independently? Does the normalised Gleamedia standalone actually deserve the same multiple as Carats? Stress-test the operator compensation: will the key person actually accept what they're being offered? Check that the waterfall math works for the person with the most negotiating leverage, not just the average shareholder.

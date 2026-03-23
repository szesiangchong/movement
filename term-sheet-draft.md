---
name: term-sheet-draft
description: >
  Draft Non-Binding Offers (NBOs) and term sheets for Movement (DVC Partners) acquisitions. Use this skill whenever the user asks to draft an NBO, non-binding offer, indicative offer, term sheet, or LOI for a deal. Also trigger on "draft NBO for [project]", "write term sheet", "indicative offer for [target]", "NBO for [target]", or "send offer letter". Supports English and Spanish language output. Handles standard acquisitions, add-on acquisitions, restructurings/distressed situations, and earn-out/reinvestment structures.
---

# Non-Binding Offer (NBO) / Term Sheet

Draft Non-Binding Offers for DVC Partners (Movement) acquisitions. The NBO is a formal indicative offer letter sent to sellers, advisors, or banks — it establishes deal terms, conditions, exclusivity, and DVC's credentials before entering confirmatory DD.

## Before You Start

1. **Read `Claude.md` and `SYSTEM_PROMPT.md`** from the movement repo for Movement context and communication standards.
2. **Clarify before building.** NBOs are externally-facing legal documents. Never generate on incomplete inputs. Ask one focused round of clarifying questions for any missing data below.
3. **Tag assumptions.** If user says "use best judgment", proceed but tag every gap-fill with `[ASSUMPTION]`.
4. **Language:** Default to English. Switch to Spanish if the target/advisor is Spanish-speaking (user will specify). Maintain the same formal legal register in both languages.

### Minimum Required Inputs

- Target company name
- Recipient (seller name, advisor firm, or bank — with contact names if available)
- Transaction type: standard acquisition / add-on / restructuring / earn-out structure
- Equity value or enterprise value (and basis — e.g., multiple × EBITDA)
- Key financial targets (Revenue and EBITDA for current and prior year)
- Deal structure (100% acquisition, seller reinvestment %, debt assumptions)
- Exclusivity period desired
- Deal team contacts at DVC

If any of the above are missing, stop and ask before proceeding.

---

## Document Format

Output as `.docx` using the docx skill. Apply DVC/Movement NBO formatting:

- **Header:** "Strictly Private and Confidential" (or "Estrictamente confidencial" for Spanish)
- **Sub-header:** "Subject to contract" (or "Sujeto a contrato")
- **Recipient block:** "To the attention of:" with names, firm, email
- **Date:** Full date format (e.g., "February 13, 2026" or "23 de diciembre de 2025")
- **Title line:** "Re: Non-Binding Offer for the acquisition of 100% of [Target] (the "Transaction")"
- **Font:** Professional serif or sans-serif, consistent with prior NBOs
- **Signature block:** DVC Partners S.L. with signatory name and title
- **No Movement logo on NBOs** — these go out under DVC Partners branding

---

## NBO Section Structure

The NBO follows a 15-section structure. All sections are mandatory unless marked [CONDITIONAL].

---

### 1. Opening / Greeting

**Standard opening:**
```
Dear Sirs,

Following our review of the information provided and our meetings with the management
team, DVC Partners, S.L. ("DVC") is strongly interested in further analyzing the
potential acquisition of 100% of [Target] (the "Company"), and hereby submits this
Non-Binding Offer (the "Indicative Offer") in relation to the Transaction.
```

**Variations by context:**
- If replacing a prior offer: add "This document replaces and supersedes any previous documents in relation to the Transaction."
- If advisor-intermediated: reference the advisor by name and thank them for facilitating
- If management meetings occurred: "We would like to thank the management team for the constructive meetings held to date."

---

### 2. Presentation of DVC Partners

**DVC boilerplate (mandatory — use verbatim):**

> DVC Partners is a pan-European private investment firm which focuses on private equity investments. Since 2002, DVC through its affiliates has invested in many companies all over Europe and in a wide variety of sectors.
>
> DVC Partners' investment philosophy is to advise its investors in the acquisition of assets in Europe where there is a clear proposition for value creation, businesses with strong market positions, defensible business models and top-notch management teams.
>
> DVC Partners adds value to its investments through the key value drivers of complementing management teams, product & service extensions, technological differentiation and innovation, new markets and frequently add-on acquisitions domestically and internationally.
>
> Around 65% of the transactions executed in the last five years were add-ons to existing portfolio companies.

**Portfolio company list (update with current portfolio — verify with user):**
Current as of early 2026: Gens Aurea, Fintyre, Wamos, Kompas, NUBA, Amor, 123.live, Soltec

**Sector experience narrative (REQUIRED — tailor per deal):**
Include 1-3 relevant portfolio case studies demonstrating DVC's track record in the target's sector or deal type. Each case study should include:
- Company name and acquisition year
- Entry metrics (revenue, EBITDA)
- Current metrics (revenue, EBITDA)
- Key value creation actions taken
- Relevance to the current transaction

For restructuring deals, include restructuring-specific case studies (Soltec, 123.live, Amor, Fintyre turnaround).

---

### 3. Strategic Rationale / Investment Rationale

Articulate WHY DVC wants to acquire the target. 3-5 bullet points covering:

- Market position of the target (use specific language: "clear market leader in...", "leading player in...")
- Sector dynamics that create the opportunity
- Value creation thesis (operational improvement, geographic expansion, product extension, consolidation)
- Fit with DVC's existing portfolio (if add-on, explain synergies explicitly)
- For restructurings: acknowledge challenges, then frame DVC as the right partner ("extensive experience navigating restructuring projects")

**Tone guidance:**
- Confident but not aggressive
- Acknowledge the target's strengths before presenting DVC's value-add
- If distressed: acknowledge challenges directly, position DVC's restructuring expertise with specific case studies
- If add-on: lead with the strategic logic of combination

---

### 4. Transaction Proposal

The core commercial terms. Structure varies by deal type:

#### Standard Acquisition
```
Based solely on the information provided to date and the Conditions and Assumptions
referred to in Section [X] below, DVC attributes a maximum Equity Value of [currency]
[amount] million to the Company, payable upfront at closing.

[If locked-box:] This represents the total cash consideration payable at Closing,
without further adjustments, considering a locked box effective as of [date].
```

#### Earn-Out Structure [CONDITIONAL]
```
DVC proposes a total Enterprise Value of [currency] [amount] million, comprised of:

- Enterprise Value at entry: [currency] [amount] million
- Deferred consideration (earn-out): Up to [currency] [amount] million, contingent
  on the Company achieving a minimum [year] EBITDA of [currency] [amount] million
  (representing a [X]% buffer over the projected [year] EBITDA of [currency] [amount]
  million)

The earn-out would be payable after the approval of the [year] audited annual report,
ideally through an earn-out debt facility.
```

#### Seller Reinvestment [CONDITIONAL]
```
The Transaction would be structured through a newly incorporated vehicle ("New-Co"),
in which DVC would hold [X]% and [Seller Name] would retain [Y]%, reinvesting from
the proceeds of the Transaction.
```

#### Restructuring / Distressed [CONDITIONAL]
```
DVC proposes an equity price of [currency] [nominal amount] for 100% of the shares,
together with a cash injection of [currency] [amount] million to support the Company's
operations and growth plan.

This proposal is conditional on:
- [X]% write-off of the Company's bank debt (from [currency] [gross debt] to
  [currency] [remaining debt])
- Remaining debt of [currency] [amount] million to be restructured on [X]-year
  maturity with [Y]-year grace period on principal and interest
- Interest at market rates for performing, low-risk industrial borrowers

[If proceeds-sharing:] DVC proposes a proceeds-sharing mechanism with restructuring
banks: [X]% to DVC / [Y]% to banks once DVC achieves [X]x MOIC and [Y]% IRR;
100% to DVC beyond that threshold.
```

---

### 5. Main Conditions and Assumptions

**Opening language:**
```
The main conditions and assumptions on which this Indicative Offer is based, and which
we must verify and confirm during our due diligence process ("Conditions and
Assumptions"), include:
```

**Mandatory conditions (include ALL of the following, adapting specifics per deal):**

#### A. Financial Performance Verification
- Minimum [prior year] revenue of [currency] [amount]
- Minimum [prior year] EBITDA of [currency] [amount] (without normalizations or adjustments)
- Visibility on [current year] revenue of [currency] [amount]
- Visibility on [current year] EBITDA of [currency] [amount]

#### B. Debt & Liability Verification
- Maximum debt position of [currency] [amount] (or zero if clean deal)
- Verification that there is no on- or off-balance sheet debt, guarantees, or contingent liabilities not previously disclosed
- Accounts payable overdue by more than 90 days treated as financial debt

#### C. Working Capital
- Confirmation of normalized working capital levels at closing
- Components: inventory, receivables, prepaid expenses, payables, accrued liabilities, provisions
- Adjustment mechanism if actual NWC deviates from agreed peg at closing

#### D. Cash Position
- Minimum cash position of [currency] [amount] at closing
- [If locked-box:] Sellers may withdraw cash generated prior to lockbox date, subject to minimum cash floor

#### E. Capital Expenditure
- Assessment of recurring capex necessary for ongoing operations
- [If known:] Maximum capex of [currency] [amount] for [period]
- Distinction between maintenance capex and growth capex

#### F. Absence of Contingencies
- Satisfactory due diligence confirming the absence of contingencies or undisclosed liabilities that could materially affect the Company's value or operations

#### G. Operational Continuity
- Company operating normally without material disruptions
- All administrative licenses, permits, and authorizations valid and in force
- Shares/assets free of liens, pledges, burdens, encumbrances, or claims

#### H. Change-of-Control Waivers
- Elimination or waiver of change-of-control clauses with lenders, landlords, suppliers, clients, and any other relevant party

#### I. Lockbox Mechanism
- Effective from [date]
- Company operates in ordinary course from lockbox date
- No extraordinary distributions, dividends, or capital movements post-lockbox

#### J. Management Retention [adapt per deal]
- [If specific names:] Retention of [Named Executive] (Role) for minimum [X] years post-closing
- [If general:] Retention of key management personnel on terms to be agreed

#### K. Investment Committee Approval
- Formal approval by DVC's Investment Committee (meets on a case-by-case basis, allowing short timeframes for decision-making)

#### L. Additional Deal-Specific Conditions [CONDITIONAL]
- [Rent cap / facility lease terms if applicable]
- [Debt restructuring approval if distressed]
- [Regulatory approvals if required]
- [Third-party consents if required]

---

### 6. Management Incentive Plan

**Standard framing:**
```
DVC has been highly impressed with the Company's management team and recognizes the
importance of retaining such talent and ensuring continued growth under new ownership.

In connection with this Transaction, DVC would like to:
- Understand [CEO/management]'s vision and strategic priorities for the Company
- Confirm [their] commitment to continue leading the Company post-transaction
- Discuss [their] willingness to reinvest alongside DVC
- Implement a Management Incentive Plan ("MIP") offering substantial incentives,
  aligned with the Company's long-term objectives

DVC is committed to working alongside the management team to provide resources,
insights, and expertise to support the Company's next phase of development.
```

**Variations:**
- If named executives known: list each by name and role with minimum retention period
- If seller reinvestment: reference the New-Co structure and % retention
- If distressed: emphasize "navigating the delicate situation" and DVC's support commitment

---

### 7. Due Diligence Requirements and Timings

**Standard framing:**
```
Subject to acceptance of this Indicative Offer and the granting of exclusivity, DVC
would commence a confirmatory Due Diligence process, not intended to adjust the price
but rather to confirm the Conditions and Assumptions outlined above.

The Due Diligence will cover the following key areas:
- Financial and tax
- Legal
- Commercial and operational
- Labour/employment
- Environmental
- Insurance
- IT and technology

DVC expects to complete the Due Diligence within [X] weeks from full access to a
Virtual Data Room ("VDR"), provided that all requested information is made available
in a timely manner.
```

**Two-phase structure [CONDITIONAL — for restructurings]:**
- Phase I: Preliminary assessment and debt restructuring confirmation
- Phase II: Full confirmatory DD (triggered at DVC's sole discretion after Phase I)
- Specify timeline for each phase separately

**Timeline guidance:**
- Standard deals: 6-8 weeks DD + 2-4 weeks documentation
- Restructurings: Phase I (4-6 weeks) + Phase II (8 weeks DD + 2 weeks documentation)
- Add-ons: 4-6 weeks (shorter due to existing sector knowledge)

---

### 8. Exclusivity Period

**Standard three-part covenant:**
```
DVC requests an exclusivity period commencing on the date of acceptance of this
Indicative Offer and ending on [date] (the "Exclusivity Period").

During the Exclusivity Period, the Sellers and/or the Company will not, and will
direct their respective directors, officers, employees, advisors, and representatives
not to, directly or indirectly:

(i) solicit or initiate any inquiry, indication of interest, proposal, or offer from
    any third party relating to the Transaction or any similar transaction;

(ii) participate in any discussions or negotiations with a third party regarding, or
     furnish or make available to a third party any information relating to the Company
     with respect to, the Transaction or any similar transaction; or

(iii) enter into any understanding, arrangement, agreement, agreement in principle, or
      other commitment (whether or not legally binding) with a third party relating to
      the Transaction or any similar transaction;

except to make any relevant party aware of the existence of any change-of-control
clause in any relevant agreement.
```

**Exclusivity period guidance:**
- Standard deals: 3-5 months from acceptance
- Restructurings: 10 weeks from Phase II commencement (conditional exclusivity)
- Include auto-extension clause if VDR access delayed: "If the VDR is not fully enabled by [date], the Exclusivity Period shall be automatically extended by the corresponding delay."

---

### 9. Break-Up Fee [CONDITIONAL]

Only include if strategically warranted (competitive process, seller commitment concerns).

```
In the event that the Sellers accept this Indicative Offer and DVC completes a
satisfactory Due Diligence and is prepared to execute the Transaction, but the Sellers
ultimately decline to proceed with the Transaction (for any reason other than DVC
itself electing not to proceed), the Sellers shall pay DVC a break-up fee of [currency]
[amount] (the "Break-Up Fee") within [5] business days of such declination.

The Break-Up Fee is intended to:
(i) compensate DVC for the Due Diligence costs and legal fees incurred; and
(ii) provide DVC with assurance of the Sellers' commitment to the Transaction.

The Sellers and DVC commit to negotiate the legal documents in good faith and within
the agreed timeline.
```

---

### 10. Regulatory Implications / Approvals

```
[If applicable:] DVC will assess any regulatory or antitrust filings required in
connection with the Transaction. Based on our preliminary analysis, [regulatory
assessment — e.g., "we do not anticipate any material regulatory obstacles" or
"filings may be required with [authority]"].

[Standard:] The Transaction will be subject to customary regulatory approvals,
including [list specific approvals if known].
```

---

### 11. Transaction Structure

```
The Transaction would be structured as the acquisition of 100% of the share capital
of the Company [or "through a newly incorporated vehicle"] by [DVC entity or New-Co
name].

[If asset deal:] Alternatively, DVC may elect to structure the Transaction as an
acquisition of substantially all of the Company's assets and business.

The final structure will be determined during Due Diligence, taking into account tax
efficiency and operational considerations.
```

**Variations:**
- New-Co structure: specify DVC % / seller % and reinvestment mechanics
- Multi-entity: specify perimeter (which entities included/excluded)
- Carve-out: specify assets/liabilities included in perimeter

---

### 12. Financing

```
DVC intends to finance the Transaction through a combination of:
- Existing financial resources of DVC and its investors (equity component)
- [If leveraged:] Debt financing from financial institutions or private debt funds
  (approximately [currency] [amount], representing approximately [X]x Debt/EBITDA)

[If add-on:] The Transaction would be financed through [Portfolio Company]'s existing
resources and financing facilities.

[Standard closer:] DVC confirms that financing is not a condition to completing the
Transaction, and DVC has the financial capacity to execute the proposed Transaction.
```

---

### 13. Contact Details

```
For any queries or further information, please do not hesitate to contact:

[Name]                          [Name]
[Title]                         [Title]
DVC Partners                    DVC Partners
Email: [email]                  Email: [email]
Phone: [phone]                  Phone: [phone]
```

Minimum 2 contacts. Always include a Partner and a Director/Associate.

---

### 14. Other Matters

**Standard boilerplate (mandatory):**
```
This Indicative Offer and its terms are confidential and should be treated
accordingly. We trust that appropriate measures will be taken to protect the
confidentiality of this document and its contents. No announcements, communications,
or disclosures shall be made relating to this Indicative Offer or DVC's interest in
the Company without DVC's prior written consent.

For the avoidance of doubt, this Indicative Offer is not intended to be exhaustive of
all the terms and conditions of the Transaction, nor is it intended that this
Indicative Offer should create any binding or legal relationship or obligation on DVC
or its portfolio companies.

The terms and conditions of the Transaction will be set out in definitive legal
agreements to be negotiated and agreed upon by the parties.

This Indicative Offer shall remain in force during [two weeks / X days] from today's
date.
```

---

### 15. Conclusion & Signature

```
We reiterate our strong interest in the Company and the Transaction, and we look
forward to working together towards a successful outcome.

Yours sincerely,

_________________________
[Signatory Name]
[Title]
DVC Partners, S.L.
```

---

## Applicable Law and Jurisdiction [CONDITIONAL]

Include when relevant (cross-border deals, restructurings):
```
This Indicative Offer shall be governed by and construed in accordance with the laws
of [jurisdiction]. Any dispute arising out of or in connection with this Indicative
Offer shall be submitted to the exclusive jurisdiction of the courts of [city].
```

---

## Deal-Type Templates

### Standard Acquisition
Sections: 1-7, 8, 10-15. No break-up fee, no restructuring language. Clean Sources & Uses.

### Add-On Acquisition
Same as standard, but Section 3 (Strategic Rationale) leads with portfolio company synergies. Financing references existing portfolio company resources. Shorter DD timeline.

### Restructuring / Distressed
All sections including Phase I/Phase II DD structure. Section 4 includes debt write-off mechanics, proceeds-sharing, cash injection. Sector experience narrative emphasizes restructuring case studies. May include Applicable Law section.

### Earn-Out / Seller Reinvestment
Section 4 includes earn-out mechanics (EBITDA threshold, buffer, payment timing) and/or New-Co structure with % split. Management section references reinvestment alongside DVC.

---

## IC Review Gate (Mandatory)

Before presenting the NBO to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity
- Verify all financial figures are consistent throughout the document (equity value, EBITDA targets, debt amounts)
- Check naming consistency (company name, legal entity, project codename)
- Verify DVC boilerplate is current and accurate
- Ensure portfolio case studies use correct and current figures
- Check conditions precedent are comprehensive and internally consistent
- Verify dates are logical (lockbox before closing, exclusivity allows sufficient DD time)
- Tone filter: ensure language is confident but not overreaching
- Core test: "If the seller's lawyers read this, are there any inconsistencies or gaps?"

### Pass 2 — Javier Ballve (Partner): Thesis & Deal Structure Challenge
- Verify the valuation basis is justified (what multiple, what EBITDA, what adjustments)
- Check earn-out / deferred structures are properly incentive-aligned
- Verify conditions provide adequate protection without being deal-breaking
- If restructuring: check debt write-off is realistic and proceeds-sharing is fair
- If seller reinvestment: verify alignment of interests
- Capex conditions distinguish maintenance vs growth
- Exclusivity period is sufficient for the DD scope
- Core test: "Does this term sheet protect us while remaining credible to the seller?"

**Protocol:**
- Fix flagged issues silently, present clean deliverable
- If material issues found: surface explicitly to user before finalizing

---

## Style Rules

- Formal legal register throughout. This is an externally-facing document.
- Use defined terms consistently: capitalize and quote on first use (e.g., the "Company", the "Transaction", the "Indicative Offer")
- Passive voice is appropriate and expected in NBO legal language
- Never use more than one em dash (—) in a single sentence
- Hedging language is appropriate: "Based solely on the information provided to date", "subject to completion of confirmatory Due Diligence"
- Spanish NBOs: maintain the same structural template, translate defined terms, use formal Spanish legal register

---

## Training Data

This skill is trained on Movement/DVC Partners' existing NBOs. As new NBOs are uploaded, reference them to refine clause language, deal-specific structuring, and tone calibration. Current training set:

| NBO | Target | Date | Deal Type | Language | Key Features |
|-----|--------|------|-----------|----------|-------------|
| Gold Business Time | Swiss gold retail | Feb 2026 | Add-on (Gens Aurea) | English | Break-up fee (CHF 2m), clean structure, CHF denomination |
| Frumecar | Spanish cement plants | Dec 2025 | Standard acquisition | Spanish | Named executive retention (5 people, 2yr), dedicated lockbox section, rent negotiation |
| Pibiplast | Italian beauty packaging | Mar 2026 | Restructuring / distressed | English | 85% debt write-off, two-phase DD, proceeds-sharing with banks, €1 nominal equity price |
| Beroil | Spanish fuel distribution | Mar 2025 | Earn-out + reinvestment | English | €14m earn-out, 70/30 New-Co structure, seller reinvestment |

When generating a new NBO, match the formality, clause precision, and structural consistency of these reference documents.

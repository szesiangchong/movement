---
name: term-sheet-draft
description: >
  Draft Non-Binding Offers (NBOs), Letters of Intent (LOIs), and term sheets for Movement and DVC Partners acquisitions. Use this skill whenever the user asks to draft an NBO, LOI, non-binding offer, indicative offer, term sheet, or letter of intent for a deal. Also trigger on "draft NBO for [project]", "write term sheet", "LOI for [target]", "indicative offer for [target]", "NBO for [target]", or "send offer letter". Supports English and Spanish language output. Handles standard acquisitions, add-on acquisitions, restructurings/distressed situations, earn-out/reinvestment structures, and North American share purchase LOIs.
---

# Non-Binding Offer (NBO) / Letter of Intent (LOI) / Term Sheet

Draft NBOs and LOIs for Movement acquisitions. Movement uses TWO distinct formats depending on geography and entity:

| Format | Entity | Geography | Use Case |
|--------|--------|-----------|----------|
| **DVC NBO** | DVC Partners, S.L. | Europe (Spain, Italy, Switzerland) | Indicative offers to sellers, advisors, or banks |
| **Movement LOI** | Special Sits General Partner I, S.A. | North America (Canada) | Letters of Intent with binding provisions to sellers or advisors |

**Key structural difference:** DVC NBOs are entirely non-binding persuasion documents with DVC corporate narrative. Movement LOIs are quasi-definitive documents with binding exclusivity, escrow mechanics, indemnification frameworks, and purchase price adjustment mechanics pre-agreed at LOI stage.

## Before You Start

1. **Read `Claude.md` and `SYSTEM_PROMPT.md`** from the movement repo for Movement context and communication standards.
2. **Determine the format:** Is this a DVC NBO (Europe) or a Movement LOI (North America)? Ask if unclear.
3. **Clarify before building.** These are externally-facing legal documents. Never generate on incomplete inputs. Ask one focused round of clarifying questions for any missing data below.
4. **Tag assumptions.** If user says "use best judgment", proceed but tag every gap-fill with `[ASSUMPTION]`.
5. **Language:** Default to English. Switch to Spanish if the target/advisor is Spanish-speaking (user will specify). Maintain the same formal legal register in both languages.

### Minimum Required Inputs (Both Formats)

- Target company name
- Recipient (seller name, advisor firm, or bank — with contact names if available)
- Transaction type: standard acquisition / add-on / restructuring / earn-out structure
- Enterprise value or equity value (and basis — e.g., multiple × EBITDA)
- Key financial targets (Revenue and EBITDA for current and prior year)
- Deal structure (100% acquisition, seller reinvestment %, debt assumptions)
- Exclusivity period desired
- Deal team contacts

### Additional Inputs for Movement LOIs (North America)

- Target NWC peg (or "to be determined post-QoE")
- Indemnification parameters (escrow %, cap structure, survival periods) — or use defaults
- Named key employees for new employment agreements
- Real property details (owned vs leased, lease terms if applicable)
- Restrictive covenant terms (non-compete/non-solicit duration and geography)
- Co-investment offer for seller (% and terms, or none)
- Closing timeline target (default: 90 days)
- Signing entity: Special Sits General Partner I, S.A.

If any critical inputs are missing, stop and ask before proceeding.

---

## Document Format

Output as `.docx` using the docx skill.

### DVC NBO Format (Europe)
- **Header:** "Strictly Private and Confidential" (or "Estrictamente confidencial" for Spanish)
- **Sub-header:** "Subject to contract" (or "Sujeto a contrato")
- **Recipient block:** "To the attention of:" with names, firm, email
- **Date:** Full date format (e.g., "February 13, 2026" or "23 de diciembre de 2025")
- **Title line:** "Re: Non-Binding Offer for the acquisition of 100% of [Target] (the "Transaction")"
- **Signature block:** DVC Partners S.L. with signatory name and title
- **No Movement logo** — DVC Partners branding

### Movement LOI Format (North America)
- **Header:** "PRIVATE AND CONFIDENTIAL"
- **No sub-header** (no "Subject to contract" — binding provisions are explicitly carved out)
- **Recipient block:** Company name and address, or advisor firm
- **Date:** Full date format (e.g., "July 23, 2025")
- **Title line:** "Re: Non-Binding Letter of Intent for the acquisition of [Target] (the "Transaction")"
- **Signature block:** "SPECIAL SITS GENERAL PARTNER I, S.A." signed by Managing Director
- **Counter-signature block** for seller (LOIs require seller execution to activate exclusivity)
- **No Movement logo** — Special Sits branding

---

# PART A: DVC NBO STRUCTURE (EUROPE)

The DVC NBO follows a 15-section structure. All sections are mandatory unless marked [CONDITIONAL].

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

## DVC NBO Deal-Type Templates

### Standard Acquisition
Sections: 1-7, 8, 10-15. No break-up fee, no restructuring language. Clean Sources & Uses.

### Add-On Acquisition
Same as standard, but Section 3 (Strategic Rationale) leads with portfolio company synergies. Financing references existing portfolio company resources. Shorter DD timeline.

### Restructuring / Distressed
All sections including Phase I/Phase II DD structure. Section 4 includes debt write-off mechanics, proceeds-sharing, cash injection. Sector experience narrative emphasizes restructuring case studies. May include Applicable Law section.

### Earn-Out / Seller Reinvestment
Section 4 includes earn-out mechanics (EBITDA threshold, buffer, payment timing) and/or New-Co structure with % split. Management section references reinvestment alongside DVC.

---

# PART B: MOVEMENT LOI STRUCTURE (NORTH AMERICA)

The Movement LOI is a more legally detailed document than the DVC NBO. It follows a 22-23 section structure with binding and non-binding provisions explicitly separated. The LOI functions as a quasi-definitive document — escrow mechanics, indemnification caps, purchase price adjustments, and restrictive covenants are pre-agreed at LOI stage.

---

### 1. Introduction

```
[Date]

PRIVATE AND CONFIDENTIAL

[Recipient Name / Company / Advisor]
[Address]

Re: Non-Binding Letter of Intent for the acquisition of 100% of the issued and
outstanding shares of [Target] (the "Transaction")

Dear [Name],

We are pleased to submit this letter of intent (the "LOI") setting out the proposed
terms and conditions on which [Purchaser Entity], or an affiliate thereof (the
"Purchaser"), would acquire all of the issued and outstanding shares (the "Shares")
of [Target] (the "Company") from [Seller Names] (collectively, the "Vendors").
```

---

### 2. Overview of Purchaser

**Movement / Special Sits description (tailor per deal):**
- Describe Movement's investment focus (special situations, turnarounds, operational transformation)
- Reference the SITS fund structure and backing
- Include 1-2 relevant portfolio case studies demonstrating sector or deal-type expertise
- Shorter and more direct than DVC boilerplate — no verbatim block required

---

### 3. Structure of Transaction

```
The Transaction would be structured as the acquisition by the Purchaser of all of
the issued and outstanding Shares in the capital of the Company, free and clear of
all liens, pledges, encumbrances, charges, options, and third-party rights of any
nature (the "Share Purchase").

[If asset deal alternative:] The Purchaser reserves the right to restructure the
Transaction as an asset purchase if determined to be more tax-efficient, provided
the economic terms remain substantially equivalent.
```

---

### 4. Consideration and Payment Terms

```
Based on the information provided, the Purchaser proposes an enterprise value of
approximately [currency] [amount] (the "Enterprise Value"), representing approximately
[X]x the Company's trailing twelve-month ("TTM") normalized EBITDA of no less than
[currency] [amount] as of [date].

The purchase price payable at closing (the "Closing Cash Payment") shall equal:

  Enterprise Value
  (+) Excess unrestricted cash at Closing
  (-) All indebtedness outstanding at Closing
  (+/-) Net Working Capital adjustment (see Section 5)

The Closing Cash Payment shall be paid in cash at Closing, subject to the adjustments
and escrow holdbacks described herein.
```

**Valuation presentation rules:**
- Always express as Enterprise Value with explicit multiple and EBITDA basis
- State the TTM EBITDA floor: "no less than [amount]"
- Show the bridge from EV to Closing Cash Payment
- Never present equity value without showing the EV-to-equity bridge

**Co-Investment offer [CONDITIONAL]:**
```
The Purchaser would offer [Seller Name] the opportunity to co-invest up to [X]% of
the equity in the acquisition vehicle on mutually agreeable terms. This co-investment
opportunity is offered as a further expression of partnership and is not a condition
of the Transaction.
```

---

### 5. Purchase Price Adjustments

**Mandatory section in all Movement LOIs. Include ALL of the following:**

#### A. Net Working Capital Adjustment
```
The Closing Cash Payment shall be subject to a dollar-for-dollar adjustment based on
the difference between the actual Net Working Capital at Closing and the target Net
Working Capital of [currency] [amount] (the "NWC Target").

Net Working Capital shall be defined as current assets (inventory, accounts receivable,
prepaid expenses, and other current assets) less current liabilities (accounts payable,
accrued liabilities, and other current liabilities), calculated in accordance with GAAP
applied on a basis consistent with past practice.

The NWC Target shall be estimated at Closing and finalized through a customary
post-Closing true-up process within [90/120] days.
```

#### B. Cash Adjustment
- Excess unrestricted cash at Closing results in upward adjustment to Closing Cash Payment
- Expectation that excess cash will be distributed to sellers pre-Closing

#### C. Debt & Liability Adjustment
- Downward adjustment for any liabilities remaining at Closing
- Exhaustive list of what constitutes "indebtedness":
  - Shareholder loans and related-party balances
  - Interest-bearing debt (bank loans, lines of credit)
  - Capital lease obligations
  - Intercompany loans and balances
  - Income taxes payable
  - Deferred revenue and customer deposits
  - Accrued bonuses and deferred compensation
  - Any non-ordinary-course obligations

---

### 6. Definitive Agreements (Escrow & Indemnification)

**This section pre-commits the key SPA mechanics at LOI stage. Critical for Movement LOIs.**

#### A. Escrow Structure
```
The Definitive Agreements shall provide for the following escrow arrangements:

Indemnity Escrow: An amount equal to [10]% of the Closing Cash Payment shall be
deposited with a mutually agreed third-party escrow agent for a period of [18] months
following Closing (the "Indemnity Escrow").

  - Two-thirds (2/3) of the Indemnity Escrow released on the first anniversary of
    Closing, less any pending or resolved claims
  - Remaining one-third (1/3) released on the [18]-month anniversary, less any
    pending or resolved claims

Working Capital Escrow: An amount of [currency] [amount] shall be held in escrow for
[120] days following Closing to secure any NWC true-up adjustment.
```

**Default escrow parameters (adjust per deal):**

| Parameter | Default | Range Observed |
|-----------|---------|---------------|
| Indemnity escrow % | 10% of Closing Cash Payment | 10% (all 3 LOIs) |
| Indemnity escrow duration | 18 months | 18 months (all 3 LOIs) |
| Release schedule | 2/3 at 12mo, 1/3 at 18mo | Consistent across all |
| WC escrow amount | $150k-$250k | Deal-specific |
| WC escrow duration | 120 days | 120 days (all 3 LOIs) |

#### B. Indemnification Framework
```
The Definitive Agreements shall contain representations, warranties, covenants, and
indemnities customary for transactions of this nature, including:

Indemnification Caps:
  - Fundamental representations and warranties: [100]% of Closing Cash Payment
  - Non-fundamental representations and warranties: [40-50]% of Closing Cash Payment

Survival Periods:
  - Fundamental representations: [7-15] years from Closing
  - Non-fundamental representations: [18] months from Closing
  - Tax representations: [60-90] days following expiry of applicable limitation period

De Minimis / Basket:
  - Individual claim threshold: [currency] [amount]
  - Aggregate basket (deductible): [currency] [amount]
```

**Default indemnification parameters:**

| Parameter | Default | Range Observed |
|-----------|---------|---------------|
| Fundamental cap | 100% of Closing Cash Payment | 100% (all 3 LOIs) |
| Non-fundamental cap | 40-50% of Closing Cash Payment | 40% (Eco), 50% (Loadstar) |
| Fundamental survival | 7-15 years | 7yr (Eco/Nusens), 15yr (Loadstar) |
| Non-fundamental survival | 18 months | 18mo (all 3 LOIs) |
| Individual threshold | ~$25k-$50k | Deal-specific |
| Aggregate basket | ~$100k-$150k | $150k (Eco) |

#### C. Restrictive Covenants
```
The Definitive Agreements shall contain customary restrictive covenants, including:

Non-Competition: [3-5] years from Closing, within [geographic scope]
Non-Solicitation: [3-5] years from Closing (employees, customers, suppliers)

[If seller is individual:] The Vendors shall be jointly and severally liable for
compliance with these restrictive covenants.
```

---

### 7. Real Property [CONDITIONAL]

**Include when the target owns or leases its operating facilities.**

#### If Target Owns Real Property:
```
The real property located at [address] (the "Real Property") shall be acquired
pursuant to a separate agreement of purchase and sale on terms consistent with this
LOI. The value of the Real Property shall be determined through a jointly commissioned
independent appraisal.
```

#### If Target Leases (Seller-Owned Property):
```
The Purchaser and the Vendors shall enter into a lease agreement for the property
located at [address] on the following terms:

  - Lease type: Triple-net lease
  - Term: [5] years, with [3] renewal options of [5] years each
  - Rent: Fair market value, to be determined by independent appraisal
  - Right of first refusal: Purchaser shall have a right of first refusal on any
    proposed sale of the property during the lease term
  - [If arbitration:] Fair market rent disputes resolved by independent arbitrator
```

---

### 8. Management Team and Other Employees

```
The Purchaser recognizes the importance of the Company's employees and intends to
maintain comparable employment terms post-Closing.

Key employees: The Purchaser may require the following individuals to enter into new
employment agreements as a condition of Closing:

  - [Name], [Title]
  - [Name], [Title]
  - [Name], [Title]

[If founder transition:] The Purchaser would welcome the opportunity for [Founder Name]
to serve as a consultant post-Closing for a period of [3-4] months at a rate of
[currency] [rate]/hour, to ensure a smooth transition of relationships and institutional
knowledge.

All other employees: The Purchaser intends to offer continued employment to the
Company's employees on substantially similar terms and conditions as currently exist.
```

---

### 9. Business in the Ordinary Course (Binding Covenant)

**This is a BINDING provision in Movement LOIs — critical difference from DVC NBOs.**

```
From the Effective Date until the earlier of Closing or termination of this LOI,
the Vendors shall cause the Company to conduct its business in the ordinary course,
consistent with past practice, and shall not, without the prior written consent of
the Purchaser:

  (a) incur any indebtedness or guarantee any obligation exceeding [currency] [amount];
  (b) make any capital expenditure exceeding [currency] [amount] individually or
      [currency] [amount] in aggregate;
  (c) increase compensation, bonuses, or benefits for any employee beyond ordinary
      course adjustments;
  (d) enter into, amend, or terminate any material contract;
  (e) declare or pay any dividend or distribution;
  (f) sell, lease, or encumber any material asset;
  (g) hire or terminate any employee earning in excess of [currency] [amount]; or
  (h) take any action outside the ordinary course of business.
```

---

### 10. Closing

```
The Parties shall use commercially reasonable efforts to complete the Transaction
within [90] days of the Effective Date (the "Target Closing Date"), subject to:

  - Completion of satisfactory due diligence
  - Negotiation and execution of Definitive Agreements
  - Satisfaction or waiver of all conditions precedent
  - Receipt of all required consents and approvals

Closing shall take place at a mutually agreed location or by electronic exchange
of documents.
```

---

### 11. Funding

```
The Purchaser confirms that it has, or will have at Closing, sufficient funds to
complete the Transaction on the terms contemplated herein. Financing is not a
condition to the Purchaser's obligations under the Definitive Agreements.

The Transaction will be financed through a combination of equity from the Purchaser's
existing financial resources and, if applicable, third-party debt financing.
```

---

### 12. Access and Due Diligence

```
Upon execution of this LOI, the Vendors shall provide the Purchaser and its
professional advisors with full access to:

  - The Company's books, records, contracts, and financial information
  - Management and key employees for interviews and operational review
  - Physical facilities for site visits
  - Customers, suppliers, and other third parties as reasonably required

The Vendors and the Company shall cooperate with the Purchaser's professional advisors
to perform a Quality of Earnings review and such other due diligence as the Purchaser
deems necessary.
```

---

### 13. Exclusivity (BINDING)

**Movement LOIs use binding exclusivity with survival provisions.**

```
Upon execution of this LOI, and for a period ending on the earlier of: (a) [90] days
following the Effective Date; (b) execution of the Definitive Agreements; (c) the
Purchaser's written notice declining to proceed; or (d) mutual written agreement
(the "Exclusivity Period"):

The Vendors shall not, and shall cause the Company and its directors, officers,
employees, shareholders, agents, and representatives not to, directly or indirectly:

  (i) solicit, initiate, or encourage any inquiry, proposal, or offer relating to
      any acquisition, merger, or similar transaction involving the Company;
  (ii) provide any information to, or enter into discussions or negotiations with,
       any third party regarding any such transaction; or
  (iii) enter into any agreement, understanding, or commitment with any third party
        regarding any such transaction.

The Vendors shall immediately cease and cause to be terminated any existing
discussions or negotiations with any third party regarding any such transaction.
```

**Key differences from DVC NBO exclusivity:**
- Binding and survives termination
- Requires immediate cessation of existing discussions (not just prospective)
- Includes broader scope of restricted parties (shareholders, agents, representatives)
- No break-up fee needed — binding exclusivity provides sufficient protection

---

### 14. Costs

```
Each Party shall bear its own costs and expenses incurred in connection with the
Transaction, including legal, accounting, and advisory fees, whether or not the
Transaction is completed.
```

---

### 15. Effect of this LOI (Binding vs Non-Binding Carve-Out)

**Critical section — explicitly separates binding from non-binding provisions.**

```
This LOI constitutes a statement of present intent only and does not create any
binding obligation on any Party to complete the Transaction. The rights and obligations
of the Parties with respect to the Transaction shall only be as set forth in the
Definitive Agreements.

Notwithstanding the foregoing, the following provisions (the "Binding Provisions")
shall be legally binding and enforceable upon execution of this LOI:

  - Section 9: Business in the Ordinary Course
  - Section 13: Exclusivity
  - Section 14: Costs
  - Section 15: Effect of this LOI
  - Section 16: Entire Agreement
  - Section 17: Public Announcement
  - Section 18: Quality of Earnings [if applicable]
  - Section 19: Governing Law
  - Section 20: Miscellaneous Terms
  - Section 21: Counterparts

The Binding Provisions shall survive any termination of this LOI.
```

---

### 16. Entire Agreement

Standard integration clause: this LOI supersedes all prior discussions and agreements relating to the Transaction.

---

### 17. Public Announcement

No public announcements without mutual written consent. Standard confidentiality language.

---

### 18. Quality of Earnings [CONDITIONAL — include for larger deals]

**Operationalized QoE section — unique to Movement LOIs.**

```
The Purchaser shall engage, at [Purchaser's / respective party's] cost, a nationally
recognized accounting firm [acceptable to both Parties] to conduct a Quality of
Earnings review of the Company (the "QoE Review").

  - The QoE Review shall be conducted under the direction and control of the Purchaser
  - The Vendors and the Company shall provide full cooperation and access to all
    financial records, working papers, and personnel as reasonably required
  - Scope: historical financial performance, normalized EBITDA, working capital
    analysis, revenue quality, and such other matters as the Purchaser deems necessary

[Cost allocation:] If the Transaction closes, the cost of the QoE Review shall be
borne by the Purchaser. If the Transaction does not close for reasons other than a
material breach by the Vendors, each Party shall bear its own costs.
```

---

### 19. Governing Law

```
This LOI shall be governed by and construed in accordance with the laws of the
Province of [Ontario / applicable province] and the federal laws of Canada applicable
therein. The Parties submit to the [exclusive / non-exclusive] jurisdiction of the
courts of [Province].
```

---

### 20-22. Miscellaneous, Counterparts, Legal Counsel

Standard legal boilerplate: amendment requirements, severability, counterparts acceptance, legal counsel identification and contact information.

---

### 23. Signature and Counter-Signature

**Movement LOIs require BOTH parties to sign (unlike DVC NBOs which are unilateral).**

```
IN WITNESS WHEREOF, the Parties have executed this LOI as of the date first written
above.

PURCHASER:

SPECIAL SITS GENERAL PARTNER I, S.A.

Per: _________________________
Name: [Signatory]
Title: Managing Director


VENDOR(S):

[TARGET COMPANY NAME]

Per: _________________________
Name: [Seller Name]
Title: [Title]

[If multiple sellers, include separate signature blocks for each]
```

**Third-party beneficiary clause [CONDITIONAL]:**
```
[PE Parent Entity] shall be an express third-party beneficiary of this LOI with
direct enforcement rights over the Binding Provisions.
```

---

## Movement LOI Deal-Type Templates

### Standard Share Purchase (Eco, Loadstar pattern)
Full 22-section structure. Clean EV with TTM EBITDA basis. 10% indemnity escrow, 18-month hold. Co-investment optional. Real property section if applicable. 90-day closing target.

### Seller Co-Investment (Nusens pattern)
Same as standard, but Section 4 includes mandatory equity co-invest (e.g., 10% at $1M). New-Co vehicle structure. MIP integrated with co-investment.

### Founder Transition
Section 8 includes detailed consulting arrangement (hours, rate, duration, scope). Longer non-compete (5 years). Real property lease if founder owns premises.

---

## IC Review Gate (Mandatory)

Before presenting the NBO to the user, run two silent review passes:

### Pass 1 — Jerry Tan (Director): Editorial, Factual & Analytical Integrity
- Verify all financial figures are consistent throughout the document (EV, EBITDA targets, debt amounts, escrow percentages, indemnification caps)
- Check naming consistency (company name, legal entity, project codename, defined terms)
- Verify DVC boilerplate is current and accurate (if NBO format)
- Ensure portfolio case studies use correct and current figures
- Check conditions precedent are comprehensive and internally consistent
- Verify dates are logical (lockbox before closing, exclusivity allows sufficient DD time, escrow release dates)
- For LOIs: verify binding vs non-binding section references are correct and complete
- For LOIs: check indemnification math is internally consistent (escrow % × closing cash = escrow amount; caps as % × closing cash)
- Tone filter: ensure language is confident but not overreaching
- Core test: "If the seller's lawyers read this, are there any inconsistencies or gaps?"

### Pass 2 — Javier Ballve (Partner): Thesis & Deal Structure Challenge
- Verify the valuation basis is justified (what multiple, what EBITDA, what adjustments)
- Check earn-out / deferred structures are properly incentive-aligned
- Verify conditions provide adequate protection without being deal-breaking
- If restructuring: check debt write-off is realistic and proceeds-sharing is fair
- If seller reinvestment / co-invest: verify alignment of interests and % is appropriate
- Capex conditions distinguish maintenance vs growth
- Exclusivity period is sufficient for the DD scope
- For LOIs: verify NWC target is reasonable vs historical (flag if "TBD" without rationale)
- For LOIs: check indemnification caps are proportionate to deal size and risk
- For LOIs: verify restrictive covenant scope is enforceable in the target's jurisdiction
- For LOIs: check real property terms are fair (lease rate, ROFR, renewal options)
- For LOIs: verify ordinary course covenant restrictions are practical (not so tight they create friction)
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

This skill is trained on Movement/DVC Partners' existing NBOs and LOIs. As new documents are uploaded, reference them to refine clause language, deal-specific structuring, and tone calibration. Current training set:

### DVC NBOs (Europe)

| NBO | Target | Date | Deal Type | Language | Key Features |
|-----|--------|------|-----------|----------|-------------|
| Gold Business Time | Swiss gold retail | Feb 2026 | Add-on (Gens Aurea) | English | Break-up fee (CHF 2m), clean structure, CHF denomination |
| Frumecar | Spanish cement plants | Dec 2025 | Standard acquisition | Spanish | Named executive retention (5 people, 2yr), dedicated lockbox section, rent negotiation |
| Pibiplast | Italian beauty packaging | Mar 2026 | Restructuring / distressed | English | 85% debt write-off, two-phase DD, proceeds-sharing with banks, €1 nominal equity price |
| Beroil | Spanish fuel distribution | Mar 2025 | Earn-out + reinvestment | English | €14m earn-out, 70/30 New-Co structure, seller reinvestment |

### Movement LOIs (North America)

| LOI | Target | Date | Deal Type | EV | Key Features |
|-----|--------|------|-----------|-----|-------------|
| Eco Architectural Glass | Canadian architectural glass | Jul 2025 | Standard share purchase | $18M CAD (5.9x) | Most detailed LOI: dedicated QoE section with cost allocation, separate real property purchase, 30% co-invest option, 10% escrow, 40% non-fundamental cap, 7yr fundamental survival, named key employees (4), $1.7M NWC target |
| Nusens Niche Contracting | Canadian niche contracting | Jan 2025 | Seller co-investment | $20M CAD (5.0x) | Mandatory 10% equity co-invest ($1M, Da Silva), joint/several seller liability, 10% escrow, 50% non-fundamental cap, 7yr fundamental survival, 3yr non-compete, founder consulting (3mo, $100/hr) |
| Loadstar Trailers | Canadian trailer manufacturing | Jun 2025 | Standard + lease-back | $11.5M CAD (5.0x) | Triple-net lease (5yr + 3×5yr renewals, FMV rent, ROFR), 30% co-invest option, 10% escrow, 50% non-fundamental cap, 15yr fundamental survival (longest), 5yr non-compete/non-solicit, WC target TBD post-QoE |

When generating a new NBO or LOI, match the formality, clause precision, and structural consistency of the relevant format's reference documents.

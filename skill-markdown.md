# SG Restructuring Daily Briefing

## Description
Scrape 3 Singapore sources daily for insolvency and restructuring intelligence, enrich each result with context and case history, and deliver a formatted briefing via email and Telegram.

## Trigger
- **Cron**: `0 8 * * 1-5` (8:00 AM SGT, weekdays only)
- **Manual**: When user says "good morning", "briefing", "restructuring update", or "morning briefing"

## Configuration
- **Recipient email**: seth@turtleadvisors.com  <!-- UPDATE THIS -->
- **Date range**: Rolling 7 days from today

---

## Instructions

When this skill is triggered, perform the following steps **in order**:

### Step 1: Calculate Date Range
- Set `DATE_FROM` = today minus 7 days (format: YYYY-MM-DD)
- Set `DATE_TO` = today (format: YYYY-MM-DD)
- Set `SGX_START` = DATE_FROM formatted as YYYYMMDD_160000
- Set `SGX_END` = DATE_TO formatted as YYYYMMDD_155959

### Step 2: Scrape SGX Company Announcements

**Try API first:**
Fetch JSON from:
```
https://api.sgx.com/announcements/v1.0/?periodstart={SGX_START}&periodend={SGX_END}&pagestart=0&pagesize=100
```

From the returned JSON, filter results where the announcement category or type matches ANY of:
- **Announcements**: "Court Meeting", "ESGM", "Notice of Consecutive 3 year losses"
- **Corporate Action**: "Corporate Debt Restructuring", "Exchange Offer/Capital Reorganisation", "Other Scheme of Arrangement"

For each matching result, extract: company name, announcement title, category, subcategory, date, and link URL.

**If API fails, use browser:**
1. Navigate to `https://www.sgx.com/securities/company-announcements`
2. Under the **Announcements** dropdown filter, select:
   - Court Meeting
   - ESGM
   - Notice of Consecutive 3 year losses
3. Under the **Corporate Action** dropdown filter, select:
   - Corporate Debt Restructuring
   - Exchange Offer/Capital Reorganisation
   - Other Scheme of Arrangement
4. Wait for results to load
5. Extract all visible announcements with: company name, title, category, date, link

### Step 3: Scrape eLitigation.sg

1. Open browser and navigate to: `https://www.elitigation.sg/gd/Home/Index`
2. Locate the search input field (it's the main text box at the top of the page)
3. Type into the search field: `Insolvency, Restructuring and Dissolution Act 2018`
4. Set the "Search by Year" dropdown to the current year
5. Click the search icon / submit the search
6. Wait for results to load
7. Extract all results from the results list. For each result, capture:
   - Case title (the linked text, e.g., "Bryan Lim Jun Da v Interior Times (Conquest) Pte. Ltd.")
   - Citation (e.g., [2026] SGHC 35)
   - Decision date
   - Legal tags (the bracketed category text above each title)
   - Full URL to the judgment
8. **Filter**: Only keep results with decision dates between `DATE_FROM` and `DATE_TO`
9. If there are multiple pages, also check page 2
10. **For each result**: Click into the judgment page and extract the first 2-3 paragraphs of the judgment text to use as source material for the context summary in Step 5

### Step 4: Scrape eGazette.gov.sg

1. Open browser and navigate to: `https://www.egazette.gov.sg/egazette-search/`
2. Locate the search input field
3. Type: `Insolvency, Restructuring and Dissolution Act 2018`
4. Submit the search
5. Wait for results to load
6. Extract all results. For each, capture:
   - Title/description of the gazette notice
   - Publication date
   - Gazette reference number
   - Category (e.g., Advertisements, Government Notifications)
   - PDF link (if available)
7. **Filter**: Only keep results published between `DATE_FROM` and `DATE_TO`
8. If there are multiple pages, check the first 3 pages
9. **For each result**: If a PDF link is available, open it and extract key details (company name, type of notice, relevant section of IRDA 2018 cited, creditor meeting dates if any)

### Step 5: Enrich Each Result with Context & History

For EVERY result from all 3 sources, generate a **brief context summary** (2-4 sentences) covering:

#### For SGX Announcements:
- What the company does (industry, sector, SGX listing details)
- Why this announcement was triggered (financial distress indicators, prior announcements, recent earnings)
- Significance for restructuring/insolvency practitioners (e.g., potential investment opportunity, creditor implications)
- **Source priority**: First check the SGX announcement PDF/attachment for details. If insufficient, use AI knowledge to supplement with publicly known information about the company.

#### For eLitigation Court Judgments:
- Brief factual background of the case (who sued whom, what for)
- The key legal issue and which provision of the Insolvency, Restructuring and Dissolution Act 2018 is engaged
- The court's decision/outcome in one sentence
- Any precedent significance or practical takeaway for restructuring practice
- **Source priority**: First use the judgment text extracted in Step 3.10. If the judgment text is insufficient or unavailable, use AI knowledge to provide context based on the case name, parties, and legal tags.

#### For eGazette Notices:
- What company/entity is involved and what they do
- What type of insolvency/restructuring event this gazette notice relates to (e.g., creditors' voluntary winding up, compulsory winding up order, scheme of arrangement)
- What stage of the process this represents (e.g., notice of meeting, notice of appointment of liquidator, final dissolution)
- Any known background on why the company is being wound up or restructured
- **Source priority**: First use details extracted from the gazette PDF in Step 4.9. If insufficient, use AI knowledge to supplement.

**IMPORTANT**: When using AI knowledge to supplement, clearly mark it as: `[AI-supplemented]`. When information is directly from the source, no marking needed.

### Step 6: Format the Briefing

Compose the briefing using this template:

```
🌅 Good Morning Seth — {TODAY_FULL_DATE}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAILY RESTRUCTURING & INSOLVENCY BRIEFING
Coverage: Last 7 days ({DATE_FROM} to {DATE_TO})

📊 SGX ANNOUNCEMENTS
──────────────────────
{For each SGX result:}
• {Company Name} — {Subcategory}
  {Announcement Title}
  📅 {Date} | 🔗 {URL}
  
  Context: {2-4 sentence context summary from Step 5}

{If no results: "No new announcements in the last 7 days."}

⚖️ eLITIGATION — COURT JUDGMENTS
──────────────────────
{For each eLitigation result:}
• {Citation} — {Case Title}
  Tags: {Tag1}; {Tag2}
  📅 {Decision Date} | 🔗 {URL}
  
  Context: {2-4 sentence context summary from Step 5, including outcome}

{If no results: "No new judgments in the last 7 days."}

📜 GOVERNMENT GAZETTE
──────────────────────
{For each eGazette result:}
• {Title}
  {Category} | {Gazette Reference}
  📅 {Date} | 🔗 {PDF URL}
  
  Context: {2-4 sentence context summary from Step 5}

{If no results: "No new gazette notices in the last 7 days."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Note: Items marked [AI-supplemented] use AI knowledge where source data was insufficient.
Sources: elitigation.sg | egazette.gov.sg | sgx.com
Generated by OpenClaw @ {CURRENT_TIME}
```

### Step 7: Deliver the Briefing

1. **Send via Email**:
   - To: seth@turtleadvisors.com  <!-- UPDATE THIS -->
   - Subject: `🌅 Daily Restructuring Briefing — {DATE_TO}`
   - Body: The formatted briefing from Step 6

2. **Send via Telegram**:
   - Send the formatted briefing to the current chat
   - If the message exceeds 4096 characters, split at section boundaries (📊, ⚖️, 📜)

### Step 8: Error Handling

- If any source fails to scrape, **still deliver the briefing** with available data
- For failed sources, include a note: "⚠️ {Source} scrape failed — check manually"
- If context enrichment fails for a specific item, deliver the item without context and note: "⚠️ Context unavailable"
- Log all errors for debugging

---

## Notes
- eLitigation search is public and does not require login
- SGX website blocks robots.txt but the API endpoint at api.sgx.com is accessible
- eGazette search is JS-rendered; browser automation is required
- The SGX API returns JSON with `{}&&` prefix that must be stripped before parsing
- All times are Singapore Time (SGT, UTC+8)
- AI-supplemented context uses the LLM's knowledge of publicly available information about Singapore-listed companies and legal proceedings. This is clearly labelled and should be verified before relying on it for investment decisions.

## Dependencies
- Browser automation (built into OpenClaw)
- Email skill (configure SMTP or use OpenClaw's built-in email)
- Telegram integration (built into OpenClaw)

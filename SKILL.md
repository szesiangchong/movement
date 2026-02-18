# SG Restructuring Daily Briefing Skill

## Description
Automated daily scraping of Singapore insolvency and restructuring intelligence from 3 sources: eLitigation.sg, eGazette.gov.sg, and SGX company announcements. Each result is enriched with a 2-4 sentence context summary using source data and AI supplementation. Delivers via email and Telegram.

## Trigger
- Cron: `0 8 * * 1-5` (8:00 AM SGT, Monday to Friday)
- Manual: User says "good morning", "briefing", or "restructuring update"

## Sources

### 1. eLitigation.sg — Court Judgments
- **URL**: `https://www.elitigation.sg/gd/Home/Index`
- **Search term**: `Insolvency, Restructuring and Dissolution Act 2018`
- **Filter**: Last 7 days rolling
- **No login required**
- **Enrichment**: Extracts judgment text for context; supplements with AI knowledge

### 2. eGazette.gov.sg — Government Gazette
- **URL**: `https://www.egazette.gov.sg/egazette-search/`
- **Search term**: `Insolvency, Restructuring and Dissolution Act 2018`
- **Filter**: Last 7 days rolling
- **Enrichment**: Extracts PDF content for context; supplements with AI knowledge

### 3. SGX Company Announcements
- **URL**: `https://www.sgx.com/securities/company-announcements`
- **API Base**: `https://api.sgx.com/announcements/v1.0/`
- **Announcement filters**: Court Meeting, ESGM, Notice of Consecutive 3 year losses
- **Corporate Action filters**: Corporate Debt Restructuring, Exchange Offer/Capital Reorganisation, Other Scheme of Arrangement
- **Filter**: Last 7 days rolling
- **Enrichment**: Checks announcement attachments; supplements with AI knowledge of listed companies

## Delivery
- **Email**: Send via configured SMTP
- **Telegram**: Send to configured chat

## Output
Each item includes:
- Source data (title, date, category, URL)
- 2-4 sentence context summary (labelled `[AI-supplemented]` when not from source)

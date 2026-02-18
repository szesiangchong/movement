# Setup Guide: SG Restructuring Daily Briefing on OpenClaw

## What You Get
Every weekday at 8AM SGT, OpenClaw will:
1. Scrape SGX for restructuring-related announcements
2. Scrape eLitigation.sg for recent IRDA 2018 court judgments
3. Scrape eGazette.gov.sg for insolvency-related gazette notices
4. **Enrich each result** with a 2-4 sentence context summary (from source data + AI supplementation)
5. Send a formatted briefing to your email AND Telegram

## Files in This Package

| File | Purpose |
|------|---------|
| `SKILL.md` | OpenClaw skill metadata/description |
| `skill-markdown.md` | **USE THIS** — Markdown-based skill (OpenClaw's native format) |
| `README.md` | This file — setup, security, and troubleshooting |

## Installation Steps

### 1. Copy the skill to OpenClaw
```bash
cp -r sg-restructuring-briefing/ ~/.openclaw/skills/sg-restructuring-briefing/
```

Or tell OpenClaw directly via Telegram:
> "Create a new skill from this file" and paste the contents of `skill-markdown.md`

### 2. Update Configuration
In `skill-markdown.md`, update:
- `seth@turtleadvisors.com` → your actual work email
- Verify your Telegram chat ID is configured in OpenClaw

### 3. Configure Email
In OpenClaw settings, ensure SMTP is configured:
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-app-password
```

### 4. Test the Skill
Send OpenClaw a message via Telegram:
> "Run the restructuring briefing now"

### 5. Verify Cron Schedule
Confirm in OpenClaw that cron jobs are enabled and timezone is `Asia/Singapore`.

---

## ⚠️ Email to Work Email — Security Considerations

### Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Corporate email filters / spam blocking** | Medium | Automated emails from personal SMTP may be flagged by your company's spam filter, especially if the sender domain doesn't match your org |
| **IT policy violation** | Medium-High | Many companies prohibit automated external tools from sending to corporate mailboxes. Check with your IT team. |
| **Data leakage vector** | Low | The briefing contains only publicly available data. However, if OpenClaw is compromised, a bad actor could use the SMTP credentials to send malicious emails to your corporate network |
| **SMTP credentials exposure** | Medium | Your email credentials are stored in OpenClaw's config on your Mac Mini. If the machine is compromised, credentials are exposed |
| **Prompt injection via scraped content** | Low-Medium | Malicious content on scraped websites could theoretically be injected into the email body. OpenClaw processes web content through the LLM, which could be manipulated |
| **Phishing risk to colleagues** | Low | If others see these automated emails and the format is mimicked, it could be used for social engineering |

### Recommendations

**Safest approach — use a dedicated sender:**
1. Create a separate email account (e.g., `briefing@yourdomain.com` or a free Gmail) as the SMTP sender
2. Set up a mail rule in Outlook to auto-sort emails from this sender into a "Briefings" folder
3. This isolates the SMTP credentials from your main work account

**If sending directly to work email:**
1. **Check IT policy first** — Ask your IT admin if automated external emails are permitted. Some orgs whitelist specific senders.
2. **Use App Passwords** — Never store your main password. Use MS365 App Passwords or OAuth tokens.
3. **Add SPF/DKIM if using custom domain** — Prevents your emails from being flagged as spam.
4. **Set up a mail rule** — Auto-sort briefing emails so they don't clutter your inbox or get confused with legitimate correspondence.

**Alternative: Skip email, use Telegram only:**
- Telegram delivery avoids all corporate email risks entirely
- You still get the briefing on your phone/desktop
- If you need it in email form, forward specific briefings manually

**Alternative: Send to personal email, then forward:**
- OpenClaw sends to your personal Gmail/Outlook
- Set up auto-forward rule to your work email
- This adds a layer of separation

### Docker Security (Already in Place)
Since you're running OpenClaw in Docker on your Mac Mini, you already have:
- Process isolation from your host system
- SMTP credentials contained within the container
- No direct access to your personal files/apps

### Additional Hardening
- **Rotate SMTP credentials** periodically
- **Monitor sent emails** — check your sent folder for unexpected messages
- **Restrict OpenClaw's SMTP skill** — if possible, limit the "to" addresses it can send to (just your email)
- **Keep OpenClaw updated** — especially given the project is transitioning to an OpenAI foundation, watch for security patches

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| SGX API returns no data | API format may have changed. The skill falls back to browser scraping. |
| eLitigation returns 0 results | Site HTML may have changed. Ask OpenClaw to inspect and update. |
| eGazette times out | JS-heavy site. Increase browser timeout. |
| Email not sending | Check SMTP credentials. Test with: "Send me a test email" |
| Email goes to spam | Add sender to safe senders list. Check SPF/DKIM. |
| Context summaries missing | LLM may not have knowledge of a specific company. Will show "Context unavailable". |
| AI context is inaccurate | AI supplementation is based on training data and may be outdated. Always verify before acting on it. |

## Customization

### Change delivery time
- `0 7 * * 1-5` → 7AM weekdays
- `0 8 * * *` → 8AM every day including weekends
- `0 8,17 * * 1-5` → 8AM and 5PM weekdays (morning + evening edition)

### Add watchlist companies
Add to Step 6 formatting:
```
### 💡 Watchlist Flag
Highlight if any results involve: [Company A], [Company B], etc.
```

### Disable AI supplementation
Remove Step 5 and the context sections from the template if you only want raw scraped data.

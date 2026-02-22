# Candor — Product Requirements Document
**Version 1.0 | Status: Pre-Production**
**Stack: React + Vite · Supabase · GPT-4o**

---

## 1. Product Overview

Candor is a candidate experience automation platform for companies hiring at 20–200 person scale. It plugs into existing ATS tools, monitors candidate pipeline health, auto-generates personalized rejection communications, and builds a living talent bank of warm candidates for future re-engagement.

**Core promise:** Every person who applies to your company walks away feeling respected — whether they got the job or not.

**Primary users:** Talent Acquisition leads, HR managers, and founders who run hiring themselves.

**Pricing model:** $99/mo (Starter, up to 3 active roles) · $249/mo (Growth, unlimited roles) · $499/mo (Scale, multi-seat + talent bank cross-search)

---

## 2. Goals & Success Metrics

| Goal | Metric | Target at 90 days |
|---|---|---|
| Activation | Companies connecting ATS within 7 days of signup | 60% |
| Core value delivery | Rejection emails sent per active account per month | 20+ |
| Retention | MRR churn | <5% monthly |
| Brand proof | Avg Glassdoor improvement after 60 days | +0.4 stars |
| Talent bank | Candidates re-engaged per company per quarter | 3+ |

---

## 3. User Personas

**Primary — The Scaling Founder**
Running hiring themselves, 5–15 open roles, no dedicated recruiter. Drowning in applicants. Has been publicly called out on LinkedIn for ghosting candidates. Wants to look professional without spending hours on admin.

**Secondary — The Solo TA Lead**
First HR hire at a Series A company. Managing 3 hiring managers. Needs systematic process so nothing falls through the cracks. Cares about employer brand metrics.

**Tertiary — The Agency Recruiter**
Manages hiring for multiple clients. Needs white-label-friendly output, bulk status management, and talent bank access across clients.

---

## 4. User Flows

### 4.1 Onboarding Flow
1. User lands on marketing page → clicks "Start Free Trial"
2. Signs up with work email (Supabase Auth)
3. Connects ATS via OAuth (Greenhouse, Lever, Ashby, Workable) or CSV upload fallback
4. Selects company tone: Professional / Warm & Direct / Casual
5. Pastes in 3 sample rejection emails they've written before (voice calibration)
6. Reviews generated voice profile — can edit or approve
7. Sets notification preferences (email digest, Slack, in-app)
8. Dashboard loads with live candidate pipeline pulled from ATS

### 4.2 Rejection Flow
1. Candidate is marked rejected in ATS (webhook) or goes 10 days without status change (cron job detects)
2. Candor generates a draft rejection email — role-specific, resume-aware, written in company voice
3. If confidence score ≥ 0.80: email queues for send after a 2-hour human review window
4. If confidence score < 0.80: email flags in dashboard as "Needs Review" — user edits and approves manually
5. Email sends via connected Gmail/Outlook or Candor's own transactional email
6. Candidate added to talent bank with tags: role applied for, skills, rejection reason, date

### 4.3 Talent Bank Re-engagement Flow
1. Hiring manager opens a new role
2. Candor surfaces talent bank matches: "7 candidates from past roles match this JD"
3. Hiring manager reviews profiles, selects candidates to re-engage
4. Candor drafts personalized re-engagement email referencing their original application
5. Candidate responds → thread handed off to hiring manager in their inbox

### 4.4 Candidate Status Nudge Flow
1. Candidate is in active pipeline with no status change for 7 days
2. Candor auto-sends "still reviewing" message in company voice
3. Message logged in dashboard — hiring manager sees it happened
4. If no update after 14 more days → escalation alert to hiring manager

---

## 5. Screens & Features

---

### Screen 1 — Marketing / Landing Page

**Purpose:** Convert visitors into trial signups.

**Above the fold:**
- Headline: *"Your ATS tracks candidates. Candor respects them."*
- Subheadline: 1-sentence value prop
- CTA: "Start Free Trial — no credit card"
- Social proof strip: logos of companies using Candor + Glassdoor improvement stat

**Below the fold:**
- Problem section: stat on candidate ghosting + Glassdoor impact
- How it works: 3-step visual (Connect ATS → Set voice → Candor runs)
- Candor Score badge mockup — what it looks like on a careers page
- Pricing table
- FAQ

---

### Screen 2 — Signup & Auth

**Fields:** Work email, password
**Options:** Google OAuth, LinkedIn OAuth
**Post-signup:** Email verification → redirects to onboarding step 1
**Supabase:** Auth handled via Supabase Auth, user row created in `users` table on verification

---

### Screen 3 — Onboarding: ATS Connection

**Header:** "Connect your hiring tool"
**Options displayed as cards:**
- Greenhouse
- Lever
- Ashby
- Workable
- BambooHR
- CSV Upload (fallback)

Each card has an OAuth "Connect" button. On success, shows green checkmark and pulls in live role list. CSV upload accepts standard export format with column mapping step.

**Skip option:** "I'll connect later" — lands on dashboard in demo mode with sample data

---

### Screen 4 — Onboarding: Voice Calibration

**Header:** "Let's learn how you communicate"

**Step A — Tone selector:**
Three cards with sample rejection sentence previews:
- Professional: *"We appreciate your interest and have decided to move forward with other candidates."*
- Warm & Direct: *"We really appreciated your application — this one wasn't the right fit, but here's why."*
- Casual: *"Hey — thanks so much for applying. We ended up going a different direction this time."*

**Step B — Sample paste:**
Text area: "Paste 1–3 rejection emails you've sent before (optional but recommended)"
Small helper text: "We use these to match your natural style — not stored beyond calibration"

**Step C — Preview:**
Shows a generated sample rejection for a fictional candidate using selected tone + pasted samples. User can regenerate or proceed.

---

### Screen 5 — Main Dashboard

**Layout:** Left sidebar nav + main content area

**Sidebar nav items:**
- Dashboard (home)
- Pipeline
- Talent Bank
- Candor Score
- Settings

**Main content — Dashboard home:**

Top row — 4 stat cards:
- Emails sent this month
- Avg response time to candidate
- Candidates in talent bank
- Current Candor Score (0–100)

Middle section — "Needs Your Attention":
Cards for flagged items: emails pending review, candidates overdue for status update, re-engagement suggestions

Bottom section — "Recent Activity":
Timeline feed of actions: email sent, candidate added to talent bank, status nudge sent

---

### Screen 6 — Pipeline View

**Layout:** Kanban-style columns matching ATS stages (Applied, Screening, Interview, Offer, Rejected, Archived)

**Each candidate card shows:**
- Name, role applied for
- Days in current stage
- Status indicator: green (active), yellow (no update 7+ days), red (no update 14+ days)
- Quick action buttons: View Draft Email · Mark Rejected · Snooze

**Filters:** By role, by stage, by flag status, by date range

**Bulk actions:** Select multiple candidates → bulk reject → Candor generates individual emails for each (not one mass email)

**Candidate detail panel (right slide-in):**
- Resume preview
- Application date + timeline
- All communications sent via Candor
- Notes field (internal only)
- Talent bank tags
- "Override and edit email" button if email is queued

---

### Screen 7 — Email Draft Review

**Triggered when:** Email is queued for send and user clicks review, OR confidence score flagged it

**Layout:**
- Left: candidate profile summary (name, role, key resume points)
- Right: draft email with inline edit capability

**Draft email shows:**
- Subject line
- Body (editable rich text)
- Tone indicator badge
- Confidence score with explanation: "Why this was flagged: ambiguous rejection reason, multiple roles mentioned"

**Actions:**
- Approve & Send (sends immediately)
- Edit & Send (user edits inline → sends)
- Regenerate (AI generates alternative)
- Discard (removes from queue, marks candidate as manually handled)

**Timer:** If no action in 24 hours, escalation email goes to user

---

### Screen 8 — Talent Bank

**Header:** "Your warm candidate network"
**Subheader:** running count of total candidates

**Search bar:** Full-text search across skills, roles, notes, tags

**Filter panel (left):**
- Skills tags (auto-extracted from resumes)
- Original role applied for
- Date added
- Re-engagement status: Not contacted · Contacted · Responded · Hired

**Candidate cards in grid:**
- Name + avatar initial
- Skills tags (top 3)
- Original role + date
- Re-engagement status badge
- "Re-engage" button

**Re-engage modal:**
- Triggered by button click
- Shows matched open roles (if any connected)
- Draft re-engagement email pre-written: references original application, specific skills, new role
- User approves or edits → sends

**Empty state:** Clear illustration + explanation of how candidates enter the bank — shown to new users before first rejection is processed

---

### Screen 9 — Candor Score

**Header:** Your Candor Score: [0–100] with color ring (red/yellow/green)

**Score breakdown — 4 sub-scores:**
- Response Speed: avg time from application to first reply
- Rejection Quality: rated by AI on specificity and warmth (not by candidates)
- Follow-through Rate: % of active candidates who received at least one status update
- Re-engagement Rate: % of talent bank candidates contacted within 90 days

**Historical chart:** Score over last 6 months

**Benchmark comparison:** "Your score vs companies your size" (anonymized aggregate)

**Candor Badge section:**
- Preview of badge widget for careers page
- Copy embed code button
- Toggle: Public badge on / off
- Badge shows: Candor Score + "Responds to every applicant" + verified checkmark

---

### Screen 10 — Settings

**Tabs:**

**General:**
- Company name, logo, website
- Default sender name and email
- Timezone

**ATS Integration:**
- Connected tools with status
- Reconnect / disconnect
- Field mapping overrides (which ATS field = rejection trigger)

**Voice & Tone:**
- Re-run voice calibration
- Manual override: add custom phrases to always include / never include
- Preview current voice profile in plain English

**Notifications:**
- Email digest: daily / weekly / off
- Slack integration: webhook URL
- Escalation threshold: hours before overdue item alerts fire

**Team (Growth + Scale plans):**
- Invite team members
- Role assignment: Admin / Reviewer / View-only

**Billing:**
- Current plan, next billing date
- Upgrade / downgrade
- Invoice history

---

## 6. Data Model (Supabase Tables)

| Table | Key fields |
|---|---|
| `users` | id, email, company_id, role, created_at |
| `companies` | id, name, ats_type, voice_profile (json), candor_score, plan |
| `candidates` | id, company_id, name, email, role_applied, status, ats_id, resume_url, tags (array), added_to_talent_bank |
| `communications` | id, candidate_id, type (rejection/nudge/reengagement), body, sent_at, confidence_score, reviewed_by |
| `roles` | id, company_id, title, jd_text, status (open/closed), ats_role_id |
| `talent_bank_matches` | id, candidate_id, role_id, match_score, suggested_at, actioned |
| `score_snapshots` | id, company_id, overall_score, speed_score, quality_score, followthrough_score, reengage_score, recorded_at |

---

## 7. Integration Architecture

**ATS webhooks (inbound):**
Greenhouse, Lever, Ashby all support webhooks on candidate stage change. Candor registers a webhook endpoint per company on ATS connection. Payload is normalized into Candor's candidate schema on receipt.

**Email delivery (outbound):**
Primary: user's connected Gmail or Outlook via OAuth (sent from their address — highest deliverability, feels personal)
Fallback: Resend transactional email from a Candor-managed domain

**Resume parsing:**
PDF/DOCX resumes stored in Supabase Storage. Parsed via GPT-4o vision on upload — extracts skills, experience level, role history as structured JSON stored on candidate record.

---

## 8. Non-Functional Requirements

**Performance:** Dashboard loads in under 2 seconds. Email generation completes in under 8 seconds.

**Security:** All candidate PII encrypted at rest in Supabase. ATS OAuth tokens stored encrypted. GDPR-compliant: candidate data deletion available on request. No candidate data used for cross-company training.

**Reliability:** Email generation has a retry mechanism — if GPT call fails, queues for retry within 30 minutes. Candidate never falls through without notification to the hiring team.

**Accessibility:** WCAG 2.1 AA compliant. Keyboard navigable dashboard.

---

## 9. Launch Scope (MVP vs Full)

| Feature | MVP (Week 1–4) | Full (Month 2–3) |
|---|---|---|
| ATS connection | CSV upload + Greenhouse only | All 5 ATS integrations |
| Email generation | Rejection emails only | Nudges + re-engagement |
| Voice calibration | Tone selector + sample paste | Full voice fingerprinting |
| Talent bank | Basic list + tags | Search + match scoring |
| Candor Score | Display only | Full breakdown + badge |
| Team seats | Single user | Multi-seat |
| Slack integration | No | Yes |

---

## 10. Out of Scope (v1)

- Native mobile app
- Candidate-facing portal or self-service feedback
- Video interview tooling
- Payroll or HRIS integration
- AI phone screening
- White-label mode for agencies (v2)

---

*Document owner: Founding team | Next review: Before development kickoff*
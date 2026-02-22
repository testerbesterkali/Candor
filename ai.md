# Candor — AI Architecture Document
**Version 1.0 | Status: Pre-Production**

---

## 1. Overview

Candor's AI layer has one job: generate rejection and re-engagement emails that sound like a specific human wrote them — not a chatbot, not a template, and not a legal department.

This document covers every AI system inside Candor: how data flows in, how the voice model is built, how emails are generated, how confidence is scored, and how the system improves over time.

---

## 2. System Map

```
ATS Webhook / CSV
      ↓
Candidate Ingestion & Normalization
      ↓
Resume Parser (GPT-4o Vision)
      ↓
Intent Classifier
      ↓
Knowledge Retrieval (RAG — Supabase pgvector)
      ↓
Voice-Constrained Email Generator (GPT-4o)
      ↓
Confidence Scorer
      ↓
Route: Auto-Send OR Human Review Queue
      ↓
Feedback Loop → Voice Profile Refinement
```

---

## 3. Component 1 — Voice Profile Builder

### Purpose
Extract how a specific person writes so that generated emails match their natural style, not generic AI output.

### Inputs
- Tone selector choice (Professional / Warm & Direct / Casual)
- Pasted sample emails (1–3 past rejection emails the user wrote themselves)
- Optional: Gmail / Outlook OAuth to pull sent email samples matching recruitment context

### Extraction Process
A single GPT-4o call analyzes the sample inputs and produces a structured Voice Profile JSON. The extraction prompt instructs the model to identify and document the following dimensions:

**Structural patterns**
How long are typical messages? Does the person use paragraph breaks or write in one block? Do they use lists or run everything into prose?

**Lexical patterns**
What filler and transition phrases appear repeatedly? What words or phrases are conspicuously absent? Do they use contractions? Do they write "we" (company voice) or "I" (personal voice)?

**Tonal patterns**
Is the warmth index high (many softening phrases, apologies, encouragement) or low (direct, efficient, no fluff)? How is bad news framed — buried or upfront?

**Sales/closing patterns**
Do they end with an open door ("feel free to reach out") or a firm close ("we wish you well")? Do they offer any explanation for the decision or stay vague?

**Punctuation & formatting habits**
Exclamation point frequency. Ellipsis usage. Em dash vs comma. All caps for emphasis? Emoji? Sign-off style.

### Output
A Voice Profile JSON object stored on the `companies` table. Example structure (not exhaustive):

```
tone_class: "warm_direct"
avg_length_words: 95
uses_contractions: true
opener_pattern: "Hi [first name],"
signature_phrases: ["really appreciate", "went a different direction", "keep you in mind"]
avoid_phrases: ["unfortunately", "we regret to inform", "at this time"]
explanation_style: "specific" | "vague" | "partial"
closes_with_open_door: true
emoji_usage: "none" | "light" | "moderate"
sign_off: "Best,"
```

### Fallback
If insufficient sample data is provided (fewer than 100 words of samples), the system falls back to a default profile for the selected tone class. The user is notified and encouraged to add samples for better accuracy.

---

## 4. Component 2 — Resume Parser

### Purpose
Extract structured candidate data from uploaded or ATS-linked resumes so the email generator can reference specific, accurate details about the candidate.

### Inputs
- PDF or DOCX resume file (stored in Supabase Storage)
- Role the candidate applied for (from ATS or manual entry)

### Process
GPT-4o vision processes the resume document and extracts:

- Top 5 skills (technical and soft)
- Most recent role title and company
- Total years of experience (estimated)
- Highest education level
- Any gaps or notable career transitions
- Alignment score: how closely does this background match the job description (0–1 float)
- Key mismatch: the single most important reason this candidate is not a fit for this specific role

The alignment score and key mismatch field are the two most critical outputs — they feed directly into the rejection email generator to produce specific, honest reasoning rather than generic boilerplate.

### Storage
Parsed output stored as JSON on the `candidates` table. Resume file retained in Supabase Storage for 12 months unless company requests deletion.

---

## 5. Component 3 — Intent Classifier

### Purpose
Determine what type of communication Candor needs to generate before invoking the full email generator.

### Inputs
- Trigger type: rejection, nudge, re-engagement
- Candidate stage history
- Days since last communication
- Any incoming reply from the candidate (if applicable)

### Classification outputs
- **rejection_standard:** Candidate rejected, no unusual context
- **rejection_internal_fill:** Role was filled internally — requires special framing
- **rejection_overqualified:** Candidate clearly overqualified — requires careful tone
- **nudge_still_reviewing:** Active candidate, no update in 7 days
- **nudge_timeline_delay:** Process delayed, candidate needs specific update
- **reengagement_new_role:** Past candidate being invited to apply to new opening
- **reengagement_pipeline_refresh:** Past candidate being checked in on after long gap
- **escalate_to_human:** Candidate has expressed frustration, threatened to post publicly, or situation is ambiguous enough that AI should not respond

The classification result changes which system prompt variant and which knowledge chunks are retrieved in the next step.

---

## 6. Component 4 — Knowledge Retrieval (RAG Layer)

### Purpose
Give the email generator accurate, company-specific facts so it never hallucinates benefits, timelines, processes, or hiring details.

### Knowledge store contents
Each company's knowledge store contains:

- All open and closed role descriptions
- Company-level FAQ (onboarding timeline, process steps, re-application policy)
- Hard rules set by the company ("never mention salary ranges in rejection emails", "always mention we keep candidates on file for 6 months")
- Historical rejection emails that received positive replies from candidates (used as quality examples)
- Blackout rules: topics the AI should never address (legal disputes, layoffs, internal restructuring)

### Storage
Embedded using OpenAI text-embedding-3-small. Stored in Supabase pgvector. Separate namespace per company — zero data bleed between companies.

### Retrieval
On each email generation request, the top 4 most semantically relevant chunks are retrieved using cosine similarity against a query composed of: intent classification + candidate role + key mismatch field from resume parsing.

Retrieved chunks are injected into the system prompt context window before generation.

---

## 7. Component 5 — Voice-Constrained Email Generator

### Purpose
Generate the final email draft — personalized, specific, and written in the company's voice.

### System prompt architecture
The system prompt is assembled dynamically for each generation request from four layers:

**Layer 1 — Role instruction**
Tells the model it is a candidate communications specialist generating an email on behalf of a specific company. Instructs it to write as if it is a human hiring manager at that company. Explicit instruction: never sound like AI, never use corporate filler phrases, never be vague when specific information is available.

**Layer 2 — Voice profile injection**
The full Voice Profile JSON is converted to plain English instructions. Example: "This person always uses contractions. They open with 'Hi [first name],' never 'Dear.' They close with 'Best,' not 'Regards.' They never say 'unfortunately.' They typically explain the specific reason for rejection in one sentence."

**Layer 3 — Knowledge context injection**
The 4 retrieved RAG chunks. May include the job description, company re-application policy, or a high-quality example rejection from this company's history.

**Layer 4 — Candidate-specific instruction**
Name, role applied for, key mismatch extracted from resume parser, alignment score, intent classification result, any special flags from the classifier (overqualified, internal fill, etc.).

**Final instruction line**
"Write the email now. Keep it under 120 words unless the situation requires more. Be specific. Be kind. Do not sound like AI."

### Generation parameters
- Model: GPT-4o
- Temperature: 0.4 (low enough for consistency, high enough for natural variation)
- Max tokens: 400
- Stop sequence: none

### Output
Raw email draft (subject line + body). Passed immediately to confidence scorer before being stored or queued.

---

## 8. Component 6 — Confidence Scorer

### Purpose
Decide whether a generated email is safe to auto-send or needs human review before it goes out.

### Scoring dimensions (each 0–1, weighted average)

**Specificity score (weight: 0.35)**
Does the email contain at least one candidate-specific detail beyond their name and role title? Checked by a secondary GPT-4o mini call that reads the email and answers: "Is there a specific reason for rejection mentioned that references this candidate's background?" Binary pass/fail converted to 0 or 1.

**Voice match score (weight: 0.30)**
Cosine similarity between the embedding of the generated email and the embedding of the user's sample emails. Scores below 0.65 indicate the generated email drifted significantly from the company's natural voice.

**Safety check score (weight: 0.25)**
A lightweight GPT-4o mini classification call checks for: legal risk language (promises of future employment, anything that could be construed as discriminatory), tone flags (passive aggressive, dismissive, inappropriately familiar), or mentions of blacklisted topics. Pass = 1.0, any flag = 0.0 (auto-escalates regardless of other scores).

**Length appropriateness score (weight: 0.10)**
Word count between 60–160 = 1.0. Under 60 = 0.5 (too brief, may feel dismissive). Over 200 = 0.5 (too long for a rejection). Hard fail at under 30 or over 300 words.

### Routing logic
- Weighted average ≥ 0.80: Email queued for auto-send after 2-hour window (allows manual override)
- Weighted average 0.60–0.79: Email placed in "Needs Review" queue with score breakdown and explanation shown to user
- Weighted average < 0.60 OR any safety flag: Email held, escalation notification sent to user immediately

---

## 9. Component 7 — Talent Bank Matching Engine

### Purpose
Surface relevant past candidates when a new role opens, before the company posts publicly.

### How candidates enter the bank
Every rejected candidate is automatically added to the talent bank on rejection with:
- Extracted skills tags from resume parser
- Role applied for
- Rejection reason category (experience gap, role filled, overqualified, culture fit)
- Date
- Re-engagement status: dormant

### Matching process
When a new role is created or activated, the matching engine runs:

1. Embeds the new job description using text-embedding-3-small
2. Compares against all dormant talent bank candidates' resume embeddings using cosine similarity
3. Returns ranked list of candidates with match score ≥ 0.70
4. Filters out: candidates who have already been re-engaged for this role, candidates who explicitly opted out, candidates rejected less than 30 days ago (too soon)
5. Surfaces top 10 matches in the "Re-engage" panel on the Roles screen

### Re-engagement draft generation
When a hiring manager selects a candidate to re-engage, the generator uses a dedicated system prompt variant that:
- References the candidate's original application by date and role
- Names the specific skills that make them a fit for the new role
- Explains what changed (new role, different requirements)
- Keeps the tone warm and opt-in: this is an invitation, not a pressure

---

## 10. Feedback Loop & Model Improvement

### How the system learns

**Explicit feedback**
When a user edits a draft before sending, the original draft and the edited version are stored as a training pair on the `communications` table. A nightly job processes new pairs and extracts delta patterns: what phrases did the user remove, add, or rewrite? These are folded back into the Voice Profile as refinements.

**Implicit feedback**
If a candidate replies positively to a rejection email (reply contains words like "thanks", "appreciate", "understand", "keep me in mind"), that email is flagged as a high-quality example and added to the RAG knowledge store as a positive exemplar for that company.

If a candidate replies negatively or escalates (reply contains frustration signals), the email is flagged for human review, removed from the exemplar pool, and a pattern note is added to the company's Voice Profile blacklist.

**Weekly voice drift check**
A weekly cron job compares the last 10 sent emails against the original voice calibration samples. If cosine similarity has drifted below 0.60, the system sends a notification to the user: "Your Candor emails may be drifting from your voice. Review and recalibrate?"

### What is never used for training
- Candidate PII or resume content
- Any data across company boundaries
- Communications from companies that have opted out of improvement features (toggle in Settings)

---

## 11. AI Failure Handling

| Failure scenario | Response |
|---|---|
| GPT-4o API timeout | Retry after 5 minutes, then 30 minutes. After 3 failures, notify user and mark as "Manual send required" |
| Resume parse fails | Candidate added with empty skills tags, email generated without resume-specific details, confidence score auto-caps at 0.70 (goes to review queue) |
| Voice profile missing | Falls back to selected tone class defaults. User notified on next login. |
| RAG retrieval returns no results | Email generates without knowledge context. Confidence score penalized by 0.10. |
| Safety flag triggered | Email never queued. Hard escalation to user with explanation of flag reason. No email sent until user manually approves an edited version. |
| Candidate email address invalid | Communication stored as draft, delivery failure logged, user notified in dashboard |

---

## 12. AI Stack Summary

| Component | Tool / Model |
|---|---|
| Voice profile extraction | GPT-4o |
| Resume parsing | GPT-4o (vision) |
| Intent classification | GPT-4o mini |
| Text embedding | OpenAI text-embedding-3-small |
| Vector store | Supabase pgvector |
| Email generation | GPT-4o |
| Confidence scoring — specificity check | GPT-4o mini |
| Confidence scoring — safety check | GPT-4o mini |
| Candidate matching | Cosine similarity on pgvector |
| Feedback processing | GPT-4o (nightly batch) |

---

## 13. Cost Estimation Per Company Per Month

Based on a company with 3 active roles, 60 applicants per month, 45 rejections, 10 nudges, 5 re-engagements.

| Operation | Volume | Est. cost |
|---|---|---|
| Resume parsing | 60 | ~$0.18 |
| Intent classification | 60 | ~$0.03 |
| RAG embedding (candidates) | 60 | ~$0.01 |
| Email generation | 60 | ~$0.30 |
| Confidence scoring (2 calls each) | 120 | ~$0.06 |
| Feedback processing (nightly) | 30 | ~$0.04 |
| **Total per company per month** | | **~$0.62** |

At $99/month revenue per company, AI cost is under 1% of revenue. Margin is healthy at scale.

---

*Document owner: Founding team / AI Lead | Next review: Before first integration test*
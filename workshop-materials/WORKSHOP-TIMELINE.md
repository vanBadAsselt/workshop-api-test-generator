# Workshop Timeline - 90 Minutes

## Overview
AI-Assisted API Test Generation Workshop

**Total Duration:** 90 minutes  
**Format:** Interactive, hands-on  
**Prerequisites:** 5-10 min before workshop (see PREREQUISITES.md)

---

## Detailed Schedule

### 0:00 - 0:15 | Introduction & Setup (15 min)
- **0:00-0:05** Teaser: "Steal tests from the browser"
  - Who creates API tests? Show of hands
  - The Choco challenge (migration + velocity + capacity)
- **0:05-0:08** Live Demo
  - Capture HAR → Extract → Generate → Run test ✅
  - "This isn't magic - you'll build it today"
- **0:08-0:11** Context setting
  - GraphQL quick overview
  - HAR files explained
  - K6 (but concepts apply to any tool)
- **0:11-0:12** Disclaimers
  - Not a silver bullet
  - Concepts over tools
  - Intermediate level, team up if needed
- **0:12-0:15** Environment check
  - Mentimeter poll (optional if time)
  - "Is localhost:3000 working?"

**Key Message:** "Steal the data, not the tests. Let's be smart about AI."

*See WORKSHOP-INTRO.md for full script*

---

### 0:15 - 0:35 | Assignment 1: Test Generation (20 min)

**0:15-0:17** Briefing (2 min)
- "Let's try the obvious approach: give AI everything"
- Explain HAR capture steps

**0:17-0:21** Hands-on: Capture HAR (4 min)
- Participants capture their own HAR
- OR use provided `assignment-1-capture.har`

**0:21-0:29** Hands-on: Generate with AI (8 min)
- Upload to ChatGPT/Claude
- Paste prompt
- Save generated test
- Try to run it

**0:29-0:35** Group Debrief (6 min)
- 🙋 "Who got a working test?" (show of hands)
- 🙋 "Who got a broken test?"
- 💡 Discuss: tokens (~500k), privacy, cost, instability
- **Key Insight:** Brute force works sometimes, but isn't scalable

**Transition:** "Let's be smarter about this..."

---

### 0:35 - 0:65 | Assignment 2: Smart Extraction (30 min)

**0:35-0:38** Briefing (3 min)
- **Recap Assignment 1:** 500k tokens, privacy issues, inconsistent
- "Instead of sending everything, let's extract what we need"
- **Key insight:** "A call is just data - extract it, then let AI focus on creative parts"
- Show the extraction → generation workflow

**0:38-0:48** Hands-on: Manual Extraction (10 min)
- Ask AI to extract ONE operation from HAR
- See the token difference
- Generate test from extracted JSON
- Compare with Assignment 1

**0:48-0:58** Hands-on: Script the Extraction (10 min)
- Use (or create) extraction script
- Run extraction script on HAR
- Generate test from output
- Test it!

**0:58-0:65** Group Debrief (7 min)
- Compare approaches (table on slides)
- Discuss: What should be scripted? What needs AI?
- **Key Insight:** Deterministic parsing = scripts, Creative logic = AI

**Transition:** "Now let's add structure..."

---

### 0:65 - 0:85 | Assignment 3: Structuring & Architecture (20 min)

**0:65-0:67** Briefing (2 min)
- **Recap:** "We can extract calls efficiently. But standalone tests don't scale."
- **The question:** "How do we turn extracted calls into a reliable, reusable system?"
- **The answer:** Six-layer modular architecture
- Quick visual walkthrough of the layers (see WORKSHOP-INTRO.md)
- Demo scaffolding generator

**0:67-0:77** Hands-on: Scaffold + Fill (10 min)
- Run scaffolding generator
- Explore generated structure
- Use AI to fill in test logic
- Test it!

**0:77-0:85** Group Debrief (8 min)
- When to scaffold vs. generate everything?
- Benefits of structure
- Bonus discussion: automation script (if anyone tried it)

---

### 0:85 - 0:90 | Wrap-Up & Takeaways (5 min)

**Key Takeaways:**
1. 🎯 **Be intentional** - Define test goals first
2. 🔧 **Script the deterministic** - Parsing, structure, formatting
3. 🤖 **AI for creativity** - Assertions, edge cases, test logic
4. 💰 **Cost matters** - 500k tokens vs 500 tokens
5. 🔒 **Privacy matters** - Don't send everything

**Call to Action:**
- "What will you try first in your own project?"
- "Where can you replace brute force AI with smart extraction?"

**Q&A Buffer:** Remaining time for questions

---

## Backup Plans

### If Running Behind:
- **Skip Assignment 3 Step 3 (Bonus)** - Just discuss conceptually
- **Shorten debriefs** - Hit key points only, save deep discussion for end
- **Use provided files** - Skip capture, use `assignment-1-capture.har`

### If Ahead of Schedule:
- **Deeper dive on Assignment 3 automation**
- **Live coding:** Create extraction script together
- **Challenge:** "Extract SearchCharacters operation"
- **Discussion:** Advanced topics (mocking, data management, CI/CD)

---

## Materials Checklist

**For Participants:**
- [ ] Workshop repo URL
- [ ] Prerequisites completed (Node, k6, app running)
- [ ] AI tool access (ChatGPT/Claude)
- [ ] Browser DevTools knowledge (F12)

**For Instructor:**
- [ ] Demo environment ready
- [ ] Backup HAR file available
- [ ] Example outputs prepared
- [ ] Comparison slides (Assignment 1 vs 2)
- [ ] Debrief discussion prompts

---

## Instructor Notes

### Pacing Tips
- **Watch the clock** - Use a timer, assignments add up quickly
- **Cut Q&A during activities** - "Save questions for debrief"
- **Demo quickly** - "Show, don't explain everything"
- **Have fallbacks** - Provide example outputs if AI is slow

### Common Issues
1. **HAR too large** - Use provided file
2. **AI slow** - Have backup generated tests ready
3. **k6 not working** - Team up participants
4. **Different AI results** - Perfect for discussion!

### Energy Management
- **Assignment 1:** High energy (everyone trying AI)
- **Assignment 2:** Mental work (understanding extraction)
- **Assignment 3:** Hands-on building (re-energize)
- **Keep moving** - Momentum matters in 90 min!

---

## Success Metrics

**Participants should leave with:**
- ✅ Understanding of when to use AI vs scripts
- ✅ Working example of extraction script
- ✅ Practical approach they can apply Monday
- ✅ Appreciation for intentional test design

**Not required:**
- ❌ Complete all bonus challenges
- ❌ Perfect working tests (broken tests teach too!)
- ❌ Deep k6 expertise


# Follow-Along Workshop Strategy (80 people, 90 minutes)

## Core Strategy: Live Coding + Optional Participation

### Philosophy
**"Code together, not alone"** - The instructor codes live while participants follow along at their own pace. Those without working setups can watch, learn, and still get full value.

---

## Execution Model

### Screen Setup
- **Main screen:** Your live coding (large font, high contrast)
- **Side screen/presentation:** Current instructions + expected output
- **Pace:** Deliberately slow with clear narration

### Instructor Workflow
For each assignment:
1. **Brief** (2-3 min): Explain what we're building
2. **Code together** (10-15 min): Type slowly, narrate every step
3. **Checkpoint** (1-2 min): "Does your output look like this?"
4. **Debrief** (5-7 min): Discuss results and insights

### Participant Options
Participants can choose their engagement level:
- 🟢 **Follow along actively** - Type the same commands
- 🟡 **Watch and copy** - Copy-paste provided snippets
- 🔵 **Observer mode** - Watch and learn concepts
- 🟣 **Pair up** - Team with someone who has a working setup

---

## Assignment Adaptations

### Assignment 1: Test Generation (20 min)
**Follow-along approach:**
- **You code live:**
  1. Open browser DevTools (narrate: "F12 or right-click → Inspect")
  2. Capture HAR while interacting with the app
  3. Save HAR file (show where it saves)
  4. Open ChatGPT, upload HAR
  5. Paste prompt (have it ready on screen)
  6. Save output as `generated-test.js`
  7. Run: `k6 run generated-test.js`

- **Participants:**
  - Try to follow along OR
  - Use provided `assignment-1-capture.har` file OR
  - Watch your screen

- **Checkpoint:** "Raise hand if you got output (any output, even errors)"

### Assignment 2: Smart Extraction (30 min)
**Follow-along approach:**
- **Step 1 - Manual extraction (10 min):**
  - You code live: prompt ChatGPT to extract ONE operation
  - Show the JSON output
  - Generate a test from just that JSON
  - Compare token count (500k → 500)

- **Step 2 - Script it (10 min):**
  - Use provided extraction script OR
  - Code it together live:
    ```bash
    node scripts/extract-from-har.js assignment-1-capture.har GetCharacter
    ```
  - Show the extracted JSON
  - Generate test from extracted data
  - Run test

- **Participants:**
  - Run the same commands OR
  - Use provided intermediate files (`extracted-operation.json`) OR
  - Watch and understand the workflow

- **Checkpoint:** "Anyone got a working extraction? Show of hands"

### Assignment 3: Scaffolding (20 min)
**Follow-along approach:**
- **You code live:**
  1. Run scaffolding generator:
     ```bash
     node scripts/generate-test-scaffold.js GetCharacter
     ```
  2. Show the generated folder structure
  3. Open one file at a time, explain each layer
  4. Use AI to fill in test logic
  5. Run the test

- **Participants:**
  - Run the same scaffolding command OR
  - Explore provided pre-generated scaffold OR
  - Follow along conceptually

- **Checkpoint:** "Who can see the six layers? Look at your file tree"

---

## Handling Scale (80 people)

### Before Workshop
1. **Send prep email** with ultra-concise prerequisites (see revised PREREQUISITES.md)
2. **Create backup files** for each assignment:
   - `assignment-1-capture.har`
   - `assignment-2-extracted.json`
   - `assignment-3-scaffold/` (pre-generated)
   - `final-working-test.js`

3. **Test your demo** multiple times - it must work flawlessly

### During Workshop

#### Opening (0:00-0:15)
- **Critical message at 0:11:**
  > "Don't worry if your setup isn't working. This is a **follow-along workshop**. You can:
  > - Watch my screen and learn the concepts
  > - Team up with someone nearby
  > - Use the backup files I've provided
  > - Try it at home later with the recording
  >
  > The goal is to understand the **approach**, not to fight with npm install."

#### Environment Check (0:12-0:15)
- **Quick poll:** "Raise hand if localhost:3000 is working"
- **Don't troubleshoot individually** - note who needs help
- **Reassure:** "If not working, no problem - follow along on my screen"

#### During Assignments
- **Type slowly and narrate:**
  - "Now I'm opening the Network tab..."
  - "I'm going to click this refresh button..."
  - "See the HAR export option? Right here..."

- **Use large font** (terminal: 24pt+, editor: 20pt+)

- **Pause frequently:**
  - "If you're following along, you should see this..."
  - "No rush, take your time..."
  - "If it's not working, use the backup file..."

- **Acknowledge observers:**
  - "For those watching, notice how..."
  - "The key concept here is..."

#### Managing Questions
- **Defer individual issues:** "Let's discuss in the break"
- **Address pattern issues:** If 5+ people have same problem, pause
- **Use helpers:** If available, have 2-3 people walking around

#### Backup Plans
- **If behind schedule:** Skip bonus steps, use pre-generated files
- **If ahead:** Deeper discussion, live Q&A
- **If demo breaks:** Have backup recordings or pre-generated outputs ready

---

## Materials to Prepare

### For Participants (in repo)
- ✅ All backup files in `backup-files/` folder
- ✅ Step-by-step cheat sheet (one page per assignment)
- ✅ Copy-paste commands in a `COMMANDS.md` file
- ✅ Expected outputs as screenshots/files

### For You (instructor)
- ✅ Tested demo environment (fresh install)
- ✅ Backup laptop (in case yours fails)
- ✅ Printed timing guide (laminated, on podium)
- ✅ Large fonts configured
- ✅ All files/tabs/windows pre-organized
- ✅ Timer visible to you (watch or phone)

---

## Success Metrics (Revised)

### Good Outcome (80+ people)
- ✅ 40%+ actively follow along
- ✅ 80%+ understand the concepts (observer or active)
- ✅ 90%+ feel they could try it at home
- ✅ Everyone has the materials to reproduce later

### Not Required
- ❌ Everyone has working setup (impossible with 80 people)
- ❌ Individual troubleshooting (not scalable)
- ❌ Perfect execution from all participants

---

## Key Mantras

**For participants:**
- "Follow along if you can, watch if you can't, learn either way"
- "Broken setups teach lessons too"
- "The code will be on GitHub - try it at home"

**For you:**
- "Narrate everything"
- "Go slower than you think"
- "Show, don't tell"
- "Keep moving - momentum matters"

---

## Post-Workshop

Provide:
1. **Recording** (if permitted/possible)
2. **GitHub repo** with all code + backup files
3. **Completed examples** for each assignment
4. **Follow-up guide:** "Try this at home" checklist
5. **Contact for questions** (Slack/Discord/Email)

This way, those who couldn't follow live can still get full value afterward.

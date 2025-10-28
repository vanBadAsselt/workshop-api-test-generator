# Assignment 3: Structuring & Architecture

## Briefing

In Assignments 1 & 2, we generated standalone tests. But real projects need more than that.

**The Question:** How do we turn extracted API calls into a **reliable, reusable test system**?

**The Answer:** A modular six-layer architecture.

In this assignment, you'll scaffold this structure, then use AI to fill it with actual test logic.

**Time:** ~20 minutes

---

## Step 1: Scaffold Your Test Structure (2 min)

Run the scaffolding generator to create a structured test:

```bash
cd solutions/scaffolding
npx tsx generate.ts <yourName>
```

**Example:**
```bash
npx tsx generate.ts anais
```

### 🔍 Explore the Six-Layer Architecture

Open `api-tests/<yourName>/` and understand the layers:

```
api-tests/<yourName>/
├── 1. main.ts                    # Entry point - loads data & runs scenarios
├── 2. steps/                     # Isolated API calls with assertions (empty)
├── 3. queries/                   # GraphQL query definitions (empty)
├── 4. testdata/                  # Environment-specific variables
│   ├── testdata.ts              # Index
│   └── testdata.prd.ts          # Production data
├── 5. config/                    # Test settings & thresholds
│   └── options.smoke.json       # Smoke test config (1 VU, 1 iteration)
└── 6. helpers/                   # Utilities and type definitions
    ├── types.ts
    └── utils.ts
```

**Key Insight:** 
- **Structure** is scaffolded (layers 1, 4-6)
- **Logic** is missing (layers 2-3) ← This is where you add tests!

**Why this structure?**
- ✅ **Reusability** - Queries used across multiple tests
- ✅ **Maintainability** - One change updates all tests
- ✅ **Environment flexibility** - Swap data by setting `ENV=prd|tst`
- ✅ **Test type flexibility** - Swap config by setting `TEST_TYPE=smoke|load`

---

## Step 2: Add Test Manually with AI (10 min)

Let's fill in the skeleton with a real test.

### 2A: Generate a GraphQL Query File

**Ask AI:**
```
Create a GraphQL queries file for the GetCharacter operation.
Use this query from my captured JSON: [paste query from assignment-2 GetCharacter-capture.json]

Output should be:
- TypeScript file exporting the query as a constant
- File should go in queries/getCharacter.ts
```

**Save output to:** `api-tests/<yourName>/queries/getCharacter.ts`

### 2B: Fill in the Main Test

**Ask AI:**
```
I have a k6 test skeleton at main.ts with this structure: [attach your main.ts]
And GraphQL queries at queries/getCharacter.ts: [attach the file]

Update main.ts to:
1. Import the getCharacter query
2. Make a POST request to the GraphQL endpoint
3. Add meaningful checks for:
   - Status is 200
   - Response has data.getCharacter
   - Character has required fields (id, name, totalPower)
   - Character ID matches the requested ID
```

**Update:** `api-tests/<yourName>/main.ts`

### 2C: Test It!

```bash
k6 run api-tests/<yourName>/main.ts
```

**Does it work?** 🎯

---

## Step 3: Automation (Bonus - 8 min)

**Challenge:** Can you create a script that automates Step 2?

**Prompt for AI:**
```
Create a script that takes:
- Input: A JSON file (from assignment-2 extraction)
- Output: Fills in the scaffolded test structure

The script should:
1. Create queries/<operationName>.ts with the GraphQL query
2. Update main.ts to use the query and add appropriate checks
```

**Time permitting:** Try to run your automation script!

---

## Debriefing Questions

### Structure vs. Logic

| What | Manual/Script | AI |
|------|---------------|-----|
| **Folder structure** | ✅ Script | ❌ |
| **GraphQL query files** | 🤔 ? | 🤔 ? |
| **Test logic & checks** | 🤔 ? | 🤔 ? |

### Discussion Points

- 🎯 **When to scaffold vs. generate everything?**
- 🏗️ **Benefits of structured tests?** (vs. single files)
- 🤖 **What should AI generate?** (creative logic)
- 🔧 **What should scripts do?** (deterministic structure)
- 📦 **Reusability:** How does structure help with multiple tests?

### Real-World Application

- How would this scale to 50+ API operations?
- Where do you draw the line between scaffolding and AI generation?
- What parts of your current test suite could be scaffolded?

---

## What You've Learned

✅ **Scaffolding** creates consistent structure  
✅ **AI** fills in creative test logic  
✅ **Structure** enables code reuse and organization  
✅ **Separation** between structure (scripted) and logic (AI-assisted)  

## Next Steps

Think about your own API testing:
- What structure would help your team?
- Which tests could share queries/steps/utilities?
- How would you balance automation vs. AI generation?

---

## Time Breakdown

- **Step 1:** 2 min (scaffold + explore)
- **Step 2:** 10 min (manual AI-assisted)
- **Step 3:** 8 min (bonus automation)
- **Buffer:** Helps if AI is slow or needs iterations

**Total:** ~20 minutes active work


# Assignment 3: Modular Architecture

## Intro: The Six-Layer Architecture

Now that we can extract real API calls, the question is: **How do we turn that into a reliable, reusable test system?**

In Assignments 1 & 2, we saw the problems with standalone tests:
- Hardcoded URLs and data
- No reusability across environments
- Difficult to scale to 50+ endpoints

The solution: **A modular six-layer architecture** that separates concerns and enables reusability.

### The 6 Layers

```
api-tests/<testset>/
├── 1️⃣ main.ts           Entry point - orchestrates the test
├── 2️⃣ steps/            Isolated API calls with assertions  
├── 3️⃣ queries/          GraphQL query definitions
├── 4️⃣ testdata/         Environment-specific test data
├── 5️⃣ config/           Performance configs & thresholds
└── 6️⃣ helpers/          Utilities and type definitions
```

---

## Assignment: Fill in the Architecture

### Step 1: Scaffold Your Test Structure

Run the scaffolding generator:

```bash
cd workshop-materials/assignment-3/scaffolding
npx tsx generate.ts <testset>
```

**Example:**
```bash
npx tsx generate.ts superpowers
```
This creates: `api-tests/superpowers/` with all 6 layers set up!

### Step 2: Explore the Structure

Open `api-tests/<superpowers>/` and look at each file. Notice:
- ✅ **Structure is there** (folders, imports, placeholders)
- ❓ **Logic is missing** (queries, steps, assertions)

**Question for discussion:**

Given the JSON from Assignment 2 (with URL, query, variables, response):

1. **Where does the URL go?**
2. **Where does the query go?**
3. **Where do the variables/test data go?**
4. **Where do the assertions go?**

Take 2 minutes with your table to map it out.

### Step 3: Add One Test

#### Create Query File

**Ask AI:**
```
Create a TypeScript file that exports this GraphQL query:
[paste query from GetCharacter-capture.json]

Export as: export const getCharacter = `...query...`;
```

**Save to:** `api-tests/superpowers/queries/getCharacter.ts`

#### Update Main

**Ask AI:**
```
Update main.ts [attach file] to use the query [attach queries/getCharacter.ts].

Make a POST to the url with the query and add basic checks.
```

**Update:** `api-tests/superpowers/main.ts`

#### Run It

```bash
k6 run api-tests/superpowers/main.ts
```

**Does it work?** 🎯

---

## Discussion

**Compare to Assignment 2:**
- What's easier to change? (environment, test data, queries)
- What's easier to reuse? (queries across tests)
- What's easier to scale? (adding 50 endpoints)

**Where would automation help?**
- Script: Create query files, update structure
- AI: Generate assertions, test logic

---

## What You've Learned

✅ **Modular architecture** = maintainable + scalable tests  
✅ **Separation of concerns** = change one thing, not everything  
✅ **Scripts** = structure, **AI** = logic  

**The complete picture:**
1. Extract API calls (Assignment 2)
2. Generate with scripts + AI (Assignment 2)  
3. Organize in scalable architecture (Assignment 3)

**You now have a system for production-ready, AI-assisted test generation!** 🎯

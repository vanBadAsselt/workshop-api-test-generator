# Assignment 2: Smart Extraction

## Briefing

In Assignment 1, we sent entire HAR files to AI - expensive, slow, and privacy-risky. 
In this assignment, we'll extract exactly what we need and explore different approaches to test generation.

---

## Step 1: Manual JSON Extraction with AI

Let's understand what structure we need and see the difference in data size.

1. **Check your HAR file:**
   - Look at `assignment-1-capture.har` file size (likely 50KB+)
   - How many tokens? Use https://platform.openai.com/tokenizer 

2. **Ask AI to extract ONE call from the HAR file:**

```
Extract the GetCharacter GraphQL operation from the HAR file I provided. Output should be JSON with this structure:
- request: { url, operationName, query, variables }
- response: the full response body
```

3. **Attach:** `assignment-1-capture.har` (or use the `wonder-woman.har` in the repo)
4. **Save the output** as `GetCharacter-manual.json`
    - How many tokens does the JSON have? 

---

## Step 2: Automate Extraction with a Script

Now let's automate what we just did manually.

### 2A: Generate the Script

**Ask AI:**

```
Generate a TypeScript script that extracts a GraphQL call from a HAR file in the JSON format like you just provided.

The script should:
- Take HAR file path and operation name as arguments
- Extract the GraphQL request (url, operationName, query, variables)
- Extract the response body
- Output JSON file named <operationName>-capture.json

Make it simple and focused.
```

### 2B: Test the Script

1. **Save script** to `assignment-2/examples/scripts/extract-graphql.ts`
2. **Run it:**

```bash
cd workshop-materials
npx tsx assignment-2/examples/scripts/extract-graphql.ts assignment-1-capture.har GetCharacter
```

3. **Check output:** Does `GetCharacter-capture.json` match your manual extraction?

---

## Step 3: Generate k6 Test from JSON

Now use the extracted JSON to generate a test with a script.

### 3A: Create Basic Test Generator Script

**Ask AI:**

```
Create a TypeScript script that generates a k6 test from a GraphQL JSON.

Input: JSON file with { request, response }
Output: Runnable k6 test
```

### 3B: Run the Generator

1. **Save script** to `assignment-2/examples/scripts/generate-k6-test.ts`

2. **Generate the test:**
```bash
npx tsx assignment-2/examples/scripts/generate-k6-test.ts GetCharacter-capture.json > generated-test.js
```

### 3C: Test It

```bash
k6 run generated-test.js
```

**Does it work?** 🎯

### 3D: Keep the Test generator on screen

Open `generate-k6-test.ts` - we'll analyze this next.

---

## Step 4: Making Tests Smarter

Our basic script generates structure, but the assertions are generic. Let's see two ways to make them smarter.

### Option A: Scripted Smart Assertions (Contract Testing)

**Ask AI:**
```
Rewrite the script to add smart and readable contract assertions by analyzing the response structure.

Generate deterministic checks:
- Type validation (string, number, array, object)
- Required fields are non-null/non-empty
- Response structure matches schema
```

**Save as:** `generate-k6-test-smart.ts`

### Option B: AI-Enhanced Assertions (Contextual Validation)

**Ask AI:**
```
Rewrite the test generation script to call OpenAI API to generate smart, contextual assertions.

The script should:
- Read the JSON file
- Send the response structure to OpenAI asking for assertion code
- Generate k6 test with context-aware assertions

Important:
- Call OpenAI at generation time (not k6 runtime)
- The prompt should specify: generate ONLY the destructuring line and check() call
- Tell AI: Do NOT include mock data, imports, or variable declarations
- Strip any code fences or markdown from OpenAI response
- Include business logic checks (e.g., "requested ID matches response", "totalPower > 0")
- Clean up the response (remove any extra code AI might add)

Include error handling for invalid responses.
```

**Save as:** `generate-k6-test-ai.ts`

### Compare All Three

Now you have:
- **Basic:** Status 200 check only
- **Smart Scripted:** Contract/type-based validations (schema checking)
- **AI-Enhanced:** Contextual, business logic assertions

---

## Step 5: Critical Analysis

With all three test versions on screen, discuss with your table:

**1. How does the API call map to the test?**
   - Where did the request & response go?

**2. Which assertions are better?**
   - Basic vs Smart vs AI-enhanced - what's the difference?

**3. How readable are these tests?**
   - Can someone else understand them?

**4. How reusable and scalable is this approach?**
   - Different environments (staging, production)?
   - Different test data (other characters)?
   - 50+ endpoints?

---

## Step 6: When to Script vs When to Use AI

### The Decision Framework

| Task | Best Approach | Why |
|------|---------------|-----|
| **Parse HAR file** | ✅ Script | Deterministic, no judgment needed |
| **Extract specific data** | ✅ Script | Fast, consistent, free |
| **Generate test boilerplate** | ✅ Script | Template-based, predictable |
| **Contract assertions (types/schema)** | ✅ Script | Deterministic, based on response structure |
| **Business logic assertions** | 🤖 AI | Requires understanding of what SHOULD happen |
| **Handle edge cases** | 🤖 AI | Requires context and judgment |

### Key Principles

**Use Scripts When:**
- Logic is deterministic (same input = same output)
- Speed and consistency matter
- Cost needs to be near-zero
- No judgment or context required

**Use AI When:**
- Logic requires judgment ("what SHOULD happen?")
- Context matters (business rules, domain knowledge)
- Creativity needed (test scenarios, edge cases)
- Human-readable output desired

**Best Practice: Hybrid**
- Scripts handle structure and deterministic work
- AI adds intelligence and context-aware logic
- Together they're faster and better than either alone

---

## What You've Learned

✅ Clean extraction is more efficient (20x less data)  
✅ Scripts handle deterministic work well  
✅ AI adds intelligence for assertions  
✅ Hybrid approach leverages both strengths  

**But:** Standalone tests still have problems with reusability and scale.

**Next:** Assignment 3 - Architecture for production-ready tests

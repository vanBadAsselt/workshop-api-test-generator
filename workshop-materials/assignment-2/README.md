# Assignment 2: Smart Extraction - Let Scripts Do the Work

## Briefing

In Assignment 1, we sent entire HAR files to AI - expensive, slow, and privacy-risky. 
In this assignment, we'll use **scripts** to extract exactly what we need, then let AI focus on the creative parts.

**Key Learning:** AI should handle fuzzy, creative work (assertions, test logic) - not deterministic parsing.

---

## Step 1: Manual JSON Extraction with AI

Let's first understand what structure we need.

1. **Ask AI to extract ONE call from the HAR file:**

```
Extract the GetCharacter GraphQL operation from the attached HAR file.
Output should be JSON with this structure:
- request: { url, operationName, query, variables }
- response: the full response body
```

2. **Attach:** `assignment-1-capture.har` (or use the one in the repo)
3. **Save the output** as `GetCharacter-manual.json`

**💡 Observe:** The JSON is tiny compared to the HAR file. How many tokens?

---

## Step 2: Automate Extraction with a Script

Now let's build a reusable tool to extract any operation.

### 2A: Generate the Script

**Ask AI:**

```
Generate a TypeScript script that extracts a GraphQL call from a HAR file.

Inputs:
- HAR file path
- Operation name to extract

Output:
- JSON file with request & response
- Request includes: url, operationName, query, variables
- Response includes: everything from the response body

Make it simple and focused.
```

### 2B: Test the Script

1. **Save script** to `assignment-2/examples/scripts/extract-gql-from-har.ts`
2. **Run it:**

```bash
cd workshop-materials
npx tsx assignment-2/examples/scripts/extract-gql-from-har.ts assignment-1-capture.har GetCharacter
```

3. **Check output:** Does `GetCharacter-capture.json` match your manual extraction?

---

## Step 3: Generate k6 Test from JSON

Now use the extracted JSON to generate a test.

### 3A: Create Test Generator Script

**Ask AI:**

```
Generate a TypeScript script that creates a k6 test from a JSON file.

Input: JSON file with request/response structure from previous step
Output: k6 test script with:
- GraphQL POST request
- Variables and query from input
- Meaningful assertions based on the response structure
```

### 3B: Run the Generator

```bash
npx tsx assignment-2/examples/scripts/generate-k6-from-json.ts GetCharacter-capture.json > tests/getCharacter.test.js
```

### 3C: Test It

```bash
k6 run tests/getCharacter.test.js
```

**Does it work?** 🎯

---

## Step 4: Try Another Operation (Bonus)

1. **Extract SearchCharacters:**
```bash
npx tsx assignment-2/examples/scripts/extract-gql-from-har.ts assignment-1-capture.har SearchCharacters
```

2. **Generate test:**
```bash
npx tsx assignment-2/examples/scripts/generate-k6-from-json.ts SearchCharacters-capture.json > tests/searchCharacters.test.js
```

3. **Run it:**
```bash
k6 run tests/searchCharacters.test.js
```

---

## Debriefing Questions

### Compare the Approaches

| Aspect | Assignment 1 (Full HAR) | Assignment 2 (Extraction Script) |
|--------|------------------------|----------------------------------|
| **Tokens sent to AI** | ~500,000 | ~500 |
| **Privacy risk** | High (entire HAR) | Low (one operation) |
| **Speed** | Slow | Fast |
| **Consistency** | Varies | Predictable |
| **Cost** | $$$ | $ |

### Discussion Points

- 🤔 **Do we need AI for extraction?** Why or why not?
- 💡 **Where should AI be used?** (assertions, edge cases, test logic)
- 🚀 **What can be scripted?** (deterministic parsing, formatting)
- 🎯 **Test quality:** Are the generated assertions meaningful? What's missing?

---

## What You've Learned

✅ **Extraction scripts** handle deterministic parsing  
✅ **AI** focuses on creative test logic  
✅ **Privacy & cost** managed by filtering data  
✅ **Reusable tools** make test generation scalable  

## Next Steps

Think about your own API test suite:
- What operations need tests?
- Can you capture → extract → generate tests in minutes?
- Where does AI add value vs. where do scripts suffice?

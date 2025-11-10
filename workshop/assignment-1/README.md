# Assignment 1: Test Generation

## Prerequisites

Before starting, ensure you have:
- ✅ **Node.js 18+** installed
- ✅ **k6** installed (see installation instructions in Step 3 below)
- ✅ **The Superpowers app running** - See [../../superpowers/README.md](../../superpowers/README.md) for setup
- ✅ **A modern browser** (Chrome/Firefox recommended)

### Quick Start

If the app isn't running yet, it's just 2 commands:

```bash
cd superpowers
npm install && npm run dev
```

**Verify it's working:** Open http://localhost:3000 and you should see the superhero list.

---

## Briefing

In this assignment, you'll capture real user interactions and let AI generate a test for you. 

## Step 1: Capture HAR file 

1. **Open the Superpowers app:** http://localhost:3000
2. **Open DevTools:** Press F12 or Right-click → Inspect
3. **Go to Network tab:**
   - ✅ Check "Preserve log"
   - 🗑️ Clear existing entries (trash icon)
4. **Interact with the app:**
   - Click "Details" on any character
5. **Export HAR file:**
   - Got to in Network tab
   - Click small icon 'Export HAR' (arrow down icon)
   - Save as `assignment-1-capture.har` in this folder (or use `wonder-woman.har` in the /examples folder)

## Step 2: Generate test with AI

1. **Open ChatGPT or Perplexity AI**
2. **Upload your HAR file**
3. **Use this prompt:**

```
You are an expert test automation engineer. Attached is a HAR file from a web application called “Superpowers”, where users can compare the powers of heroes and villains. Generate a K6 test script based on the GetCharacter GraphQL API call you can find in this HAR file.
```

4. **Save the generated script** as `generated-test.js` in this folder

## Step 3: Run the test 

1. **Run your generated test with K6:**
Make sure your terminal is opened at `cd workshop-materials/assignment-1`
```bash
k6 run generated-test.js
```
2. **Observe the results**
- Is the test working, or not? Can you fix it with AI? 
- What is the test validating?
- Based on the sample response, what assertions would you include to verify the API contract?

3. **Improve the test with this prompt starter**
- Generate 3-5 meaningful assertions for this API response, focus is ... ? 

## Debriefing 

We'll discuss as a group:

- 🙋 **Who got a working test?**
- 🙋 **Who got a broken test?**
- 🤔 **What is your test actually validating?**

## Troubleshooting

**Test fails immediately:**
- Check if backend is running: http://localhost:4000/graphql
- Check if frontend is running: http://localhost:3000

**k6 not found:**
- Install k6 following instructions in Step 3

**AI assistant not working:**
- Team up with another attendee for this exercise

**HAR file too large:**
- That's normal! HAR files include all content. Try it with the HAR file in this repo `assignment-1-capture.har`

**AI generated broken code:**
Try this prompt: "The test you generated has an error on line X. Can you fix it?"

## Next Steps

In **Assignment 2**, we'll write tests **with intention** - defining what we want to test **before** generating the script!

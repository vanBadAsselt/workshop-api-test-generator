# Workshop Prerequisites

## What We'll Do Together

In this 90-minute workshop, we'll use AI to **generate k6 API tests** from real browser traffic. You'll learn to:
- Capture API calls from your browser (HAR files)
- Use ChatGPT/Claude to generate k6 tests
- Build smart extraction scripts that make AI more effective

**No worries if your setup doesn't work!** This is a **follow-along workshop** - you can watch and learn the concepts, team up with others, or try it at home later.

---

## Quick Setup (Try Before Workshop)

### 1. Install Node.js 18+ and npm
```bash
node --version  # Should be v18.0.0 or higher
```
**Don't have it?** Download from [nodejs.org](https://nodejs.org/)

### 2. Install k6
```bash
k6 version
```

**Install:**
- **macOS:** `brew install k6`
- **Windows:** `choco install k6` or download from [k6.io/docs/get-started/installation](https://k6.io/docs/get-started/installation/)
- **Linux:** `sudo snap install k6` or see [k6.io/docs/get-started/installation](https://k6.io/docs/get-started/installation/)

### 3. Get AI Access (Free Tier Works)
Sign up for one of these:
- [ChatGPT](https://chat.openai.com) - free version can upload files
- [Claude](https://claude.ai) - free version can upload files

**Verify:** Can you upload a file? Look for the paperclip icon.

### 4. Get the Workshop Repository

```bash
git clone https://github.com/vanBadAsselt/workshop-api-test-generator
cd workshop-api-test-generator/superpowers
```



Or download directly from: https://github.com/vanBadAsselt/workshop-api-test-generator

### 5. Run the Workshop App
```bash
npm install
npm run dev
```

**Verify:**
- http://localhost:3000 shows superhero list

If you see both, you're ready!

---

## Didn't Work? No Problem!

**Options during the workshop:**
1. **Watch and learn** - Follow along on the instructor's screen
2. **Team up** - Pair with someone who has a working setup
3. **Use backup files** - We'll provide pre-captured HAR files and examples
4. **Try at home** - All materials will be available after the workshop

The goal is to learn the **approach and concepts**, not to fight with installations!

---

## Nice to Have (Optional)

- **Modern browser** with DevTools (Chrome, Firefox, Edge, Safari)
- **Text editor** (VS Code, Cursor, or any editor you like)
- **Basic terminal knowledge** (running commands, navigating folders)

---

## Questions?

Contact the workshop organizer before the session, or arrive 10 minutes early for setup help.

See you at the workshop!



# Quick Start Guide

**TL;DR for attendees who want to get started fast.**

---

## 1. Install Prerequisites

```bash
# Check versions
node --version  # Need 18+
k6 version      # Should return version number
```

**Also need:**
- AI assistant access (ChatGPT or Claude - free tier is fine)

**Don't have them?** See [PREREQUISITES.md](PREREQUISITES.md)

---

## 2. Start the App

```bash
cd superpowers
npm install
npm run dev
```

**Verify:**
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:4000/graphql ✅

---

## 3. You're Ready!

Move on to **Assignment 1** when the workshop starts.

---

## Having Issues?

| Problem | Solution |
|---------|----------|
| Command not found | Install missing software (see PREREQUISITES.md) |
| Port already in use | Kill other processes or change port |
| No characters showing | Run `npm install` again |
| Permission denied | Use `sudo` (Mac/Linux) or run as Admin (Windows) |
| Something doesn't work | Team up with another attendee during the workshop |

---

## Just Want the Minimum?

**Required:**
- Node.js 18+
- k6
- A browser
- AI assistant (ChatGPT/Claude)

**2 commands:**
```bash
cd superpowers
npm install && npm run dev
```

**Done!**


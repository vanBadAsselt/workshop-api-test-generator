# Workshop Prerequisites

Please verify and complete these setup **before** the workshop to maximize hands-on time.

## Pre-Workshop Checklist

Before the workshop starts, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] k6 installed (`k6 version`)
- [ ] AI assistant account (ChatGPT or Claude - free tier is fine)
- [ ] Superpowers app runs (`npm run dev` in superpowers folder)
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend loads at http://localhost:4000/graphql
- [ ] Browser DevTools working (press F12)

---

## Required Software

### 1. Node.js 18+ and npm

**Check if you have it:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Installation:**
- **Mac:** Download from [nodejs.org](https://nodejs.org/) or `brew install node`
- **Windows:** Download installer from [nodejs.org](https://nodejs.org/)
- **Linux:** `sudo apt install nodejs npm` or see [nodejs.org](https://nodejs.org/)

---

### 2. k6 (Load Testing Tool)

**Check if you have it:**
```bash
k6 version
```

**Installation:**

**macOS:**
```bash
brew install k6
```

**Windows:**
```bash
# Using Chocolatey
choco install k6

# Or download installer from:
# https://github.com/grafana/k6/releases
```

**Linux (Debian/Ubuntu):**
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Linux (Snap):**
```bash
sudo snap install k6
```

---

### 3. Modern Web Browser

Any of these with DevTools:
- ✅ Google Chrome (recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

---

### 4. Text Editor or IDE

Any editor works:
- VS Code (recommended)
- Cursor
- WebStorm
- Sublime Text
- Atom
- Vim/Emacs

---

### 5. AI Assistant Access

You'll need access to an AI assistant that can:
- Accept file uploads (HAR files)
- Generate code/scripts

**Recommended options:**
- **ChatGPT** - [chat.openai.com](https://chat.openai.com) (free tier works)
- **Claude** - [claude.ai](https://claude.ai) (free tier works)

**How to verify:**
1. Log in to your chosen AI assistant
2. Start a new conversation
3. Verify you can upload files (look for a paperclip/upload icon)

**Can't get AI access working?** No problem! During the workshop, you can team up with another attendee.

--- 

## Workshop App Setup

### Install the Superpowers Demo App

```bash
# Clone the workshop repository (if provided)
cd workshop-e2e-test-generator/superpowers

# Install dependencies
npm install

# Start the app
npm run dev
```

### Verify Installation

1. **Frontend:** Open http://localhost:3000
   - You should see a list of superheroes
   - Try searching for "spider"

2. **Backend:** Open http://localhost:4000/graphql
   - GraphQL Playground should load
   - You can run test queries here

If both work, you're ready! 🎉

---

## Troubleshooting

### "Command not found: node"
- Node.js is not installed or not in PATH
- Restart terminal after installation
- On Windows, may need to restart computer

### "Command not found: k6"
- k6 is not installed or not in PATH
- Try closing and reopening terminal
- On Windows with Chocolatey, run as Administrator

### "Port 3000 already in use"
- Another app is using the port
- Kill the process or change the port in `frontend/vite.config.ts`

### "Port 4000 already in use"
- Backend port is taken
- Check if backend is already running in another terminal

### App doesn't show any characters
- Make sure you ran `npm install` first
- Check console for errors (F12 in browser)
- Verify `backend/data/characters.json` exists

---

## Need Help?

**During setup:** Reach out to the workshop organizer with:
- Your operating system (Mac/Windows/Linux)
- Error messages (screenshot or copy-paste)
- What step you're stuck on

**Day of workshop:** 
- Arrive 10 minutes early if you have setup issues - we'll have time to help!
- If something doesn't work, you can pair up with another attendee



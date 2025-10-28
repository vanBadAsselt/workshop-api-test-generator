# Workshop: AI-Assisted API Test Generation

**Duration:** 90 minutes  
**Level:** Intermediate  
**Focus:** Concepts that apply to any API testing tool

---

## Workshop Structure

### Introduction (15 min)
**"What if you could steal tests straight from the browser?"**

Learn about:
- The challenge: Fast feature development + limited testing capacity
- How HAR files capture real API traffic
- Why GraphQL makes testing easier
- The architecture we'll build

### Assignment 1: Test Generation (20 min)
**The naive approach: Give AI everything**

- Capture a HAR file from your browser
- Send it to ChatGPT/Claude
- Generate a k6 test
- Run it

**Key Learning:** This works... but doesn't scale.
- ~500,000 tokens per test
- Privacy concerns
- Inconsistent results
- Expensive at scale

### Assignment 2: Smart Extraction (30 min)
**Be smart about what you send to AI**

- Extract specific operations from HAR files
- Use scripts for deterministic parsing
- Let AI focus on creative test logic
- Reuse extraction scripts

**Key Learning:** Separation of concerns
- Scripts handle parsing (deterministic)
- AI handles logic (creative)
- ~500 tokens vs 500,000
- Privacy-safe, fast, consistent

### Assignment 3: Structuring & Architecture (20 min)
**Build a maintainable test system**

- Scaffold a six-layer architecture
- Understand modular test structure
- Fill structure with AI-generated logic
- Enable reusability at scale

**Key Learning:** Structure enables scale
- Queries reused across tests
- Environment-specific data
- Test type flexibility (smoke, load, stress)
- One change updates all tests

### Wrap-Up (5 min)
**What you learned**

- 🎯 Be intentional about test goals
- 🔧 Script the deterministic parts
- 🤖 Use AI for creative logic
- 🏗️ Structure for maintainability
- 💰 Smart extraction saves money

---

## Six-Layer Architecture

```
┌─────────────────────────────────────────┐
│  1. MAIN - Entry Point                  │  Load data, run scenarios
├─────────────────────────────────────────┤
│  2. STEPS - Isolated API Calls          │  Execute + Assert
├─────────────────────────────────────────┤
│  3. QUERIES - GraphQL Definitions       │  Reusable queries
├─────────────────────────────────────────┤
│  4. TESTDATA - Variables & Inputs       │  Environment-specific
├─────────────────────────────────────────┤
│  5. CONFIG - Test Settings              │  Performance params
├─────────────────────────────────────────┤
│  6. HELPERS - Utilities & Types         │  Shared code
└─────────────────────────────────────────┘
```

**Benefits:**
- ✅ Reusability - One query, many tests
- ✅ Maintainability - Change once, update all
- ✅ Flexibility - Swap env/config easily
- ✅ Scalability - Structure grows with you

---

## Files & Resources

### Getting Started
- [PREREQUISITES.md](PREREQUISITES.md) - Setup before workshop
- [QUICK-START.md](QUICK-START.md) - Quick reference
- [WORKSHOP-INTRO.md](WORKSHOP-INTRO.md) - Full instructor script
- [WORKSHOP-TIMELINE.md](WORKSHOP-TIMELINE.md) - Detailed schedule

### Assignments
- [assignment-1/](assignment-1/) - Test Generation (20 min)
- [assignment-2/](assignment-2/) - Smart Extraction (30 min)
- [assignment-3/](assignment-3/) - Structuring & Architecture (20 min)

### Demo App
- [../superpowers/](../superpowers/) - Superhero comparison app

---

## Key Takeaways

### When to Use What

| Task | Tool | Why |
|------|------|-----|
| **Parsing HAR files** | Script | Deterministic, fast, private |
| **Extracting operations** | Script | Consistent, reusable |
| **Creating structure** | Script/Generator | Consistent architecture |
| **Writing assertions** | AI | Creative, context-aware |
| **Generating test logic** | AI | Understands intent |
| **Edge case handling** | AI | Thinks like a tester |

### Cost Comparison

| Approach | Tokens | Privacy | Speed | Consistency |
|----------|--------|---------|-------|-------------|
| Full HAR to AI | ~500,000 | ⚠️ Low | 🐌 Slow | ⚠️ Variable |
| Extracted call | ~500 | ✅ High | ⚡ Fast | ✅ Predictable |

### Real-World Application

**Start with:**
1. Capture real user flows (HAR files)
2. Extract the operations you care about
3. Scaffold your test structure
4. Use AI to fill in the details

**Scale up:**
1. Reuse queries across tests
2. Environment-specific test data
3. Multiple test types (smoke, load, stress)
4. Shared utilities and helpers

---

## After the Workshop

**Try this Monday:**
1. Capture a HAR file from your own app
2. Extract one operation
3. Generate a test with AI
4. Run it!

**Questions to consider:**
- Which of your tests could be extracted from HAR files?
- Where can scripts replace manual work?
- What structure would help your team scale?
- How much time could smart extraction save?

---

## Tools Used

- **k6** - Load testing tool (concepts apply to any tool)
- **GraphQL** - Query language (works with REST too)
- **HAR files** - Standard format for browser traffic
- **ChatGPT/Claude** - AI assistants for test generation
- **TypeScript** - For extraction scripts

**Remember:** The concepts apply regardless of your tools!

---

## Credits

Workshop created by Anaïs van Asselt  
Company: Choco  
Focus: Making API testing faster and more maintainable through smart automation

---

## Contributing

Found an issue or have a suggestion? The workshop materials are designed to be adapted to your context.

**Ideas for customization:**
- Swap Superpowers app with your own API
- Add REST API examples alongside GraphQL
- Include additional test types (integration, contract)
- Extend architecture with more layers

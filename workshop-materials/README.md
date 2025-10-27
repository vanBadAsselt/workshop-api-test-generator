# API Test Automation Workshop

Welcome to the API Test Automation Workshop! This hands-on workshop will teach you how to test APIs using real-world scenarios with the **Superpowers** demo application.

## Workshop Overview

In this workshop, you'll learn:
- How to analyze API traffic using browser DevTools and HAR files
- GraphQL API testing fundamentals
- REST API testing best practices
- How to write automated API tests
- Contract testing concepts
- Performance and load testing basics

## Prerequisites

**📋 Before the workshop:** Please complete setup using one of these guides:
- **Detailed Setup:** [PREREQUISITES.md](PREREQUISITES.md) - Full instructions for all platforms
- **Quick Start:** [QUICK-START.md](QUICK-START.md) - For experienced developers

**Minimum requirements:**
- Node.js 18+
- k6 (load testing tool)
- Modern browser with DevTools
- AI assistant access (ChatGPT/Claude)

**Knowledge prerequisites:**
- Basic understanding of APIs (REST/GraphQL)
- Familiarity with JavaScript/TypeScript

## Getting Started

### On Workshop Day

If you completed pre-workshop setup, just run:

```bash
cd superpowers
npm run dev
```

**Verify it's working:**
- Frontend: http://localhost:3000 ✅
- Backend: http://localhost:4000/graphql ✅

## API Documentation

### GraphQL Endpoint: `http://localhost:4000/graphql`

**Available Queries:**
- `searchCharacters` - Search and filter characters
- `getCharacter` - Get detailed character info
- `getCharactersByAlignment` - Filter by good/bad/neutral
- `getRandomCharacter` - Get a random character

### REST Endpoints: `http://localhost:4001/api`

- `POST /api/compare` - Compare two characters
- `GET /api/characters/:id/stats` - Get character stats
- `GET /api/random` - Get random character

## Tips for Success

1. Use the GraphQL Playground at http://localhost:4000/graphql to explore queries
2. Keep browser DevTools Network tab open to inspect traffic
3. Export HAR files to analyze request/response patterns
4. Read error messages carefully - they often contain helpful hints
5. Ask questions! Your instructors are here to help

## Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [REST API Best Practices](https://restfulapi.net/)
- [HAR File Specification](http://www.softwareishard.com/blog/har-12-spec/)
- [Jest Testing Framework](https://jestjs.io/)

## Support

If you encounter any issues:
1. Check that both backend and frontend are running
2. Verify you're using the correct ports
3. Clear browser cache and reload
4. Ask your workshop instructor

Happy Testing!

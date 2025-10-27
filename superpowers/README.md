# Superpowers

A lightweight superhero power comparison application built for API test automation workshops. Compare your favorite heroes and villains while learning how to generate automated tests from network traffic.

## Features

- Browse and search superhero characters
- Filter by alignment (Good/Bad/Neutral)
- Sort by name or power level
- View detailed character information
- Compare powers between two characters
- Get random character recommendations

## Tech Stack

- **Backend**: Node.js + Express + Apollo Server (GraphQL) + REST endpoints
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Data**: Cached superhero data (no external API dependencies during workshop)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation & Running

```bash
# Install all dependencies
npm install

# Start both backend and frontend
npm run dev
```

That's it! The app comes with pre-seeded character data.

### Access Points

- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:4000/graphql
- **REST API**: http://localhost:4000/api

## API Endpoints

### GraphQL Queries

```graphql
# Search characters
query SearchCharacters($searchTerm: String, $alignment: String) {
  searchCharacters(searchTerm: $searchTerm, alignment: $alignment) {
    characters {
      id
      name
      totalPower
      image { url }
      biography { alignment }
    }
  }
}

# Get character details
query GetCharacter($id: ID!) {
  getCharacter(id: $id) {
    id
    name
    powerstats { intelligence strength speed durability power combat }
    biography { fullName alignment }
  }
}
```

### REST Endpoints

```bash
# Compare two characters
POST /api/compare
Body: { "characterIds": ["69", "620"] }

# Get character stats
GET /api/characters/:id/stats

# Get random character
GET /api/random
```

## Workshop Usage

### Generating HAR Files

1. Open the app in Chrome/Firefox
2. Open Developer Tools (Network tab)
3. Interact with the app (search, filter, view details, compare)
4. Right-click network logs → "Save all as HAR with content"
5. Use the HAR file for test generation exercises

### Example User Flow for HAR Generation

1. Load character list → `SearchCharacters` query
2. Search "bat" → `SearchCharacters` with variables
3. Click Batman → `GetCharacter` query
4. Select Batman + Joker → `POST /api/compare`
5. Click random → `GET /api/random`

**Result**: HAR file with ~5 API calls demonstrating various patterns

## Development Scripts

```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Data Management

Character data is pre-loaded in `backend/data/characters.json`. No external API or seeding required!

**Optional:** If you want to regenerate the character data:
```bash
# Requires SUPERHERO_API_KEY in backend/.env
npm run seed
```

### Optional: Simulate Errors

Add query parameters for workshop demos:
- `?simulateError=500` - Return 500 error
- `?simulateDelay=2000` - Add 2s delay

## License

MIT - Free for workshop and educational use

---

Built with ⚡ by Anaïs van Asselt at Choco for API Test Automation Workshops

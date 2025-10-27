# Superhero API Test Automation Workshop - Demo App Requirements

## Overview
A lightweight TypeScript application demonstrating API test generation from network traffic. The app uses both GraphQL and REST endpoints with a **cached backend** to ensure reliable workshop experience for 80+ participants without external API rate limits.

## Workshop Context
This app serves as the practical foundation for teaching:
- HAR file generation from real browser traffic
- Extracting GraphQL and REST calls from network recordings
- AI-assisted test generation and assertion creation
- Modular test architecture implementation
- K6 test framework usage (concepts applicable to any API testing tool)

## Architecture Decision: Hybrid Backend ⭐

### Why Hybrid?
With 80 workshop participants making concurrent API calls, we need:
- ✅ **No rate limits** - participants won't hit external API restrictions
- ✅ **Reliability** - no dependency on external service uptime
- ✅ **Control** - ability to add edge cases, errors, delays for testing scenarios
- ✅ **Offline capability** - workshop works without internet once setup
- ✅ **Realistic behavior** - feels like a real API with proper patterns

### Architecture Flow
```
┌──────────┐      ┌─────────────────────────┐      ┌──────────────────┐
│ Frontend │─────▶│ Your Backend            │─────▶│ Cached JSON Data │
│ (React)  │      │ - GraphQL (Apollo)      │      │ (~50 characters) │
└──────────┘      │ - REST endpoints        │      └──────────────────┘
                  │ - TypeScript            │              ↑
                  └─────────────────────────┘              │
                               ↑                           │
                               │                    ┌──────┴──────┐
                               └────────────────────│ Seed Script │
                                  (optional refresh)│ (one-time)  │
                                                    └─────────────┘
```

## Technical Requirements

### Stack
- **Language**: TypeScript (strict mode)
- **Backend**:
  - Node.js + Express
  - Apollo Server (GraphQL)
  - Express REST endpoints
- **Frontend**:
  - React 18 with TypeScript
  - Apollo Client (GraphQL queries)
  - Fetch API (REST calls)
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Package Manager**: npm or pnpm
- **Data Source**: Pre-seeded JSON files (sourced from Superhero API)

### Project Structure
```
workshop-e2e-test-generator/
├── demo-app/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── server.ts           # Express + Apollo setup
│   │   │   ├── schema.graphql      # GraphQL schema
│   │   │   ├── resolvers/          # GraphQL resolvers
│   │   │   ├── rest/               # REST endpoints
│   │   │   └── data-service.ts     # Data access layer
│   │   ├── data/
│   │   │   └── characters.json     # Seeded character data
│   │   ├── scripts/
│   │   │   └── seed-data.ts        # One-time data fetch script
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   ├── graphql/            # GraphQL queries
│   │   │   └── api/                # REST API calls
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── README.md                   # Workshop setup guide
```

## Data Seeding Strategy

### Seed Script (`seed-data.ts`)
One-time script to fetch and cache popular superhero data:

**Characters to fetch** (~50 characters):
- Popular heroes: Batman, Superman, Wonder Woman, Spider-Man, Iron Man, etc.
- Popular villains: Joker, Thanos, Loki, Venom, etc.
- Mix of Marvel and DC
- Various power levels for interesting comparisons

**Data structure** (`characters.json`):
```json
{
  "characters": [
    {
      "id": "69",
      "name": "Batman",
      "slug": "batman",
      "powerstats": {
        "intelligence": "100",
        "strength": "26",
        "speed": "27",
        "durability": "50",
        "power": "47",
        "combat": "100"
      },
      "appearance": {
        "gender": "Male",
        "race": "Human",
        "height": ["6'2", "188 cm"],
        "weight": ["210 lb", "95 kg"]
      },
      "biography": {
        "fullName": "Bruce Wayne",
        "alterEgos": "No alter egos found.",
        "aliases": ["Batman", "Dark Knight"],
        "placeOfBirth": "Gotham City",
        "alignment": "good",
        "publisher": "DC Comics"
      },
      "image": {
        "url": "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg"
      }
    }
  ],
  "metadata": {
    "totalCount": 50,
    "seededAt": "2025-01-15T10:00:00Z",
    "source": "superheroapi.com"
  }
}
```

### Backend Implementation Notes
- **Fast responses**: Serve from memory (load JSON on startup)
- **Realistic delays**: Optional 50-300ms artificial delay to simulate real API
- **Error simulation**: 5% chance of 500 error for testing error handling
- **Pagination**: Implement cursor-based pagination for list queries

## Functional Requirements

### 1. Character List View (GraphQL)

**GraphQL Schema:**
```graphql
type Character {
  id: ID!
  name: String!
  slug: String!
  powerstats: Powerstats!
  appearance: Appearance!
  biography: Biography!
  image: Image!
  totalPower: Int!
}

type Powerstats {
  intelligence: String!
  strength: String!
  speed: String!
  durability: String!
  power: String!
  combat: String!
}

type Biography {
  fullName: String!
  alignment: String!
  publisher: String
  placeOfBirth: String
  aliases: [String!]!
}

type Appearance {
  gender: String
  race: String
  height: [String!]
  weight: [String!]
}

type Image {
  url: String!
}

type Query {
  searchCharacters(
    searchTerm: String
    alignment: String
    sortBy: SortOption
    limit: Int
    offset: Int
  ): CharacterConnection!

  getCharacter(id: ID!): Character

  getCharactersByAlignment(alignment: String!): [Character!]!
}

enum SortOption {
  NAME_ASC
  NAME_DESC
  POWER_ASC
  POWER_DESC
}

type CharacterConnection {
  characters: [Character!]!
  totalCount: Int!
  hasMore: Boolean!
}
```

**UI Components:**
- Card grid (3-4 columns)
- Each card:
  - Character image
  - Name
  - Total power badge
  - Alignment badge (Good/Bad/Neutral with color coding)
  - "View Details" button
  - "Select for Comparison" checkbox

**Interactions:**
- Search input (debounced, triggers GraphQL query)
- Alignment filter: All / Good / Bad / Neutral
- Sort dropdown: Name A-Z, Name Z-A, Power High-Low, Power Low-High
- Load more button (pagination)

**Example GraphQL Query Generated:**
```graphql
query SearchCharacters($searchTerm: String, $alignment: String, $sortBy: SortOption, $limit: Int, $offset: Int) {
  searchCharacters(
    searchTerm: $searchTerm
    alignment: $alignment
    sortBy: $sortBy
    limit: $limit
    offset: $offset
  ) {
    characters {
      id
      name
      image {
        url
      }
      totalPower
      biography {
        alignment
      }
    }
    totalCount
    hasMore
  }
}
```

### 2. Character Details Modal (GraphQL)

**GraphQL Query:**
```graphql
query GetCharacter($id: ID!) {
  getCharacter(id: $id) {
    id
    name
    image {
      url
    }
    powerstats {
      intelligence
      strength
      speed
      durability
      power
      combat
    }
    biography {
      fullName
      aliases
      placeOfBirth
      alignment
      publisher
    }
    appearance {
      gender
      race
      height
      weight
    }
    totalPower
  }
}
```

**UI Components:**
- Modal overlay with backdrop
- Large character image
- Stats visualization (progress bars or radar chart)
- Biography section
- Appearance details
- "Close" and "Compare" buttons

### 3. Compare Powers Feature (REST)

**REST Endpoint 1: Compare Characters**
```
POST /api/compare
Content-Type: application/json

Request:
{
  "characterIds": ["69", "620"]
}

Response:
{
  "comparison": {
    "winner": {
      "id": "620",
      "name": "Wonder Woman",
      "totalPower": 542
    },
    "opponent": {
      "id": "69",
      "name": "Batman",
      "totalPower": 431
    },
    "powerDifference": 111,
    "winPercentage": 55.7,
    "breakdown": {
      "intelligence": {
        "winner": "Batman",
        "winnerScore": 100,
        "opponentScore": 88,
        "margin": 12
      },
      "strength": {
        "winner": "Wonder Woman",
        "winnerScore": 100,
        "opponentScore": 26,
        "margin": 74
      },
      "speed": {
        "winner": "Wonder Woman",
        "winnerScore": 79,
        "opponentScore": 27,
        "margin": 52
      },
      "durability": {
        "winner": "Wonder Woman",
        "winnerScore": 100,
        "opponentScore": 50,
        "margin": 50
      },
      "power": {
        "winner": "Wonder Woman",
        "winnerScore": 100,
        "opponentScore": 47,
        "margin": 53
      },
      "combat": {
        "winner": "Tie",
        "winnerScore": 100,
        "opponentScore": 100,
        "margin": 0
      }
    },
    "analysis": "Wonder Woman dominates with superior physical stats, winning in 4 out of 6 categories. Batman's only advantage is intelligence."
  }
}
```

**REST Endpoint 2: Get Character Stats (Simplified)**
```
GET /api/characters/:id/stats

Response:
{
  "id": "69",
  "name": "Batman",
  "alignment": "good",
  "powerstats": {
    "intelligence": 100,
    "strength": 26,
    "speed": 27,
    "durability": 50,
    "power": 47,
    "combat": 100
  },
  "totalPower": 431
}
```

**REST Endpoint 3: Random Character**
```
GET /api/random

Response:
{
  "id": "346",
  "name": "Iron Man",
  "slug": "iron-man",
  ... (full character data)
}
```

**UI Components:**
- Comparison selection mode (select 2 characters)
- "Compare Selected" button
- Comparison result modal:
  - Side-by-side character display
  - Stat-by-stat breakdown with bars
  - Winner announcement
  - Win analysis text

### 4. Additional Features for Network Traffic Variety

**GraphQL Mutation (Optional):**
```graphql
mutation RateCharacter($id: ID!, $rating: Int!) {
  rateCharacter(id: $id, rating: $rating) {
    id
    rating
    totalRatings
  }
}
```
Note: Doesn't persist, just returns mock response for workshop purposes.

## Non-Functional Requirements

### Performance
- Initial load: < 1 second
- GraphQL query response: < 200ms (cached data)
- REST endpoint response: < 100ms
- Support 80 concurrent users without degradation

### Developer Experience
- `npm install` - install all dependencies
- `npm run seed` - run seed script (one-time setup)
- `npm run dev` - start both frontend and backend concurrently
- Environment variables in `.env.example`
- TypeScript strict mode
- ESLint + Prettier configured

### Workshop-Specific Requirements
- **Clear Operation Names**: Every GraphQL query must have explicit `operationName`
- **Descriptive Variables**: Use clear variable names (e.g., `$searchTerm`, not `$q`)
- **Structured Responses**: Consistent JSON structure for easy parsing
- **Error Responses**: Well-formed error objects
- **CORS Enabled**: Frontend can call backend from any origin during workshop

## Workshop Exercise Alignment

### Assignment 1A: Naive Test Generation
**User Flow:**
1. Load app → `SearchCharacters` GraphQL query
2. Search "bat" → `SearchCharacters` with variables
3. Click Batman → `GetCharacter` GraphQL query
4. Select Batman + Joker → `POST /api/compare` REST call

**Expected HAR File:**
- 3-4 GraphQL operations
- 1-2 REST calls
- Clean structure for AI processing

### Assignment 1B: AI Assertions
**Good Response Data for Assertions:**
- Various data types: String, Int, Boolean, Array, Object
- Nullable vs non-nullable fields
- Nested structures (powerstats, biography)
- Enum values (alignment)

### Assignment 2: Extraction
**HAR File Characteristics:**
- GraphQL operations have clear `operationName`
- Request payload includes `query`, `variables`
- Response follows consistent structure
- REST endpoints use standard HTTP verbs
- Clear distinction between GraphQL and REST in HAR

### Assignment 3: Modular Generation
**Mapping to Test Architecture:**
```
Query Layer:     GraphQL operations stored as strings
Step Layer:      Execute query with variables + assertions
Testdata Layer:  Variable values (characterId, searchTerm, etc.)
Options:         Test config (iterations, thresholds)
Main:            Test suite orchestration
```

## Sample Workshop User Journey

1. **Open App** → `SearchCharacters` (limit: 12)
2. **Type "man" in search** → `SearchCharacters` (searchTerm: "man")
3. **Filter "Good"** → `SearchCharacters` (alignment: "good")
4. **Sort by Power** → `SearchCharacters` (sortBy: "POWER_DESC")
5. **Click Superman** → `GetCharacter` (id: "644")
6. **Click Random** → `GET /api/random`
7. **Select Batman & Joker** → `POST /api/compare` (ids: ["69", "370"])
8. **Get Joker stats** → `GET /api/characters/370/stats`

**Result:** HAR with ~8 distinct API calls demonstrating various GraphQL patterns and REST endpoints.

## Error Scenarios for Advanced Testing

Optional: Backend can simulate errors via query parameter
- `?simulateError=500` → Returns 500 error
- `?simulateDelay=3000` → Adds 3s delay
- `?simulateEmpty=true` → Returns empty result

Good for teaching error handling in tests.

## Success Criteria

- ✅ Complete setup in < 5 minutes
- ✅ Runs on macOS, Windows, Linux (Node 18+)
- ✅ Zero external API dependencies during workshop
- ✅ 80 users can run simultaneously without issues
- ✅ Generates clean, parseable HAR files
- ✅ All GraphQL queries have explicit operation names
- ✅ REST endpoints follow conventions
- ✅ Responses include variety of data types for assertion practice

## Out of Scope (V1)

- User authentication
- Real database (JSON files sufficient)
- Image uploads
- WebSocket/Subscriptions
- Mobile responsive (desktop-first is fine)
- Production deployment
- Advanced caching strategies
- Rate limiting

## Implementation Phases

### Phase 1: Backend Foundation
1. ✅ Seed script to fetch character data
2. ✅ Express server setup
3. ✅ GraphQL schema + resolvers
4. ✅ REST endpoints
5. ✅ Data service layer

### Phase 2: Frontend Core
1. ✅ Vite + React + TypeScript setup
2. ✅ Apollo Client configuration
3. ✅ Character list component
4. ✅ Search, filter, sort functionality
5. ✅ Character detail modal

### Phase 3: Advanced Features
1. ✅ Compare powers feature (REST)
2. ✅ Random character
3. ✅ UI polish with TailwindCSS
4. ✅ Loading states & error handling

### Phase 4: Workshop Readiness
1. ✅ Test HAR file generation
2. ✅ Verify GraphQL operation names
3. ✅ Create setup documentation
4. ✅ Prepare sample HAR files
5. ✅ Test with concurrent users

## Next Steps

Ready to start implementation! Shall we begin with:
1. **Project structure setup**
2. **Seed script** to fetch character data
3. **Backend implementation** (GraphQL + REST)
4. **Frontend components**

Let me know and I'll start building!

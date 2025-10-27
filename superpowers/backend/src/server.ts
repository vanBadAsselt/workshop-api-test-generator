import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { compareCharacters } from './rest/compare';
import { getCharacterStats, getRandomCharacter } from './rest/characters';

// Load environment variables
dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

// Read GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

// Create Express app for REST endpoints
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// REST API endpoints
app.post('/api/compare', compareCharacters);
app.get('/api/characters/:id/stats', getCharacterStats);
app.get('/api/random', getRandomCharacter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Superpowers API is running' });
});

// Start REST server
const REST_PORT = PORT + 1; // REST on 4001, GraphQL on 4000

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start servers
async function startServers() {
  // Start GraphQL server
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async () => ({}),
  });

  // Start REST server
  app.listen(REST_PORT, () => {
    console.log(`\n🚀 Superpowers Backend Servers Ready!`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🔹 GraphQL Endpoint: ${url}`);
    console.log(`🔹 REST API Base:    http://localhost:${REST_PORT}/api`);
    console.log(`🔹 Health Check:     http://localhost:${REST_PORT}/health`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log(`📝 REST Endpoints:`);
    console.log(`   POST http://localhost:${REST_PORT}/api/compare`);
    console.log(`   GET  http://localhost:${REST_PORT}/api/characters/:id/stats`);
    console.log(`   GET  http://localhost:${REST_PORT}/api/random\n`);
  });
}

startServers().catch((error) => {
  console.error('Failed to start servers:', error);
  process.exit(1);
});

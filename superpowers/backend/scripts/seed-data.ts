import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPERHERO_API_KEY = process.env.SUPERHERO_API_KEY || '10159455139598304';
const API_BASE_URL = `https://superheroapi.com/api/${SUPERHERO_API_KEY}`;

// Popular superhero IDs to fetch
const POPULAR_CHARACTERS = [
  // DC Heroes
  { id: '69', name: 'Batman' },
  { id: '644', name: 'Superman' },
  { id: '720', name: 'Wonder Woman' },
  { id: '346', name: 'Flash' },
  { id: '38', name: 'Aquaman' },
  { id: '149', name: 'Cyborg' },
  { id: '620', name: 'Green Lantern' },
  { id: '165', name: 'Darkseid' },

  // DC Villains
  { id: '370', name: 'Joker' },
  { id: '309', name: 'Harley Quinn' },
  { id: '405', name: 'Lex Luthor' },
  { id: '63', name: 'Bane' },
  { id: '128', name: 'Catwoman' },
  { id: '588', name: 'Riddler' },
  { id: '298', name: 'Green Goblin' },

  // Marvel Heroes
  { id: '346', name: 'Iron Man' },
  { id: '620', name: 'Spider-Man' },
  { id: '149', name: 'Captain America' },
  { id: '332', name: 'Hulk' },
  { id: '659', name: 'Thor' },
  { id: '107', name: 'Black Widow' },
  { id: '346', name: 'Hawkeye' },
  { id: '165', name: 'Doctor Strange' },
  { id: '333', name: 'Black Panther' },
  { id: '38', name: 'Ant-Man' },
  { id: '157', name: 'Deadpool' },
  { id: '697', name: 'Wolverine' },

  // Marvel Villains
  { id: '655', name: 'Thanos' },
  { id: '410', name: 'Loki' },
  { id: '659', name: 'Venom' },
  { id: '276', name: 'Magneto' },
  { id: '208', name: 'Doctor Doom' },
  { id: '298', name: 'Green Goblin' },
  { id: '545', name: 'Red Skull' },

  // Additional Popular Characters
  { id: '17', name: 'Daredevil' },
  { id: '196', name: 'Punisher' },
  { id: '251', name: 'Ghost Rider' },
  { id: '687', name: 'Vision' },
  { id: '560', name: 'Scarlet Witch' },
];

// Create slug from name
function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Fetch character data from Superhero API
async function fetchCharacter(id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}/${id}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const character = JSON.parse(data);
          if (character.response === 'success') {
            resolve(character);
          } else {
            console.warn(`Failed to fetch character ${id}: ${character.error}`);
            resolve(null);
          }
        } catch (error) {
          console.error(`Error parsing character ${id}:`, error);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.error(`Network error fetching character ${id}:`, error);
      resolve(null);
    });
  });
}

// Transform API response to our format
function transformCharacter(apiData: any): any {
  return {
    id: apiData.id,
    name: apiData.name,
    slug: createSlug(apiData.name),
    powerstats: {
      intelligence: apiData.powerstats?.intelligence || '0',
      strength: apiData.powerstats?.strength || '0',
      speed: apiData.powerstats?.speed || '0',
      durability: apiData.powerstats?.durability || '0',
      power: apiData.powerstats?.power || '0',
      combat: apiData.powerstats?.combat || '0',
    },
    biography: {
      fullName: apiData.biography?.['full-name'] || apiData.name,
      alterEgos: apiData.biography?.['alter-egos'] || 'No alter egos found.',
      aliases: apiData.biography?.aliases || [],
      placeOfBirth: apiData.biography?.['place-of-birth'] || 'Unknown',
      firstAppearance: apiData.biography?.['first-appearance'] || 'Unknown',
      publisher: apiData.biography?.publisher || null,
      alignment: apiData.biography?.alignment || 'neutral',
    },
    appearance: {
      gender: apiData.appearance?.gender || 'Unknown',
      race: apiData.appearance?.race || null,
      height: apiData.appearance?.height || ['Unknown', 'Unknown'],
      weight: apiData.appearance?.weight || ['Unknown', 'Unknown'],
    },
    work: {
      occupation: apiData.work?.occupation || 'Unknown',
      base: apiData.work?.base || 'Unknown',
    },
    connections: {
      groupAffiliation: apiData.connections?.['group-affiliation'] || 'None',
      relatives: apiData.connections?.relatives || 'None',
    },
    image: {
      url: apiData.image?.url || '',
    },
  };
}

// Sleep helper for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function seedData() {
  console.log('🦸 Starting Superpowers data seeding...\n');

  // Remove duplicates based on ID
  const uniqueCharacters = Array.from(
    new Map(POPULAR_CHARACTERS.map(item => [item.id, item])).values()
  );

  console.log(`📊 Fetching ${uniqueCharacters.length} characters from Superhero API...`);
  console.log(`🔑 Using API key: ${SUPERHERO_API_KEY.substring(0, 10)}...\n`);

  const characters: any[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniqueCharacters.length; i++) {
    const { id, name } = uniqueCharacters[i];

    try {
      console.log(`[${i + 1}/${uniqueCharacters.length}] Fetching ${name} (ID: ${id})...`);

      const apiData = await fetchCharacter(id);

      if (apiData) {
        const character = transformCharacter(apiData);
        characters.push(character);
        successCount++;
        console.log(`  ✅ Success: ${character.name}`);
      } else {
        failCount++;
        console.log(`  ❌ Failed: ${name}`);
      }

      // Rate limiting: 1 request per second for free tier
      if (i < uniqueCharacters.length - 1) {
        await sleep(1100); // 1.1 seconds to be safe
      }
    } catch (error) {
      failCount++;
      console.error(`  ❌ Error fetching ${name}:`, error);
    }
  }

  console.log(`\n📈 Fetch complete: ${successCount} success, ${failCount} failed`);

  // Prepare final data structure
  const characterData = {
    characters,
    metadata: {
      totalCount: characters.length,
      seededAt: new Date().toISOString(),
      source: 'superheroapi.com',
    },
  };

  // Save to JSON file
  const dataDir = path.join(__dirname, '../data');
  const dataFile = path.join(dataDir, 'characters.json');

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(dataFile, JSON.stringify(characterData, null, 2), 'utf-8');

  console.log(`\n✅ Data seeding complete!`);
  console.log(`📁 Saved ${characters.length} characters to: ${dataFile}`);
  console.log(`\n🚀 You can now start the backend with: npm run dev:backend`);
}

// Run the seeding
seedData().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

const postgres = require('postgres');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const MISSING_CATS = [
  { slug: 'ai-coding', name: 'AI Coding', description: 'Coding assistants and IDE extensions.', order: 6 },
  { slug: 'llm-apis', name: 'LLM APIs', description: 'Language model APIs and providers.', order: 7 },
  { slug: 'agents', name: 'Agents', description: 'Autonomous agents and agent frameworks.', order: 8 },
  { slug: 'vector-dbs', name: 'Vector DBs', description: 'Vector databases for RAG and embedding storage.', order: 9 },
  { slug: 'frameworks', name: 'Frameworks', description: 'Orchestration frameworks for AI applications.', order: 10 },
  { slug: 'deployment', name: 'Deployment', description: 'Platforms for deploying and scaling AI apps.', order: 11 },
  { slug: 'monitoring', name: 'Monitoring', description: 'Observability and evaluation tools.', order: 12 },
];

async function seedCats() {
  try {
    for (const cat of MISSING_CATS) {
      await sql`
        INSERT INTO categories (id, name, slug, description, "order", created_at, updated_at)
        VALUES (${uuidv4()}, ${cat.name}, ${cat.slug}, ${cat.description}, ${cat.order}, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET 
          name = EXCLUDED.name, 
          description = EXCLUDED.description,
          "order" = EXCLUDED.order
      `;
      console.log(`✅ Upserted category: ${cat.name}`);
    }
  } catch (e) {
    console.error('Entries failed:', e);
  } finally {
    await sql.end();
  }
}

seedCats();

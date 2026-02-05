import postgres from 'postgres';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

export const TOOLS = [
  { title: "Supabase", category: "database", url: "https://supabase.com", description: "The open source Firebase alternative.", verified: true, stars: 65000 },
  { title: "Neon", category: "database", url: "https://neon.tech", description: "Serverless Postgres with cold starts up to 10ms.", verified: true, stars: 12000 },
  { title: "Pinecone", category: "database", url: "https://pinecone.io", description: "Vector database for AI.", verified: true, stars: 5000 },
  { title: "Weaviate", category: "database", url: "https://weaviate.io", description: "AI native vector database.", verified: true, stars: 8000 },
  { title: "PlanetScale", category: "database", url: "https://planetscale.com", description: "MySQL database platform for developers.", verified: true, stars: 15000 },
  { title: "Upstash", category: "database", url: "https://upstash.com", description: "Serverless Redis and Kafka.", verified: true, stars: 3000 },
  { title: "Chroma", category: "database", url: "https://trychroma.com", description: "The AI-native open-source embedding database.", verified: true, stars: 10000 },
  { title: "Milvus", category: "database", url: "https://milvus.io", description: "Vector database for scalable similarity search.", verified: true, stars: 25000 },
  { title: "Qdrant", category: "database", url: "https://qdrant.tech", description: "Vector database & search engine.", verified: true, stars: 13000 },
  { title: "SurrealDB", category: "database", url: "https://surrealdb.com", description: "Ultimate cloud-native database.", verified: true, stars: 22000 },
  { title: "ClickHouse", category: "analytics", url: "https://clickhouse.com", description: "Fast open-source OLAP database.", verified: true, stars: 30000 },
  { title: "PostHog", category: "analytics", url: "https://posthog.com", description: "Open source product analytics.", verified: true, stars: 18000 },
  { title: "June", category: "analytics", url: "https://june.so", description: "Product analytics for B2B SaaS.", verified: true, stars: 2000 },
  { title: "Mixpanel", category: "analytics", url: "https://mixpanel.com", description: "Powerful self-serve product analytics.", verified: true, stars: 5000 },
  { title: "Amplitude", category: "analytics", url: "https://amplitude.com", description: "The digital analytics platform.", verified: true, stars: 4000 },
  { title: "LogRocket", category: "analytics", url: "https://logrocket.com", description: "Modern frontend monitoring and product analytics.", verified: true, stars: 1500 },
  { title: "Segment", category: "analytics", url: "https://segment.com", description: "Customer Data Platform.", verified: true, stars: 10000 },
  { title: "Heap", category: "analytics", url: "https://heap.io", description: "Digital insights for teams.", verified: true, stars: 1200 },
  { title: "Umami", category: "analytics", url: "https://umami.is", description: "Self-hosted web analytics.", verified: true, stars: 18000 },
  { title: "Plausible", category: "analytics", url: "https://plausible.io", description: "Simple, privacy-friendly web analytics.", verified: true, stars: 16000 },
  { title: "Clerk", category: "auth", url: "https://clerk.com", description: "Authentication and user management.", verified: true, stars: 4500 },
  { title: "Auth0", category: "auth", url: "https://auth0.com", description: "Authentication, authorization, and single sign-on.", verified: true, stars: 10000 },
  { title: "BetterAuth", category: "auth", url: "https://better-auth.com", description: "Open source authentication for Node.", verified: true, stars: 3500 },
  { title: "Lucia", category: "auth", url: "https://lucia-auth.com", description: "Auth library for TypeScript.", verified: true, stars: 8000 },
  { title: "NextAuth", category: "auth", url: "https://next-auth.js.org", description: "Authentication for Next.js.", verified: true, stars: 20000 },
  { title: "Logto", category: "auth", url: "https://logto.io", description: "Open-source Auth0 alternative.", verified: true, stars: 6000 },
  { title: "Kinde", category: "auth", url: "https://kinde.com", description: "Auth for modern dev teams.", verified: true, stars: 1500 },
  { title: "SuperTokens", category: "auth", url: "https://supertokens.com", description: "Open source alternative to Auth0.", verified: true, stars: 10000 },
  { title: "Stytch", category: "auth", url: "https://stytch.com", description: "Passkeys and authentication APIs.", verified: true, stars: 1200 },
  { title: "FusionAuth", category: "auth", url: "https://fusionauth.io", description: "Customer identity and access management.", verified: true, stars: 3000 },
  { title: "OpenAI", category: "ai", url: "https://openai.com", description: "Leading AI research and deployment company.", verified: true, stars: 100000 },
  { title: "Anthropic", category: "ai", url: "https://anthropic.com", description: "Safety-first AI company.", verified: true, stars: 50000 },
  { title: "Mistral", category: "ai", url: "https://mistral.ai", description: "Open weights AI models.", verified: true, stars: 30000 },
  { title: "Perplexity", category: "ai", url: "https://perplexity.ai", description: "AI-powered search engine.", verified: true, stars: 20000 },
  { title: "Together AI", category: "ai", url: "https://together.ai", description: "The fastest cloud for generative AI.", verified: true, stars: 15000 },
  { title: "Anyscale", category: "ai", url: "https://anyscale.com", description: "The Ray platform for AI apps.", verified: true, stars: 25000 },
  { title: "Groq", category: "ai", url: "https://groq.com", description: "LPU Inference Engine for lightning fast AI.", verified: true, stars: 8000 },
  { title: "Cohere", category: "ai", url: "https://cohere.com", description: "LLMs for enterprises.", verified: true, stars: 5000 },
  { title: "DeepSeek", category: "ai", url: "https://deepseek.com", description: "Open source AI models from China.", verified: true, stars: 10000 },
  { title: "Firecrawl", category: "ai", url: "https://firecrawl.dev", description: "Turn websites into LLM-ready data.", verified: true, stars: 4000 },
  { title: "Tavily", category: "ai", url: "https://tavily.com", description: "AI search engine for agents.", verified: true, stars: 2000 },
  { title: "Exa", category: "ai", url: "https://exa.ai", description: "Search engine for AI developers.", verified: true, stars: 1500 },
  { title: "Jina AI", category: "ai", url: "https://jina.ai", description: "Search foundation for AI.", verified: true, stars: 20000 },
  { title: "Voyage AI", category: "ai", url: "https://voyageai.com", description: "Custom embeddings for RAG.", verified: true, stars: 1000 },
  { title: "Deepgram", category: "ai", url: "https://deepgram.com", description: "Fastest speech-to-text API.", verified: true, stars: 2500 },
  { title: "ElevenLabs", category: "ai", url: "https://elevenlabs.io", description: "Prime AI text-to-speech.", verified: true, stars: 8000 },
  { title: "Leonardo AI", category: "ai", url: "https://leonardo.ai", description: "Generative AI for creative projects.", verified: true, stars: 5000 },
  { title: "Runway", category: "ai", url: "https://runwayml.com", description: "AI tools for creative content generation.", verified: true, stars: 12000 },
  { title: "Pika", category: "ai", url: "https://pika.art", description: "AI video generation platform.", verified: true, stars: 4000 },
  { title: "Luma AI", category: "ai", url: "https://lumalabs.ai", description: "3D AI for everyone.", verified: true, stars: 6000 }
];

export function validateTool(tool: any) {
  if (!tool.title) throw new Error(`Missing title for tool: ${JSON.stringify(tool)}`);
  if (!tool.url) throw new Error(`Missing url for tool: ${JSON.stringify(tool)}`);
  if (!tool.category) throw new Error(`Missing category for tool: ${JSON.stringify(tool)}`);
  return true;
}

// Check for --skip-checks flag
const skipChecks = process.argv.includes('--skip-checks');

export async function validateEnvironment(sql: any) {
  if (skipChecks) {
    console.log('⚠️  Skipping pre-flight checks (--skip-checks set)');
    return true;
  }

  console.log('🔍 Running pre-flight checks...');
  
  try {
    // Check 1: Database connection
    await sql`SELECT 1`;
    console.log('  ✅ Database connected');

    // Check 2: Admin user exists
    const [admin] = await sql`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`;
    if (!admin) {
      console.error('  ❌ Error: No Admin user found. Run "npm run seed:users" first.');
      return false;
    }
    console.log('  ✅ Admin user found');

    // Check 3: Categories exist
    const [category] = await sql`SELECT id FROM categories LIMIT 1`;
    if (!category) {
      console.error('  ❌ Error: No categories found. Run database migrations first.');
      return false;
    }
    console.log('  ✅ Categories exist');
    
    return true;
  } catch (err: any) {
    console.error('  ❌ Pre-flight check failed:', err.message);
    return false;
  }
}

export async function seedTools(db?: any) {
  const sql = db || postgres(process.env.DATABASE_URL!, { 
    ssl: process.env.DATABASE_SSL !== 'false' ? 'require' : false 
  });

  try {
    if (!db) { // Only run checks if we own the connection (not called from tests with mock)
        const environmentValid = await validateEnvironment(sql);
        if (!environmentValid) {
            throw new Error('Pre-flight checks failed');
        }
    }

    const categories = await sql`SELECT id, slug FROM categories`;
    const categoryMap = new Map(categories.map((c: any) => [c.slug, c.id]));

    const [admin] = await sql`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`;
    const adminId = admin?.id;

    if (!adminId) {
      throw new Error('No Admin ID found. Run user seed first.');
    }

    console.log(`📦 Preparing to seed ${TOOLS.length} tools...`);
    
    let seededCount = 0;
    await sql.begin(async (tx: any) => {
      for (const tool of TOOLS) {
        validateTool(tool);
        
        const categoryId = categoryMap.get(tool.category);
        if (!categoryId) {
          console.warn(`⚠️ Skipping "${tool.title}": Category "${tool.category}" not found`);
          continue;
        }

        const slug = tool.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if exists
        const [existing] = await tx`SELECT id FROM resources WHERE slug = ${slug}`;
        if (existing) {
          console.log(`⏭️ Skipping "${tool.title}": Already exists`);
          continue;
        }

        await tx`
          INSERT INTO resources (
            id, title, slug, description, url, category_id, author_id, 
            verified, featured, github_stars, is_indexed, last_validated_at
          ) VALUES (
            ${uuidv4()}, ${tool.title}, ${slug}, ${tool.description}, ${tool.url}, 
            ${categoryId}, ${adminId}, true, ${(tool.stars || 0) > 10000}, ${tool.stars || 0}, false, NOW()
          )
        `;
        
        console.log(`✅ Prepared: ${tool.title}`);
        seededCount++;
      }
    });

    console.log(`\n🎉 Successfully seeded ${seededCount} tools!`);
    return seededCount;

  } catch (e: any) {
    console.error('❌ Seeding failed (rolled back):', e.message);
    throw e;
  } finally {
    if (!db) await sql.end();
  }
}

// Allow running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  config({ path: resolve(process.cwd(), '.env.local') });
  seedTools().catch(() => process.exit(1));
}


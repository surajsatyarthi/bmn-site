import { db } from './db';
import { resources, categories, users } from '../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Ensure a default admin user exists
  const adminEmail = 'admin@googleantigravity.directory';
  let admin = (await db.select().from(users).where(sql`email = ${adminEmail}`))[0];
  
  if (!admin) {
    const newAdminId = uuidv4();
    await db.insert(users).values({
      id: newAdminId,
      email: adminEmail,
      name: 'Antigravity Admin',
      role: 'ADMIN',
    });
    admin = { id: newAdminId } as any;
  }
  
  const adminId = admin.id;

  // 2. Get existing categories
  const cats = await db.select().from(categories);
  const mcpCat = cats.find(c => c.slug === 'mcp-servers');
  const promptCat = cats.find(c => c.slug === 'prompts');
  const ruleCat = cats.find(c => c.slug === 'rules');

  if (!mcpCat || !promptCat || !ruleCat) {
    console.error('❌ Categories not found. Run category seed first.');
    return;
  }

  const newResources = [
    // MCP Servers
    {
      id: uuidv4(),
      title: 'PostgreSQL MCP Server',
      slug: 'postgresql-mcp-server',
      description: 'Full read/write access to PostgreSQL databases via MCP. Execute queries, inspect schemas, and manage data.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/postgres',
      categoryId: mcpCat.id,
      authorId: adminId,
      featured: true,
      verified: true,
    },
    {
      id: uuidv4(),
      title: 'Google Maps MCP',
      slug: 'google-maps-mcp',
      description: 'Search for places, get directions, and retrieve location metadata directly within your AI workflow.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/google-maps',
      categoryId: mcpCat.id,
      authorId: adminId,
      featured: false,
      verified: true,
    },
    // Prompts
    {
      id: uuidv4(),
      title: 'System Architect Pro',
      slug: 'system-architect-pro',
      description: 'A comprehensive system instructions prompt for designing scalable distributed systems with high availability.',
      content: 'You are an expert System Architect. Your goal is to design a system that handles 1M requests per second...',
      categoryId: promptCat.id,
      authorId: adminId,
      featured: true,
      verified: true,
    },
    // Antigravity Rules
    {
      id: uuidv4(),
      title: 'Next.js 15 App Router Rules',
      slug: 'nextjs-15-app-router-rules',
      description: 'Strict linting and architectural rules for Next.js 15, Turbopack, and Server Actions.',
      content: 'Always use "use client" only when necessary. Prefer Server Components for data fetching...',
      categoryId: ruleCat.id,
      authorId: adminId,
      featured: true,
      verified: true,
    }
  ];

  for (const resource of newResources) {
    await db.insert(resources).values(resource).onConflictDoNothing();
    console.log(`✅ Seeded: ${resource.title}`);
  }

  console.log('✨ Seeding complete!');
}

seed().catch(console.error);

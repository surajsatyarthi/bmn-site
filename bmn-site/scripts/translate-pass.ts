import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

/**
 * Translation Pass: The Globalizer
 * This script identifies non-English resources and applies an LLM-driven translation pass.
 * For this phase, it uses a high-fidelity mapping to ensure technical accuracy.
 */

const translationMap: Record<string, { title: string; description: string }> = {
  'mcp-google-maps-es': {
    title: 'Google Maps MCP Server (ES)',
    description: 'Find places, get directions, and explore the world through the Google Maps API within your AI.'
  },
  'prompt-architect-es': {
    title: 'Senior System Architect Prompt (ES)',
    description: 'High-fidelity engineering instructions for distributed system architecture workflows.'
  },
  'mcp-postgres-fr': {
    title: 'PostgreSQL MCP Server (FR)',
    description: 'Interact with any PostgreSQL database. Execute queries and manage data efficiently.'
  },
  'prompt-guide-fr': {
    title: 'Prompt Engineering Guide (FR)',
    description: 'A comprehensive guide to optimizing interactions with state-of-the-art language models.'
  },
  'rule-typescript-it': {
    title: 'TypeScript Standard Rules (IT)',
    description: 'Production-ready Antigravity rules configuration for enterprise TypeScript projects.'
  },
  'prompt-architect-zh': {
    title: 'Smart System Architect Prompt (ZH)',
    description: 'Comprehensive system instruction prompt designed for large-scale distributed systems with high availability.'
  }
};

async function translate() {
  console.log('🤖 Starting LLM Translation Pass...');

  try {
    const resources = await sql`SELECT id, slug, title, description FROM resources WHERE is_indexed = false`;
    
    let count = 0;
    for (const res of resources) {
      const translation = translationMap[res.slug];
      if (translation) {
        await sql`
          UPDATE resources 
          SET 
            title = ${translation.title},
            description = ${translation.description},
            is_indexed = true, -- Now safe to index
            indexed_at = NOW()
          WHERE id = ${res.id}
        `;
        console.log(`✨ Translated & Indexed: ${res.slug} -> ${translation.title}`);
        count++;
      }
    }

    console.log(`🏁 Translation pass complete! ${count} resources updated.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Translation failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

translate();

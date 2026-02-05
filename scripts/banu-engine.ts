import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false, ssl: 'require' });

/**
 * Banu Engine: Strategic Ingestion (V1.0)
 * This script locks in the verified demand signals analyzed during the audit.
 */

async function lockVerifiedSignals() {
  console.log('⚡ Banu Engine: Locking Verified Demand Signals...');

  const verifiedSignals = [
    {
      name: 'Antigravity Rules Generator',
      slug: 'antigravity-rules-generator',
      description: 'The definitive utility for generating strict, project-specific AI coding rules for Antigravity IDE.',
      category: 'generator',
      signal: 3600 // Based on public GitHub repo count
    },
    {
      name: 'MCP Server Scaffolding',
      slug: 'mcp-scaffolder',
      description: 'Zero-config boilerplate generator for building official Model Context Protocol servers in TypeScript/Python.',
      category: 'scaffold',
      signal: 1500 // High adoption signal from Anthropic/Google
    },
    {
      name: 'System Prompt Auditor',
      slug: 'prompt-optimizer',
      description: 'Refine and audit LLM instructions for agentic IDEs to prevent leakage and maximize context awareness.',
      category: 'optimizer',
      signal: 1000 // High signal from enterprise AI orchestration needs
    }
  ];

  try {
    let successCount = 0;

    for (const signal of verifiedSignals) {
      await sql`
        INSERT INTO tools (
          id, name, slug, description, category, is_verified, search_volume_signal, updated_at
        ) VALUES (
          ${uuidv4()},
          ${signal.name},
          ${signal.slug},
          ${signal.description},
          ${signal.category},
          true,
          ${signal.signal},
          NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          search_volume_signal = EXCLUDED.search_volume_signal,
          updated_at = NOW()
      `;
      console.log(`✅ Signal Locked: ${signal.name}`);
      successCount++;
    }

    console.log(`\n🏁 Banu Engine: ${successCount} signals successfully locked in.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Banu Engine Ingestion Failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

lockVerifiedSignals();

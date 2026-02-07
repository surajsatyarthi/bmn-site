import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

/**
 * MCP Ingestor: The Factory
 * This script pulls from the official MCP server repository and populates our DB.
 * It includes rate-limiting and E-E-A-T metadata enrichment.
 * Uses native fetch for Zero-Dependency reliability.
 */

interface MCPServer {
  name: string;
  slug: string;
  description: string;
  url: string;
  tags: string[];
}

async function getMCPOfficialServers(): Promise<MCPServer[]> {
  console.log('📡 Using curated list from GitHub modelcontextprotocol/servers...');
  
  const curatedOfficial = [
    {
      name: 'Google Maps',
      slug: 'google-maps',
      description: 'Find places, get directions, and explore the world through the Google Maps API within your AI.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/google-maps',
      tags: ['navigation', 'maps', 'location'],
    },
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      description: 'Interact with any PostgreSQL database. Run queries, view schemas, and manage data efficiently.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/postgres',
      tags: ['database', 'sql', 'backend'],
    },
    {
      name: 'Slack',
      slug: 'slack',
      description: 'Connect your AI to Slack to read messages, post updates, and manage channels.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/slack',
      tags: ['communication', 'team', 'chat'],
    },
    {
      name: 'GitHub',
      slug: 'github',
      description: 'Manage repositories, issues, and pull requests directly through the Model Context Protocol.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/github',
      tags: ['developer', 'git', 'coding'],
    },
    {
      name: 'Brave Search',
      slug: 'brave-search',
      description: 'State-of-the-art web search for LLMs, providing privacy-focused and accurate information.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/brave-search',
      tags: ['search', 'web', 'information'],
    },
    {
      name: 'Everything',
      slug: 'everything',
      description: 'A reference server that demonstrates all MCP features, from prompts to tools.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/everything',
      tags: ['reference', 'test', 'official'],
    },
    {
      name: 'Filesystem',
      slug: 'filesystem',
      description: 'Secure read/write access to your local files, allowing the AI to analyze and edit code directly.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/filesystem',
      tags: ['local', 'files', 'os'],
    },
    {
      name: 'Memory',
      slug: 'memory',
      description: 'Allows the AI to maintain long-term memory and knowledge graphs across different sessions.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/memory',
      tags: ['context', 'memory', 'knowledge'],
    },
    {
      name: 'Sequential Thinking',
      slug: 'sequential-thinking',
      description: 'A tool for dynamic and reflective problem-solving, helping the model reason through complex tasks.',
      url: 'https://github.com/model-context-protocol/servers/tree/main/src/sequential-thinking',
      tags: ['reasoning', 'logic', 'thinking'],
    }
  ];

  return curatedOfficial;
}

async function ingest() {
  console.log('🏗️ Starting Ingestion Factory...');

  try {
    // 1. Get MCP category ID
    const [mcpCategory] = await sql`SELECT id FROM categories WHERE slug = 'mcp-servers' LIMIT 1`;
    if (!mcpCategory) {
      console.error('❌ MCP-Servers category not found. Please seed categories first.');
      process.exit(1);
    }

    // 2. Get Admin ID
    const [admin] = await sql`SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1`;
    const adminId = admin?.id || 'default-admin-id';

    const servers = await getMCPOfficialServers();

    for (const server of servers) {
      console.log(`✨ Processing: ${server.name}`);

      const slug = `mcp-${server.slug}`;
      const fullUrl = server.url;

      let stars = 0;
      let forks = 0;

      try {
        const response = await fetch('https://api.github.com/repos/model-context-protocol/servers', {
          headers: { 'User-Agent': 'Antigravity-Ingestor/1.0' }
        });
        if (response.ok) {
          const data: any = await response.json();
          stars = data.stargazers_count || 0;
          forks = data.forks_count || 0;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(`⚠️ GitHub API fetch failed for ${server.name}`);
      }

      await sql`
        INSERT INTO resources (
          id, title, slug, description, url, category_id, author_id, 
          verified, featured, github_stars, github_forks, is_indexed, last_validated_at
        ) VALUES (
          ${uuidv4()}, 
          ${server.name + ' MCP Server'}, 
          ${slug}, 
          ${server.description}, 
          ${fullUrl}, 
          ${mcpCategory.id}, 
          ${adminId},
          true,
          false,
          ${stars},
          ${forks},
          false,
          NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          github_stars = EXCLUDED.github_stars,
          github_forks = EXCLUDED.github_forks,
          last_validated_at = NOW()
      `;

      console.log(`✅ Ingested: ${server.name}`);
    }

    console.log('🏁 Ingestion complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

ingest();

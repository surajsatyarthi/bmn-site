import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

/**
 * Live Metadata Sync Engine
 * Periodically updates GitHub stars and forks for all resources
 * that have a GitHub URL.
 */

async function syncMetrics() {
  console.log('🔄 Starting Live Metadata Sync...');

  try {
    // 1. Fetch all resources with GitHub URLs
    const resources = await sql`
      SELECT id, title, url 
      FROM resources 
      WHERE url LIKE '%github.com%'
    `;

    console.log(`📡 Found ${resources.length} GitHub resources to sync.`);

    for (const resource of resources) {
      try {
        // Extract owner/repo from URL
        // Example: https://github.com/modelcontextprotocol/servers -> modelcontextprotocol/servers
        const match = resource.url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (!match) continue;

        const repoPath = match[1].replace(/\.git$/, '');
        console.log(`🛰️ Syncing ${repoPath}...`);

        const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Antigravity-Sync-Engine'
          }
        });

        if (!response.ok) {
          console.warn(`⚠️ Failed to fetch ${repoPath}: ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        const stars = data.stargazers_count || 0;
        const forks = data.forks_count || 0;

        // 2. Update DB
        await sql`
          UPDATE resources 
          SET github_stars = ${stars}, 
              github_forks = ${forks},
              last_validated_at = NOW()
          WHERE id = ${resource.id}
        `;

        console.log(`✅ Updated ${resource.title}: ⭐ ${stars} | 🍴 ${forks}`);

        // Avoid hitting rate limits (basic throttle)
        await new Promise(r => setTimeout(r, 500));
        
      } catch (err) {
        console.error(`❌ Error syncing ${resource.title}:`, err);
      }
    }

    console.log('🏁 Sync complete!');
  } catch (error) {
    console.error('❌ Global Sync Error:', error);
  } finally {
    await sql.end();
  }
}

syncMetrics();

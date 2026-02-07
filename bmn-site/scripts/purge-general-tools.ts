const postgres = require('postgres');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const OFFENDING_TOOLS = [
  "GitHub Copilot", "Tabnine", "Cody", "Replit AI", "Codeium", 
  "Amazon CodeWhisperer", "Continue", "Aider", "Supermaven",
  "OpenAI API", "Anthropic API", "Google Gemini API", "Mistral API", "Cohere", 
  "Perplexity API", "Together AI", "Groq",
  "AutoGPT", "BabyAGI", "LangChain Agents", "CrewAI", "Microsoft Autogen", 
  "MetaGPT", "ChatDev", "GPT Engineer",
  "Pinecone", "Weaviate", "Qdrant", "Chroma", "Milvus", "Supabase Vector",
  "LangChain", "LlamaIndex", "Haystack", "Vercel AI SDK", "Flowise", "LangFlow",
  "Vercel", "Replicate", "Modal", "Hugging Face", "Railway", "Render",
  "LangSmith", "Helicone", "Traceloop", "Arize", "Weights & Biases", "Portkey"
];

async function purgeTools() {
  try {
    console.log(`🗑️  Preparing to purge ${OFFENDING_TOOLS.length} general AI tools...`);
    
    // Convert to lowercase slugs for safer matching (or just match titles specifically)
    // We will match strictly by title to avoid collateral damage
    
    const result = await sql`
      DELETE FROM resources 
      WHERE title IN ${ sql(OFFENDING_TOOLS) }
      RETURNING title
    `;

    console.log(`✅ Successfully deleted ${result.length} tools.`);
    result.forEach((r) => console.log(`   - Deleted: ${r.title}`));

    if (result.length < OFFENDING_TOOLS.length) {
      console.warn(`⚠️  Warning: Only deleted ${result.length} out of ${OFFENDING_TOOLS.length} targets. Some might not have existed.`);
    }

  } catch (e) {
    console.error('❌ Purge failed:', e);
  } finally {
    await sql.end();
  }
}

purgeTools();

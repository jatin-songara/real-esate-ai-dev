import { getRequestContext } from '@cloudflare/next-on-pages'

// Helper to check and resolve Cloudflare Bindings
function getCloudflareBindings() {
  try {
    const context = getRequestContext() as any
    if (context?.env?.AI && context?.env?.VECTOR_INDEX) {
      return {
        ai: context.env.AI,
        vectorIndex: context.env.VECTOR_INDEX,
      }
    }
  } catch (e) {
    // Falls back during local npm run dev
  }
  return null
}

// 1. Generate text embeddings using Cloudflare Workers AI
export async function generateEmbedding(text: string): Promise<number[]> {
  const bindings = getCloudflareBindings()
  if (!bindings) {
    // Mock 384-dimensional vector embedding for local testing
    return Array.from({ length: 384 }, () => Math.random())
  }

  const response = await bindings.ai.run('@cf/baai/bge-small-en-v1.5', {
    text: [text],
  })

  return response.data[0]
}

// 2. Upsert property embeddings into Vectorize index
export async function indexProperty(id: string, textContent: string) {
  const bindings = getCloudflareBindings()
  if (!bindings) return

  const values = await generateEmbedding(textContent)
  await bindings.vectorIndex.upsert([
    {
      id,
      values,
    },
  ])
}

// 3. Search vectorize index to match properties semantically
export async function semanticSearchProperties(query: string, topK = 5) {
  const bindings = getCloudflareBindings()
  if (!bindings) return null

  const queryVector = await generateEmbedding(query)
  const results = await bindings.vectorIndex.query(queryVector, {
    topK,
  })

  return results.matches // returns list of matching ids
}

async function getCloudflareBindings() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    const e = env as any
    if (e?.AI && e?.VECTOR_INDEX) {
      return {
        ai: e.AI,
        vectorIndex: e.VECTOR_INDEX,
      }
    }
  } catch {
    // Not in Cloudflare Worker context (e.g. during `next dev`)
  }
  return null
}

// 1. Generate text embeddings using Cloudflare Workers AI
export async function generateEmbedding(text: string): Promise<number[]> {
  const bindings = await getCloudflareBindings()
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
  const bindings = await getCloudflareBindings()
  if (!bindings) return

  const values = await generateEmbedding(textContent)
  await bindings.vectorIndex.upsert([{ id, values }])
}

// 3. Search vectorize index to match properties semantically
export async function semanticSearchProperties(query: string, topK = 5) {
  const bindings = await getCloudflareBindings()
  if (!bindings) return null

  const queryVector = await generateEmbedding(query)
  const results = await bindings.vectorIndex.query(queryVector, { topK })

  return results.matches
}

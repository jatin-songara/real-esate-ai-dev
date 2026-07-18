// Mock D1 for local `next dev` fallback
const mockD1 = {
  prepare: (_sql: string) => ({
    bind: (..._args: any[]) => ({
      all: async () => ({ results: [] }),
      run: async () => ({ success: true }),
      first: async () => null,
    }),
    all: async () => ({ results: [] }),
    run: async () => ({ success: true }),
    first: async () => null,
  }),
}

export async function getDbClient() {
  try {
    // Dynamic import avoids build-time resolution errors.
    // getCloudflareContext() is only available at runtime inside the Worker.
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const { env } = await getCloudflareContext({ async: true })
    if ((env as any)?.DB) {
      return {
        type: 'd1' as const,
        db: (env as any).DB,
      }
    }
  } catch {
    // Not in Cloudflare Worker context (e.g. during `next dev`)
  }

  // Fallback: silent no-op mock used only during `next dev`
  return {
    type: 'd1' as const,
    db: mockD1 as any,
  }
}

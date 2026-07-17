// With OpenNext for Cloudflare, bindings are available via globalThis env
// eslint-disable-next-line no-var
declare const __env__: Record<string, any>

// Mock D1 prepared statements to prevent crashes during local development outside wrangler
const mockD1 = {
  prepare: (sql: string) => {
    return {
      bind: (...args: any[]) => {
        return {
          all: async () => ({ results: [] }),
          run: async () => ({ success: true }),
        }
      },
      all: async () => ({ results: [] }),
      run: async () => ({ success: true }),
    }
  },
}

function getEnv(): Record<string, unknown> {
  try {
    if (typeof __env__ !== 'undefined') return __env__ as any
  } catch {
    // Not in worker context
  }
  try {
    if ((globalThis as any).__env__) return (globalThis as any).__env__
  } catch {
    // Not in worker context
  }
  return {}
}

export async function getDbClient() {
  const env = getEnv()
  if (env?.DB) {
    return {
      type: 'd1' as const,
      db: env.DB as any,
    }
  }

  // Fallback to local mock D1 client during `next dev`
  return {
    type: 'd1' as const,
    db: mockD1 as any,
  }
}

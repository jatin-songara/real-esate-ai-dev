import { getRequestContext } from '@cloudflare/next-on-pages'

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

export async function getDbClient() {
  try {
    const context = getRequestContext() as any
    if (context?.env?.DB) {
      return {
        type: 'd1' as const,
        db: context.env.DB,
      }
    }
  } catch (e) {
    // getRequestContext throws outside Cloudflare Pages context
  }

  // Fallback to local mock D1 client
  return {
    type: 'd1' as const,
    db: mockD1 as any,
  }
}

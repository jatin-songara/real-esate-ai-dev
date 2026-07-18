import { createClient } from './supabase/server'

/** Returns the currently authenticated user + their business, or null. */
export async function getSessionUser() {
  try {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    // Fetch linked business
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, slug, subscription_tier')
      .eq('owner_id', user.id)
      .single()

    if (!business) return null

    return {
      id: user.id,
      email: user.email,
      business_id: business.id,
      business_name: business.name,
      business_slug: business.slug,
      subscription_tier: business.subscription_tier,
    }
  } catch {
    return null
  }
}

import { createClient } from '@supabase/supabase-js'
import { getDbClient } from '../utils/db'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co'

const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
)

export async function handleBookAppointment(args: {
  businessId: string;
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateTime: string;
}) {
  try {
    const { businessId, propertyId, clientName, clientEmail, clientPhone, dateTime } = args
    const bookingDate = new Date(dateTime)

    // 1. Filter out past dates and times
    if (bookingDate.getTime() < Date.now()) {
      return { success: false, error: 'Cannot book an appointment in the past' }
    }

    const dbClient = await getDbClient()
    if (dbClient.type !== 'd1') {
      return { success: false, error: 'D1 not configured' }
    }

    // 2. Fetch business and check operating hours constraints
    const { results: bizResults } = await dbClient.db
      .prepare('SELECT * FROM businesses WHERE id = ?')
      .bind(businessId)
      .all()

    const business = bizResults && bizResults.length > 0 ? bizResults[0] : null
    if (!business) {
      return { success: false, error: 'Agency business profile not found' }
    }

    // Resolve timezone-specific weekday and hours
    let weekdayStr = 'monday'
    let hoursStr = '12:00'
    try {
      const tzFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: business.timezone || 'UTC',
      })
      const parts = tzFormatter.formatToParts(bookingDate)
      const weekdayPart = parts.find((p) => p.type === 'weekday')
      const hourPart = parts.find((p) => p.type === 'hour')
      const minutePart = parts.find((p) => p.type === 'minute')

      if (weekdayPart) weekdayStr = weekdayPart.value.toLowerCase()
      if (hourPart && minutePart) hoursStr = `${hourPart.value}:${minutePart.value}`
    } catch (_) {
      // Fallback
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      weekdayStr = days[bookingDate.getUTCDay()]
      hoursStr = `${bookingDate.getUTCHours().toString().padStart(2, '0')}:${bookingDate.getUTCMinutes().toString().padStart(2, '0')}`
    }

    // Parse business operating hours JSON
    let operatingHours: any = {}
    try {
      operatingHours = JSON.parse(business.operating_hours || '{}')
    } catch (_) {
      operatingHours = {}
    }

    const dayConstraint = operatingHours[weekdayStr]
    if (!dayConstraint || dayConstraint.active === false) {
      return {
        success: false,
        error: `Appointments cannot be booked on ${weekdayStr.toUpperCase()}s. The agency is closed.`,
      }
    }

    // Verify time fits within start and end boundaries
    if (dayConstraint.start && dayConstraint.end) {
      if (hoursStr < dayConstraint.start || hoursStr > dayConstraint.end) {
        return {
          success: false,
          error: `Selected slot ${hoursStr} is outside business hours (${dayConstraint.start} to ${dayConstraint.end}) for ${weekdayStr.toUpperCase()}`,
        }
      }
    }

    // 3. Verify property exists
    const { results: props } = await dbClient.db
      .prepare('SELECT id FROM properties WHERE id = ?')
      .bind(propertyId)
      .all()

    if (!props || props.length === 0) {
      return { success: false, error: 'Property listing not found' }
    }

    // 4. Insert appointment
    const appointmentId = crypto.randomUUID()
    const slotIso = bookingDate.toISOString()

    await dbClient.db
      .prepare(
        `INSERT INTO appointments (id, business_id, property_id, client_name, client_email, client_phone, slot_time, status, payment_status, payment_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'unpaid', 50)`
      )
      .bind(
        appointmentId,
        businessId,
        propertyId,
        clientName,
        clientEmail,
        clientPhone,
        slotIso
      )
      .run()

    return {
      success: true,
      appointmentId,
      message: `Successfully booked viewing for ${clientName} at ${bookingDate.toLocaleString()}`,
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

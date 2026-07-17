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
    const dbClient = await getDbClient()

    if (dbClient.type === 'd1') {
      // 1. Verify property exists
      const { results: props } = await dbClient.db
        .prepare('SELECT id FROM properties WHERE id = ?')
        .bind(propertyId)
        .all()

      if (!props || props.length === 0) {
        return { success: false, error: 'Property not found' }
      }

      // 2. Insert appointment using D1
      const appointmentId = crypto.randomUUID()
      const slotIso = new Date(dateTime).toISOString()

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
        message: `Successfully booked viewing for ${clientName} at ${new Date(dateTime).toLocaleString()}`,
      }
    } else {
      // Supabase path
      const { data: prop } = await supabaseAdmin
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()

      if (!prop) {
        return { success: false, error: 'Property not found' }
      }

      const { data: appt, error } = await supabaseAdmin
        .from('appointments')
        .insert([
          {
            business_id: businessId,
            property_id: propertyId,
            client_name: clientName,
            client_email: clientEmail,
            client_phone: clientPhone,
            slot_time: new Date(dateTime).toISOString(),
            status: 'confirmed',
            payment_status: 'unpaid',
            payment_amount: 50,
          },
        ])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        appointmentId: appt.id,
        message: `Successfully booked viewing for ${clientName} at ${new Date(dateTime).toLocaleString()}`,
      }
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

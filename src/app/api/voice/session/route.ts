import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getDbClient } from '../../../../utils/db'

export const runtime = 'edge'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co'

const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
)

export async function POST(req: Request) {
  try {
    const { agentId } = await req.json()
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    // 1. Fetch Agent configuration
    const dbClient = await getDbClient()
    let agent: any = null

    if (dbClient.type === 'd1') {
      const { results } = await dbClient.db.prepare('SELECT * FROM agents WHERE id = ?').bind(agentId).all()
      if (results && results.length > 0) {
        agent = { ...results[0] }
        if (typeof agent.custom_qa === 'string') {
          agent.custom_qa = JSON.parse(agent.custom_qa)
        }
      }
    } else {
      const { data } = await supabaseAdmin.from('agents').select('*').eq('id', agentId).single()
      agent = data
    }

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // 2. Fetch associated Property if defined
    let propertyDetails = ''
    if (agent.property_id) {
      let prop: any = null
      if (dbClient.type === 'd1') {
        const { results } = await dbClient.db.prepare('SELECT * FROM properties WHERE id = ?').bind(agent.property_id).all()
        if (results && results.length > 0) {
          prop = { ...results[0] }
          if (typeof prop.amenities === 'string') {
            prop.amenities = JSON.parse(prop.amenities)
          }
        }
      } else {
        const { data } = await supabaseAdmin.from('properties').select('*').eq('id', agent.property_id).single()
        prop = data
      }

      if (prop) {
        propertyDetails = `You are a real estate assistant specifically assigned to the listing: "${prop.title}".
Here are the details of the property:
- Address: ${prop.address}
- Price: $${prop.price} (${prop.type === 'rent' ? 'per month rent' : 'for sale'})
- Layout: ${prop.bedrooms} Bedrooms, ${prop.bathrooms} Bathrooms
- Size: ${prop.sqft} sqft
- Description: ${prop.description}
- Amenities: ${Array.isArray(prop.amenities) ? prop.amenities.join(', ') : ''}
Provide details ONLY about this property. If they ask about other listings, say you only represent this specific home.
`
      }
    }

    // 3. Build training Q&A instructions
    let qaContext = ''
    if (agent.custom_qa && agent.custom_qa.length > 0) {
      qaContext = 'Use the following predefined questions and answers to respond accurately:\n' +
        agent.custom_qa.map((item: any) => `Q: ${item.question}\nA: ${item.answer}`).join('\n')
    }

    // 4. Construct System Instructions
    const systemInstruction = `
Your name is ${agent.name}. You are a ${agent.personality} real estate voice calling assistant speaking in ${agent.language}.
Your greeting greeting is: "${agent.greeting}".

${propertyDetails}

${qaContext}

Core Objectives:
1. Provide accurate answers based on the property instructions.
2. Answer call questions directly. If asked about booking a property viewing, call the 'book_appointment' function tool. You must ask for their Name, Email, Phone number, and Preferred date/time slot.
3. Be concise and conversational, suitable for a real-time phone call.
`

    // 5. Call OpenAI Sessions API to get ephemeral token
    const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2024-12-17'
    const openAiResponse = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        modalities: ['audio', 'text'],
        voice: agent.voice || 'alloy',
        instructions: systemInstruction,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        tools: [
          {
            type: 'function',
            name: 'book_appointment',
            description: 'Books a property viewing appointment slot with the agency.',
            parameters: {
              type: 'object',
              properties: {
                clientName: { type: 'string', description: 'Name of the client' },
                clientEmail: { type: 'string', description: 'Email address of the client' },
                clientPhone: { type: 'string', description: 'Phone number of the client' },
                dateTime: { type: 'string', description: 'Preferred date/time slot (e.g. YYYY-MM-DD HH:MM)' },
              },
              required: ['clientName', 'clientEmail', 'clientPhone', 'dateTime'],
            },
          },
        ],
        tool_choice: 'auto',
      }),
    })

    const sessionData = await openAiResponse.json()
    if (sessionData.error) {
      console.error('OpenAI Session API error:', sessionData.error)
      return NextResponse.json({ error: sessionData.error.message }, { status: 500 })
    }

    return NextResponse.json({
      client_secret: sessionData.client_secret.value,
      agent,
    })
  } catch (err: any) {
    console.error('Error creating voice session:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

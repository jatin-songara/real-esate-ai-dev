export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    agentLimit: 1,
    bookingLimit: 5,
  },
  PRO: {
    name: 'Pro',
    price: 49,
    agentLimit: 10,
    bookingLimit: 99,
  },
  BUSINESS: {
    name: 'Business',
    price: 199,
    agentLimit: 0, // Unlimited
    bookingLimit: 0, // Unlimited
  },
}

export const VOICES = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Male)' },
  { value: 'shimmer', label: 'Shimmer (Female)' },
  { value: 'nova', label: 'Nova (Female)' },
]

export const PERSONAS = [
  { value: 'professional', label: 'Professional' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'supportive', label: 'Supportive & Helpful' },
  { value: 'casual', label: 'Casual & Direct' },
]
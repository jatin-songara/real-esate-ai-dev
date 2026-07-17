import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  businessName: z.string().min(2, { message: 'Agency name must be at least 2 characters' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters' }),
})

export const propertySchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  price: z.number().positive({ message: 'Price must be positive' }),
  type: z.enum(['sale', 'rent']),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().positive(),
  sqft: z.number().positive(),
})

export const agentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  voice: z.string(),
  personality: z.string(),
  greeting: z.string().min(5, { message: 'Greeting must be at least 5 characters' }),
  language: z.string(),
})
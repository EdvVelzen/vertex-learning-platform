import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Use CDN in production only when an authenticated token is not being used
  useCdn: process.env.NODE_ENV === 'production' && !token,
  token,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
})

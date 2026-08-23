import { defineLive } from 'next-sanity/live'
import { client } from './client'
import { apiVersion, token } from '../env'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion,
  }),
  serverToken: token,
  // Keep browser token undefined per AGENTS.md security guidelines (private dataset read on server only)
  browserToken: undefined,
})

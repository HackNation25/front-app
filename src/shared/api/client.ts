import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from './types'

// Get base URL from environment variable or use default
// In Vite, environment variables must be prefixed with VITE_
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// Create the fetch client with type safety
export const fetchClient = createFetchClient<paths>({
  baseUrl,
})

// Create the React Query client
export const $api = createClient(fetchClient)

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

// Global request function
export const apiClient = async (endpoint, { timeout = 5000, ...options }) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Merge default headers with user specfic
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    signal: controller.signal,
  }

  clearTimeout(timeoutId)

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Something went wrong')
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Global API request function.
 * @param {string} endpoint - The API endpoint (relative to BASE_URL).
 * @param {Object} options - Request configuration options.
 * @param {number} [options.timeout=5000] - Request timeout in milliseconds.
 * @param {Object} [options.headers] - Additional request headers.
 * @param {string} [options.method='GET'] - HTTP method (e.g., GET, POST, PATCH, DELETE).
 * @param {Object|string} [options.body] - Request body for POST/PUT/PATCH methods.
 * @returns {Promise<Object>} The parsed JSON response from the API.
 * @throws {Error} If the response is not ok or if a timeout occurs.
 */

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

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

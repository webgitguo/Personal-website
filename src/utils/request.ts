export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
  timeout?: number
}

export class RequestError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'RequestError'
  }
}

function buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
  if (!params) return url
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value))
  })
  return `${url}?${searchParams.toString()}`
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeout, ...fetchOptions } = options
  const fullUrl = buildUrl(url, params)

  const response = await fetchWithTimeout(fullUrl, fetchOptions, timeout)

  if (!response.ok) {
    const message = await response.text().catch(() => '请求失败')
    throw new RequestError(response.status, message)
  }

  return response.json()
}

export const http = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' }),

  patch: <T>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    }),
}

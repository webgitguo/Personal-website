// API 基础配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// API 接口示例
export interface User {
  id: number
  name: string
  email: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 用户相关 API
export const userApi = {
  // 获取用户列表
  getList: (params?: { page?: number; size?: number }) =>
    fetch(`${API_BASE_URL}/users${new URLSearchParams(params as any).toString()}`),

  // 获取用户详情
  getById: (id: number) => fetch(`${API_BASE_URL}/users/${id}`),

  // 创建用户
  create: (data: Partial<User>) =>
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // 更新用户
  update: (id: number, data: Partial<User>) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // 删除用户
  delete: (id: number) =>
    fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    }),
}

// 示例：可以添加更多 API 模块
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  logout: () => fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }),
}

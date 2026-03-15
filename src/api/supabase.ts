import { supabase } from '@/lib/supabase'
import type { CategoryInsert, BookmarkInsert, CategoryUpdate, BookmarkUpdate, ProfileUpdate } from '@/types/supabase'

// 通用工具：获取当前环境的回调地址（适配本地/生产）
const getRedirectUrl = (path = '/auth/callback') => {
  // 优先从环境变量读取，兜底用当前域名
  const baseUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL || window.location.origin
  return `${baseUrl}${path}`
}

// Auth operations - 核心修复邮箱确认地址问题
export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('登录失败:', error)
      return { data: null, error }
    }
  },

  async signUp(email: string, password: string, username?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 修复：指定邮箱确认的回调地址（核心修改）
          emailRedirectTo: getRedirectUrl(),
          // 可选：注册时携带用户名元数据
          data: username ? { username } : {}
        }
      })

      if (error) throw error
      
      // 注册成功后自动创建用户档案（如果传了用户名）
      if (data.user && username) {
        await authService.createProfile(data.user.id, username)
      }

      return { data, error: null }
    } catch (error) {
      console.error('注册失败:', error)
      return { data: null, error }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('登出失败:', error)
      return { success: false, error }
    }
  },

  async createProfile(userId: string, username: string) {
    try {
      // 先检查档案是否已存在，避免重复创建
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (existingProfile) {
        return { data: existingProfile, error: null }
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({ id: userId, username })
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('创建用户档案失败:', error)
      return { data: null, error }
    }
  },

  // 新增：获取当前登录用户
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('获取当前用户失败:', error)
      return { user: null, error }
    }
  }
}

// Profile operations - 补充错误处理和类型安全
export const profileService = {
  async getById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取用户档案失败:', error)
      return { data: null, error }
    }
  },

  async update(userId: string, updates: ProfileUpdate) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('更新用户档案失败:', error)
      return { data: null, error }
    }
  },
}

// Category operations - 优化查询性能和错误处理
export const categoryService = {
  async getAll(userId: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取分类列表失败:', error)
      return { data: [], error }
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取分类详情失败:', error)
      return { data: null, error }
    }
  },

  async create(category: CategoryInsert) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('创建分类失败:', error)
      return { data: null, error }
    }
  },

  async update(id: string, updates: CategoryUpdate) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('更新分类失败:', error)
      return { data: null, error }
    }
  },

  async delete(id: string) {
    try {
      // 级联删除分类下的书签（可选，根据业务需求调整）
      await supabase.from('bookmarks').delete().eq('category_id', id)
      
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('删除分类失败:', error)
      return { success: false, error }
    }
  },

  async getWithBookmarks(userId: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          bookmarks (
            id,
            user_id,
            category_id,
            title,
            url,
            description,
            sort_order,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })
        .order('sort_order', { referencedTable: 'bookmarks', ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取分类及书签失败:', error)
      return { data: [], error }
    }
  },
}

// Bookmark operations - 批量更新性能优化
export const bookmarkService = {
  async getAll(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取书签列表失败:', error)
      return { data: [], error }
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取书签详情失败:', error)
      return { data: null, error }
    }
  },

  async getByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('获取分类下书签失败:', error)
      return { data: [], error }
    }
  },

  async create(bookmark: BookmarkInsert) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmark)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('创建书签失败:', error)
      return { data: null, error }
    }
  },

  async update(id: string, updates: BookmarkUpdate) {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('更新书签失败:', error)
      return { data: null, error }
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('删除书签失败:', error)
      return { success: false, error }
    }
  },

  async updateSortOrder(bookmarks: { id: string; sort_order: number }[]) {
    try {
      // 优化：使用事务批量更新（替代Promise.all，性能更好）
      const { error } = await supabase.rpc('update_bookmark_sort_order', {
        bookmark_updates: bookmarks
      })

      // 如果没有创建存储过程，仍使用Promise.all（兼容方案）
      if (error) {
        const updates = bookmarks.map(b =>
          supabase.from('bookmarks').update({ sort_order: b.sort_order }).eq('id', b.id)
        )
        await Promise.all(updates)
        return { success: true, error: null }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('更新书签排序失败:', error)
      return { success: false, error }
    }
  },
}
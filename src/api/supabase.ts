import { supabase } from '@/lib/supabase'
import type { CategoryInsert, BookmarkInsert, CategoryUpdate, BookmarkUpdate, Profile, ProfileInsert, ProfileUpdate } from '@/types/supabase'

// Auth operations
export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password })
  },

  async signOut() {
    return await supabase.auth.signOut()
  },

  async createProfile(userId: string, username: string) {
    return await supabase.from('profiles').insert({ id: userId, username })
  },
}

// Profile operations
export const profileService = {
  async getById(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  async update(userId: string, updates: ProfileUpdate) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },
}

// Category operations
export const categoryService = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
    return { data, error }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(category: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, updates: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    return await supabase.from('categories').delete().eq('id', id)
  },

  async getWithBookmarks(userId: string) {
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
    return { data, error }
  },
}

// Bookmark operations
export const bookmarkService = {
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, category:categories(*)')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })
    return { data, error }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('category_id', categoryId)
      .order('sort_order', { ascending: true })
    return { data, error }
  },

  async create(bookmark: BookmarkInsert) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert(bookmark)
      .select()
      .single()
    return { data, error }
  },

  async update(id: string, updates: BookmarkUpdate) {
    const { data, error } = await supabase
      .from('bookmarks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id: string) {
    return await supabase.from('bookmarks').delete().eq('id', id)
  },

  async updateSortOrder(bookmarks: { id: string; sort_order: number }[]) {
    const updates = bookmarks.map(b =>
      supabase.from('bookmarks').update({ sort_order: b.sort_order }).eq('id', b.id)
    )
    return await Promise.all(updates)
  },
}

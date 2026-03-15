// Database types matching Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      categories: {
        Row: Category
        Insert: CategoryInsert
        Update: CategoryUpdate
      }
      bookmarks: {
        Row: Bookmark
        Insert: BookmarkInsert
        Update: BookmarkUpdate
      }
    }
  }
}

// Profile type
export interface Profile {
  id: string
  username: string | null
  created_at: string
}

export interface ProfileInsert {
  id?: string
  username?: string | null
  created_at?: string
}

export interface ProfileUpdate {
  id?: string
  username?: string | null
  created_at?: string
}

// Category type
export interface Category {
  id: string
  user_id: string
  name: string
  icon: string | null
  sort_order: number
  created_at: string
}

export interface CategoryInsert {
  id?: string
  user_id: string
  name: string
  icon?: string | null
  sort_order?: number
  created_at?: string
}

export interface CategoryUpdate {
  id?: string
  user_id?: string
  name?: string
  icon?: string | null
  sort_order?: number
  created_at?: string
}

// Bookmark type
export interface Bookmark {
  id: string
  user_id: string
  category_id: string | null
  title: string
  url: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BookmarkInsert {
  id?: string
  user_id: string
  category_id?: string | null
  title: string
  url: string
  description?: string | null
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export interface BookmarkUpdate {
  id?: string
  user_id?: string
  category_id?: string | null
  title?: string
  url?: string
  description?: string | null
  sort_order?: number
  created_at?: string
  updated_at?: string
}

// Join types for API responses
export interface CategoryWithBookmarks extends Category {
  bookmarks: Bookmark[]
}

export interface BookmarkWithCategory extends Bookmark {
  category: Category | null
}

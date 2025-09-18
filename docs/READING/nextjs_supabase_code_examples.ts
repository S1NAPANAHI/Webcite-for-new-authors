
// ==================================================
// SUPABASE CLIENT CONFIGURATION
// ==================================================

// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ==================================================
// DATABASE TYPES (Auto-generated from Supabase)
// ==================================================

// lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string | null
          slug: string
          cover_image: string | null
          state: 'draft' | 'scheduled' | 'published' | 'archived'
          publish_at: string | null
          unpublish_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description?: string | null
          slug: string
          cover_image?: string | null
          state?: 'draft' | 'scheduled' | 'published' | 'archived'
          publish_at?: string | null
          unpublish_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string | null
          slug?: string
          cover_image?: string | null
          state?: 'draft' | 'scheduled' | 'published' | 'archived'
          publish_at?: string | null
          unpublish_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          issue_id: string
          title: string
          subtitle: string | null
          synopsis: string | null
          slug: string
          order_index: number
          content_format: 'rich' | 'markdown' | 'file'
          content_json: Json | null
          content_text: string | null
          content_url: string | null
          release_date: string | null
          subscription_required: boolean | null
          state: 'draft' | 'scheduled' | 'published' | 'archived'
          word_count: number
          estimated_reading_time: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          title: string
          subtitle?: string | null
          synopsis?: string | null
          slug: string
          order_index?: number
          content_format?: 'rich' | 'markdown' | 'file'
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          release_date?: string | null
          subscription_required?: boolean | null
          state?: 'draft' | 'scheduled' | 'published' | 'archived'
          word_count?: number
          estimated_reading_time?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          title?: string
          subtitle?: string | null
          synopsis?: string | null
          slug?: string
          order_index?: number
          content_format?: 'rich' | 'markdown' | 'file'
          content_json?: Json | null
          content_text?: string | null
          content_url?: string | null
          release_date?: string | null
          subscription_required?: boolean | null
          state?: 'draft' | 'scheduled' | 'published' | 'archived'
          word_count?: number
          estimated_reading_time?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: 'free' | 'premium' | 'admin'
          reading_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium' | 'admin'
          reading_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium' | 'admin'
          reading_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_library: {
        Row: {
          id: string
          user_id: string
          work_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter'
          work_id: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          work_type: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter'
          work_id: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          work_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter'
          work_id?: string
          added_at?: string
        }
      }
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ==================================================
// DATA ACCESS LAYER
// ==================================================

// lib/services/content.ts
import { supabase } from '../supabase'
import { Database } from '../database.types'

type Book = Database['public']['Tables']['books']['Row']
type Chapter = Database['public']['Tables']['chapters']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export class ContentService {
  // Get all published books for library
  static async getPublishedBooks(): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('state', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get book with full hierarchy
  static async getBookWithHierarchy(bookSlug: string) {
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select(`
        *,
        volumes(
          *,
          sagas(
            *,
            arcs(
              *,
              issues(
                *,
                chapters(*)
              )
            )
          )
        )
      `)
      .eq('slug', bookSlug)
      .eq('state', 'published')
      .single()

    if (bookError) throw bookError
    return book
  }

  // Get chapter content with access control
  static async getChapterContent(
    bookSlug: string,
    volumeSlug: string,
    sagaSlug: string,
    arcSlug: string,
    issueSlug: string,
    chapterSlug: string,
    userId?: string
  ): Promise<Chapter | null> {
    // Build the query with all joins to validate the full path
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        issues!inner(
          *,
          arcs!inner(
            *,
            sagas!inner(
              *,
              volumes!inner(
                *,
                books!inner(slug)
              )
            )
          )
        )
      `)
      .eq('slug', chapterSlug)
      .eq('issues.slug', issueSlug)
      .eq('issues.arcs.slug', arcSlug)
      .eq('issues.arcs.sagas.slug', sagaSlug)
      .eq('issues.arcs.sagas.volumes.slug', volumeSlug)
      .eq('issues.arcs.sagas.volumes.books.slug', bookSlug)
      .single()

    if (error) {
      console.error('Chapter access error:', error)
      return null
    }

    // Check access permissions
    const hasAccess = await this.checkContentAccess(data.id, 'chapter', userId)
    if (!hasAccess) {
      return null
    }

    return data
  }

  // Check if user has access to specific content
  static async checkContentAccess(
    contentId: string,
    contentType: 'chapter' | 'issue',
    userId?: string
  ): Promise<boolean> {
    if (!userId) {
      // Check if content is free
      if (contentType === 'chapter') {
        const { data } = await supabase
          .from('chapters')
          .select(`
            subscription_required,
            issues!inner(subscription_required)
          `)
          .eq('id', contentId)
          .single()

        return !data?.subscription_required && !data?.issues?.subscription_required
      }
    }

    // Call the database function for proper access check
    const { data, error } = await supabase.rpc('user_has_content_access', {
      user_id_param: userId,
      content_type: contentType,
      content_id_param: contentId
    })

    if (error) {
      console.error('Access check error:', error)
      return false
    }

    return data
  }

  // Add content to user library
  static async addToLibrary(
    userId: string,
    workType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter',
    workId: string
  ) {
    const { data, error } = await supabase
      .from('user_library')
      .insert({
        user_id: userId,
        work_type: workType,
        work_id: workId
      })

    if (error) throw error
    return data
  }

  // Get user's library
  static async getUserLibrary(userId: string) {
    const { data, error } = await supabase
      .from('user_library')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Update reading progress
  static async updateReadingProgress(
    userId: string,
    chapterId: string,
    progressPercentage: number,
    lastReadPosition: number = 0
  ) {
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        progress_percentage: progressPercentage,
        last_read_position: lastReadPosition,
        completed: progressPercentage >= 100,
        last_read_at: new Date().toISOString()
      })

    if (error) throw error
    return data
  }
}

// ==================================================
// ADMIN SERVICE
// ==================================================

// lib/services/admin.ts
export class AdminService {
  // Create a new book
  static async createBook(bookData: {
    title: string
    subtitle?: string
    description?: string
    slug: string
    cover_image?: string
  }) {
    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create a chapter
  static async createChapter(chapterData: {
    issue_id: string
    title: string
    slug: string
    content_format: 'rich' | 'markdown' | 'file'
    content_text?: string
    content_json?: any
    content_url?: string
    order_index: number
  }) {
    const { data, error } = await supabase
      .from('chapters')
      .insert(chapterData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update content state
  static async updateContentState(
    table: string,
    id: string,
    state: 'draft' | 'scheduled' | 'published' | 'archived',
    publishAt?: string
  ) {
    const updateData: any = { state }
    if (publishAt) updateData.publish_at = publishAt

    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get admin dashboard data
  static async getAdminDashboard() {
    const [booksResult, chaptersResult, usersResult] = await Promise.all([
      supabase.from('books').select('id, title, state, created_at'),
      supabase.from('chapters').select('id, title, state, created_at'),
      supabase.from('profiles').select('id, email, subscription_status, created_at')
    ])

    return {
      books: booksResult.data || [],
      chapters: chaptersResult.data || [],
      users: usersResult.data || []
    }
  }
}

// ==================================================
// REACT HOOKS
// ==================================================

// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(profile)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setProfile(profile)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.subscription_status === 'admin',
    isPremium: profile?.subscription_status === 'premium' || profile?.subscription_status === 'admin'
  }
}

// hooks/useLibrary.ts
import { useState, useEffect } from 'react'
import { ContentService } from '../lib/services/content'

export function useLibrary(userId?: string) {
  const [library, setLibrary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadLibrary()
    } else {
      setLoading(false)
    }
  }, [userId])

  const loadLibrary = async () => {
    if (!userId) return

    try {
      const data = await ContentService.getUserLibrary(userId)
      setLibrary(data)
    } catch (error) {
      console.error('Error loading library:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToLibrary = async (
    workType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter',
    workId: string
  ) => {
    if (!userId) return

    try {
      await ContentService.addToLibrary(userId, workType, workId)
      await loadLibrary() // Refresh
    } catch (error) {
      console.error('Error adding to library:', error)
      throw error
    }
  }

  return {
    library,
    loading,
    addToLibrary,
    refetch: loadLibrary
  }
}

// ==================================================
// REACT COMPONENTS
// ==================================================

// components/LibraryCard.tsx
import React from 'react'
import Link from 'next/link'
import { Book } from '../lib/database.types'

interface LibraryCardProps {
  book: Book
  onAddToLibrary?: (bookId: string) => void
  inLibrary?: boolean
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  book,
  onAddToLibrary,
  inLibrary = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {book.cover_image && (
        <div className="aspect-[3/4] relative">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>

        {book.subtitle && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{book.subtitle}</p>
        )}

        {book.description && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">{book.description}</p>
        )}

        <div className="flex justify-between items-center">
          <Link
            href={`/library/books/${book.slug}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>

          {onAddToLibrary && !inLibrary && (
            <button
              onClick={() => onAddToLibrary(book.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Add to Library
            </button>
          )}

          {inLibrary && (
            <span className="text-green-600 font-medium">✓ In Library</span>
          )}
        </div>
      </div>
    </div>
  )
}

// components/EbookReader.tsx
import React, { useState, useEffect } from 'react'
import { ContentService } from '../lib/services/content'
import { useAuth } from '../hooks/useAuth'

interface EbookReaderProps {
  chapterId: string
  onProgressUpdate?: (progress: number) => void
}

export const EbookReader: React.FC<EbookReaderProps> = ({
  chapterId,
  onProgressUpdate
}) => {
  const { user } = useAuth()
  const [chapter, setChapter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light')

  useEffect(() => {
    loadChapter()
  }, [chapterId])

  const loadChapter = async () => {
    try {
      // This would need to be implemented with proper path resolution
      // const chapter = await ContentService.getChapterContent(...)
      // setChapter(chapter)
    } catch (error) {
      console.error('Error loading chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100

    if (onProgressUpdate) {
      onProgressUpdate(scrollPercentage)
    }

    // Update reading progress in database
    if (user && chapter) {
      ContentService.updateReadingProgress(
        user.id,
        chapter.id,
        scrollPercentage,
        target.scrollTop
      )
    }
  }

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-white',
    sepia: 'bg-amber-50 text-amber-900'
  }

  if (loading) return <div>Loading chapter...</div>
  if (!chapter) return <div>Chapter not found or access denied</div>

  return (
    <div className={`min-h-screen ${themeClasses[theme]}`}>
      {/* Reader Controls */}
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{chapter.title}</h1>

        <div className="flex items-center space-x-4">
          {/* Font Size Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="p-2 rounded hover:bg-gray-100"
            >
              A-
            </button>
            <span className="text-sm">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-2 rounded hover:bg-gray-100"
            >
              A+
            </button>
          </div>

          {/* Theme Controls */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="p-2 rounded border"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
          </select>
        </div>
      </div>

      {/* Chapter Content */}
      <div
        className="max-w-4xl mx-auto p-8 leading-relaxed"
        style={{ fontSize: `${fontSize}px` }}
        onScroll={handleScroll}
      >
        {chapter.content_format === 'markdown' && (
          <div
            dangerouslySetInnerHTML={{
              __html: chapter.content_text // This should be processed through a markdown parser
            }}
          />
        )}

        {chapter.content_format === 'rich' && (
          <div>
            {/* Render rich content from content_json */}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================================================
// NEXT.JS PAGE EXAMPLES
// ==================================================

// pages/library/index.tsx
import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { ContentService } from '../../lib/services/content'
import { LibraryCard } from '../../components/LibraryCard'
import { useAuth } from '../../hooks/useAuth'
import { useLibrary } from '../../hooks/useLibrary'

interface LibraryPageProps {
  books: any[]
}

export default function LibraryPage({ books }: LibraryPageProps) {
  const { user, isPremium } = useAuth()
  const { library, addToLibrary } = useLibrary(user?.id)

  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBooks = books.filter(book => {
    // Apply search filter
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Apply access filter
    if (filter === 'free') {
      return !book.subscription_required
    } else if (filter === 'premium') {
      return book.subscription_required
    }

    return true
  })

  const handleAddToLibrary = async (bookId: string) => {
    try {
      await addToLibrary('book', bookId)
    } catch (error) {
      console.error('Failed to add to library:', error)
    }
  }

  const isInLibrary = (bookId: string) => {
    return library.some(item => item.work_type === 'book' && item.work_id === bookId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Library</h1>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded ${
              filter === 'free' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setFilter('premium')}
            className={`px-4 py-2 rounded ${
              filter === 'premium' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Premium
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <LibraryCard
            key={book.id}
            book={book}
            onAddToLibrary={user ? handleAddToLibrary : undefined}
            inLibrary={isInLibrary(book.id)}
          />
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const books = await ContentService.getPublishedBooks()

    return {
      props: {
        books
      }
    }
  } catch (error) {
    console.error('Error fetching books:', error)

    return {
      props: {
        books: []
      }
    }
  }
}

// pages/library/books/[...slugs].tsx
import React from 'react'
import { GetServerSideProps } from 'next'
import { ContentService } from '../../../lib/services/content'
import { EbookReader } from '../../../components/EbookReader'

interface BookPageProps {
  content: any
  contentType: 'book' | 'volume' | 'saga' | 'arc' | 'issue' | 'chapter'
  slugs: string[]
}

export default function BookPage({ content, contentType, slugs }: BookPageProps) {
  if (contentType === 'chapter') {
    return <EbookReader chapterId={content.id} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

      {content.subtitle && (
        <h2 className="text-xl text-gray-600 mb-4">{content.subtitle}</h2>
      )}

      {content.description && (
        <p className="text-gray-700 mb-8">{content.description}</p>
      )}

      {/* Navigation and children listing */}
      {contentType === 'book' && content.volumes && (
        <div>
          <h3 className="text-2xl font-bold mb-4">Volumes</h3>
          <div className="grid gap-4">
            {content.volumes.map((volume: any) => (
              <div key={volume.id} className="border p-4 rounded">
                <h4 className="font-bold">{volume.title}</h4>
                {volume.description && <p className="text-gray-600">{volume.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const slugs = params?.slugs as string[]

  if (!slugs || slugs.length === 0) {
    return { notFound: true }
  }

  try {
    // Determine content type and fetch appropriate data
    if (slugs.length === 2 && slugs[0] === 'books') {
      // Book detail page: /library/books/[bookSlug]
      const book = await ContentService.getBookWithHierarchy(slugs[1])

      return {
        props: {
          content: book,
          contentType: 'book',
          slugs
        }
      }
    } else if (slugs.length === 8) {
      // Chapter page: /library/books/[book]/volumes/[volume]/sagas/[saga]/arcs/[arc]/issues/[issue]/chapters/[chapter]
      const [, bookSlug, , volumeSlug, , sagaSlug, , arcSlug, , issueSlug, , chapterSlug] = slugs

      // Get user from session for access control
      const chapter = await ContentService.getChapterContent(
        bookSlug, volumeSlug, sagaSlug, arcSlug, issueSlug, chapterSlug
      )

      if (!chapter) {
        return { notFound: true }
      }

      return {
        props: {
          content: chapter,
          contentType: 'chapter',
          slugs
        }
      }
    }

    return { notFound: true }
  } catch (error) {
    console.error('Error fetching content:', error)
    return { notFound: true }
  }
}

// ==================================================
// ADMIN DASHBOARD COMPONENT
// ==================================================

// pages/admin/dashboard.tsx
import React, { useState, useEffect } from 'react'
import { AdminService } from '../../lib/services/admin'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData()
    }
  }, [isAdmin])

  const loadDashboardData = async () => {
    try {
      const data = await AdminService.getAdminDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return <div>Access Denied</div>
  }

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardData?.books?.length || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Chapters</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardData?.chapters?.length || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardData?.users?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Recent Books</h3>
          <div className="space-y-3">
            {dashboardData?.books?.slice(0, 5).map((book: any) => (
              <div key={book.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-gray-600">{book.state}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(book.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {dashboardData?.users?.slice(0, 5).map((user: any) => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h4 className="font-medium">{user.email}</h4>
                  <p className="text-sm text-gray-600">{user.subscription_status}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

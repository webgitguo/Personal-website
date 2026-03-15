import { useState, useEffect } from 'react'
import { Typography, Row, Col, Button, Spin, message, Select, Space, Input } from 'antd'
import { PlusOutlined, SearchOutlined,ArrowLeftOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { bookmarkService, categoryService } from '@/api/supabase'
import type { Bookmark, Category, BookmarkWithCategory } from '@/types/supabase'
import BookmarkCard from '@/components/BookmarkCard'
import BookmarkForm from '@/components/BookmarkForm'

const { Title, Text } = Typography
const { Search } = Input

export default function BookmarkManage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<BookmarkWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    loadData()
  }, [user])

  useEffect(() => {
    if (user) {
      loadBookmarks()
    }
  }, [selectedCategory, user])

  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [bookmarksData, categoriesData] = await Promise.all([
        bookmarkService.getAll(user.id),
        categoryService.getAll(user.id),
      ])

      if (bookmarksData.error) throw bookmarksData.error
      if (categoriesData.error) throw categoriesData.error

      setBookmarks((bookmarksData.data as any) || [])
      setCategories(categoriesData.data || [])
    } catch (error) {
      message.error('加载数据失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadBookmarks = async () => {
    if (!user) return

    try {
      const { data, error } = await bookmarkService.getAll(user.id)
      if (error) throw error
      setBookmarks((data as any) || [])
    } catch (error) {
      message.error('加载书签失败')
    }
  }

  const handleAdd = () => {
    setEditingBookmark(undefined)
    setFormVisible(true)
  }

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setFormVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await bookmarkService.delete(id)
      if (error) throw error
      message.success('删除成功')
      loadBookmarks()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: Omit<Bookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingBookmark) {
        const { error } = await bookmarkService.update(editingBookmark.id, values)
        if (error) throw error
      } else {
        const { error } = await bookmarkService.create({ ...values, user_id: user?.id || '' })
        if (error) throw error
      }
      loadBookmarks()
      setFormVisible(false)
    } catch (error) {
      message.error('保存失败')
      throw error
    }
  }

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchCategory = !selectedCategory || bookmark.category_id === selectedCategory
    const matchSearch = !searchText ||
      bookmark.title.toLowerCase().includes(searchText.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchText.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined/>}
              onClick={() => (window.location.href = '/')}
              style={{ marginRight: '8px' }}
            />
            书签管理   <Text style={{marginLeft:5}} type="secondary">共 {filteredBookmarks.length} 个书签</Text>
          </Title>
    
        </div>
        <Space>
          <Select
            placeholder="选择分类"
            style={{ width: 150 }}
            allowClear
            value={selectedCategory}
            onChange={setSelectedCategory}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
          <Search
            placeholder="搜索书签"
            allowClear
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加书签
          </Button>
        </Space>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {searchText || selectedCategory ? '没有找到匹配的书签' : '还没有添加任何书签'}
          </Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredBookmarks.map((bookmark) => (
            <Col key={bookmark.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <BookmarkCard
                bookmark={bookmark}
                categoryName={bookmark.category?.name}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      <BookmarkForm
        visible={formVisible}
        bookmark={editingBookmark}
        categories={categories}
        userId={user?.id || ''}
        onSubmit={handleSubmit}
        onCancel={() => setFormVisible(false)}
      />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Typography, Row, Col, Card, Button, Empty, Space, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { categoryService } from '@/api/supabase'
import type { CategoryWithBookmarks } from '@/types/supabase'

const { Title, Text } = Typography

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [categories, setCategories] = useState<CategoryWithBookmarks[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [user])

  const loadCategories = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await categoryService.getWithBookmarks(user.id)
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('加载分类失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '94%', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text type="secondary">欢迎回来，{user?.user_metadata?.username || user?.email?.split('@')[0] || '用户'}</Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => (window.location.href = '/categories')}
          >
            管理分类
          </Button>
          <Button onClick={handleLogout}>退出登录</Button>
        </Space>
      </div>

      {categories.length === 0 ? (
        <Card>
          <Empty
            description="暂无分类"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => (window.location.href = '/categories')}
            >
              添加第一个分类
            </Button>
          </Empty>
        </Card>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {categories.map((category) => (
            <Card
              key={category.id}
              title={
                <Space>
                  <span style={{ fontSize: '20px' }}>{category.icon || '📁'}</span>
                  <span>{category.name}</span>
                  <Text type="secondary">({category.bookmarks?.length || 0})</Text>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  size="small"
                  onClick={() => (window.location.href = `/bookmarks?category=${category.id}`)}
                >
                  查看全部
                </Button>
              }
            >
              {category.bookmarks && category.bookmarks.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {category.bookmarks.slice(0, 8).map((bookmark) => (
                    <Col key={bookmark.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #f0f0f0',
                          textAlign: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#1890ff'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#f0f0f0'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`}
                          alt=""
                          style={{ width: '48px', height: '48px', marginBottom: '8px' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48?text=?'
                          }}
                        />
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#262626',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {bookmark.title}
                        </div>
                      </a>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="暂无书签" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          ))}
        </Space>
      )}
    </div>
  )
}

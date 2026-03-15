import { useState, useEffect } from 'react'
import { Typography, Row, Col, Button, Spin, message } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { categoryService } from '@/api/supabase'
import type { Category } from '@/types/supabase'
import CategoryCard from '@/components/CategoryCard'
import CategoryForm from '@/components/CategoryForm'

const { Title, Text } = Typography

export default function CategoryManage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()

  useEffect(() => {
    loadCategories()
  }, [user])

  const loadCategories = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await categoryService.getAll(user.id)
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      message.error('加载分类失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingCategory(undefined)
    setFormVisible(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await categoryService.delete(id)
      if (error) throw error
      message.success('删除成功')
      loadCategories()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async (values: Omit<Category, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (editingCategory) {
        const { error } = await categoryService.update(editingCategory.id, values)
        if (error) throw error
      } else {
        const { error } = await categoryService.create({ ...values, user_id: user?.id || '' })
        if (error) throw error
      }
      loadCategories()
      setFormVisible(false)
    } catch (error) {
      message.error('保存失败')
      throw error
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
          type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard')}
          >
          </Button>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              分类管理    <Text type="secondary">共 {categories.length} 个分类</Text>
            </Title>
        
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加分类
        </Button>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            还没有创建任何分类
          </Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col key={category.id} xs={12} sm={8} md={6} lg={4} xl={3}>
              <CategoryCard
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      <CategoryForm
        visible={formVisible}
        category={editingCategory}
        userId={user?.id || ''}
        onSubmit={handleSubmit}
        onCancel={() => setFormVisible(false)}
      />
    </div>
  )
}

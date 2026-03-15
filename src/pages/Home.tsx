import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Space, Card, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { BookOutlined, FolderOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import './Home.css'

const { Title, Paragraph, Text } = Typography

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Don't render the landing page if user is logged in (will be redirected)
  if (user) {
    return null
  }
  return (
    <div className="home">
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ fontSize: '48px', marginBottom: '16px' }}>
          🚀 个人网站导航
        </Title>
        <Paragraph style={{ fontSize: '20px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          轻松管理您的书签和网站快捷方式，按分类整理，一键访问
        </Paragraph>
        <Space size="middle" style={{ marginTop: '32px' }}>
          <Link to="/register">
            <Button type="primary" size="large" icon={<BookOutlined />}>
              立即开始
            </Button>
          </Link>
          <Link to="/login">
            <Button size="large" icon={<LockOutlined />}>
              登录账户
            </Button>
          </Link>
        </Space>
      </div>

      <Row gutter={[24, 24]} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <BookOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px', display: 'block' }} />
            <Title level={4}>书签管理</Title>
            <Text type="secondary">添加、编辑、删除书签，按需管理您的收藏</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <FolderOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px', display: 'block' }} />
            <Title level={4}>分类整理</Title>
            <Text type="secondary">创建自定义分类，让书签井井有条</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <ThunderboltOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px', display: 'block' }} />
            <Title level={4}>快速访问</Title>
            <Text type="secondary">一键直达常用网站，节省宝贵时间</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <LockOutlined style={{ fontSize: '48px', color: '#f5222d', marginBottom: '16px', display: 'block' }} />
            <Title level={4}>安全可靠</Title>
            <Text type="secondary">数据加密存储，随时随地访问您的收藏</Text>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

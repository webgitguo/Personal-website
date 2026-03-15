import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Avatar, message, Space, Descriptions, Typography, Divider } from 'antd'
import { UserOutlined, MailOutlined, CalendarOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { profileService } from '@/api/supabase'
import type { Profile } from '@/types/supabase'

const { Title, Text } = Typography

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await profileService.getById(user.id)
      if (error) throw error
      setProfile(data || null)
      if (data) {
        form.setFieldsValue({ username: data.username })
      }
    } catch (error) {
      console.error('加载个人信息失败:', error)
      message.error('加载个人信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (values: { username: string }) => {
    if (!user) return

    try {
      const { data, error } = await profileService.update(user.id, { username: values.username })
      if (error) throw error

      setProfile(data)
      setEditing(false)
      message.success('保存成功')

    } catch (error) {
      console.error( error)
    }
  }

  const handleCancel = () => {
    if (profile) {
      form.setFieldsValue({ username: profile.username })
    }
    setEditing(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <span>加载中...</span>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        个人信息
      </Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 用户信息卡片 */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {profile?.username || user?.user_metadata?.username || '用户'}
              </Title>
              <Text type="secondary">用户 ID: {user?.id?.slice(0, 8)}...</Text>
            </div>
          </div>

          <Descriptions column={1} bordered>
            <Descriptions.Item label={<Space><MailOutlined /> 邮箱</Space>}>
              {user?.email}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><CalendarOutlined /> 注册时间</Space>}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={<Space><UserOutlined /> 用户名</Space>}>
              {editing ? (
                <Form form={form} onFinish={handleSave} layout="inline">
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, message: '用户名至少3个字符' },
                      { max: 20, message: '用户名最多20个字符' },
                    ]}
                  >
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" icon={<SaveOutlined />} htmlType="submit" size="small">
                        保存
                      </Button>
                      <Button onClick={handleCancel} size="small">
                        取消
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ) : (
                <Space>
                  {profile?.username || user?.user_metadata?.username || '未设置'}
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => setEditing(true)}
                  >
                    修改
                  </Button>
                </Space>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 统计信息 */}
        <Card title="账号统计">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>注册时间</Text>
              <Text strong>{user?.created_at ? new Date(user.created_at).toLocaleString('zh-CN') : '-'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>最后登录</Text>
              <Text strong>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('zh-CN') : '-'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>邮箱验证</Text>
              <Text strong style={{ color: user?.email_confirmed_at ? '#52c41a' : '#faad14' }}>
                {user?.email_confirmed_at ? '已验证' : '未验证'}
              </Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

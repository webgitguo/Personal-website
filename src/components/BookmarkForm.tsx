import { useState, useEffect } from 'react'
import { Form, Input, Select, Modal, Button, message } from 'antd'
import type { Bookmark, Category } from '@/types/supabase'

const { TextArea } = Input

interface BookmarkFormProps {
  visible: boolean
  bookmark?: Bookmark
  categories: Category[]
  userId: string
  onSubmit: (values: Omit<Bookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export default function BookmarkForm({ visible, bookmark, categories, userId, onSubmit, onCancel }: BookmarkFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (bookmark) {
      form.setFieldsValue({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        category_id: bookmark.category_id,
      })
    } else {
      form.resetFields()
    }
  }, [bookmark, visible, form])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await onSubmit({
        ...values,
        user_id: userId,
        sort_order: 0,
      })
      form.resetFields()
      message.success(bookmark ? '书签更新成功' : '书签添加成功')
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={bookmark ? '编辑书签' : '添加书签'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {bookmark ? '更新' : '添加'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="书签标题" />
        </Form.Item>

        <Form.Item
          label="URL"
          name="url"
          rules={[
            { required: true, message: '请输入URL' },
            { type: 'url', message: '请输入有效的URL' },
          ]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item label="分类" name="category_id">
          <Select placeholder="选择分类（可选）" allowClear>
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea rows={3} placeholder="书签描述（可选）" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

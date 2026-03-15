import { useState, useEffect } from 'react'
import { Form, Input, Select, Modal, Button, message } from 'antd'
import type { Category } from '@/types/supabase'

const iconOptions = [
  { label: '文件夹', value: '📁' },
  { label: '应用', value: '📱' },
  { label: '书本', value: '📚' },
  { label: '闪电', value: '⚡' },
  { label: '爱心', value: '❤️' },
  { label: '设置', value: '⚙️' },
  { label: '团队', value: '👥' },
  { label: '工具', value: '🛠️' },
  { label: '灯泡', value: '💡' },
  { label: '星球', value: '🌐' },
  { label: '代码', value: '💻' },
  { label: '音乐', value: '🎵' },
  { label: '购物', value: '🛒' },
  { label: '游戏', value: '🎮' },
  { label: '图片', value: '🖼️' },
]

interface CategoryFormProps {
  visible: boolean
  category?: Category
  userId: string
  onSubmit: (values: Omit<Category, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  onCancel: () => void
}

export default function CategoryForm({ visible, category, userId, onSubmit, onCancel }: CategoryFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        icon: category.icon,
        sort_order: category.sort_order,
      })
    } else {
      form.resetFields()
    }
  }, [category, visible, form])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await onSubmit({
        ...values,
        user_id: userId,
      })
      form.resetFields()
      message.success(category ? '分类更新成功' : '分类添加成功')
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={category ? '编辑分类' : '添加分类'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {category ? '更新' : '添加'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="分类名称"
          name="name"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="例如：开发工具" />
        </Form.Item>

        <Form.Item label="图标" name="icon" initialValue="📁">
          <Select placeholder="选择图标" style={{ fontSize: '20px' }}>
            {iconOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value} style={{ fontSize: '20px' }}>
                {opt.value} {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="排序"
          name="sort_order"
          initialValue={0}
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <Input type="number" placeholder="数字越小越靠前" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

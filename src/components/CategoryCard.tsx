import { Card, Typography, Space, Popconfirm, Button, Badge } from 'antd'
import { DeleteOutlined, EditOutlined, FolderOutlined } from '@ant-design/icons'
import type { Category } from '@/types/supabase'

const { Title, Text } = Typography

interface CategoryCardProps {
  category: Category
  bookmarkCount?: number
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onClick?: () => void
}

export default function CategoryCard({ category, bookmarkCount = 0, onEdit, onDelete, onClick }: CategoryCardProps) {
  return (
    <Badge count={bookmarkCount} showZero color="blue" style={{ fontSize: '12px' }}>
      <Card
        hoverable
        size="default"
        style={{ minWidth: 200 }}
        extra={
          <Space size="small">
            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(category)} />
            <Popconfirm
              title="删除分类"
              description="确定要删除这个分类吗？分类下的所有书签也将被删除。"
              onConfirm={() => onDelete(category.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        }
        onClick={onClick}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }} align="center">
          <div style={{ fontSize: '32px', color: '#1890ff' }}>
            {category.icon ? (
              <span style={{ fontSize: '32px' }}>{category.icon}</span>
            ) : (
              <FolderOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
            )}
          </div>
          <Title level={5} style={{ margin: 0, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {category.name}
          </Title>
          {bookmarkCount > 0 && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {bookmarkCount} 个书签
            </Text>
          )}
        </Space>
      </Card>
    </Badge>
  )
}

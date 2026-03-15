import { Card, Typography, Tag, Space, Popconfirm, Button } from 'antd'
import { DeleteOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons'
import type { Bookmark } from '@/types/supabase'
import { getFaviconUrl } from '@/utils/favicon'

const { Title, Paragraph } = Typography

interface BookmarkCardProps {
  bookmark: Bookmark
  categoryName?: string
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export default function BookmarkCard({ bookmark, categoryName, onEdit, onDelete }: BookmarkCardProps) {
  return (
    <Card
      hoverable
      size="small"
      extra={
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => onEdit(bookmark)} />
          <Popconfirm
            title="删除书签"
            description="确定要删除这个书签吗？"
            onConfirm={() => onDelete(bookmark.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      }
      actions={[
        <Button
          type="link"
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          icon={<LinkOutlined />}
          key="visit"
        >
          访问
        </Button>,
      ]}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            style={{ width: 32, height: 32, objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/32?text=?'
            }}
          />
          <Title level={5} style={{ margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {bookmark.title}
          </Title>
        </div>
        {bookmark.description && (
          <Paragraph type="secondary" style={{ margin: 0, fontSize: '12px' }} ellipsis={{ rows: 2 }}>
            {bookmark.description}
          </Paragraph>
        )}
        {categoryName && <Tag color="blue">{categoryName}</Tag>}
      </Space>
    </Card>
  )
}

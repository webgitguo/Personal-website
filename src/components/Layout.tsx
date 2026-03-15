import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Avatar, Dropdown } from 'antd'
import { UserOutlined, LogoutOutlined, DashboardOutlined, BookOutlined, FolderOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserSwitchOutlined />,
        label: '个人信息',
        onClick: () => navigate('/profile'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: '仪表盘',
        onClick: () => navigate('/dashboard'),
      },
      {
        key: 'bookmarks',
        icon: <BookOutlined />,
        label: '书签管理',
        onClick: () => navigate('/bookmarks'),
      },
      {
        key: 'categories',
        icon: <FolderOutlined />,
        label: '分类管理',
        onClick: () => navigate('/categories'),
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  }

  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                导航快捷方式
              </Link>
            </h1>
            <nav className="nav">
              <Link to="/" className="nav-link">
                首页
              </Link>
              <Link to="/about" className="nav-link">
                关于
              </Link>
            </nav>
          </div>
          <div className="header-right">
            {user ? (
              <Dropdown menu={userMenu} placement="bottomRight">
                <Button type="text" style={{ color: 'white' }}>
                  <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <span>{user.user_metadata?.username || user.email?.split('@')[0] || '用户'}</span>
                  </Space>
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button type="link" style={{ color: 'white', padding: 0 }} onClick={() => navigate('/login')}>
                  登录
                </Button>
                <Button type="primary" size="small" onClick={() => navigate('/register')}>
                  注册
                </Button>
              </Space>
            )}
          </div>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>&copy; 2026 导航快捷方式. All rights reserved.</p>
      </footer>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BookmarkManage from './pages/BookmarkManage'
import CategoryManage from './pages/CategoryManage'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Auth pages without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route element={<AuthGuard><Outlet /></AuthGuard>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookmarks" element={<BookmarkManage />} />
              <Route path="categories" element={<CategoryManage />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* 404 route */}
          <Route element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import './NotFound.css'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">页面未找到</p>
      <p className="not-found-description">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <Link to="/" className="not-found-link">
        返回首页
      </Link>
    </div>
  )
}

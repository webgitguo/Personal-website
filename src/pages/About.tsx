import './About.css'

export default function About() {
  return (
    <div className="about">
      <h1 className="about-title">关于我们</h1>
      <section className="about-section">
        <h2>项目简介</h2>
        <p>
          React Framework 是一个基于现代 Web 技术栈的通用前端框架模板，旨在帮助开发者快速搭建高质量的 React 应用程序。
        </p>
      </section>
      <section className="about-section">
        <h2>技术栈</h2>
        <ul className="tech-list">
          <li>React 18 - UI 库</li>
          <li>TypeScript - 类型安全</li>
          <li>React Router v6 - 路由管理</li>
          <li>Vite - 构建工具</li>
        </ul>
      </section>
      <section className="about-section">
        <h2>项目结构</h2>
        <pre className="code-block">
{`src/
├── api/          # API 请求封装
├── components/   # 通用组件
├── hooks/        # 自定义 Hooks
├── pages/        # 页面组件
├── styles/       # 全局样式
├── utils/        # 工具函数
└── App.tsx       # 应用入口`}
        </pre>
      </section>
    </div>
  )
}

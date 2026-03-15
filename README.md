# React Framework

一个基于 TypeScript 和 React Router v6 的通用 React 框架模板。

## 技术栈

- React 18 - UI 库
- TypeScript - 类型安全
- React Router v6 - 路由管理
- Vite - 构建工具

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 项目结构

```
src/
├── api/          # API 请求封装
│   └── index.ts
├── components/   # 通用组件
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── index.ts
├── hooks/        # 自定义 Hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── index.ts
├── pages/        # 页面组件
│   ├── Home.tsx
│   ├── About.tsx
│   └── NotFound.tsx
├── styles/       # 全局样式
│   ├── index.css
│   └── variables.css
├── utils/        # 工具函数
│   ├── format.ts
│   ├── validate.ts
│   ├── storage.ts
│   ├── request.ts
│   └── index.ts
├── App.tsx       # 应用入口
└── main.tsx      # React 根组件
```

## 主要功能

### 通用组件

- **Button** - 按钮组件，支持多种样式和加载状态
- **Modal** - 模态框组件
- **Layout** - 布局组件

### 自定义 Hooks

- **useDebounce** - 防抖 Hook
- **useLocalStorage** - 本地存储 Hook
- **useMediaQuery** - 媒体查询 Hook

### 工具函数

- **format** - 日期、数字、货币格式化
- **validate** - 表单验证（邮箱、手机号、URL、UUID）
- **storage** - 本地存储封装
- **request** - HTTP 请求封装

## 环境变量

复制 `.env.example` 为 `.env` 并配置相应变量：

```bash
cp .env.example .env
```

## 许可证

MIT

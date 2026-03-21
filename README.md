<p align="center">
   <img src="./public/logo.png" alt="logo.png" width="32" height="32" />
</p>

<h1 align="center" style="font-size: 26px; color: #409EFF;">蓝 云 博 客 2.0</h1>

一个基于 Nuxt 3 的全栈博客系统，集成前台内容展示与后台管理，支持文章、分类、标签、相册、留言、友链、文件管理、访问日志与数据看板等功能。

<p align="center">
   <img alt="Static Badge" src="https://img.shields.io/badge/Nuxt-3.17.6-%200DC82">
   <img alt="Static Badge" src="https://img.shields.io/badge/NodeJS-22.22.1-%230B6C09">
   <img alt="Static Badge" src="https://img.shields.io/badge/Express-4.19.2-%23259dff">
   <img alt="Static Badge" src="https://img.shields.io/badge/MongoDB-7.0.0-%23005D86">
   <img alt="Static Badge" src="https://img.shields.io/badge/Version-2.0.0-%23409EFF">
</p>

## 项目特性

- 前台博客：首页、文章列表/详情、分类筛选、相册、留言、友链、关于页
- 后台管理：文章发布与编辑、分类标签管理、管理员与角色管理、站点信息管理
- 文件系统：支持文件上传与图片管理，图片自动转 `webp`，并基于哈希去重
- 安全能力：管理员 JWT 鉴权、验证码校验、会话机制
- 运维能力：访问日志落库、日志文件输出、接口文档自动生成
- 全栈一体：Nuxt 页面 + Nitro API + MongoDB 持久化

## 技术栈

- 前端：`Nuxt 3`、`Vue 3`、`TypeScript`、`Pinia`
- UI/样式：`Element Plus`、`Tailwind CSS`、`SCSS`、`bootstrap-icons`
- 服务端：Nuxt Nitro（`server/api`、`server/middleware`）
- 数据库：`MongoDB` + `Mongoose`
- 文件与图像：`multer`、`sharp`
- 安全与工具：`jsonwebtoken`、`nuxt-auth-utils`、`svg-captcha`、`log4js`、`dayjs`

## 项目截图

> 项目截图位于 `screenshot/` 目录。

### 前台

![首页-1](./screenshot/首页-1.jpeg)
![首页-2](./screenshot/首页-2.png)

### 后台

![后台-1](./screenshot/后台-1.jpeg)
![后台-2](./screenshot/后台-2.jpeg)

## 目录结构

```text
lyblog/
├─ pages/                 # 前台与后台页面（Nuxt 约定式路由）
├─ components/            # 前端组件
├─ composables/           # 组合式逻辑封装
├─ stores/                # Pinia 状态管理
├─ api/                   # 前端请求封装
├─ server/
│  ├─ api/                # 后端接口（admin/client）
│  ├─ middleware/         # 鉴权、上传、日志、验证码等中间件
│  ├─ models/             # Mongoose 数据模型
│  ├─ plugins/            # 服务端插件（如 MongoDB 连接）
│  ├─ routes/             # 自定义服务端路由
│  └─ utils/              # 服务端工具函数
├─ public/resource/       # 上传后的静态资源
├─ db/lyblog.js           # MongoDB 初始化示例数据
├─ apidoc/                # apidoc 生成结果
└─ nuxt.config.ts         # Nuxt 配置
```

## 快速开始

### 1) 环境要求

- Node.js `>= 18`
- MongoDB（本地默认连接：`mongodb://localhost:27017/lyblog`）

### 2) 安装依赖

```bash
npm install
```

### 3) 配置环境变量

在项目根目录创建 `.env`（或按你的部署环境注入）：

```bash
NUXT_TOKEN_SECRET=please_change_to_a_strong_secret
```

建议：

- `NUXT_TOKEN_SECRET` 使用高强度随机字符串
- `session.password` 在 `nuxt.config.ts` 的 `runtimeConfig.session.password` 中配置，且建议至少 32 位

### 4) 初始化数据库（可选）

如果你希望快速导入示例数据，可使用 `db/lyblog.js`：

```bash
mongosh "mongodb://localhost:27017/lyblog" db/lyblog.js
```

> 提示：示例数据仅用于开发测试，生产环境请自行初始化并重置管理员账号信息。

### 5) 启动开发环境

```bash
npm run dev
```

默认地址：`http://localhost:3000`
后台地址：`http://localhost:3000/admin`

```登录信息
账号：admin
密码：123456
```

## 常用命令

```bash
# 启动开发环境（会先生成 apidoc）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 生成静态站点
npm run generate

# 重新生成接口文档
npm run doc
```

## API 文档

- 执行 `npm run doc` 后会在 `apidoc/` 下生成文档产物。
- 开发模式会先执行文档生成，再启动 Nuxt。

## 部署说明（简要）

部署教程：https://lanyunblog.com/article/69bcab7d366b68abd767c093

常见部署流程：

1. 配置生产环境变量（尤其是 JWT 与 Session 相关密钥）
2. 准备 MongoDB 并确保连接可用
3. 执行 `npm run build`
4. 执行 `npm run preview` 或按 Nitro/Node 方式托管
5. 使用 Nginx（可选）做反向代理与 HTTPS

## 安全建议

- 不要使用默认密钥或弱口令
- 首次部署后立即修改管理员账号密码
- 生产环境建议关闭不必要的调试输出
- 对公开接口增加限流与防刷策略（可按业务扩展中间件）

## 开源协议

本项目基于 [MIT](./LICENSE) 协议开源。

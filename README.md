# SipSave

一个简单的咖啡打卡储蓄应用。每次喝咖啡打卡时，系统会记录下相应的金额，帮助你追踪咖啡消费和储蓄情况。

## 功能特点

- 多用户支持：可以添加多个用户，分别记录他们的咖啡打卡
- 打卡记录：记录每次打卡的日期、时间和金额
- 数据统计：显示总储蓄金额和总打卡次数
- 历史记录：查看详细的打卡历史

## 技术栈

- React 19
- TypeScript
- Vite 6
- React Router 7
- LocalStorage for data persistence

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

本项目使用 Cloudflare Pages 进行部署。部署配置：

- 构建命令：`npm run build`
- 构建输出目录：`dist`
- Node.js 版本：19.x

## 作者

[ChellyRyo](https://github.com/ChellyRyo)

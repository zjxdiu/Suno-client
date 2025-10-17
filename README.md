## 简介

Suno-client是一个为Suno API proxy制作的简易web应用。

参考项目：[Suno-API](https://github.com/Suno-API)

**该应用使用**[dyad](https://github.com/dyad-sh/dyad)**制作，代码由AI生成。**

## 核心特性

- 自定义API Base URL/key
- 创意模式/自定义模式，模型选项v3.5、v4、auk
- 任务列表自动更新，间隔可调（0表示禁用功能）
- 任务自动重命名为音乐标题
- English support

## 设计特性

- 标准Typescript + tailwind CSS，通过vite可快捷部署开发服务器
- 无后端，可快速转为静态页面
- 易用而现代化的UI界面

## 使用方法

**您必须提供自己的API信息！**

（并非广告，仅为自己实测结果）目前确认可用的API中转商：Gue API，云雾API，柏拉图AI

由于中转API的响应速度无法保证，因此自动检查间隔请勿设置过小，建议10-20s或只手动检查！

在线Demo：[Vercel app](https://suno-client-pink.vercel.app)

1. 启动开发服务器：

```bash
npm install
npm run dev
```

2. 转换为静态页面：

`npm run build`


3. i18n翻译文件

路径：/public/locales/{lang}/translation.json


## TO-DO

- 支持更多音频操作（上传、续写、翻版、分离等）
- UI深色模式
- 任务列表显示优化（不重复显示标题、加入播放控制等）

## 已知问题

- 音频正在播放时，刷新任务状态会导致播放停止但界面按钮停留在播放状态。刷新页面可暂时解决问题。

- 任务状态获取出错时，自动刷新不可用。目前不确定是否会修改这一行为，但检查按钮仍可用。

## 更新记录

250929：改进数据导出功能并新增导入，现在导出和导入按钮在设置面板里，且会导出/导入更多数据（任务列表、历史prompt、API信息）。**注意：导入数据将完全覆盖本地原有数据！**
---
page: true
date: 2020-11-28
title: 项目概述
describe: 项目概述
---

## 基于「VitePress」搭建的极简博客

现已完成:

- 渲染文章列表
- 文章目录
- Gitalk 评论
- 文章按时间轴归档
- 文章分类

## 效果预览

在线地址:[https://crazymryan.github.io/blog](https://crazymryan.github.io/blog)

## 安装

```bash
git clone git@github.com:CrazyMrYan/blog.git
&
cd blog
```

## 下载依赖&启动
```shell
# npm
npm install
&
npm run dev

# yarn
yarn install
&
yarn dev
```

## 打包静态
在打包之前你需要配置 `.vitepress` > `config.js` 中加上 base:'你的存放文件名'

还需要在 `.vitepress` > `build` > `index.js` 修改 type 为 `build` 

```diff
+ const type = 'build'
export function Build(){
+    return type === 'build' ? '你的存放文件名' : ''
}
```

```shell
# npm
npm run build

# yarn
yarn build

```
## 鸣谢 
本项目采用 [Moking1997](https://github.com/Moking1997) 搭建的 [vitepress-blog](https://github.com/Moking1997/vitepress-blog),来进行的修改
---
page: true
date: 2021-01-03
title: 项目概述
describe: 项目概述
---

![](./docs/images/5a94f43a5b2471.jpg)
![](./docs/images/5a94f43a5b2472.jpg)

## 项目地址
[https://github.com/CrazyMrYan/blog](https://github.com/CrazyMrYan/blog)

## 🚀 基于「VitePress」搭建的极简博客

现已完成:

✅ 渲染文章列表

✅ 使用Vue 3

✅ 文章目录

✅ 文章按时间轴归档

✅ 文章分类
****
2021-12-31

✅ Gitalk 评论

****
2020-01-05 更新

✅ 文章列表分页


****
2021-01-16 更新

✅ 文章图片放大

✅ 切换黑暗模式

✅ 局部打印

****
准备开发~

⬜ 文章上下页

## 效果预览

在线地址:[https://crazymryan.github.io/blog](https://crazymryan.github.io/blog)

国内访问:[http://crazy.lovemysoul.vip/blog](http://crazy.lovemysoul.vip/blog) 

注意：（因为自己的服务器域名马上要过期了，我就懒得再去配置一个 gitalk 了，所以国内访问不携带评论功能。等有时间了在不上来）

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
```diff
let config = {
    head:[...],
    title:'悲伤日记',
    themeConfig:{...},
    dest: 'public',
+   base:'你的存放文件名'
}
```


还需要在 `.vitepress` > `build` > `index.js` 修改 type 为 `build` 

```diff
- const type = 'dev'
+ const type = 'build'
export function Build(){
-    return type === 'build' ? '' : ''
+    return type === 'build' ? '你的存放文件名' : ''
}
```

```shell
# npm
npm run build

# yarn
yarn build

```
## 联系我
<span><img src="./docs/images/beishang.jpg" style="width:50%"/><img src="./docs/images/mycode.jpg" style="width:50%"/></span>

## 鸣谢 
本项目采用 [@Moking1997](https://github.com/Moking1997) 搭建的 [vitepress-blog](https://github.com/Moking1997/vitepress-blog),来进行的修改

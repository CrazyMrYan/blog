---
date: 2021-03-31
title: 真正的手摸手带你从0到1 搭建一个UI组件库
page: false
tags:
  - vue
  - 插件
  - UI库
describe: 如何做一个vuejs UI 组件库？最近也是手痒没事找事做，然后就突发奇想照着葫芦画瓢模仿（站在巨人的肩膀上抄），自己也来总结并记录一下这个构建的过程
---

## 前言

> 如何做一个vuejs UI 组件库？最近也是手痒没事找事做，然后就突发奇想照着葫芦画瓢模仿（站在巨人的肩膀上抄），自己也来总结并记录一下这个构建的过程

## 前提

1. 你至少得用会 vue
2. 简单的封装过一些组件
3. 会吹牛
4. 会给我点个赞

好了就这四点，足矣

## 创建一个vue的项目

如果你觉得 vue-cli 不太符合你的需求，也可以自行创建

我们这里就直接使用 vue-cli啦

```shell
// 创建一个 cli
vue create laoyan-ui
```

手动选择配置

![](https://i.loli.net/2021/03/30/V1ICtuY5fcmsNWD.png)

选择 babel 和 css 预处理器就好了

![](https://i.loli.net/2021/03/30/P6WqcovtDES3fXU.png)

选择node-sass

![](https://i.loli.net/2021/03/30/UrD3HRKkCgI9Vmo.png)

选择package.json

![](https://i.loli.net/2021/03/31/rYHmD3tXZ6WI2ln.png)

是不是感觉回到了当初学 vue 的时光？对！就是纯手摸手的教学

好了废话不多说，创建好了，一起来造作吧

![](https://i.loli.net/2021/03/30/MzleCGwZDWUNbLS.png)



## 修改文件名称

好，我们进入到刚刚创建的项目目录中后，先不着急启动项目，我们要学会先规划大橘🍊，再付出行动

### 新建 packages

新建一个存放组件的文件夹 `packages` ，后面我们大部分组件开发工作也是在这里面进行的

### 修改 src

再将 `src` 文件夹改成 `examples` ，`examples` 我们用来做测试使用

### 新建 vue.config.js 

```js
module.exports = {
    pages: {
      index: {
        // 修改入口
        entry: 'examples/main.js',
        template: 'public/index.html',
        filename: 'index.html'
      }
    },
    chainWebpack: config => {
        config.module
          .rule('js')
          .include
            .add('/packages')
            .end()
          .use('babel')
            .loader('babel-loader')
            .tap(options => {
              return options
          })
     }
}
```

### 清理不需要的内容

将 `examples/assets` 里面的logo.png 删除

将 `examples` 的 components目录删除

将 `examples`  的 `App.vue` 删除成下面这样

```html
<template>
  <div id="app">
    app.vue
  </div>
</template>

<script>

export default {
    name: 'App',
}
</script>
```

### 目录结构截图

![](https://i.loli.net/2021/03/30/JfDnPxvyRMkZ7bG.png)

### 启动项目

```shell
yarn serve
```

![](https://i.loli.net/2021/03/30/Fg9BJbvm64IWPNZ.png)

启动完成，打开浏览器

![](https://i.loli.net/2021/03/30/v6Z7BcEqiHNmQF5.png)

到这里，你就已经差不多做完了组件库的前期准备性工作

## 开始干活

我们所有的组件放在 `packages` 目录下，那么目录结构肯定是长这样

```
|packages
|--- aComponent
|--- bComponent
|--- cComponent
```

那么我们需要一个 `index.js` 文件用于引入这些组件，然后再去暴露

哎～ 先不管这 `index.js` 我们先随便写一个组件(一看就会的组件—`文本链接`)，保证可以正常使用组件先

### 写一个文本链接

我们暂且称之为 `ly-link`

```
|packages
|--- lyLink
|---|--- src
|---|---|--- index.vue
```

将 index.vue 写成这鸟样

```html
<template>
    <!-- 用传过来 href 进行跳转 --> <!-- 用传过来的 type 修改颜色 --> 
    <a :href="href || undefined" :class="[`ly-link-${type}`]" >
        <!-- 使用默认插槽来填充文本 -->
        <slot/>
    </a>
</template>

<script>
    export default {
        // 等下 index.js 里面要用到
        name:"lyLink",
        props: {
            // 限制类型
            href: String,
            type: {
                type: String,
                default: 'default'
            }
        }
    }
</script>

<style lang="scss" scoped>
    // 定义链接字体颜色
    .ly-link-default {
        color: #606266;
    }
    .ly-link-primary {
        color: #409eff;
    }
</style>
```

组件写完了，然后我们在`examples/App.vue` 中测试一下

```html
<template>
  <div id="app">
    <!-- 使用组件 传入type -->
    <ly-link type="primary"> 老严 link </ly-link>
  </div>
</template>

<script>
// 引入组件
import lyLink from '../packages/lyLink/src'
export default {
    name: 'App',
  	// 注册组件
    components: { lyLink }
}
</script>
```

看看效果

![](https://i.loli.net/2021/03/30/3jTm5NAJq7nxQKv.png)

看起来没啥毛病，但是我们仔细一品，这不对呀，我们应该是要入口文件main中全局引入的呀

### 创建index.js

好，那我们回到刚刚说的 `index.js` 中来，我们通过index.js 作为暴露组件的 js

```js
// 引入组件
import lyLink from './lyLink/src'
// 存放组件的数组
const components = [
    lyLink
]

// 定义 install 方法，接收 Vue 作为参数。
const install = function (Vue) {
    // 判断是否安装
    if (install.installed) return
    // 遍历 components 数组，来进行全局注册
    components.map(component => {
        Vue.component(component.name, component)
    })
}

export default {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    lyLink
}
```

然后我门来到 main.js 中,引入我们刚刚写的index.js 文件

```js
import Vue from 'vue'
// 引入index.js
import laoyanUi from '../packages';
Vue.use(laoyanUi)
```

再把 App.vue 中的引入和注册组件删除

```html
<template>
  <div id="app">
    <ly-link type="primary"> 老严 test </ly-link>
  </div>
</template>

<script>
export default {
    name: 'App'
}
</script>
```

![](https://i.loli.net/2021/03/30/rYvKnBaF6Autcp4.png)

这样还是没问题的对吧！

那么需求来了，用户现在需要按需引入组件，怎么做？

什么按需引入，给我打!

### 按需引入

好，咱们来到了按需引入这个环节

我们平常用多了市面上的 UI组件库，会发现一般都会有个按需引入

比如 `element-ui`

```js
import { Button, Select } from 'element-ui'
```

那么该如何达到按需引入的效果呢？

在对应的组件文件夹中，再写上一个 `index.js`

```js
// 引入组件
import lyLink from './src';

// 提供 install 安装方法，供按需引入
lyLink.install = function (Vue) {
    // 注册组件
    Vue.component(lyLink.name, lyLink)
}
// 暴露组件
export default lyLink
```

此时你的 packages 应该长这样

![](https://i.loli.net/2021/03/30/IOfKGrHPvoY3tSd.png)

然后我们再去到外面 `packages\index.js`

将引入的vue文件改为引入index.js,再默认暴露 install

```diff
// 引入刚刚写的组件内的index.js
+ import lyLink from './lyLink'
const components = [
    lyLink
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue,opt = {}) {
    // 判断是否安装
    if (install.installed) return
    // 遍历注册全局组件
    components.map(component => {
        Vue.component(component.name, component)
    })
}

+ export default install

+ export {
    // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
    install,
    // 以下是具体的组件列表
    lyLink
}
```

按需引入试试吧

```js
import { lyLink } from '../packages';
Vue.use(lyLink)
```

![](https://i.loli.net/2021/03/30/2sViThOKHAzufQd.png)

效果也是可以的

### cdn 引入

我们每次做项目优化的时候都有一个 cdn 优化，那么这个cdn引入，我们改怎么配置呢？

```diff
  import lyLink from './lyLink'
  const components = [
      lyLink
  ]

  // 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
  const install = function (Vue,opt = {}) {
      // 判断是否安装
      if (install.installed) return
      // 遍历注册全局组件
      components.map(component => {
          Vue.component(component.name, component)
      })
  }

+ // 判断是否是直接引入文件
+ if (typeof window !== 'undefined' && window.Vue) {
+     install(window.Vue)
+ }

  export default install

  export {
      // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
      install,
      // 以下是具体的组件列表
      lyLink
  }
```

多加这一层判断即可，严老湿我们怎么上传cdn呐？我们在后面会讲这个如何使用



## 打包组件库

怎么打包？yarn build? 那不是打包项目了嘛

我们需要在 `package.json` 中加上一条新的命令

```diff
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
+    "lib": "vue-cli-service build --target lib --name index --dest lib packages/index.js"
},
```

### 执行打包

这条命令会将我们的组件的打包到一个 `lib` 的文件夹中

```shell
yarn lib
```

![](https://i.loli.net/2021/03/30/vSTZtEcRup9rX3d.png)

打包完成之后我们试试引入lib文件夹中的组件

### 试试效果

在main.js中引入

```js
import Vue from 'vue'
import App from './App.vue'
import { lyLink } from '../lib/index.umd.min.js';
Vue.use(lyLink)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```

启动项目

```shell
yarn serve
```



![](https://i.loli.net/2021/03/30/J6wjblR3MNF49hP.png)

我们已经成功解析了组件。但是发现了一个问题，我们好像没有样式

因为我们还没有引入样式

```diff
  import Vue from 'vue'
  import App from './App.vue'
  import { lyLink } from '../lib/index.umd.min.js';
+ import '../lib/index.css'
  Vue.use(lyLink)
  Vue.config.productionTip = false

  new Vue({
    render: h => h(App),
  }).$mount('#app')
```

![](https://i.loli.net/2021/03/30/d9gRS4lQNX7rLIJ.png)

这下算是完成了吧，那我们应该要发布组件了吧？

不然我们怎么提供给别人使用呢，一般就是上传 npmjs

## 发布组件

发布组件我们一般会发布到npm上,然后就可以通过 `yarn` 或者 `cnpm` 下载了

### 创建.npmignore

但是我们需要创建一个`.npmignore` 文件来忽略上传一部分文件， 比如测试文件`examples`,我们没必要上传,这样会增加包的体积

```
# 忽略目录
examples/
packages/
public/
dist/
common/

# 忽略指定文件
vue.config.js
babel.config.js
*.map
```

好了我们接下来可以进行上传npm包了

### 登陆npm

```shell
npm login
```

![](https://i.loli.net/2021/03/30/3tcFwpiHdjqQShn.png)

我们登陆成功了！那么接下来

### 发布包

发布包之前你还需要做一件事情

将你的package.json中的 `private` 改为 `false ` ，这个是用来表示这个包是否为私有的

```diff
- "private": true,
+ "private": false,
```

修改入口文件为lib下面的js，不然到时候下载依赖找不到你的组件

```json
"main": "lib/index.umd.min.js",
```

执行发布

```shell
npm publish
```

![](https://i.loli.net/2021/03/30/VT5r3fv8Gg9yu2Y.png)

发布包有很多疑难杂症，希望你可以顺利百度谷歌到，这里我就不一一说明了

## 安装依赖

你可以重新创建一个 vue-cli 来下载你的依赖包

```shell
yarn add laoyan-ui
```

### 引入

下载完成之后,在main.js中引入

```js
import { lyLink } from 'laoyan-ui'
import 'laoyan-ui/lib/index.css'
Vue.use(lyLink)
```

### 效果

随便找个页面测试一下吧

```html
<ly-link type="primary" href="//lovemysoul.vip/votre-dieu">test link</ly-link>
```

![](https://i.loli.net/2021/03/30/FVf8u9WJ5v6rdLH.png)

到这里我们就已经完成了UI组件库的大部分流程

但是我们之前说的 cdn 引入呢？

### cdn 使用

我们直接新建一个 index.html，这个 `https://unpkg.com` 你就可以理解为 npm 自带的cdn

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test laoyan-ui</title>
    <!-- 引入vue -->
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.5.6/vue.min.js"></script>
    <!-- 引入 laoyan-ui 的组件-->
    <script src="https://unpkg.com/laoyan-ui/lib/index.umd.min.js"></script>
    <!-- 引入 laoyan-ui 的样式 -->
    <link rel="stylesheet" href="https://unpkg.com/laoyan-ui/lib/index.css">
</head>
<body>
    <div id="app">  
        <ly-link type="primary"> test laoyan-ui </ly-link> 
    </div>
    <script>
        let vm = new Vue({
            el:"#app"
        })
    </script>
</body>
</html>
```

![](https://i.loli.net/2021/03/31/2SAcpDCObJzH6rE.png)

> 注意： 生产环境，推荐在引入cdn时加上版本号 如： `//unpkg.com/laoyan-ui@0.1.0`@0.1.0 就是锁定版本号，这样可以锁定你引入的版本，保证稳定性

## 最后

我们的今天的课程就到这里，现在将近凌晨一点钟，该睡觉了

如果你觉得这篇文章讲得还算不错，可以给我点个赞哈哈，收割一波

如果本篇文章有什么错误，请您大胆提出，老严也会及时修改

最近在做的 GitHub 项目地址是 ：https://github.com/votre-dieu/votre-dieu 

欢迎PR、Star、Fock

## 代码地址

如果你要我们刚刚一起写的这个代码，可以点击下方链接百度云盘进行下载

链接: https://pan.baidu.com/s/1puYN6hPdJ-RSZyb1Yf53gA  

密码: 4n6v
